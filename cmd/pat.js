const error = require('../lib/error');
const Discord = require('discord.js');
const index = require('../index')
const fs = require('fs');

const api = 'https://pixelwalk.cc/static/naisu/pats/'; // will add functionality later.

let images = []
fs.readdir('./res/pats/', (err, files) => {
  files.forEach((file) => {
    images.push(file)
  });
});

function exec(msg, args) {
    let target = msg.mentions.users.first().id
    let initiator = msg.author.id

    let file = Math.floor(Math.random() * (images.length) + 1)

    try {
        msg.channel.send({embed: 
        {
            description: `<@${initiator}> has patted <@${target}>!`,
            image: {
                url: `attachment://${file}.gif`
            }
        },
            files: [{ attachment: `./res/pats/${file}.gif`}] 
        });
    } catch (e) {
        index.logger.error(`Could not send message: ${e}`)
    }
}

module.exports = {
    exec: exec
}