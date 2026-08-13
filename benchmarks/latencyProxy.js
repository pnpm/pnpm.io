'use strict'
import fs from 'fs'
import net from 'net'
import path from 'path'
import spawn from 'cross-spawn'
import { fileURLToPath } from 'url'

const DIRNAME = path.dirname(fileURLToPath(import.meta.url))

// A TCP proxy that puts an emulated network link in front of a local server.
//
// Every package manager in this section talks to a registry running on the same
// machine, where a round trip is effectively free. That hides the cost the
// benchmark is trying to show: resolving a dependency graph means walking it
// level by level, and each level costs one round trip, so on a real network the
// install time is dominated by graph depth times latency rather than by how
// fast the registry answers.
//
// Ported from the `integrated-benchmark` task in the pnpm monorepo, which
// emulates the same link for the same reason.

const INITIAL_CWND_BYTES = 14_600

/** Megabits per second to bytes per second, or null for an uncapped link. */
export function mbpsToBytesPerSec (mbps) {
  if (!Number.isFinite(mbps) || mbps <= 0) return null
  return Math.max(1, Math.round(mbps * 125_000))
}

/**
 * Models TCP slow start: a connection begins at an initial congestion window
 * and its effective rate (window / RTT) doubles per delivered window until it
 * reaches the cap. Without this a transfer runs at the full cap from its first
 * byte, which overstates throughput for the many small tarballs an install
 * fetches.
 */
function createSlowStart (profile) {
  const rttSecs = (profile.oneWayMs * 2) / 1000
  if (!profile.slowStart || rttSecs <= 0 || profile.rateLimit == null) return null
  return { cwnd: INITIAL_CWND_BYTES, rttSecs, bytesInRound: 0 }
}

function effectiveRate (ramp, cap, length) {
  const rate = Math.min(ramp.cwnd / ramp.rttSecs, cap)
  ramp.bytesInRound += length
  if (ramp.bytesInRound >= ramp.cwnd) {
    ramp.bytesInRound = 0
    ramp.cwnd = Math.min(ramp.cwnd * 2, Math.max(cap * ramp.rttSecs, INITIAL_CWND_BYTES))
  }
  return rate
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Forwards one direction of a connection, holding every chunk for the link's
 * one-way delay and, when the link is capped, for as long as it takes to put
 * the chunk on the wire.
 */
function pump (src, dst, profile) {
  const ramp = createSlowStart(profile)
  // The earliest moment the link is free to start the next chunk. It advances
  // by each chunk's serialization time so the cap is a sustained throughput
  // limit rather than a per-chunk one.
  let linkFreeAt = 0
  let queue = Promise.resolve()

  src.on('data', (chunk) => {
    const releaseAt = Date.now() + profile.oneWayMs
    queue = queue.then(async () => {
      if (dst.destroyed) return
      const sendAt = Math.max(releaseAt, linkFreeAt)
      const wait = sendAt - Date.now()
      if (wait > 0) await sleep(wait)
      if (profile.rateLimit != null) {
        const rate = ramp
          ? effectiveRate(ramp, profile.rateLimit, chunk.length)
          : profile.rateLimit
        linkFreeAt = Math.max(sendAt, Date.now()) + (chunk.length / rate) * 1000
      }
      if (dst.destroyed) return
      // Respect backpressure, otherwise a capped link would buffer whole
      // tarballs in memory instead of pacing them. The wait has to end if the
      // socket dies first, or this direction would stall for good and hold the
      // connection open behind it.
      if (!dst.write(chunk)) {
        await new Promise((resolve) => {
          const done = () => {
            dst.off('drain', done)
            dst.off('close', done)
            dst.off('error', done)
            resolve()
          }
          dst.once('drain', done)
          dst.once('close', done)
          dst.once('error', done)
        })
      }
    }).catch(() => {})
  })

  src.on('end', () => { queue = queue.then(() => { if (!dst.destroyed) dst.end() }).catch(() => {}) })
  src.on('error', () => dst.destroy())
}

function listen ({ upstreamPort, roundTripMs, rateLimit, slowStart }) {
  // The profile is one-way; a round trip pays it twice.
  const profile = { oneWayMs: roundTripMs / 2, rateLimit, slowStart }
  // Both sockets have to stay half-open. Delaying a chunk means one direction
  // is always behind the other, and with Node's default the first side to
  // finish would close its peer's write side before the chunks still waiting on
  // the link had been handed over.
  const server = net.createServer({ allowHalfOpen: true }, (client) => {
    const upstream = net.connect({ host: '127.0.0.1', port: upstreamPort, allowHalfOpen: true })
    upstream.on('error', () => client.destroy())
    client.on('error', () => upstream.destroy())
    // A peer that vanishes without a clean shutdown would otherwise leave its
    // other half open forever. An install opens a lot of connections, and
    // leaking one descriptor per abandoned connection eventually stops the
    // proxy accepting new ones.
    upstream.on('close', () => client.destroy())
    client.on('close', () => upstream.destroy())
    pump(client, upstream, profile)
    pump(upstream, client, profile)
  })
  server.on('error', (err) => { throw err })
  return server
}

/**
 * Starts the proxy as a process of its own and resolves with the port to point
 * clients at.
 *
 * It has to be a separate process. Installs are measured with a synchronous
 * spawn, which blocks this process's event loop for as long as the package
 * manager runs — a proxy living here would accept no connection until the very
 * install it is supposed to be serving had already finished.
 */
export async function startLatencyProxy ({ upstreamPort, roundTripMs, rateLimit = null, slowStart = false, logPath }) {
  // Like pnpr, the proxy writes to a file instead of a pipe: nothing here
  // drains a pipe while a measured install holds the event loop, so a full
  // buffer would block the very process the traffic flows through.
  const logFd = fs.openSync(logPath, 'a')
  const proc = spawn(process.execPath, [
    path.join(DIRNAME, 'latencyProxy.js'),
    `--upstream-port=${upstreamPort}`,
    `--round-trip-ms=${roundTripMs}`,
    `--rate-limit=${rateLimit ?? 0}`,
    `--slow-start=${slowStart ? 1 : 0}`,
  ], { stdio: ['ignore', logFd, logFd] })
  fs.closeSync(logFd)

  const deadline = Date.now() + 15_000
  while (Date.now() < deadline) {
    const log = fs.readFileSync(logPath, 'utf8')
    const port = log.match(/^port=(\d+)$/m)?.[1]
    if (port) {
      return { port: Number(port), close: () => { proc.kill() } }
    }
    if (proc.exitCode !== null) {
      throw new Error(`The latency proxy exited with code ${proc.exitCode}. ${log}`)
    }
    await sleep(100)
  }
  throw new Error(`The latency proxy did not start. ${fs.readFileSync(logPath, 'utf8')}`)
}

// Running this file directly is what `startLatencyProxy` spawns.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const arg = (name) => Number(process.argv.find((a) => a.startsWith(`--${name}=`))?.split('=')[1] ?? 0)
  const rateLimit = arg('rate-limit')
  const server = listen({
    upstreamPort: arg('upstream-port'),
    roundTripMs: arg('round-trip-ms'),
    rateLimit: rateLimit > 0 ? rateLimit : null,
    slowStart: arg('slow-start') === 1,
  })
  server.listen(0, '127.0.0.1', () => {
    console.log(`port=${server.address().port}`)
  })
}
