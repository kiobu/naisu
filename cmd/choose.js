const index = require('../index')
const error = require('../lib/error')

function exec(msg) {
    let tmp = msg.content.substring(index.naisu.config.prefix.length, msg.length).split(' ').map(x => x.trim()); 
    let args = [];

    // Push the arguments to the args table.
    for (let i = 1; i < tmp.length; i++) {
        args.push(tmp[i].replace(',',''))
    }

    console.log(args)
    
    if (args.length === 0 || !args) {
        error.NoArgsException(msg, args, "You need to specify a list to choose from, separated by commas.")
        return;
    }

    let choice = Math.floor(Math.random() * args.length);
    console.log(choice)
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