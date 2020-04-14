const logger = require("../lib/logger")
const SQLite = require('better-sqlite3')
const LiveQuery = require("./livequery")
const path = require("path");
const EventEmitter = require("events");

const ROOT = path.dirname(require.main.filename);

// Include the LQ config file.
let lqconf = "";

try {
    lqconf = require(ROOT + "/lq_config.json")
    if (lqconf) {
        logger.log("The LiveQuery config was loaded successfully.", "LQ")
        module.exports.config = lqconf;
    }
} catch (e) {
    logger.error(`The LiveQuery config could not be loaded. \n${e}`, "LQ")
}

// Connect to the DB and initial setups.
module.exports.Connect = () => {
    let sql = "";

    if (lqconf.useSQLite) {
        sql = new SQLite(lqconf.SQLitePath)
        logger.log(`Connected to the SQLite database.`, "LQ")
        setupDB(lqconf);
    }

    return sql;

    function setupDB(lqconf) {
        const table = sql.prepare(`SELECT count(*) FROM sqlite_master WHERE type='table' AND name='${lqconf.uniqueName}::${lqconf.type}';`).get()

        if (!table['count(*)']) {
            logger.log(`The LiveQuery table for "${lqconf.uniqueName}::${lqconf.type}" was not found! Creating...`, "LQ")
            sql.prepare(`CREATE TABLE IF NOT EXISTS '${lqconf.uniqueName}::${lqconf.type}' (uid TEXT PRIMARY KEY, svname TEXT, plyname TEXT, msg TEXT, time INTEGER);`).run()
            sql.prepare(`CREATE UNIQUE INDEX idx_chat_id ON '${lqconf.uniqueName}::${lqconf.type}' (uid);`).run();
            sql.pragma("synchronous = 1")
            sql.pragma("journal_mode = wal")
            logger.log('... Done!', "LQ")
        } else {
            logger.log(`LiveQuery table for ${lqconf.uniqueName}::${lqconf.type} found.`, "LQ")
        }
    }
}

module.exports.Listener = new EventEmitter();

// Takes a SQLite object.
module.exports.AddField = (sql, table) => {
    let query = sql.prepare(
        `INSERT OR REPLACE INTO '${lqconf.uniqueName}::${lqconf.type}' (uid, svname, plyname, msg, time) VALUES (@uid, @svname, @plyname, @msg, @time);`
    )

    query.run(table);
    module.exports.Listener.emit('newField');
}

module.exports.FetchLatest = (sql) => {
    let query = sql.prepare(
        `SELECT * FROM '${lqconf.uniqueName}::${lqconf.type}' WHERE time = (SELECT MAX(time) FROM '${lqconf.uniqueName}::${lqconf.type}');`
    )

    return query.get()
}
