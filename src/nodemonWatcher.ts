const NODEMON_EVENTS = {
  START: 'start',
  QUIT: 'quit',
  RESTART: 'restart'
}

function handleQuit() {
  console.log('[APP] - App has quit')
}

function handleStart() {
  console.log('[APP] has started')
}

function handleRestart() {
  console.log('[APP] has restarted')
}

/**
 *
 * @param nodemonInstance : TODO: figure out how to type nodemon
 * @param script
 * @param ext
 */
export function appService(nodemonInstance: any, script: string, ext: string) {
  nodemonInstance({
    script,
    ext
  })
    .on(NODEMON_EVENTS.START, handleStart)
    .on(NODEMON_EVENTS.RESTART, handleRestart)
    .on(NODEMON_EVENTS.QUIT, handleQuit)
}
