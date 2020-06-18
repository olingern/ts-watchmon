"use strict";
exports.__esModule = true;
var nodemon = require("nodemon");
var fork_1 = require("./fork");
var nodemonWatcher_1 = require("./nodemonWatcher");
var typescriptWatcher_1 = require("./typescriptWatcher");
try {
    fork_1.forkFactory(__dirname + "/startTypescriptWatcher", typescriptWatcher_1.typescriptCompilerMessageHandler);
    nodemonWatcher_1.appService(nodemon, 'node ./app/main.js', 'js json');
}
catch (e) {
    console.error(e);
}
