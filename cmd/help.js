const error = require('../lib/error')
const index = require('../index')
const Discord = require('discord.js')
const fs = require('fs')

function exec(msg, args) {
var message = ""
    fs.readdirSync(__dirname).forEach((file) => {
        var name = file.slice(0, -3)
        var source = require("./" + name)
        
        if (source.description) {
            if (!source.aliases) {
                message += "# " + index.naisu.config.prefix + name + "\n" + source.description + "\n"
            } else {
                message += "# " + index.naisu.config.prefix + name + "\n> aliases: " + source.aliases.join(', ') + "\n" + source.description + "\n"
            }
        }
    })

    embed = {embed: 
        {
            title: 'Help Menu',
            description: "Here are my commands:\n```md\n" + message + "```",
        }
    }

    msg.channel.send(embed);
}

module.exports = {
    exec: exec,
    description: 'Show the help menu.',
    aliases: ['?', 'commands']
}