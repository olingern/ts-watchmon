import * as chalk from "chalk"

export const logger = {
  error: function (msg: string): void {
    console.log(`${chalk.red("❌")} ${msg}`)
  },
  success: function (msg: string): void {
    console.log(`${chalk.green("✔️")}  ${msg}`)
  }
}
