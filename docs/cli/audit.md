---
id: audit
title: pnpm audit
---

Checks for known security issues with the installed packages.

If security issues are found, try to update your dependencies via `pnpm update`.
If a simple update does not fix all the issues, use [overrides] to force
versions that are not vulnerable. For instance, if `lodash@<2.1.0` is vulnerable,
use this overrides to force `lodash@^2.1.0`:

```json title="package.json"
{
    "pnpm": {
        "overrides": {
            "lodash@<2.1.0": "^2.1.0"
        }
    }
}
```

Or alternatively, run `pnpm audit --fix`.


If an `allowList` is provided in the `package.json`, overrides for those CVEs will not be installed.
This is useful if a vulnerable package has been designated as tolerable to a project or an upstream dependency is blocking an upgrade.

```json title="package.json"
{
    "pnpm": {
        "allowList": [
            "CVE-2022-36313"
        ]
    }
}
```

[overrides]: ../package_json.md#pnpmoverrides

## Options

### --audit-level &lt;severity\>

* Type: **low**, **moderate**, **high**, **critical**
* Default: **low**

Only print advisories with severity greater than or equal to `<severity>`.

### --fix

Add overrides to the `package.json` file in order to force non-vulnerable versions of the dependencies.

### --json

Output audit report in JSON format.

### --dev, -D

Only audit dev dependencies.

### --prod, -P

Only audit production dependencies.

### --no-optional

Don't audit `optionalDependencies`.

### --ignore-registry-errors

If the registry responds with a non-200 status code, the process should exit with 0.
So the process will fail only if the registry actually successfully responds with found vulnerabilities.
