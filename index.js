const chalk = require('chalk')
const Discord = require('discord.js')
const fs = require('fs')
const path = require('path')
const SQLite = require('better-sqlite3')

const sql = new SQLite('db/data.sqlite')

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

if (!exptab['count(*)']) {
    naisu.log('The experience table was not found! Creating...')
    sql.prepare("CREATE TABLE IF NOT EXISTS experience (uid TEXT PRIMARY KEY, userid TEXT, username TEXT, serverid TEXT, xp INTEGER, lvl INTEGER);").run()
    sql.prepare("CREATE UNIQUE INDEX idx_scores_id ON experience (uid);").run();
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

    if (msg.content.length == config.prefix.length) {return}

    naisu.getScore = sql.prepare("SELECT * FROM `experience` WHERE serverid = ? AND userid = ?");
    naisu.setScore = sql.prepare("INSERT OR REPLACE INTO experience (uid, userid, username, serverid, xp, lvl) VALUES (@uid, @userid, @username, @serverid, @xp, @lvl);")

    if (msg.author.bot) return;
    if (msg.channel.type !== "text") return;

    if (msg.guild) {
        let localscore = naisu.getScore.get(msg.guild.id, msg.author.id);

        if (!localscore) {
            localscore = {
                uid: `${msg.guild.id}::${msg.author.id}`,
                userid: msg.author.id,
                username: msg.author.username,
                serverid: msg.guild.id,
                xp: 0,
                lvl: 0,
            }
        }
        localscore.xp++;

        //const nxtLvl = Math.floor(0.5 * Math.sqrt(localscore.xp));
        const nxtLvl = Math.floor(Math.sqrt(localscore.xp/10));
        if (localscore.lvl < nxtLvl) {
            localscore.lvl++;
            msg.reply(`You're now level **${nxtLvl}**.`)
        }
        naisu.setScore.run(localscore);
    }

    // Get all the arguments of the message that passes the above checks.
    let tmp = msg.content.substring(config.prefix.length, msg.length).split(' '); 
    let args = [];

    if (!msg.content.startsWith(config.prefix)) {return}

    // Push the arguments to the args table.
    for (let i = 1; i < tmp.length; i++) {
        args.push(tmp[i])
    }

    let command = tmp[0]

    if (naisu.modules.hasOwnProperty(command)) {
        return naisu.modules[command].exec(msg, args)
    }
})

naisu.on('error', function() {
    naisu.error(`An error has occured that has caused Naisu to shut down. You should use breakpoints to isolate the problem:`)
    console.error;
})

module.exports = {
    naisu: naisu,
}

