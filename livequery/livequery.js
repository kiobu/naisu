const naisu = require('../index').naisu
const DBConn = require("./conn")
const path = require('path')
const logger = require('../lib/logger')

// Set up LiveQuery obj.
const LiveQuery = {
    db: {
        Connect: DBConn.Connect,
        AddField: DBConn.AddField
    },
    config: DBConn.config
}

module.exports = LiveQuery;


// Set up LiveQuery.

const Database = LiveQuery.db.Connect();
