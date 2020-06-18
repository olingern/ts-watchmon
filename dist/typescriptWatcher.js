"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typescriptCompilerMessageHandler = exports.watchTypescript = void 0;
const ts = require("typescript");
function searchLineMap(lineMap, errorCode) {
    const lineMapLookup = new Map();
    const lineMapLen = lineMap.length;
    for (let i = 0; i < lineMapLen; i++) {
        lineMapLookup.set(lineMap[i], i + 1);
    }
    const result = lineMap.reduce((a, b) => {
        return Math.abs(b - errorCode) < Math.abs(a - errorCode) ? b : a;
    });
    return lineMapLookup.get(result);
}
function sendParentMessage(message) {
    process.send({
        message,
        isError: false
    });
}
function sendParentErrorMessage(filename, line, code, message) {
    process.send({
        filename,
        line,
        message,
        code,
        isError: true
    });
}
const formatHost = {
    getCanonicalFileName: (path) => path,
    getCurrentDirectory: ts.sys.getCurrentDirectory,
    getNewLine: () => ts.sys.newLine
};
function watchTypescript(tsDirToWatch) {
    const configPath = ts.findConfigFile(tsDirToWatch, ts.sys.fileExists, 'tsconfig.json');
    if (!configPath) {
        throw new Error("Could not find a valid 'tsconfig.json'.");
    }
    const createProgram = ts.createSemanticDiagnosticsBuilderProgram;
    const host = ts.createWatchCompilerHost(configPath, {}, ts.sys, createProgram, reportDiagnostic, reportWatchStatusChanged);
    const origCreateProgram = host.createProgram;
    host.createProgram = (rootNames, options, host, oldProgram) => {
        sendParentMessage('Beginning compilation');
        return origCreateProgram(rootNames, options, host, oldProgram);
    };
    const origPostProgramCreate = host.afterProgramCreate;
    host.afterProgramCreate = program => {
        sendParentMessage('Compilation finished');
        origPostProgramCreate && origPostProgramCreate(program);
    };
    ts.createWatchProgram(host);
}
exports.watchTypescript = watchTypescript;
function reportDiagnostic(diagnostic) {
    if (!diagnostic || !diagnostic.file || !diagnostic.start) {
        throw new Error('Diagnostic missing info');
    }
    const file = diagnostic.file;
    if (!file.lineMap) {
        throw new Error('File does not have lineMap property');
    }
    const line = searchLineMap(file.lineMap, diagnostic.start);
    if (!line) {
        throw new Error('Could not find line of error');
    }
    sendParentErrorMessage(diagnostic.file.fileName, line, diagnostic.code, ts.flattenDiagnosticMessageText(diagnostic.messageText, formatHost.getNewLine()));
}
function reportWatchStatusChanged(diagnostic) {
    sendParentMessage(ts.formatDiagnostic(diagnostic, formatHost));
}
function typescriptCompilerMessageHandler(msg, stdout, stderr) {
    if (msg.isError) {
        stdout.log('[COMPILER]: Error', msg.code, ':', `${msg.message}\nLINE:${msg.line}`);
    }
    else {
        stderr.log('[COMPILER]:', msg.message);
    }
}
exports.typescriptCompilerMessageHandler = typescriptCompilerMessageHandler;
