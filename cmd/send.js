const error = require('../lib/error')

function exec(msg, args) {
    if (!msg.member.hasPermission("ADMINISTRATOR")) {
        error.InsufficientPermissionsException(msg, args, "You need to be ADMINISTRATOR to use this command!")
    } else {
        msg.channel.send(args.join(" "));
        return msg.delete();
    }
}

module.exports = {exec: exec};