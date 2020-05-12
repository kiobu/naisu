const index = require('../index')
const error = require('../lib/error')

function exec(msg) {
    let args = msg.content.substring(index.naisu.config.prefix.length, msg.length).split(',').map(x => x.trim());
    args.shift()
    
    if (args.length === 0 || !args) {
        error.NoArgsException(msg, args, "You need to specify a list to choose from, separated by commas.")
        return;
    }

    if (args.every(v => v === args[0])) {
        msg.channel.send("Very funny.")
        return;
    }

    let choice = Math.floor(Math.random() * (args.length));
    msg.channel.send(`I choose ...`)
        .then(message => {
            setTimeout(_ => { 
                message.edit(`${message} **${args[choice]}**!`) 
            }, 1500);
        })
}

module.exports = {
    exec: exec,
    description: `Randomly choose from the list of choices given, separated by commas.`
}