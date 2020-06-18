"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forkFactory = void 0;
const childProcess = require("child_process");
const console_1 = require("console");
function forkFactory(filePath, messageHandler) {
    const forkedProcess = childProcess.fork(filePath);
    const stderrConsole = new console_1.Console(process.stderr);
    const stdoutConsole = new console_1.Console(process.stdout);
    forkedProcess.on('message', (msg) => {
        messageHandler(msg, stdoutConsole, stderrConsole);
    });
    return forkedProcess;
}
exports.forkFactory = forkFactory;
