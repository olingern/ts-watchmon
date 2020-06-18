import { watchTypescript } from './typescriptWatcher';

const pkgJson = require('../package.json')

watchTypescript(`${process.cwd()}/${pkgJson.project.tsDir}`)
