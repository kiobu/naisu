/* Alias for serverquery */

const serverquery = require("./serverquery");

exports.exec = function(msg, args) {
    serverquery.exec(msg, args);
}