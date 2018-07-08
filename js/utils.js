const config = require('../config.json');

exports.parseCommand = function (messageContent) {
    return messageContent.trim().slice(config.commandPrefix.length);
}

exports.playAudioFile = function (targetChannel, commandName) {
    targetChannel.join().then(connection => {
        const dispatcher = connection.playFile(config.commands[commandName].filePath);
        dispatcher.on("end", end => {
            targetChannel.leave();
        });
    }).catch(console.error);
}