const SQLite = require("better-sqlite3")
const sql = new SQLite('db/data.sqlite')
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
      .setThumbnail(`${msg.author.avatarURL}`)
      .setTimestamp()
      .addField("Level", `${score.lvl}`)
      .addField("Points/XP", `${score.xp}`, true)
    
    msg.channel.send({embed});

}