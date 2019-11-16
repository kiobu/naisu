const Discord = require('discord.js');
const index = require('../index');
const path = require('path');

function _getCaller() {
    try {
        var err = new Error();
        var callerfile;
        var currentfile;

        Error.prepareStackTrace = function (err, stack) { return stack; };

        currentfile = err.stack.shift().getFileName();

        while (err.stack.length) {
            callerfile = err.stack.shift().getFileName();

            if(currentfile !== callerfile) return callerfile;
        }
    } catch (err) {}
    return undefined;
}

const EXCEPTION = new Discord.RichEmbed()
	.setColor('#ff0000')
	.setTitle('A')
    .setDescription('A')

module.exports = {
    IllegalArgumentException: function(msg, args, error) {
        EXCEPTION.setTitle("IllegalArgumentException");
        EXCEPTION.setDescription(`An illegal argument was passed.`);
        EXCEPTION.addField(`Offending Module: `, path.basename(_getCaller()));
        EXCEPTION.addField(`Error: `, error);
        msg.channel.send(EXCEPTION)
        EXCEPTION.setTitle('A')
        EXCEPTION.setDescription('A')
        EXCEPTION.fields = []
        return;
    },
    NoArgsException: function(msg, args, error) {
        EXCEPTION.setTitle("NoArgsException");
        EXCEPTION.setDescription(`An argument was not given where one was required.`);
        EXCEPTION.addField(`Offending Module: `, path.basename(_getCaller()));
        EXCEPTION.addField(`Error: `, error);
        msg.channel.send(EXCEPTION)
        EXCEPTION.setTitle('A')
        EXCEPTION.setDescription('A')
        EXCEPTION.fields = []
        return
    },
    GenericException: function(msg, args, error) {
        EXCEPTION.setTitle("GenericException");
        EXCEPTION.setDescription("An error has occured.");
        EXCEPTION.addField(`Offending Module: `, path.basename(_getCaller()));
        EXCEPTION.addField(`Error: `, error);
        msg.channel.send(EXCEPTION)
        EXCEPTION.setTitle('A')
        EXCEPTION.setDescription('A')
        EXCEPTION.fields = []
        return;
    },
    InsufficientPermissionsException: function(msg, args, error) {
        EXCEPTION.setTitle("InsufficientPermissionsException");
        EXCEPTION.setDescription("You do not have sufficient permissions to execute this command.");
        EXCEPTION.addField(`Offending Module: `, path.basename(_getCaller()));
        EXCEPTION.addField(`Error: `, error);
        msg.channel.send(EXCEPTION)
        EXCEPTION.setTitle('A')
        EXCEPTION.setDescription('A')
        EXCEPTION.fields = []
        return;
    },
}