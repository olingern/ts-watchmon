/**
 * The typescript watch starts in a separate process
 */

import { watchTypescript } from './typescriptWatcher'
import { logger } from './logger'
import { ERRORS } from './errors'

// main will validate existence, but because
// we are in a separate process, we need to
// re-require here.
const pkgJson = require('./package.json')

if (!pkgJson['project']) {
  logger.error(ERRORS.NO_PROJECT)
}

watchTypescript(`${process.cwd()}/${pkgJson.project.tsDir}`)
