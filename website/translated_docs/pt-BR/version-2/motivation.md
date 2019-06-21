---
id: versão-2-motivação
title: Motivação
original_id: motivação
---

O pnpm usa hard links e links simbólicos para salvar uma versão de um módulo apenas uma vez em um disco.
Ao usar npm ou Yarn, por exemplo, se você tiver 100 projetos usando a mesma versão
de lodash, você terá 100 cópias de lodash no disco. Com pnpm, o lodash será salvo em um
Um único lugar no disco e um hard link irá colocá-lo no `node_modules` onde deveria
ser instalado.

Como resultado, você economiza gigabytes de espaço no disco e tem instalações muito mais rápidas!
Se você quiser mais detalhes sobre a estrutura `node_modules` exclusiva que o pnpm cria e
por que funciona bem com o ecossistema Node.js, leia este pequeno artigo: [Por que devemos usar o pnpm?](https://www.kochan.io/nodejs/why-should-we-use-pnpm.html)