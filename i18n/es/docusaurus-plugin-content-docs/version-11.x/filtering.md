---
id: filtering
title: Filtración
---

El filtrado permite restringir los comandos a un subconjunto específico de paquetes.

pnpm admite un selector de sintaxis enriquecida para seleccionar paquetes por nombre o por relación.

Selectors may be specified via the `--filter` (or `-F`) flag:

```sh
pnpm --filter <package_selector> <command>
```

## Emparejamiento

### --filter &lt;package_name>

To select an exact package, just specify its name (`@scope/pkg`) or use a
pattern to select a set of packages (`@scope/*`).

Ejemplos:

```sh
pnpm --filter "@babel/core" test
pnpm --filter "@babel/*" test
pnpm --filter "*core" test
```

Specifying the scope of the package is optional, so `--filter=core` will pick `@babel/core` if `core` is not found.
However, if the workspace has multiple packages with the same name (for instance, `@babel/core` and `@types/core`),
then filtering without scope will pick nothing.

### --filter &lt;package_name>...

To select a package and its dependencies (direct and non-direct), suffix the
package name with an ellipsis: `<package_name>...`. For instance, the next
command will run tests of `foo` and all of its dependencies:

```sh
pnpm --filter foo... test
```

Puede usar un patrón para seleccionar un conjunto de paquetes raíz:

```sh
pnpm --filter "@babel/preset-*..." test
```

### --filter &lt;package_name>^...

Para seleccionar SOLAMENTE las dependencias de un paquete (tanto directas como no directas),
agregue al nombre los puntos suspensivos antes mencionados precedidos por un cheurón. For
instance, the next command will run tests for all of `foo`'s
dependencies:

```sh
pnpm --filter "foo^..." test
```

### --filter ...&lt;package_name>

To select a package and its dependent packages (direct and non-direct), prefix
the package name with an ellipsis: `...<package_name>`. For instance, this will
run the tests of `foo` and all packages dependent on it:

```sh
pnpm --filter ...foo test
```

### --filter "...^&lt;package_name>"

Para seleccionar SOLAMENTE a los dependientes de un paquete (tanto directos como no directos), prefije el nombre del paquete
con puntos suspensivos seguidos de un cheurón. For instance, this will
run tests for all packages dependent on `foo`:

```text
pnpm --filter "...^foo" test
```

### --filter `./<glob>`, --filter `{<glob>}`

Un patrón global relativo a los proyectos que coincidan con el directorio de trabajo actual.

```sh
pnpm --filter "./packages/**" <cmd>
```

Incluye todos los proyectos que están bajo el directorio especificado.

También se puede usar con los operadores de puntos suspensivos y cheurón para seleccionar
dependientes/dependencias:

```sh
pnpm --filter ...{<directory>} <cmd>
pnpm --filter {<directory>}... <cmd>
pnpm --filter ...{<directory>}... <cmd>
```

It may also be combined with `[<since>]`. Por ejemplo, para seleccionar todos los
proyectos modificados dentro de un directorio:

```sh
pnpm --filter "{packages/**}[origin/master]" <cmd>
pnpm --filter "...{packages/**}[origin/master]" <cmd>
pnpm --filter "{packages/**}[origin/master]..." <cmd>
pnpm --filter "...{packages/**}[origin/master]..." <cmd>
```

O puede seleccionar todos los paquetes de un directorio con nombres que coincidan con el patrón
dado:

```text
pnpm --filter "@babel/*{components/**}" <cmd>
pnpm --filter "@babel/*{components/**}[origin/master]" <cmd>
pnpm --filter "...@babel/*{components/**}[origin/master]" <cmd>
```

### --filter "[&lt;since>]"

Selecciona todos los paquetes cambiados desde el commit/rama especificado. May be
suffixed or prefixed with `...` to include dependencies/dependents.

For example, the next command will run tests in all changed packages since
`master` and on any dependent packages:

```sh
pnpm --filter "...[origin/master]" test
```

### --fail-if-no-match

Use this flag if you want the CLI to fail if no packages have matched the filters.

You may also set this permanently with a [`failIfNoMatch` setting].

[`failIfNoMatch` setting]: workspaces.md#failifnomatch

## Excluyendo

Cualquiera de los selectores de filtro puede funcionar como operadores de exclusión cuando tienen un
inicial "!". In zsh (and possibly other shells), "!" should be escaped: `\!`.

For instance, this will run a command in all projects except for `foo`:

```sh
pnpm --filter=!foo <cmd>
```

And this will run a command in all projects that are not under the `lib`
directory:

```sh
pnpm --filter=!./lib <cmd>
```

## Multiplicidad

Cuando se filtran los paquetes, se toma cada paquete que coincida con al menos uno de los
selectores. Puedes usar tantos filtros como quieras:

```sh
pnpm --filter ...foo --filter bar --filter baz... test
```

## --filter-prod &lt;filtering_pattern>

Acts the same a `--filter` but omits `devDependencies` when selecting dependency projects
from the workspace.

## --test-pattern &lt;glob>

`test-pattern` allows detecting whether the modified files are related to tests.
Si lo son, los paquetes dependientes de dichos paquetes modificados no están incluidos.

Esta opción es útil con el filtro "cambiado desde". Por ejemplo, el siguiente comando
ejecutará pruebas en todos los paquetes modificados, y si los cambios están en el código fuente
del paquete, las pruebas también se ejecutarán en los paquetes dependientes:

```sh
pnpm --filter="...[origin/master]" --test-pattern="test/*" test
```

## --changed-files-ignore-pattern &lt;glob>

Permite ignorar los archivos cambiados por patrones de glob al filtrar los proyectos cambiados desde el commit/rama especificado.

Ejemplo de uso:

```sh
pnpm --filter="...[origin/master]" --changed-files-ignore-pattern="**/README.md" run build
```
