const Discord = require('discord.js');
const bot = new Discord.Client();
const config = require('./config.json');
const credentials = require('./credentials.json')
const utils = require('./utils.js');

bot.login(credentials.token);

bot.on('ready', () => {
    // bot.user.setUsername('Emoji Microwave (Temporary Name)')
    console.log("Awaiting D-mails!");
    bot.user.setPresence({ game: { name: 'with worldlines' }, status: 'online' })
});

bot.on('message', (message) => {

    // String literal matches
    if(message.content.trim().toLowerCase() == 'nullpo') {
        message.channel.send('Gah!');
    }

    // Commands
    if(message.content.trim().startsWith(config.commandPrefix)) {
        command = utils.parseCommand(message.content);
        switch (command.toLowerCase()) {
            case undefined:
            case 'help':
                helpCommand(message);
        }
    }

    // Emojis
    if(message.content.trim().includes(":")) {
        emojiCommand(message);
    }
});

function helpCommand (message) {
    const emojiEntries = Object.entries(config.emojis).map(([emoji, entry]) => `${config.emojiPrefix}${emoji}\n\t- ${entry.description}`);
    const commandEntries = Object.entries(config.commands).map(([command, entry]) => `${config.commandPrefix}${command} ${entry.usage}\n\t- ${entry.description}`);

    const helpText =
    `I-It's not like I want you to know how I work or anything, **b-b-baka**!\n_Emojis:_\n${emojiEntries.join('\n')}\n_Commands:_\n${commandEntries.join('\n')}`

    message.channel.send(helpText);
}

function emojiCommand (message) {
    let emojiPrefix = config.emojiPrefix;
    let messageParts = message.content.split(" ");
    emoji = utils.findEmojiLocation(`${emojiPrefix}([^\s]*)`, messageParts)

    for(let emojiEntry of Object.entries(config.emojis)) {
        if(emoji.match(`${emojiPrefix}${emojiEntry[0]}([^\s]*)`)) {
            message.channel.send("", {
                file: `${emojiEntry[1].filePath}`
            })
        }
    }
}