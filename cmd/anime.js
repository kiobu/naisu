const index = require('../index')
const mal = require('mal-scraper')
const Discord = require('discord.js')

function exec(msg, args) {

    if (args.length === 0) {
        msg.reply("You did not specify the name of an anime!")
    } 
    else {

        let text = args.join(' ').toLowerCase()
    
        mal.getInfoFromName(text)
            .then(function(data) {  
            
            index.naisu.log(`Request for anime information for '` + text + `' in server: ` + msg.guild.name + '.')

            const embed = new Discord.RichEmbed()
            .setTitle("Synopsis")
            .setAuthor(data.title)
            .setColor(index.naisu.config.embedcolor)
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

            index.naisu.success(`Sent data for '${data.title}'.`)
            
            })
            .catch((err) => index.naisu.error(err.stack))

    }
}

module.exports = {exec: exec}
