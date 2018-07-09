'use strict';
const Discord = require('discord.js');
const utils = require('./utils.js');
const config = require('../config.json');
const credentials = require('../credentials.json');

const bot = new Discord.Client();
bot.login(credentials.token).catch(err => {
    console.error(err.message);
    bot.destroy();
});

bot.on('ready', async () => {
    try {
        // await bot.user.setUsername('Emoji Microwave (Temporary Name)')
        await bot.user.setPresence({ game: { name: 'with worldlines' }, status: 'online' });
    } catch(err) {
        console.error(err.stack);
    }
    console.log('Awaiting D-mails!');
});

bot.on('message', async (message) => {
    // No-op if message was from a bot
    if(message.author.bot) return;

    try {
        // String literal matches
        if(message.content.toLowerCase() === 'nullpo') {
            await message.channel.send('Gah!');
        }

        // Commands
        if(message.content.startsWith(config.commandPrefix)) {
            const command = utils.parseCommand(message.content);
            switch(command.toLowerCase()) {
                case 'help':
                    await helpCommand(message);
                    break;
                case 'tuturu':
                case 'beechga':
                case 'sonuvabetch':
                    await playCommand(message, command);
                    break;
            }
        }

        // Emojis
        if(message.content.includes(':')) {
            await emojiCommand(message);
        }
    } catch(err) {
        console.error(err.stack);
    }
});

bot.on('voiceStateUpdate', async (oldMember, newMember) => {
    // No-op if user is a bot
    if(newMember.user.bot || oldMember.user.bot) return;

    const newMemberVoiceChannel = newMember.voiceChannel;
    const oldMemberVoiceChannel = oldMember.voiceChannel;

    if(newMember.voiceChannelID && newMember.voiceChannelID !== oldMember.voiceChannelID) { // User has entered a voice channel
        try {
            if(newMember.roles.find('name', 'Weeb')) utils.playAudioFile(newMemberVoiceChannel, 'tuturu');
        } catch(err) {
            console.error(err.stack);
        }
    } else if(oldMemberVoiceChannel) { // User has left a voice channel
        // TODO something to do when a user leaves
    }
});

function helpCommand (message) {
    const emojiEntries = Object.entries(config.emojis)
        .map(([emoji, entry]) => `${config.emojiPrefix}${emoji}\n\t- ${entry.description}`);
    const commandEntries = Object.entries(config.commands)
        .map(([command, entry]) => `${config.commandPrefix}${command} ${entry.usage}\n\t- ${entry.description}`);

    const helpText =
`I-It's not like I want you to know how I work or anything, **b-b-baka**!
_Emojis:_
${emojiEntries.join('\n')}
_Commands:_
${commandEntries.join('\n')}`;

    return message.channel.send(helpText);
}

function playCommand (message, commandName) {
    const { voiceChannel } = message.member;
    return voiceChannel
        ? utils.playAudioFile(voiceChannel, commandName)
        : message.channel.send(config.commands[commandName].description);
}

function emojiCommand (message) {
    const emojiPrefix = config.emojiPrefix;

    let match;
    if((match = message.content.match(`${emojiPrefix}([^\\s]*)`))) {
        const [, emoji] = match;
        if(config.emojis.hasOwnProperty(emoji)) {
            return message.channel.send('', {
                file: `${config.emojis[emoji].filePath}`
            });
        } else if(emoji in config.emojis) {
            return message.channel.send('Gah!');
        }
    }
}
