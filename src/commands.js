const utils = require('./utils.js');
const config = require('../config.json');
const path = require('path');

exports.helpCommand = async function (message) {
    const emojiEntries = Object.entries(config.emojis)
        .map(([emoji, entry]) => `${config.emojiPrefix}${emoji}\n\t- ${entry.description}`);
    const commandEntries = Object.entries(config.commands)
        .map(([command, entry]) => `${config.commandPrefix}${command} ${entry.usage}\n\t- ${entry.description}`);

    const helpText =
        `It's not like I want you to know how I work or anything, **baka**.
_Emojis:_
${emojiEntries.join('\n')}
_Commands:_
${commandEntries.join('\n')}`;

    return message.channel.send(helpText);
};

exports.playCommand = async function (message, commandName) {
    const voiceChannel = message.member.voice.channel;
    return voiceChannel
        ? utils.playAudioFile(voiceChannel, commandName)
        : message.channel.send(config.commands[commandName].description);
};

exports.greetMeCommand = async function (message) {
    const greetMeCommandObject = config.commands.greetme;

    if (!message.guild.roles.cache.find(guild => guild.name === greetMeCommandObject.role.name)) { // If the role does not exist already
        try {
            await message.guild.createRole(greetMeCommandObject.role);
        } catch (err) {
            console.log(err.stack);
        }
    }
    if (message.member.roles.cache.find(guild => guild.name === greetMeCommandObject.role.name)) {
        message.reply(greetMeCommandObject.alreadyHasRoleResponse);
    } else {
        const dkPepperEmoji = message.guild.emojis.cache.get(greetMeCommandObject.emojiID); // Get the dkPepper emoji
        try {
            const dkPepperMsg = await message.reply(greetMeCommandObject.confirmResponse);
            await dkPepperMsg.react(dkPepperEmoji);
            const reactions = await dkPepperMsg.awaitReactions(reaction => reaction.emoji === dkPepperEmoji, { max: 2, time: 1.048596 * 10000 });
            if (reactions.get(dkPepperEmoji.id).count === 2) {
                await message.member.roles.add(message.guild.roles.cache.find(guild => guild.name === greetMeCommandObject.role.name)); // Get "tuturu" role and add it to the member
                message.reply(greetMeCommandObject.successResponse); // Notify the user of successful role addition
            } else {
                message.reply(greetMeCommandObject.tooSlowResponse); // Notify the user of the time out
            }
        } catch (err) {
            console.error(err.stack);
        }
    }
};

exports.emojiCommand = async function (message) {
    const emojiPrefix = config.emojiPrefix;

    let match;
    if ((match = message.content.match(`${emojiPrefix}([^\\s]*)`))) {
        const [, emoji] = match;
        if (config.emojis.hasOwnProperty(emoji)) {
            return message.channel.send({
                files: [{
                    attachment: `${config.emojis[emoji].filePath}`
                }]
            });
        } else if (emoji in config.emojis) {
            return message.channel.send('Gah!');
        }
    }
};
