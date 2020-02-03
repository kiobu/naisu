const index = require("../index");
const error = require("../lib/error");
const Discord = require("discord.js");

exports.exec = function(msg, args) {

    if(args.length > 1) {
        error.IllegalArgumentException(msg,args,"Only one user can be specified.");
    } else if (args.length < 1) {
        error.IllegalArgumentException(msg,args,"You must specify a user.");
    } else {

        let target = msg.mentions.users.first();
	if (!target) {
	    error.IllegalArgumentException(msg,args,"Tag the user rather than typing their name.");
    	} else {
        const embed = new Discord.RichEmbed()
        .setAuthor(target.username)
        .setColor(0x00AE86)
        .setImage(target.avatarURL)
        
        msg.channel.send({embed});
	}
    }
}
