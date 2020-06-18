"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodemon = require("nodemon");
const fork_1 = require("./fork");
const nodemonWatcher_1 = require("./nodemonWatcher");
const typescriptWatcher_1 = require("./typescriptWatcher");
const logger_1 = require("./logger");
const common_1 = require("./common");
const fs_1 = require("fs");
const errors_1 = require("./errors");
try {
    if (fs_1.existsSync(common_1.getPkgJsonPath())) {
        logger_1.logger.success('package.json found');
    }
}
catch (e) {
    logger_1.logger.error(e);
    process.exit(1);
}
const pkg = require(common_1.getPkgJsonPath());
if (!pkg.project || !pkg.project.tsDir) {
    logger_1.logger.error(errors_1.ERRORS.INVALID_PACKAGE_JSON);
    process.exit(1);
}
try {
    fork_1.forkFactory(`${__dirname}/startTypescriptWatcher`, typescriptWatcher_1.typescriptCompilerMessageHandler);
    nodemonWatcher_1.appService(nodemon, 'js json');
}
catch (e) {
    console.error(e);
}
