const DBConn = require("./conn")
const index = require("../index")

// Set up LiveQuery obj.
LiveQuery = {
    db: {
        Connect: DBConn.Connect
    }
}

LiveQuery.db.Connect();

module.exports = LiveQuery;