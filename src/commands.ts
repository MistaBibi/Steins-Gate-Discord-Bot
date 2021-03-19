import * as utils from './utils';
import * as config from '../config.json';
import type { Message } from 'discord.js';
import type { BotCommand, BotSoundCommand } from './types';

export async function helpCommand(message: Message, command: BotCommand): Promise<void> {
    const emojiEntries = Object.entries(config.emojis).map(
        ([emoji, entry]) => `${config.emojiPrefix}${emoji}\n\t- ${entry.description}`,
    );
    const commandEntries = Object.entries(config.commands).map(
        ([command, entry]) =>
            `${config.commandPrefix}${command} ${entry.usage}\n\t- ${entry.description}`,
    );

    const helpText = `It's not like I want you to know how I work or anything, **baka**.
_Emojis:_
${emojiEntries.join('\n')}
_Commands:_
${commandEntries.join('\n')}`;
    await message.channel.send(helpText);
}

export async function playCommand(message: Message, command: BotSoundCommand): Promise<void> {
    if (!message.member) {
        throw new Error("Message's guild member is not defined.");
    }
    const voiceChannel = message.member.voice.channel;
    voiceChannel
        ? await utils.playAudioFile(voiceChannel, command.filePath)
        : await message.channel.send(command.description);
}

export async function greetMeCommand(message: Message, command: BotCommand): Promise<void> {
    const { guild, member } = message;
    if (!guild) {
        throw new Error("Message's guild is not defined.");
    }
    if (!member) {
        throw new Error("Message's guild member is not defined.");
    }

    const params = command.params as {
        role: {
            name: string;
            color: [number, number, number];
            permissions: [];
        };
        emojiID: string;
        confirmResponse: string;
        successResponse: string;
        tooSlowResponse: string;
        alreadyHasRoleResponse: string;
    };

    let emojiRole = guild.roles.cache.find((guild) => guild.name === params.role.name);
    if (!emojiRole) {
        // If the role does not exist already
        emojiRole = await guild.roles.create({ data: params.role });
    }
    if (member.roles.cache.find((guild) => guild.name === params.role.name)) {
        await message.reply(params.alreadyHasRoleResponse);
    } else {
        const dkPepperEmoji = guild.emojis.cache.get(params.emojiID); // Get the dkPepper emoji
        if (!dkPepperEmoji) {
            throw new Error('dkPepperEmoji was not found.');
        }
        const dkPepperMsg = await message.reply(params.confirmResponse);
        await dkPepperMsg.react(dkPepperEmoji);
        const reactions = await dkPepperMsg.awaitReactions(
            (reaction) => reaction.emoji === dkPepperEmoji,
            { max: 2, time: 1.048596 * 10000 },
        );
        if (reactions.get(dkPepperEmoji.id)?.count === 2) {
            await member.roles.add(emojiRole); // Get "tuturu" role and add it to the member
            await message.reply(params.successResponse); // Notify the user of successful role addition
        } else {
            await message.reply(params.tooSlowResponse); // Notify the user of the time out
        }
    }
}

export async function emojiCommand(message: Message): Promise<void> {
    const emojiPrefix = config.emojiPrefix;

    let match;
    if ((match = message.content.match(`${emojiPrefix}([^\\s]*)`))) {
        const [, emoji] = match;
        if (Object.prototype.hasOwnProperty.call(config.emojis, emoji)) {
            await message.channel.send({
                files: [
                    {
                        attachment: `${config.emojis[emoji].filePath}`,
                    },
                ],
            });
        } else if (emoji in config.emojis) {
            await message.channel.send('Gah!');
        }
    }
}
