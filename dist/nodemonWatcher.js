"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appService = void 0;
const NODEMON_EVENTS = {
    START: 'start',
    QUIT: 'quit',
    RESTART: 'restart'
};
function handleQuit() {
    console.log('[APP] - App has quit');
}
function handleStart() {
    console.log('[APP] has started');
}
function handleRestart() {
    console.log('[APP] has restarted');
}
function appService(nodemonInstance, ext) {
    nodemonInstance({ ext })
        .on(NODEMON_EVENTS.START, handleStart)
        .on(NODEMON_EVENTS.RESTART, handleRestart)
        .on(NODEMON_EVENTS.QUIT, handleQuit);
}
exports.appService = appService;
