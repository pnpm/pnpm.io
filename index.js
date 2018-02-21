'use strict'
const loadYamlFile = require('load-yaml-file')
const pug = require('pug')
const fs = require('mz/fs')

const homepage = pug.compileFile('template.pug')

const langs = [
  {
    code: 'en',
    label: 'English'
  },
  {
    code: 'de',
    label: 'Deutsch'
  },
  {
    code: 'hu',
    label: 'Magyar'
  },
  {
    code: 'uk',
    label: 'Українська'
  },
  {
    code: 'ru',
    label: 'Русский'
  },
  {
    code: 'pt-br',
    label: 'Português (Brasil)'
  },
  {
    code: 'es',
    label: 'Español'
  },
  {
    code: 'zh-cn',
    label: '简体中文'
  }
]

loadYamlFile('copies.yaml')
  .then(copies => {
    const promises = Object.keys(copies)
      .map(langCode => {
        const model = Object.assign({}, copies[langCode], {
          langs: langs.filter(lang => lang.code !== langCode)
        })
        const html = homepage(model)
        const filename = langCode === 'en'
          ? 'index.html'
          : `${langCode}/index.html`
        return fs.writeFile(filename, html, 'UTF8')
      })
    return Promise.all(promises)
  })
  .catch(err => console.error(err))
