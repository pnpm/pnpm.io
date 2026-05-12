---
id: errors
title: Error Codes
---

## ERR_PNPM_UNEXPECTED_STORE

Un directorio de módulos está presente y está vinculado a un directorio de almacenamiento diferente.

Si cambió el directorio de la tienda intencionalmente, ejecute `pnpm install` y pnpm reinstalará las dependencias usando el nuevo almacenamiento.

## ERR_PNPM_NO_MATCHING_VERSION_INSIDE_WORKSPACE

Un proyecto tiene una dependencia de espacio de trabajo que no existe en el espacio de trabajo.

Por ejemplo, el paquete `foo` tiene `bar@1.0.0` en las `dependencias`:

```json
{
  "name": "foo",
  "version": "1.0.0",
  "dependencies": {
    "bar": "workspace:1.0.0"
  }
}
```

Sin embargo, solo hay `bar@2.0.0` en el espacio de trabajo, por lo que `pnpm install` fallará.

Para corregir este error, todas las dependencias que usan el [protocolo de espacio de trabajo][] deben actualizarse para usar versiones de paquetes que están presentes en el espacio de trabajo. Esto puede hacerse manualmente o usando el comando `pnpm -r update`.

## ERR_PNPM_PEER_DEP_ISSUES

`pnpm install` will fail if the project has unresolved peer dependencies or the peer dependencies are not matching the wanted ranges. To fix this, install the missing peer dependencies.

You may also selectively ignore these errors using the [peerDependencyRules.ignoreMissing][] and [peerDependencyRules.allowedVersions][] settings.

## ERR_PNPM_OUTDATED_LOCKFILE

This error happens when installation cannot be performed without changes to the lockfile. This might happen in a CI environment if someone has changed a `package.json` file in the repository without running `pnpm install` afterwards. Or someone forgot to commit the changes to the lockfile.

To fix this error, just run `pnpm install` and commit the changes to the lockfile.

## ERR\_PNPM\_TARBALL\_INTEGRITY

This error indicates that the downloaded package's tarball did not match the expected integrity checksum.

If you use the npm registry (`registry.npmjs.org`), then this probably means that the integrity in your lockfile is incorrect. This might happen if a lockfile had badly resolved merge conflicts.

If you use a registry that allows to override existing versions of a package, then it might mean that in your local metadata cache you have the integrity checksum of an older version of the package. In this case, you should run `pnpm store prune`. This command will remove your local metadata cache. Then you can retry the command that failed.

But also be careful and verify that the package is downloaded from the right URL. The URL should be printed in the error message.

## ERR_PNPM_MISMATCHED_RELEASE_CHANNEL

The config field `use-node-version` defines a release channel different from version suffix.

Por ejemplo:
* `rc/20.0.0` defines an `rc` channel but the version is that of a stable release.
* `release/20.0.0-rc.0` defines a `release` channel but the version is that of an RC release.

To fix this error, either remove the release channel prefix or correct the version suffix.

Note that it is not allowed to specify node versions like `lts/Jod`. The correct syntax for stable release is strictly X.Y.Z or release/X.Y.Z.

## ERR_PNPM_INVALID_NODE_VERSION

The value of config field `use-node-version` has an invalid syntax.

Below are the valid forms of `use-node-version`:
* Stable release:
  * `X.Y.Z` (`X`, `Y`, `Z` are integers)
  * `release/X.Y.Z` (`X`, `Y`, `Z` are integers)
* RC release:
  * `X.Y.Z-rc.W` (`X`, `Y`, `Z`, `W` are integers)
  * `rc/X.Y.Z-rc.W` (`X`, `Y`, `Z`, `W` are integers)

[protocolo de espacio de trabajo]: ./workspaces.md#workspace-protocol-workspace

[peerDependencyRules.ignoreMissing]: settings#peerdependencyrulesignoremissing
[peerDependencyRules.allowedVersions]: settings#peerdependencyrulesallowedversions
