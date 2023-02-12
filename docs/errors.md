---
id: errors
title: Error Codes
---

## ERR_PNPM_UNEXPECTED_STORE

A modules directory is present and is linked to a different store directory.

If you changed the store directory intentionally, run `pnpm install` and pnpm will reinstall the dependencies using the new store.

## ERR_PNPM_NO_MATCHING_VERSION_INSIDE_WORKSPACE

A project has a workspace dependency that does not exist in the workspace.

For instance, package `foo` has `bar@1.0.0` in the `dependencies`:

```json
{
  "name": "foo",
  "version": "1.0.0",
  "dependencies": {
    "bar": "workspace:1.0.0"
  }
}
```

However, there is only `bar@2.0.0` in the workspace, so `pnpm install` will fail.

To fix this error, all dependencies that use the [workspace protocol] should be updated to use versions of packages that are present in the workspace. This can be done either manually or using the `pnpm -r update` command.

[workspace protocol]: ./workspaces.md#workspace-protocol-workspace

## ERR_PNPM_PEER_DEP_ISSUES

`pnpm install` will fail if the project has unresolved peer dependencies or the peer dependencies are not matching the wanted ranges. To fix this, install the missing peer dependencies.

You may also selectively ignore these errors using the [pnpm.peerDependencyRules.ignoreMissing](package_json#pnpmpeerdependencyrulesignoremissing) and [pnpm.peerDependencyRules.allowedVersions](package_json#pnpmpeerdependencyrulesallowedversions) fields in `package.json`.

## ERR_PNPM_OUTDATED_LOCKFILE

This error happens when installation cannot be performed without changes to the lockfile. This might happen in a CI environment if someone has changed a `package.json` file in the repository without running `pnpm install` afterwards. Or someone forgot to commit the changes to the lockfile.

To fix this error, just run `pnpm install` and commit the changes to the lockfile.

## ERR_PNPM_AUDIT_BAD_RESPONSE

## ERR_PNPM_CONFIG_CONFLICT_LINK_WORKSPACE_PACKAGES_WITH_GLOBAL

## ERR_PNPM_CONFIG_CONFLICT_SHARED_WORKSPACE_LOCKFILE_WITH_GLOBAL

## ERR_PNPM_CONFIG_CONFLICT_LOCKFILE_DIR_WITH_GLOBAL

## ERR_PNPM_CONFIG_CONFLICT_HOIST_PATTERN_WITH_GLOBAL

## ERR_PNPM_CONFIG_CONFLICT_VIRTUAL_STORE_DIR_WITH_GLOBAL

## ERR_PNPM_CONFIG_CONFLICT_PEER_CANNOT_BE_PROD_DEP

## ERR_PNPM_CONFIG_CONFLICT_PEER_CANNOT_BE_OPTIONAL_DEP

## ERR_PNPM_CONFIG_CONFLICT_HOIST

## ERR_PNPM_LOCKFILE_MISSING_DEPENDENCY

## ERR_PNPM_MODULES_BREAKING_CHANGE

## ERR_PNPM_LOCKFILE_BREAKING_CHANGE

## ERR_PNPM_INVALID_PACKAGE_NAME

## ERR_PNPM_REGISTRIES_MISMATCH

## ERR_PNPM_LOCKFILE_MISSING_DEPENDENCY

## ERR_PNPM_NO_OFFLINE_TARBALL

## ERR_PNPM_NO_OFFLINE_TARBALL

## ERR_PNPM_LOCKFILE_DIRECTORY_MISMATCH

## ERR_PNPM_SPEC_NOT_SUPPORTED_BY_ANY_RESOLVER

## ERR_PNPM_UNEXPECTED_VIRTUAL_STORE

## ERR_PNPM_STORE_BREAKING_CHANGE

## ERR_PNPM_MODIFIED_DEPENDENCY

## ERR_PNPM_RECURSIVE_RUN_NO_SCRIPT

## ERR_PNPM_NO_MATCHING_VERSION

## ERR_PNPM_RECURSIVE_FAIL

## ERR_PNPM_BAD_TARBALL_SIZE

## ERR_PNPM_UNSUPPORTED_ENGINE

## ERR_PNPM_FETCH_401

## ERR_PNPM_FETCH_403

## ERR_PNPM_SOME_CODE

## ERR_PNPM_UNSUPPORTED_PLATFORM

## ERR_PNPM_OPTIONS_CONFLICT

## ERR_PNPM_NOT_IN_WORKSPACE

## ERR_PNPM_WORKSPACE_OPTION_OUTSIDE_WORKSPACE

## ERR_PNPM_BAD_OPTIONS

## ERR_PNPM_FETCH_404

## ERR_PNPM_CANNOT_REMOVE_MISSING_DEPS

Trying to remove a dependency does not exist on the repository

```
pnpm remove does-not-exist
ERR_PNPM_CANNOT_REMOVE_MISSING_DEPS  Cannot remove 'a': no such dependency found
```

## ERR_PNPM_NO_PACKAGE_IN_DEPENDENCIES

## ERR_PNPM_MISSING_PACKAGE_NAME

## ERR_PNPM_OUTDATED_NO_LOCKFILE

## ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL

## ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL

## ERR_PNPM_BAD_ENV_FOUND

## ERR_PNPM_BAD_SHELL_SECTION

## ERR_PNPM_STORE_ADD_FAILURE

## ERR_PNPM_BAD_PACKAGE_JSON

## ERR_PNPM_NO_IMPORTER_MANIFEST_FOUND

## ERR_PNPM_YAML_PARSE

## ERR_PNPM_JSON_PARSE

## ERR_PNPM_JSON_PARSE

## ERR_PNPM_PREPARE_PKG_FAILURE
