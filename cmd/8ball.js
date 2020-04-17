const index = require("../index")
const error = require("../lib/error")

exports.exec = function(msg, args) {

    if (args.length < 1) {
        msg.reply("You must ask a question.")
        return;
    }

    const REPLIES = ["It is certain", "It is decidedly so", "Without a doubt",
    "Yes, definitely", "You may rely on it", "As I see it, yes",
    "Most likely", "Outlook good", "Signs point to yes", "Yes",
    "Reply hazy, try again", "Ask again later",
    "Better not tell you now", "Cannot predict now",
    "Concentrate and ask again", "Don't bet on it",
    "My reply is no", "My sources say no", "Outlook not so good",
    "Very doubtful", "Fuck you"]

    msg.reply(":8ball: " + REPLIES[(Math.floor(Math.random() * 20))] + ".")
}