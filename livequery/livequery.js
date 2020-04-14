const DBConn = require("./conn")
const path = require('path')
const logger = require('../lib/logger')
const express = require('express')
const bodyParser = require('body-parser');

const model = {uid: "",plyname: "",svname: "",msg: "",time: 0}

const naisu = require('../index').naisu; logger.log("Loading Naisu...")

function objectsHaveSameKeys(...objects) {
    const allKeys = objects.reduce((keys, object) => keys.concat(Object.keys(object)), []);
    const union = new Set(allKeys);
    return objects.every(object => union.size === Object.keys(object).length);
 }

naisu.on('ready', () => {
    // Set up LiveQuery obj.
    const LiveQuery = {
        db: DBConn,
        config: DBConn.config,
        app: express()
    }

    // Set up LiveQuery DB connection.
    const Database = LiveQuery.db.Connect();

    // Configure app to use body-parser. This will let us get the data from a POST req.
    LiveQuery.app.use(bodyParser.urlencoded({ extended: true }));
    LiveQuery.app.use(bodyParser.json());

    // Setup express routes to /api.
    var router = express.Router();

    router.post('/', function(req, res) {
        let queryObj = req.body;
        if (objectsHaveSameKeys(queryObj, model)) {
            LiveQuery.db.AddField(Database, queryObj)
            res.send("Data successfully parsed.")
        } else {
            res.send("The request was not in the proper format.")
        }
    });

    LiveQuery.app.use('/api', router);
    
    // Listen server.
    LiveQuery.app.listen(LiveQuery.config.port);
    logger.log(`LiveQuery listening on port ${LiveQuery.config.port}`, "LQ")

    // Fire Discord msg. event.
    LiveQuery.db.Listener.on('newField', () => {
        naisu.channels.get("673950971172356106").send("New message received:\n" + JSON.stringify(LiveQuery.db.FetchLatest(Database)))
    })

    module.exports = LiveQuery;
})
