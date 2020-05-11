/* Alias for serverquery */

const help = require("./help");

exports.exec = function(msg, args) {
    help.exec(msg, args);
}