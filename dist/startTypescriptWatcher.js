"use strict";
exports.__esModule = true;
var typescriptWatcher_1 = require("./typescriptWatcher");
var pkgJson = require('../package.json');
typescriptWatcher_1.watchTypescript(process.cwd() + "/" + pkgJson.project.tsDir);
