---
id: filtering
title: Filtración
---

El filtrado permite restringir los comandos a un subconjunto específico de paquetes.

pnpm admite un selector de sintaxis enriquecida para seleccionar paquetes por nombre o por relación.

Los selectores pueden especificarse mediante el indicador `--filter` (o `-F`):

```sh
pnpm --filter <package_selector> <command>
```

## Emparejamiento

### --filter &lt;package_name>

Para seleccionar un paquete exacto, simplemente especifique su nombre (`@scope/pkg`) o use un patrón para seleccionar un conjunto de paquetes (`@scope/*`).

Ejemplos:

```sh
pnpm --filter "@babel/core" test
pnpm --filter "@babel/*" test
pnpm --filter "*core" test
```

Specifying the scope of the package is optional, so `--filter=core` will pick `@babel/core` if `core` is not found. Sin embargo, si el espacio de trabajo tiene varios paquetes con el mismo nombre (por ejemplo, `@babel/core` y `@types/core`), el filtrado sin alcance no seleccionará nada.

### --filter &lt;package_name>...

Para seleccionar un paquete y sus dependencias (directas y no directas), coloque el sufijo en el nombre del paquete con puntos suspensivos: `<package_name>...`. Por ejemplo, el siguiente comando ejecutará pruebas para todas las dependencias de `foo`:

```sh
pnpm --filter foo... test
```

Puede usar un patrón para seleccionar un conjunto de paquetes raíz:

```sh
pnpm --filter "@babel/preset-*..." test
```

### --filter &lt;package_name>^...

Para seleccionar SOLAMENTE las dependencias de un paquete (tanto directas como no directas), agregue al nombre los puntos suspensivos antes mencionados precedidos por un cheurón. Por ejemplo, el siguiente comando ejecutará pruebas para todas las dependencias de `foo`:

```sh
pnpm --filter "foo^..." test
```

### --filter &lt;package_name>

Para seleccionar un paquete y sus dependencias (directas y no directas), coloque el sufijo en el nombre del paquete con puntos suspensivos: `<package_name>...`. Por ejemplo, esto ejecutará las pruebas de `foo` y todos los paquetes que dependen de él:

```sh
pnpm --filter ...foo test
```

### --filter "...^&lt;package_name>"

Para seleccionar SOLAMENTE a los dependientes de un paquete (tanto directos como no directos), prefije el nombre del paquete con puntos suspensivos seguidos de un cheurón. Por ejemplo, esto ejecutará pruebas para todos los paquetes que dependen de `foo`:

```text
pnpm --filter "...^foo" test
```

### --filter `./<glob>`, --filter `{<glob>}`

Un patrón global relativo a los proyectos que coincidan con el directorio de trabajo actual.

```sh
pnpm --filter "./packages/**" <cmd>
```

Incluye todos los proyectos que están bajo el directorio especificado.

También se puede usar con los operadores de puntos suspensivos y cheurón para seleccionar dependientes/dependencias:

```sh
pnpm --filter ...{<directory>} <cmd>
pnpm --filter {<directory>}... <cmd>
pnpm --filter ...{<directory>}... <cmd>
```

También se puede combinar con `[<since>]`. Por ejemplo, para seleccionar todos los proyectos modificados dentro de un directorio:

```sh
pnpm --filter "{packages/**}[origin/master]" <cmd>
pnpm --filter "...{packages/**}[origin/master]" <cmd>
pnpm --filter "{packages/**}[origin/master]..." <cmd>
pnpm --filter "...{packages/**}[origin/master]..." <cmd>
```

O puede seleccionar todos los paquetes de un directorio con nombres que coincidan con el patrón dado:

```text
pnpm --filter "@babel/*{components/**}" <cmd>
pnpm --filter "@babel/*{components/**}[origin/master]" <cmd>
pnpm --filter "...@babel/*{components/**}[origin/master]" <cmd>
```

### --filter "[&lt;since>]"

Selecciona todos los paquetes cambiados desde el commit/rama especificado. Puede tener el sufijo o el prefijo `...` para incluir dependencias/dependientes.

Por ejemplo, el siguiente comando ejecutará pruebas en todos los paquetes modificados desde `master` y en cualquier paquete dependiente:

```sh
pnpm --filter "...[origin/master]" test
```

### --fail-if-no-match

Use this flag if you want the CLI to fail if no packages have matched the filters.

You may also set this permanently with a [`failIfNoMatch` setting][].

## Excluyendo

Cualquiera de los selectores de filtro puede funcionar como operadores de exclusión cuando tienen un inicial "!". En zsh (y posiblemente en otros shells), "!" se debe escapar: `\!`.

Por ejemplo, esto ejecutará un comando en todos los proyectos excepto en `foo`:

```sh
pnpm --filter=!foo <cmd>
```

Y esto ejecutará un comando en todos los proyectos que no estén en el directorio `lib`:

```sh
pnpm --filter=!./lib <cmd>
```

## Multiplicidad

Cuando se filtran los paquetes, se toma cada paquete que coincida con al menos uno de los selectores. Puedes usar tantos filtros como quieras:

```sh
pnpm --filter ...foo --filter bar --filter baz... test
```

## --filter-prod &lt;filtering_pattern>

Actúa igual que `--filter` pero omite `devDependencies` al seleccionar los proyectos de dependencia del espacio de trabajo.

## -- test-pattern &lt;glob>

`test-pattern` permite detectar los archivos modificados relacionados con pruebas. Si lo son, los paquetes dependientes de dichos paquetes modificados no están incluidos.

Esta opción es útil con el filtro "cambiado desde". Por ejemplo, el siguiente comando ejecutará pruebas en todos los paquetes modificados, y si los cambios están en el código fuente del paquete, las pruebas también se ejecutarán en los paquetes dependientes:

```sh
pnpm --filter="...[origin/master]" --test-pattern="test/*" test
```

## --changed-files-ignore-pattern &lt;glob>

Permite ignorar los archivos cambiados por patrones de glob al filtrar los proyectos cambiados desde el commit/rama especificado.

Ejemplo de uso:

```sh
pnpm --filter="...[origin/master]" --changed-files-ignore-pattern="**/README.md" run build
```

[`failIfNoMatch` setting]: workspaces.md#failifnomatch
