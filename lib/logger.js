const chalk = require("chalk");

module.exports = {
    error: function(message) {
        console.log(chalk.red(`[naisu] `) + `${message}`);
    },
    log: function(message) {
        console.log(chalk.gray(`[naisu] `) + `${message}`);
    },
    success: function(message) {
        console.log(chalk.green(`[naisu] `) + `${message}`);
    },
    serverquery: {
        log: function(message) {
            console.log(chalk.cyan(`[serverquery] `) + `${message}`);
        }
    }
}