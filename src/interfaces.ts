import { SourceFile } from 'typescript'

export interface ICompilerMessage {
  message: string
  isError: boolean
  code?: number
  line?: number
}

export interface IForkedProcessMessageHandler {
  (msg: ICompilerMessage, stdout: any, stderr: any): void
}

export interface IExtendedSourceFile extends SourceFile {
  lineMap?: number[]
}
