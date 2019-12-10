const error = require("../lib/error")
const rq = require("request-promise");
const index = require("../index")

exports.exec = function(msg, args) {

rq.get('http://thecatapi.com/api/images/get?format=src&type=png', {
}, function(error, response, body) {
    if(!error && response.statusCode == 200) {
        msg.channel.send(response.request.uri.href);
    } else {
        index.naisu.error(error);
        error.GenericException(msg,args,"Cannot communicate with the image API. Please try again later.");
    }
})

}