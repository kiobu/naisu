const error = ("../lib/error")

function exec(msg, args) {
    if (!msg.member.hasPermission("ADMINISTRATOR")) {
        error.InsufficientPermissionsException(msg, args, "You must have ADMINISTRATOR permissions to use this command.");
    } else {
        msg.channel.send(args.join(" "));
        return msg.delete();
    }
}

module.exports = {exec: exec};