import * as nodemon from 'nodemon'

import { forkFactory } from './fork'
import { appService } from './nodemonWatcher'
import { typescriptCompilerMessageHandler } from './typescriptWatcher'
import { logger } from './logger'
import { getPkgJsonPath } from './common'

import { existsSync } from 'fs'
import { ERRORS } from './errors'

// Validate package.json existence
try {
  if (existsSync(getPkgJsonPath())) {
    //file exists
    logger.success('package.json found')
  }
} catch (e) {
  logger.error(e)
  process.exit(1)
}


const pkg = require(getPkgJsonPath())

// Validate package.json project properties
if (!pkg.project || !pkg.project.tsDir) {
  logger.error(ERRORS.INVALID_PACKAGE_JSON)
  process.exit(1)
}

try {
  // Forks a process and injects a message handler
  forkFactory(`${__dirname}/startTypescriptWatcher`, typescriptCompilerMessageHandler)

  // Main service for nodemon process
  appService(nodemon, 'js json')
} catch (e) {
  console.error(e)
}
