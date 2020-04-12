const fs = require("fs");

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

const args = require("yargs")
    .option('token', {
        describe: "The bot's private token.",
        alias: 't'
    })
    .option('prefix', {
        describe: "The bot's chat prefix.",
        alias: 'p',
    })
    .demandOption(['token', 'prefix'])
    .argv;

var write = (b) => {
    if (b) {
        fs.writeFile(path, JSON.stringify({
            token: args.token,
            prefix: args.prefix
        }), 'utf8', function(err) {
            if (err) {
                console.error("Could not create the config.json file.")
                return console.error(err);
            }
            return console.log("The config.json file was successfully created.")
        })
    } else {
        return console.log("Exiting setup.")
    }
}

const path = "./config.json";

if (fs.existsSync(path)) {
    readline.question('The config file already exists. Do you wish to overwrite it? (y/n): ', resp => {
        if (resp.toLowerCase() == "y") {
            write(true);
        } else {
            write(false);
        }
        readline.close();
    })
} else {
    write(true);
}
