---
title: Opciones de configuración de Node-Modules con pnpm
authors: zkochan
---

Hay muchas maneras de crear un directorio de los módulos de node. Tu objetivo debe ser crear el más estricto, pero si eso no es posible, también hay opciones para hacer un node_modules suelto también.

<!--truncate-->

## La configuración predeterminada

De forma predeterminada, pnpm v6 creará un directorio semi estricto de node_modules. Semi estricto significa que tu aplicación solo podrá requerir paquetes que se agreguen como dependencias a `package.json` (con un par de excepciones). Sin embargo, tus dependencias podrán acceder a cualquier paquete.

La configuración predeterminada se ve así:

```ini
; Todos los paquetes son hoisteados a node_modules/.pnpm/node_modules
hoist-pattern[]=*

; Todos los tipos son hoisteados a la raíz para que TypeScript no moleste
public-hoist-pattern[]=*types*

; Todos los paquetes relacionados con ESLint son hoisteados a la raíz también
public-hoist-pattern[]=*eslint*
```

## Plug'nPlay. La configuración más estricta

pnpm soporta [ el Plug'n'Play de Yarn](https://yarnpkg.com/features/pnp) desde la v5.9. Con PnP, tanto su aplicación como las dependencias de su aplicación tendrán acceso solo a sus dependencias declaradas. Esto es aún más estricto que establecer `hoist=false` porque dentro de un monorepo, su aplicación no podrá acceder ni siquiera a las dependencias del proyecto raíz.

Para usar Plug'n'Play, establezca estos ajustes:

```ini
node-linker=pnp
symlink=false
```

## Un directorio de módulos estricto y tradicional

Si no estás listo para usar PnP aún, puedes ser estricto y únicamente permitir que los paquetes accedan a sus propias dependencias fijando la configuración de hoist a falso:

```ini
hoist=false
```

Sin embargo, si alguna de tus dependencias intentan acceder a paquetes que no forman parte de sus dependencias, tienes dos opciones:

1. Crea un archivo `pnpmfile.js` y utiliza un [hook](/pnpmfile) para agregar la dependencia que falta al manifiesto del paquete.

2. Agrega un patrón a la opción `hoist-pattern`. Por ejemplo, si el módulo que falta es `babel-core`, agrega la siguiente configuración a `.npmrc`:

    ```ini
    hoist-pattern[]=babel-core
    ```

## El peor caso - hoisting a la raíz

Algunas herramientas tal vez no funcionen aún con la configuración predeterminada de pnpm, que hoistea todo a la raíz de la virtual store y a algunos paquetes a la raíz. En este caso, puedes hoistear todo o una parte de las dependencias a la raíz del directorio de módulos.

Hoistear todo a la raíz de node_modules:

```ini
shamefully-hoist=true
```

Hoistear únicamente los paquetes que coincidan con un patrón:

```ini
public-hoist-pattern[]=babel-*
```
