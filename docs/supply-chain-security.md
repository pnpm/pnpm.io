---
id: supply-chain-security
title: Mitigating supply chain attacks
---

Sometimes npm packages are compromised and published with malware. Luckily, there are companies like [Socket], [Snyk], and [Aikido] that detect these compromised packages early. The npm registry usually removes the affected versions within hours. However, there is always a window of time between when the malware is published and when it is detected, during which you could be exposed. Fortunately, there are some things you can do with pnpm to minimize the risks.

Historically, most compromised packages have used `postinstall` scripts to run code immediately upon installation. To mitigate this, pnpm v10 disables the automatic execution of `postinstall` scripts in dependencies. Although there is a setting to re-enable them globally using [dangerouslyAllowAllBuilds], we recommend explicitly listing only trusted dependencies. This way, if a dependency did not require a build in the past, it won't suddenly run a malicious script if a compromised version is published. Still, we recommend being cautious when updating a trusted package that has a `postinstall` script, as [it might get compromised].

Another way to reduce the risk of installing compromised packages is to delay updates to your dependencies. Since malware is usually detected quickly, delaying updates by 24 hours will most likely prevent you from installing a bad version. The [`minimumReleaseAge`] setting defines the minimum number of minutes that must pass after a version is published before pnpm will install it. For example, set it to `1440` to wait one day, or `10080` to wait one week before installing a new version.

It goes without saying that you should always lock your dependencies with a lockfile. Commit your lockfile to your repository to avoid unexpected updates.

[Socket]: https://socket.dev/
[Snyk]: https://snyk.io
[Aikido]: https://www.aikido.dev/
[dangerouslyAllowAllBuilds]: settings.md#dangerouslyallowallbuilds
[it might get compromised]: https://socket.dev/blog/nx-packages-compromised
[minimumReleaseAge]: settings.md#minimumreleaseage
