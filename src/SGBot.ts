import * as Discord from 'discord.js';
import * as utils from './utils';
import * as commands from './commands';
import * as config from '../config.json';
import { SoundCommandKey } from './types';
import { once } from 'events';

const credentials: { token: string } = require('../credentials.json');

async function main(): Promise<void> {
    const bot = new Discord.Client();

    bot.on('message', (message) => {
        // No-op if message was from a bot
        if (message.author.bot) return;

        (async () => {
            // String literal matches
            if (message.content.toLowerCase() === 'nullpo') {
                await message.channel.send('Gah!');
            }
            // Commands
            if (message.content.startsWith(config.commandPrefix)) {
                const command = utils.parseCommand(message.content).toLowerCase();
                switch (command) {
                    case 'help':
                        await commands.helpCommand(message, config.commands[command]);
                        break;
                    case 'greetme':
                        await commands.greetMeCommand(message, config.commands[command]);
                        break;
                    case 'tuturu':
                    case 'beechga':
                    case 'sonuvabetch':
                        await commands.playCommand(message, config.commands[command]);
                        break;
                }
            }
            // Emojis
            if (message.content.includes(':')) {
                await commands.emojiCommand(message);
            }
        })().catch((err) => {
            console.error(err.stack);
        });
    });

    bot.on('voiceStateUpdate', (oldMember, newMember) => {
        // No-op if user is a bot
        if (newMember.member?.user.bot || oldMember.member?.user.bot) return;

        const newMemberVoiceChannel = newMember.channel;
        const oldMemberVoiceChannel = oldMember.channel;

        if (
            newMemberVoiceChannel &&
            newMember.channelID &&
            newMember.channelID !== oldMember.channelID
        ) {
            // User has entered a voice channel
            if (
                newMember.member!.roles.cache.find((guild) => guild.name === 'tuturu') &&
                newMemberVoiceChannel.name === 'Anime Watching Team'
            ) {
                utils.playAudioFile(newMemberVoiceChannel, SoundCommandKey.TUTURU).catch((err) => {
                    console.error(err.stack);
                });
            }
        } else if (oldMemberVoiceChannel) {
            // User has left a voice channel
            // TODO something to do when a user leaves
        }
    });

    try {
        await bot.login(credentials.token);
        await once(bot, 'ready');
        // await bot.user.setUsername('Emoji Microwave (Temporary Name)')
        await bot.user!.setPresence({ activity: { name: 'with worldlines' }, status: 'online' });
        console.log('Awaiting D-mails!');
    } catch (err) {
        console.error(err.stack);
        bot.destroy();
    }
}

main().catch((err) => {
    console.error(err.stack);
});
