const config = require('./config.json');

exports.parseCommand = function (messageContent) {
    return messageContent.trim().slice(config.commandPrefix.length);
}

exports.findEmojiLocation = function (str, array) {
    for (var j in array) {
        if (array[j].match(str)) return array[j];
    }
    return "";
}