const error = require('../lib/error');
const Discord = require('discord.js');
const index = require('../index')
const fs = require('fs');

const api = 'https://pixelwalk.cc/static/naisu/kills/'; // will add functionality later.

let images = []
fs.readdir('./res/kills/', (err, files) => {
  files.forEach((file) => {
    images.push(file)
  });
});

function exec(msg, args) {
    target = ''
    try {
        target = msg.mentions.users.first().id
    } catch (_) {
        error.IllegalArgumentException(msg, args, "This command requires a mentioned user as an argument. Make sure you @ somebody!");
        return;
    }

    let initiator = msg.author.id

    let file = Math.floor(Math.random() * (images.length) + 1)

    try {
        msg.channel.send({embed: 
        {
            description: `<@${initiator}> has killed <@${target}>! RIP.`,
            image: {
                url: `attachment://${file}.gif`
            }
        },
            files: [{ attachment: `./res/kills/${file}.gif`}] 
        });
    } catch (e) {
        index.logger.error(`Could not send message: ${e}`)
    }
}

module.exports = {
    exec: exec, 
    description: 'Kills a user.'
}