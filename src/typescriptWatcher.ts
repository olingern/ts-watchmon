import * as ts from 'typescript'

import { ICompilerMessage, IExtendedSourceFile } from './interfaces'

/**
 *
 * @param lineMap
 * @param errorCode
 */
function searchLineMap(lineMap: number[], errorCode: number): number | undefined {
  const lineMapLookup: Map<number, number> = new Map()
  const lineMapLen = lineMap.length

  for (let i = 0; i < lineMapLen; i++) {
    lineMapLookup.set(lineMap[i], i + 1)
  }

  const result = lineMap.reduce((a, b) => {
    return Math.abs(b - errorCode) < Math.abs(a - errorCode) ? b : a
  })

  return lineMapLookup.get(result)
}

/**
 *
 * @param message
 */
function sendParentMessage(message: string): void {
  process.send!({
    message,
    isError: false
  })
}

/**
 *
 * @param filename
 * @param line
 * @param code
 * @param message
 */
function sendParentErrorMessage(filename: string, line: number, code: number, message: string): void {
  process.send!({
    filename,
    line,
    message,
    code,
    isError: true
  })
}

/**
 *
 */
const formatHost = {
  getCanonicalFileName: (path: string): string => path,
  getCurrentDirectory: ts.sys.getCurrentDirectory,
  getNewLine: (): string => ts.sys.newLine
}

/**
 *
 */
export function watchTypescript(tsDirToWatch: string): void {
  const configPath = ts.findConfigFile(tsDirToWatch, ts.sys.fileExists, 'tsconfig.json')
  if (!configPath) {
    throw new Error("Could not find a valid 'tsconfig.json'.")
  }

  const createProgram = ts.createSemanticDiagnosticsBuilderProgram

  const host = ts.createWatchCompilerHost(
    configPath,
    {},
    ts.sys,
    createProgram,
    reportDiagnostic,
    reportWatchStatusChanged
  )

  const origCreateProgram = host.createProgram

  host.createProgram = (rootNames, options, host, oldProgram) => {
    sendParentMessage('Beginning compilation')
    return origCreateProgram(rootNames, options, host, oldProgram)
  }
  const origPostProgramCreate = host.afterProgramCreate

  host.afterProgramCreate = program => {
    sendParentMessage('Compilation finished')
    origPostProgramCreate && origPostProgramCreate(program)
  }

  ts.createWatchProgram(host)
}

/**
 *
 * @param diagnostic
 */
function reportDiagnostic(diagnostic: ts.Diagnostic): void {
  if (!diagnostic || !diagnostic.file || !diagnostic.start) {
    throw new Error('Diagnostic missing info')
  }

  const file: IExtendedSourceFile = diagnostic.file

  if (!file.lineMap) {
    throw new Error('File does not have lineMap property')
  }

  const line = searchLineMap(file.lineMap, diagnostic.start)

  if (!line) {
    throw new Error('Could not find line of error')
  }

  sendParentErrorMessage(
    diagnostic.file.fileName,
    line,
    diagnostic.code,
    ts.flattenDiagnosticMessageText(diagnostic.messageText, formatHost.getNewLine())
  )
}

/**
 *
 * @param diagnostic
 */
function reportWatchStatusChanged(diagnostic: ts.Diagnostic) {
  sendParentMessage(ts.formatDiagnostic(diagnostic, formatHost))
}

export function typescriptCompilerMessageHandler(msg: ICompilerMessage, stdout: any, stderr: any) {
  if (msg.isError) {
    stdout.log('[COMPILER]: Error', msg.code, ':', `${msg.message}\nLINE:${msg.line}`)
  } else {
    stderr.log('[COMPILER]:', msg.message)
  }
}
