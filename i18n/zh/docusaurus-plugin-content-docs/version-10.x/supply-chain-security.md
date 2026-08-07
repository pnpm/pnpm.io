---
id: supply-chain-security
title: 缓解供应链攻击
---

有时 npm 包会被破坏并被恶意软件发布。 幸运的是，有 [Socket]、[Snyk] 和 [Aikido] 等公司能够及早发现这些受损软件包。 npm 源通常在几小时内删除受影响的版本。 然而，恶意软件发布和被检测到之间总会有一段时间，在此期间你可能会受到攻击。 幸运的是，你可以使用 pnpm 做一些事情来最大限度地降低风险。

### 阻止有风险的安装后脚本

从历史上看，大多数受损软件包都使用 `postinstall` 脚本在安装后立即运行代码。 为了缓解这种情况，pnpm v10 禁用依赖项中 `postinstall` 脚本的自动执行。 尽管可以使用 [dangerouslyAllowAllBuilds] 全局重新启用它们，但我们建议使用 [allowBuilds] 明确列出受信任的依赖项。 这样，如果依赖项过去不需要构建，那么在发布受损版本时它就不会突然运行恶意脚本。 尽管如此，我们仍然建议在更新带有 `postinstall` 脚本的受信任的包时要谨慎，因为[它可能会受到损害][it might get compromised]。

### 防止出现奇异的传递依赖关系

你可以通过将 [blockExoticSubdeps] 设置为 `true` 来阻止传递依赖项使用特殊来源（例如 git 存储库或直接 tarball URL）。 这样可以确保所有传递依赖关系都从可信来源解析，从而降低供应链攻击的风险。

### 延迟依赖更新

另一种降低安装受损软件包风险的方法是推迟更新依赖包。 由于恶意软件通常会很快被检测到，因此将更新延迟 24 小时很可能会阻止你安装错误版本。 [minimumReleaseAge] 设置定义了版本发布后 pnpm 安装之前必须经过的最少分钟数。 例如，将它设置为 `1440` 会等待一天, 或 `10080` 来在安装一个新版本等待一周。

### 强制执行信任政策

为了进一步保护你的供应链，pnpm 还支持 [trustPolicy] 设置。 当设置为 `no-downgrade` 时，如果软件包的信任级别与以前的版本相比有所降低（例如，如果该软件包以前是由受信任的发布者发布的，但现在只有来源信息或没有信任证据），则此设置将阻止安装该软件包。 这可以帮助你避免安装可能已被入侵或不太可信的版本。

如果你需要允许特定软件包或版本绕过信任策略检查，可以使用 [trustPolicyExclude] 设置。 这对于已知软件包很有用，这些软件包可能不符合信任要求，但仍然可以安全使用。

此外， [trustPolicyIgnoreAfter] 设置允许您忽略对超过指定时间之前发布的软件包的信任检查。 这对于缺少带有签名或来源信息的发布流程的旧版本软件包很有帮助。

### 使用锁文件

不用说，你应该总是用锁文件锁定你的依赖关系。 将你的锁文件提交到你的资源库，以避免意外的更新。

[Socket]: https://socket.dev/
[Snyk]: https://snyk.io
[Aikido]: https://www.aikido.dev/
[dangerouslyAllowAllBuilds]: settings.md#dangerouslyallowallbuilds
[it might get compromised]: https://socket.dev/blog/nx-packages-compromised
[minimumReleaseAge]: settings.md#minimumreleaseage
[trustPolicy]: settings.md#trustpolicy
[trustPolicyExclude]: settings.md#trustpolicyexclude
[allowBuilds]: settings.md#allowbuilds
[blockExoticSubdeps]: settings.md#blockexoticsubdeps
[trustPolicyIgnoreAfter]: settings.md#trustpolicyignoreafter
