const Discord = require('discord.js');
const bot = new Discord.Client();
const config = require('./config.json');

bot.login(config.token);

bot.on('ready', () => {
    // bot.user.setUsername('Emoji Microwave (Temporary Name)')
    bot.user.setPresence({ game: { name: 'with worldlines' }, status: 'online' })
});

bot.on('message', (message) => {
    let prefix = config.emojiPrefix;
    let messageParts = message.content.split(" ");

    // String literal matches
    if(message.content.toLowerCase() == 'is kyle a soy boi?') {
        message.channel.send('Yes, it is known.');
    }

    // Commands
    cmd = messageParts[findCommandIndex(prefix + '([A-Za-z]+)', messageParts)]

    emoticonNames = ['moeka_phone', 'daru_cry', 'kurisu_frown', 'o_kabe', "tuturu", "faris_nyan", "luka_bow", "suzuha_sigh", "luka_mop"];

    for(var index in emoticonNames) {
        if(cmd == `${prefix}${emoticonNames[index]}:`) {
            message.channel.send("", {
                file: `emojis/${emoticonNames[index]}.png`
            })
        }
    }
});

function findCommandIndex (str, array) {
    for (var j=0; j<array.length; j++) {
        if (array[j].match(str)) return j;
    }
    return -1;
}