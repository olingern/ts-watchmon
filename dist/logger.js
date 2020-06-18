"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const chalk = require("chalk");
exports.logger = {
    error: function (msg) {
        console.log(`${chalk.red("❌")} ${msg}`);
    },
    success: function (msg) {
        console.log(`${chalk.green("✔️")}  ${msg}`);
    }
};
