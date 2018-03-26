'use strict'

module.exports = {
  hooks: {
    readPackage (pkg) {
      switch (pkg.name) {
        case 'docusaurus':
          pkg.dependencies['mkdirp'] = '^0.5.1'
          break
      }
      return pkg
    }
  }
}
