const Discord = require('discord.js');
const imageList = require('./asset/imageList.json');
const {
    prefix,
    token,
    staffRole,
    modRole,
    adminRole
} = require('./config.json');
const {
    quote
} = require('./utility/quote.js');
const {
    getAllFiles
} = require('./utility/utility.js');
const {
    scraper,
    scraper2
} = require('./utility/scraper.js');

const commandFiles = getAllFiles("commands");

const client = new Discord.Client();
client.commands = new Discord.Collection();

for (let fileName of commandFiles) {
    const command = require(fileName);
    client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

client.once('ready', () => {
    console.log('Ready!');
});

let count = 0;

setInterval(scraper, 60000, client, '킹덤', count);


client.on('message', message => {
    if (message.channel.id === '713406898719817748' &&
        message.content !== '.acknowledged') {
        return message.delete();
    }

    if (!message.content.startsWith(prefix) || message.author.bot) {
        // Check quote command (pass a message URL)
        quote(message).then(result => {
            if (result.isMessageURL) {
                if (result.embedQuote) {
                    message.delete();
                    return message.channel.send(result.embedQuote);
                } else {
                    return message.channel.send("**Invalid message link** :x:");
                }
            }
        });

        return;
    }

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    let command = 
        client.commands.get(commandName) ||
        client.commands.find(cmd => cmd.aliases &&
                                    cmd.aliases.includes(commandName));

    if (!command) {
        if (imageList.find(i => i.name === commandName)) {
            command = client.commands.get("image");
        } else {
            return message.channel.send("**There's no such command** :x:");
        }            
    }

    if (command.guildOnly && message.channel.type !== 'text') {
        return message.reply('I can\'t execute that command inside DMs!');
    }        

    if (command.staffOnly) {
        if (!message.member.roles.cache.has(staffRole)) {
            return message.reply(` **only staff can use this command**⚠️`);
        } else if (command.modOnly && 
                   !message.member.roles.cache.has(modRole)) {
            return message.reply(' **only moderators can use this command**⚠️');
        } else if (command.adminOnly && 
                   !message.member.roles.cache.has(adminRole)) {
            return message.reply(' **only admins can use this command**⚠️');
        }
    }

    if (command.args && !args.length) {
        let reply = `** you didn't provide any arguments**, ${message.author}!`;

        if (command.usage) {
            reply += `\n**The proper usage would be:** ` +
                     `\`${prefix}${command.name} ${command.usage}\``;
        }

        return message.channel.send(reply);
    }

    if (!cooldowns.has(commandName)) {
        cooldowns.set(commandName, new Discord.Collection());
    }
        
    const now = Date.now();
    const timestamps = cooldowns.get(commandName);
    const cooldownAmount = (command.cooldown || 20) * 1000;

    if (timestamps.has(message.author.id)) {
        let expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            let timeLeft = (expirationTime - now) / 1000;
            let reply = `** please wait ${timeLeft.toFixed(1)} more second(s)` +
                        ` before reusing the \`${commandName}\` command** ⏳`;

            return message.reply(reply);
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(message, args, client, commandName);
    } catch (error) {
        console.error(error);
        message.reply(' **an unexpected error has occurred** ❌');
    }
});

client.login(token);