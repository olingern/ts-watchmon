import * as childProcess from 'child_process'
import { Console } from 'console'

import { ICompilerMessage, IForkedProcessMessageHandler } from './interfaces'

export function forkFactory(filePath: string, messageHandler: IForkedProcessMessageHandler): childProcess.ChildProcess {
  const forkedProcess = childProcess.fork(filePath)

  const stderrConsole = new Console(process.stderr)
  const stdoutConsole = new Console(process.stdout)

  forkedProcess.send({})
  forkedProcess.on('message', (msg: ICompilerMessage) => {
    messageHandler(msg, stdoutConsole, stderrConsole)
  })

  return forkedProcess
}
