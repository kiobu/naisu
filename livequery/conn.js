const logger = require("../lib/logger")
const SQLite = require('better-sqlite3')

const LiveQuery = require("./livequery")

let sql = "";

let lqconf = "";

module.exports.Connect = function() {
    try {
        lqconf = require("./lq_config.json")
        if (lqconf) {
            logger.log("The LiveQuery config was loaded successfully.") 
        }
    } catch (e) {
        logger.error(`The LiveQuery config could not be loaded. \n${e}`)
    }

    if (lqconf.useSQLite) {
        sql = new SQLite('../db/LiveQuery.sqlite')
        logger.log(`Connected to the SQLite database.`)
        setupDB(lqconf);
    }

    function setupDB(lqconf) {
        const table = sql.prepare(`SELECT count(*) FROM sqlite_master WHERE type='table' AND name='${lqconf.type}';`).get()

        if (!table['count(*)']) {
            logger.log(`The LiveQuery table for ${lqconf.type} was not found! Creating...`)
            sql.prepare(`CREATE TABLE IF NOT EXISTS ${lqconf.type} (uid TEXT PRIMARY KEY, svname TEXT, plyname TEXT, charname TEXT, msg TEXT);`).run()
            sql.prepare(`CREATE UNIQUE INDEX idx_chat_id ON ${lqconf.type} (uid);`).run();
            sql.pragma("synchronous = 1")
            sql.pragma("journal_mode = wal")
            logger.log('... Done!')
        } else {
            logger.log(`LiveQuery table for ${lqconf.type} found.`)
        }
    }
}