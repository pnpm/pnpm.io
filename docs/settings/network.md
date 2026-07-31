---
id: network
title: "Network & Request Settings"
sidebar_label: "Network & requests"
---

## Network Settings

### httpsProxy

* Default: **null**
* Type: **url**

A proxy to use for outgoing HTTPS requests. If the `HTTPS_PROXY`, `https_proxy`,
`HTTP_PROXY` or `http_proxy` environment variables are set, their values will be
used instead.

If your proxy URL contains a username and password, make sure to URL-encode them.
For instance:

```yaml
httpsProxy: "https://use%21r:pas%2As@my.proxy:1234/foo"
```

Do not encode the colon (`:`) between the username and password.

### httpProxy

* Default: **null**
* Type: **url**

A proxy to use for outgoing HTTP requests. If the `HTTP_PROXY` or `http_proxy`
environment variables are set, proxy settings will be honored by the underlying
request library.

### noProxy

* Default: **null**
* Type: **String**

A comma-separated string of domain extensions that a proxy should not be used for.

### localAddress

* Default: **undefined**
* Type: **IP Address**

The IP address of the local interface to use when making connections to the npm
registry.

### maxsockets

* Default: **networkConcurrency x 3**
* Type: **Number**

The maximum number of connections to use per origin (protocol/host/port combination).

### strictSsl

* Default: **true**
* Type: **Boolean**

Whether or not to do SSL key validation when making requests to the registry via
HTTPS.

## Request Settings

### gitShallowHosts

* Default: **['github.com', 'gist.github.com', 'gitlab.com', 'bitbucket.com', 'bitbucket.org']**
* Type: **string[]**

When fetching dependencies that are Git repositories, if the host is listed in this setting, pnpm will use shallow cloning to fetch only the needed commit, not all the history.

### networkConcurrency

* Default: **auto (workers × 3 clamped to 16-64)**
* Type: **Number**

Controls the maximum number of HTTP(S) requests to process simultaneously.

As of v10.24.0, pnpm automatically selects a value between 16 and 64 based on the number of workers (networkConcurrency = clamp(workers × 3, 16, 64)). Set this value explicitly to override the automatic scaling.

### fetchRetries

* Default: **2**
* Type: **Number**

How many times to retry if pnpm fails to fetch from the registry.

### fetchRetryFactor

* Default: **10**
* Type: **Number**

The exponential factor for retry backoff.

### fetchRetryMintimeout

* Default: **10000 (10 seconds)**
* Type: **Number**

The lower bound (in milliseconds) of the retry exponential backoff.

### fetchRetryMaxtimeout

* Default: **60000 (1 minute)**
* Type: **Number**

The upper bound (in milliseconds) of the retry exponential backoff.

### fetchTimeout

* Default: **60000 (1 minute)**
* Type: **Number**

The maximum amount of time to wait for HTTP requests to connect and complete.
This time should be enough to download the largest package over a reasonable connection.

### fetchWarnTimeoutMs

Added in: v10.18.0

* Default: **10000 ms (10 seconds)**
* Type: **Number**

A warning message is displayed if a metadata request to the registry takes longer than the specified threshold (in milliseconds).

### fetchMinSpeedKiBps

Added in: v10.18.0

* Default: **50 KiB/s**
* Type: **Number**

A warning message is displayed if the download speed of a tarball from the registry falls below the specified threshold (in KiB/s).
