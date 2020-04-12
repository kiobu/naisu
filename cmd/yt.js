/* Alias for youtube */

const youtube = require("./youtube");

exports.exec = function(msg, args) {
    youtube.exec(msg, args);
}