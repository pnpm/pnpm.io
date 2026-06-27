---
id: exec
title: pnpm exec
---

Ejecuta un comando de shell en el ámbito de un proyecto.

La carpeta `node_modules/.bin` se agrega al `PATH`, por lo que `pnpm exec` permite ejecutar comandos que exponen ciertas dependencias.

## Ejemplos

Si tienes Jest como dependencia de tu proyecto, no es necesario instalar Jest globalmente, simplemente ejecútalo con `pnpm exec`:

```
pnpm exec jest
```

El argumento `exec` es opcional cuando el comando a ejecutar no está en conflicto con un comando incorporado de pnpm, así que también puedes ejecutar:

```
pnpm jest
```

## Opciones

Cualquier opción para el comando `exec` debe aparecer antes de la palabra `exec`. Las opciones listadas después de la palabra `exec` se pasan al comando ejecutado.

Bien. pnpm se ejecutará recursivamente:

```
pnpm -r exec jest
```

Mal, pnpm no se ejecutará recursivamente pero `jest` se ejecutará con la opción `-r`:

```
pnpm exec jest -r
```

### --recursive, -r

Ejecuta un comando de shell en cada proyecto del workspace.

El nombre del paquete actual está disponible a través de la variable de entorno `PNPM_PACKAGE_NAME`.

#### Ejemplos

Elimina las instalaciones de `node_modules` para todos los paquetes:

```
pnpm -r exec rm -rf node_modules
```

Ver la información de todos los paquetes. Esto debe usarse con la opción `--shell-mode` (o `-c`) para que funcione la variable de entorno.

```
pnpm -rc exec pnpm view \$PNPM_PACKAGE_NAME
```

### --no-reporter-hide-prefix

Do not hide prefix when running commands in parallel.

### --resume-from &lt;nombre_paquete\>

Continúa la ejecución de un proyecto en particular. Esto puede ser útil si estás trabajando con un área de trabajo grande y quieres reiniciar una compilación en un proyecto particular sin ejecutar a través de todos los proyectos que lo preceden en el orden de compilación.

### --parallel

Completely disregard concurrency and topological sorting, running a given script immediately in all matching packages. Este es el parámetro preferido para procesos de ejecución prolongada en muchos paquetes, por ejemplo, un proceso de compilación prolongado.

### --shell-mode, -c

Ejecuta el comando dentro de un shell. Utiliza `/bin/sh` en UNIX y `\cmd.exe` en Windows.

### --report-summary

[Lea acerca de esta opción en los documentos del comando de ejecución](./run.md#--report-summary)

### --filter &lt;selector_de_paquete\>

[Leer más acerca del filtrado.](../filtering.md)
