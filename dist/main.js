"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodemon = require("nodemon");
const fork_1 = require("./fork");
const nodemonWatcher_1 = require("./nodemonWatcher");
const typescriptWatcher_1 = require("./typescriptWatcher");
const logger_1 = require("./logger");
const fs_1 = require("fs");
try {
    if (fs_1.existsSync("./package.json")) {
        logger_1.logger.info("package.json found");
    }
}
catch (e) {
    logger_1.logger.error(e);
}
const pkg = require("./package.json");
if (!pkg.project || !pkg.project.tsDir || !pkg.project.entry) {
    logger_1.logger.error("package.json project section is not filled out correct. See the docs");
}
try {
    fork_1.forkFactory(`${__dirname}/startTypescriptWatcher`, typescriptWatcher_1.typescriptCompilerMessageHandler);
    nodemonWatcher_1.appService(nodemon, 'js json');
}
catch (e) {
    console.error(e);
}
