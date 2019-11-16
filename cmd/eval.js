const error = require("../lib/error");
const Discord = require("discord.js")

const kio = "114843644896346116" 
const moo = "546812203697963036"
const swr = "552871078008193063"

function exec(msg, args) {

    if (args.length === 0) {
        error.NoArgsException(msg, args, "You must specify JavaScript code to evaluate.")
        //msg.reply("You must specify JavaScript code to evaluate.")
        return;
    }

    console.log(msg.author.id);
    if (msg.author.id !== kio && msg.author.id !== moo && msg.author.id !== swr) {
        error.InsufficientPermissionsException(msg, args, "This command is restricted to the bot's creator.")
        return;
        //msg.reply("You are not the bot's creator!");
    } else {
        try {
            msg.channel.send(eval(msg.content.substring(5, msg.content.length)));
            msg.delete();
        } catch(e) {
            msg.reply("Eval failed!");
            console.log(e)
        };
}   ;
};

module.exports = {exec: exec}