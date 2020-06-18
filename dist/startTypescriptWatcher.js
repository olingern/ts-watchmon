"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typescriptWatcher_1 = require("./typescriptWatcher");
const logger_1 = require("./logger");
const errors_1 = require("./errors");
const pkgJson = require('./package.json');
if (!pkgJson["project"]) {
    logger_1.logger.error(errors_1.ERRORS.NO_PROJECT);
}
typescriptWatcher_1.watchTypescript(`${process.cwd()}/${pkgJson.project.tsDir}`);
