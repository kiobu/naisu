const SQLite = require("better-sqlite3")
const sql = new SQLite('./data.sqlite')
const Discord = require("discord.js")

const index = require("../index");
const error = require("../lib/error");

exports.exec = function(msg) {
    
    let score = sql.prepare("SELECT * FROM experience WHERE userid = ? AND serverid = ?;").get(msg.author.id, msg.guild.id);
    
    const embed = new Discord.RichEmbed()
      .setAuthor(`${msg.author.username}`, `${msg.author.avatarURL}`)
      .setColor(0x00AE86)
      //.setDescription(`Data for '${msg.author.username}' in '${msg.guild.name}'.`)
      .setFooter(`Created by ${index.naisu.config.discordTag}`, `${index.naisu.user.avatarURL}`)
      .setImage(`${msg.author.avatarURL}`)
      .setThumbnail(`${msg.guild.iconURL}`)
      .setTimestamp()
      .setURL("https://discord.js.org/#/docs/main/indev/class/RichEmbed")
      .addField("Level", `${score.lvl}`)
      .addField("Points/XP", `${score.xp}`, true)
    
    msg.channel.send({embed});

}