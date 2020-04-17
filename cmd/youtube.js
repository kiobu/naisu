const index = require("../index");
const error = require("../lib/error");
const Discord = require("discord.js");

const KEY = index.naisu.config.gapi;
const EMBED = new Discord.RichEmbed();

var search = require('youtube-search');
    var opts = {
        maxResults: 5,
        key: KEY,
    };

exports.exec = function(msg, args) {

    if (args.length === 0) {
        error.NoArgsException(msg,args,"You need to specify a video name to search for.")
        return;
    }

    list = false;
    for (i = 0; i < args.length; i++) {
        if (args[i] === "--list") {
            list = true;
            args.splice(i, 1)
            EMBED
                .setColor('#ff0000')
                .setTitle('Results')
        }
    }
    search(args.join(' '), opts, function(err, results) {
        if(err) return index.logger.error(`Could not create connection to YouTube API. Stack: ${$err.stack}`);
        for (i = 0; i < results.length; i++) {
            if (results[i].kind == "youtube#video") {
                if (!list) {
                    msg.channel.send(results[i].link);
                    break;
                } else {
                    EMBED.addField(results[i].title, results[i].link)
                }
            } else {
                continue;
            }
        }
        if (list) {
            msg.channel.send(EMBED);
            EMBED.setTitle('Results')
            EMBED.fields = []
        }
        
        return;
    });
}

