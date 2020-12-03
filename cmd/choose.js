const index = require('../index')
const error = require('../lib/error')

function exec(msg, args) {
    args = args.join(" ").split(',').map(x => x.trim());
    
    if (args.length === 0 || !args || args[0] == "") {
        error.NoArgsException(msg, args, "You need to specify a list to choose from, separated by commas.")
        return;
    }

    let choice = Math.floor(Math.random() * args.length);

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