"use strict";
exports.__esModule = true;
exports.forkFactory = void 0;
var childProcess = require("child_process");
var console_1 = require("console");
function forkFactory(filePath, messageHandler) {
    var forkedProcess = childProcess.fork(filePath);
    var stderrConsole = new console_1.Console(process.stderr);
    var stdoutConsole = new console_1.Console(process.stdout);
    forkedProcess.send({});
    forkedProcess.on('message', function (msg) {
        messageHandler(msg, stdoutConsole, stderrConsole);
    });
    return forkedProcess;
}
exports.forkFactory = forkFactory;
