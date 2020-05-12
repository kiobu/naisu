const index = require('../index')
const mal = require('mal-scraper')
const Discord = require('discord.js')

const error = require("../lib/error")

function exec(msg, args) {

    if (args.length === 0) {
        error.NoArgsException(msg, args, "No anime was given.")
    } 
    else {

        let text = args.join(' ').toLowerCase()
    
        mal.getInfoFromName(text)
            .then(data => {  
                console.log(data)
                const embed = new Discord.RichEmbed()
                .setTitle("Synopsis")
                .setAuthor(data.title)
                //.setColor(index.naisu.config.embedcolor)
            .setColor(0xffffff)
                .setDescription(data.synopsis)
                .setFooter(index.naisu.config.name + " This data is automatically fetched with mal-scraper.", `${index.naisu.user.avatarURL}`)
                .setImage(data.picture)
                .addField("Genres", data.genres.join(", "))
                .addField("Type", data.type)
                .addField("Episodes", data.episodes)
                .addField("Status", data.status)
                .addField("Aired", data.aired)
                .addField("Ranked", data.ranked)
                .addField("Popularity", data.popularity)
                .setTimestamp();
                
                msg.channel.send({embed});

                index.logger.success(`Sent data for '${data.title}'.`)
            
            })
            .catch((err) => index.logger.error(err.stack))

    }
}

module.exports = {
    exec: exec,
    description: 'Search MAL for information about an anime.'
}
