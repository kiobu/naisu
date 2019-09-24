const chalk = require('chalk')
const Discord = require('discord.js')
const fs = require('fs')
const path = require('path')
const SQLite = require('better-sqlite3')

const sql = new SQLite('./data.sqlite')

let config = "";

const naisu = new Discord.Client();

// Informational logging.

naisu.error = function(message) {
    console.log(chalk.red(`[naisu] `) + `${message}`)
}

naisu.log = function(message) {
    console.log(chalk.gray(`[naisu] `) + `${message}`)
}

naisu.success = function(message) {
    console.log(chalk.green(`[naisu] `) + `${message}`)
}

// Checks for config.json

if (!fs.existsSync(path.join(__dirname, 'config.json'))) {
    naisu.error("config.json not found!")
} 

try {
    config = require('./config.json')
    naisu.config = config;
} catch (error) {
    naisu.error(`The configuration file could not be loaded!:\n${error.stack}`)
}

// Checks for database table data and runs a few essential queries.

const exptab = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='experience';").get()
const vertab = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='verify';").get()

if (!vertab['count(*)']) {
    naisu.log('The verification table was not found! Creating...')
    sql.prepare("CREATE TABLE IF NOT EXISTS verify (serverid INTEGER, enabled BOOLEAN, role TEXT, channel TEXT, command TEXT);").run()
    sql.pragma("synchronous = 1")
    sql.pragma("journal_mode = wal")
    naisu.log('... Done!')
} 

if (!exptab['count(*)']) {
    naisu.log('The experience table was not found! Creating...')
    sql.prepare("CREATE TABLE IF NOT EXISTS experience (id TEXT PRIMARY KEY, userid TEXT, username TEXT, serverid INTEGER, points INTEGER, memberid TEXT);").run()
    sql.pragma("synchronous = 1")
    sql.pragma("journal_mode = wal")
    naisu.log('... Done!')
}

// Initializes Naisubot.

naisu.on('ready', () => {
    naisu.log('Loading modules...')
    naisu.moduleinit();
    naisu.success(`Successfuly logged in as ${naisu.user.tag}!`)
})

naisu.login(config.token);
naisu.log('Naisu initialized.')

// Loads the modules.

naisu.moduleinit = function() {
    naisu.modules = {};

    fs.readdirSync('./cmd/').forEach((file) => {
        let name = file.slice(0, -3)

        delete require.cache[require.resolve(`./cmd/${file}`)]

        try {
            naisu.modules[name] = require(`./cmd/${file}`)
            
            if (naisu.modules[name].hasOwnProperty('init')) {
                naisu.modules[name].init(naisu)
            }

            naisu.log(`Module '${name}' is ready.`)
        } catch (error) {
            naisu.error(`Error in module '${name}':\n${error.stack}`)
        }
    })
}

naisu.on('message', (msg) => {

    if (msg.guild == null) {return} // Check if the message is anything but a server/guild.
    if (msg.channel.id != "606565560733663242") { // Checks if our message is NOT in the verification channel.
        if (!msg.content.startsWith(config.prefix)) {return} // Check if the message starts with our prefix.
        if (msg.content.length == config.prefix.length) {return} // Check if only the prefix was sent with no command.
    }

    // Get all the arguments of the message that passes the above checks.
    let tmp = msg.content.substring(config.prefix.length, msg.length).split(' '); 
    let args = [];

    // Push the arguments to the args table.
    for (let i = 1; i < tmp.length; i++) {
        args.push(tmp[i])
    }

    let command = tmp[0]

    if (naisu.modules.hasOwnProperty(command)) {
        return naisu.modules[command].exec(msg, args)
    }
})

module.exports = {
    naisu: naisu,
}

