const index = require("../index");
const error = require("../lib/error");
const Discord = require("discord.js");

const KEY = index.naisu.config.gapi;

var search = require('youtube-search');
    var opts = {
        maxResults: 10,
        key: KEY,
    };

exports.exec = function(msg, args) {
    search(args.join(' '), opts, function(err, results) {
        if(err) return index.logger.error(`Could not create connection to YouTube API. Stack: ${$err.stack}`);
       
        for (i = 0; i < results.length; i++) {
            if (results[i].kind == "youtube#video") {
                msg.channel.send(results[i].link);
                break;
            } else {
                continue;
            }
        }
    });
}

