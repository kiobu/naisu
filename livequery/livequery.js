const DBConn = require("./conn")

LiveQuery = {
    db: {
        Connect: DBConn.Connect
    }
}

LiveQuery.db.Connect();

module.exports = LiveQuery;