"use strict";
exports.__esModule = true;
exports.typescriptCompilerMessageHandler = exports.watchTypescript = void 0;
var ts = require("typescript");
/**
 *
 * @param lineMap
 * @param errorCode
 */
function searchLineMap(lineMap, errorCode) {
    var lineMapLookup = new Map();
    var lineMapLen = lineMap.length;
    for (var i = 0; i < lineMapLen; i++) {
        lineMapLookup.set(lineMap[i], i + 1);
    }
    var result = lineMap.reduce(function (a, b) {
        return Math.abs(b - errorCode) < Math.abs(a - errorCode) ? b : a;
    });
    return lineMapLookup.get(result);
}
/**
 *
 * @param message
 */
function sendParentMessage(message) {
    process.send({
        message: message,
        isError: false
    });
}
/**
 *
 * @param filename
 * @param line
 * @param code
 * @param message
 */
function sendParentErrorMessage(filename, line, code, message) {
    process.send({
        filename: filename,
        line: line,
        message: message,
        code: code,
        isError: true
    });
}
/**
 *
 */
var formatHost = {
    getCanonicalFileName: function (path) { return path; },
    getCurrentDirectory: ts.sys.getCurrentDirectory,
    getNewLine: function () { return ts.sys.newLine; }
};
/**
 *
 */
function watchTypescript(tsDirToWatch) {
    var configPath = ts.findConfigFile(tsDirToWatch, ts.sys.fileExists, 'tsconfig.json');
    if (!configPath) {
        throw new Error("Could not find a valid 'tsconfig.json'.");
    }
    var createProgram = ts.createSemanticDiagnosticsBuilderProgram;
    var host = ts.createWatchCompilerHost(configPath, {}, ts.sys, createProgram, reportDiagnostic, reportWatchStatusChanged);
    var origCreateProgram = host.createProgram;
    host.trace = function (s) {
        console.log('I am tracing');
        console.log(s);
    };
    host.createProgram = function (rootNames, options, host, oldProgram) {
        sendParentMessage('Beginning compilation');
        return origCreateProgram(rootNames, options, host, oldProgram);
    };
    var origPostProgramCreate = host.afterProgramCreate;
    host.afterProgramCreate = function (program) {
        sendParentMessage('Compilation finished');
        origPostProgramCreate && origPostProgramCreate(program);
    };
    ts.createWatchProgram(host);
}
exports.watchTypescript = watchTypescript;
/**
 *
 * @param diagnostic
 */
function reportDiagnostic(diagnostic) {
    if (!diagnostic || !diagnostic.file || !diagnostic.start) {
        throw new Error('Diagnostic missing info');
    }
    var file = diagnostic.file;
    if (!file.lineMap) {
        throw new Error('File does not have lineMap property');
    }
    var line = searchLineMap(file.lineMap, diagnostic.start);
    if (!line) {
        throw new Error('Could not find line of error');
    }
    sendParentErrorMessage(diagnostic.file.fileName, line, diagnostic.code, ts.flattenDiagnosticMessageText(diagnostic.messageText, formatHost.getNewLine()));
}
/**
 *
 * @param diagnostic
 */
function reportWatchStatusChanged(diagnostic) {
    sendParentMessage(ts.formatDiagnostic(diagnostic, formatHost));
}
function typescriptCompilerMessageHandler(msg, stdout, stderr) {
    if (msg.isError) {
        stdout.log('[COMPILER]: Error', msg.code, ':', msg.message + "\nLINE:" + msg.line);
    }
    else {
        stderr.log('[COMPILER]:', msg.message);
    }
}
exports.typescriptCompilerMessageHandler = typescriptCompilerMessageHandler;
