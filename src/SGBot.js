'use strict';
const Discord = require('discord.js');
const utils = require('./utils.js');
const commands = require('./commands.js');
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
                    await commands.helpCommand(message);
                    break;
                case 'greetme':
                    await commands.greetMeCommand(message);
                    break;
                case 'tuturu':
                case 'beechga':
                case 'sonuvabetch':
                    await commands.playCommand(message, command);
                    break;
            }
        }

        // Emojis
        if(message.content.includes(':')) {
            await commands.emojiCommand(message);
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
            if(newMember.roles.find('name', 'tuturu') && newMember.voiceChannel.name === 'Anime Watching Team') utils.playAudioFile(newMemberVoiceChannel, 'tuturu');
        } catch(err) {
            console.error(err.stack);
        }
    } else if(oldMemberVoiceChannel) { // User has left a voice channel
        // TODO something to do when a user leaves
    }
});
