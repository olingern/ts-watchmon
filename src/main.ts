import * as nodemon from 'nodemon'

import { forkFactory } from './fork'
import { appService } from './nodemonWatcher'
import { typescriptCompilerMessageHandler } from './typescriptWatcher'

import * as pkg from "./package.json"

try {
  console.log(pkg.project["compiledEntry"])
  forkFactory(`${__dirname}/startTypescriptWatcher`, typescriptCompilerMessageHandler)
  appService(nodemon, 'node ./app/main.js', 'js json')
} catch (e) {
  console.error(e)
}
