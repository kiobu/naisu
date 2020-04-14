const DBConn = require("./conn")
const path = require('path')
const logger = require('../lib/logger')
const express = require('express')
const bodyParser = require('body-parser');
const Discord = require('discord.js')

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

    LiveQuery.app.use((err, req, res, next) => {
        // If there is a JSON parse issue, throw away the request.
        if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
            logger.error("There was an issue parsing the request body. Error: " + err, "LQ");
            return res.sendStatus(400); // Bad request
        }    
        next();
    });

    router.post('/', function(req, res) {
        let ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || '').split(',')[0].trim();
        let queryObj = req.body;
        if (objectsHaveSameKeys(queryObj, model)) {
            logger.success(`POST request accepted. Req. IP: ${ip}`, "LQ")
            if (LiveQuery.config.useSQLite) {
                LiveQuery.db.AddField(Database, queryObj)
            } else {
                LiveQuery.db.Listener.emit('newField', queryObj);
            }
            res.send(`Data successfully parsed. IP: ${ip}`)
        } else {
            logger.log(`POST request denied. Req. IP: ${ip}`, "LQ")
            res.send(`The request was not in the proper format. IP: ${ip}`)
        }
    });

    LiveQuery.app.use('/api', router);
    
    // Listen server.
    LiveQuery.app.listen(LiveQuery.config.port);
    logger.log(`LiveQuery listening on port ${LiveQuery.config.port}`, "LQ")

    // Fire Discord msg. event.
    LiveQuery.db.Listener.on('newField', (body) => {
        const EMBED = new Discord.RichEmbed()
        .setColor('#aaff00')
        if (LiveQuery.config.useSQLite) {
            EMBED
                .setTitle(LiveQuery.db.FetchLatest(Database).svname)
                .addField("Player Name", LiveQuery.db.FetchLatest(Database).plyname)
                .addField("Message", LiveQuery.db.FetchLatest(Database).msg)
        } else {
            EMBED
                .setTitle(body.svname)
                .addField("Player Name", body.plyname)
                .addField("Message", body.msg)
        }
        naisu.channels.get(LiveQuery.config.channelID).send(EMBED)
    })

    module.exports = LiveQuery;
})
