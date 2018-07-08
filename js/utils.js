const config = require('../config.json');

exports.parseCommand = function (messageContent) {
    return messageContent.trim().slice(config.commandPrefix.length);
}

exports.playAudioFile = async function (targetChannel, commandName) {
    const connection = await targetChannel.join();
    const dispatcher = connection.playFile(config.commands[commandName].filePath);
    dispatcher.on('end', end => {
        targetChannel.leave();
    });
}