const error = require('../lib/error')

function exec(msg, args) {
    msg.channel.send(args.join(" "));
    return msg.delete();
}

module.exports = {
    exec: exec,
    description: 'Send a message using Naisu as the author.'
};
