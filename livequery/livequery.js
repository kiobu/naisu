const DBConn = require("./conn")
const path = require('path')

const ROOT = path.dirname(require.main.filename);

// Set up LiveQuery obj.
LiveQuery = {
    db: {
        Connect: DBConn.Connect
    }
}

// Set up LiveQuery.
LiveQuery.db.Connect();

module.exports = LiveQuery;