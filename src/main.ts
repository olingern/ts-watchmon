import * as nodemon from 'nodemon'

import { forkFactory } from './fork'
import { appService } from './nodemonWatcher'
import { typescriptCompilerMessageHandler } from './typescriptWatcher'
import { logger } from './logger'

import { existsSync } from "fs"

// Validate package.json existence
try {
  if (existsSync("./package.json")) {
    //file exists
    logger.info("package.json found")
  }
} catch (e) {
  logger.error(e)
}

const pkg = require("./package.json")

// Validate package.json project properties
if (!pkg.project || !pkg.project.tsDir || !pkg.project.entry) {
  logger.error("package.json project section is not filled out correct. See the docs")
}

try {
  // Forks a process and injects a message handler
  forkFactory(`${__dirname}/startTypescriptWatcher`, typescriptCompilerMessageHandler)

  // Main service for nodemon process
  appService(nodemon, 'js json')
} catch (e) {
  console.error(e)
}

