const Discord = require('discord.js');
const bot = new Discord.Client();
const auth = require('./auth.json');

bot.on('message', (message) => {
    if(message.content == 'Henlo') {
        message.reply('Henlo');
    }
});

bot.login(auth.token);