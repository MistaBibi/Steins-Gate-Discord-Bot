const config = require('../config.json');
const path = require('path');

exports.parseCommand = function (messageContent) {
    return messageContent.trim().slice(config.commandPrefix.length);
};

exports.playAudioFile = async function (targetChannel, commandName) {
    const connection = targetChannel.connection || await targetChannel.join();
    const dispatcher = connection.play(path.resolve(config.commands[commandName].filePath), { volume: 0.35 });
    dispatcher.on('finish', () => {
        if (!connection.dispatcher) connection.disconnect();
    });
};
