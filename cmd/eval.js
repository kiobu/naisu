const error = require("../lib/error");
const KIOID = "114843644896346116";

function exec(msg, args) {

    if (args.length === 0) {
        error.NoArgsException(msg, args, "You must specify JavaScript code to evaluate.")
    } else {
        if (msg.author.id !== KIOID) {
            error.InsufficientPermissionsException(msg, args, "This function is restricted to the bot's creator!")
        } else {
            try {
                msg.channel.send(eval(msg.content.substring(5, msg.content.length)));
                msg.delete();
            } catch(e) {
                console.log(e)
            };
        };
    };
};

module.exports = {exec: exec}