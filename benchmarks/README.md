# Usage

```
pnpm install
pnpm run benchmark
```

npm, pnpm, and Bun are installed from the registry by the benchmark itself. Yarn is not on the registry anymore — Yarn 6 ships as a platform binary — so it is downloaded from its release channel instead, which needs `unzip` on `PATH`.

## Installing through a registry server

One section installs every package manager through a [pnpr](https://pnpm.io/pnpr) registry instead of npmjs, and measures pnpm a second time with dependency resolution offloaded to that server. pnpr is installed from the registry by the benchmark, like the package managers are, and needs no setup.

Two things about that section are worth knowing before changing it.

Its numbers are recorded under their own fixture name (`alotta-files-pnpr`). They are measured against a different registry across an emulated network, so pooling them with the main section's runs of the same fixture would average two unrelated things together.

The network is emulated by `latencyProxy.js`, which every client's traffic passes through — including pnpm's resolution requests, at the same round trip, so no client gets a cheaper link than another. It runs as a process of its own because installs are measured with a synchronous spawn: a proxy inside the benchmark process would accept no connection until the install it is serving had already finished. The same reasoning applies to output — pnpr and the proxy write to files rather than pipes, because nothing drains a pipe while a measured install holds the event loop, and a full pipe buffer would stop the server answering mid-scenario.

## Node.js version management

The Node.js version management section compares pnpm with fnm and nvm. nvm is cloned by the benchmark itself, but `fnm` has to be on `PATH`:

```
curl -fsSL https://fnm.vercel.app/install | bash
```

That section times commands inside the shell with `$EPOCHREALTIME`, so it needs Bash 5 or newer on `PATH` and refuses to measure without it. macOS still ships Bash 3.2 as `/bin/bash`:

```
brew install bash
```
