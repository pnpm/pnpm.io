---
id: pnpx-cli
title: pnpx CLI
---

:::warning

此命令已弃用！ 请改用 [`pnpm exec`][] 和 [`pnpm dlx`][] 命令。

:::

## 对于新用户

`pnpx` (PNPm eXecute) 是一个命令行工具，它从源获取包但并不会将其安装为依赖，热加载并运行它暴露的任何默认二进制命令。

例如，可以在任何地方使用 `create-react-app` 来初始化一个 React 应用，而不用在其他项目下安装它，你可以运行：

```sh
pnpx create-react-app my-project
```

这将从源获取 `create-react-app` 并使用给定的参数运行它。 有关更多信息，你可以在 npm 查看 [npx][] ，npx 提供了相同的接口，但是它基于 `npm` 而不是这里提供的 `pnpm`。

如果你只想运行一个项目依赖的二进制文件，请参阅 [`pnpm exec`][]。

## 写给 npm 用户

npm 有一个很棒的包运行器叫做 [npx][]。 pnpm 通过 `pnpx` 命令提供相同的工具。 唯一的不同是 `pnpx` 使用 `pnpm` 安装软件包。

[npx]: https://www.npmjs.com/package/npx
[`pnpm exec`]: ./cli/exec.md
[`pnpm dlx`]: ./cli/dlx.md
