const Discord = require('discord.js');
const bot = new Discord.Client();
const config = require('../config');
const credentials = require('../credentials')

bot.login(config.token);

bot.on('ready', () => {
    // bot.user.setUsername('Emoji Microwave (Temporary Name)')
    console.log("Awaiting D-mails!");
    bot.user.setPresence({ game: { name: 'with worldlines' }, status: 'online' })
});

bot.on('message', (message) => {
    let emojiPrefix = config.emojiPrefix;
    let standardPrefix = config.standardPrefix;
    let messageParts = message.content.split(" ");

    // String literal matches
    if(message.content.toLowerCase() == 'nullpo') {
        message.channel.send('Gah!');
    }

    if(message.content.toLowerCase() == `${standardPrefix}help`) {
        message.channel.send('');
    }

    // Commands
    cmd = messageParts[findCommandIndex(emojiPrefix + '([A-Za-z]+)', messageParts)]

    emoticonNames = ['moeka_phone', 'daru_cry', 'kurisu_frown', 'o_kabe', "tuturu",
     "faris_nyan", "luka_bow", "suzuha_sigh", "luka_mop", "kurisu_channeler",
     "moeka_sad", "amadeus_kurisu", "maho_bath", "daru_orz", "maho_dazed",
     "oopa_happy", "okabe_break"];

    for(var index in emoticonNames) {
        if(cmd == `${emojiPrefix}${emoticonNames[index]}:`) {
            message.channel.send("", {
                file: `emojis/${emoticonNames[index]}.png`
            })
        }
    }
});

function findCommandIndex (str, array) {
    for (var j in array) {
        if (array[j].match(str)) return j;
    }
    return -1;
}