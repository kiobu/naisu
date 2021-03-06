const index = require('../index')

function exec(msg) {
    msg.channel.send('Ping')
        .then(message => {
            message.edit('', {
                'embed': {
                    'title': "Pong!",
                    'description': `Took ${message.createdTimestamp - msg.createdTimestamp}ms.`,
                    'color': index.naisu.config.embedcolor
                }
            })
        })
}

module.exports = {
    exec: exec,
    description: 'Sends an ICMP ping to the bot.'
}
