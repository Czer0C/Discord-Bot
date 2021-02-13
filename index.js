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
    getAllFiles,
    getPages
} = require('./utility/utility.js');
const {
    getKoreanScan,
    scrapeSenseScan
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

setInterval(getKoreanScan, 10000, client);
setInterval(scrapeSenseScan, 10000, client);


client.on('messageDelete', async (message) => {
    const logs = message.guild.channels.cache.find(channel => channel.name === 'bot-testing');
    if (!logs) {
        return;
    }
    const test = await message.guild.fetchAuditLogs({type: 'MESSAGE_DELETE'});

    const entry = 
            await message.guild.fetchAuditLogs({type: 'MESSAGE_DELETE'})
                                .then(audit => audit.entries.first())

    let user = ""
    if (entry.extra.channel.id === message.channel.id
        && (entry.target.id === message.author.id)
        && (entry.createdTimestamp > (Date.now() - 5000))
        && (entry.extra.count >= 1)) {
      user = entry.executor.username
    } else { 
      user = message.author.username
    }
    logs.send(`A message by ${message.author.username} was deleted in <#${message.channel.id}> by ${user}`);
  })

client.on('message', message => {
    const {
        channel,
        content,
        author,
        member
    } = message;

    if (!author.bot && !member.roles.cache.has('684289189390319638')) {
        return;
    }

    if (channel.id === '713406898719817748' && content !== '.acknowledged') {
        return message.delete();
    }

    if (!content.startsWith(prefix) || author.bot) {
        quote(message).then(result => {
            if (result.isMessageURL) {
                if (result.embedQuote) {
                    message.delete();
                    return channel.send(result.embedQuote);
                } else {
                    return channel.send("**Invalid message link** ❌");
                }
            }
        });

        return;
    }

    
    
    const args = content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    let command = 
        client.commands.get(commandName) ||
        client.commands.find(cmd => cmd.aliases &&
                                    cmd.aliases.includes(commandName));
    
    
    if (!command) {
        command = client.commands.get("image");
    }

    if (command.guildOnly && channel.type !== 'text') {
        return message.reply('I can\'t execute that command inside DMs!');
    }        

    if (command.staffOnly) {
        if (!member.roles.cache.has(staffRole)) {
            return message.reply(` **only staff can use this command**⚠️`);
        } else if (command.modOnly && !member.roles.cache.has(modRole)) {
            return message.reply(' **only moderators can use this command**⚠️');
        } else if (command.adminOnly && !member.roles.cache.has(adminRole)) {
            return message.reply(' **only admins can use this command**⚠️');
        }
    }

    if (command.args && !args.length) {
        let reply = `** you didn't provide any arguments** ⚠️`;

        if (command.usage) {
            reply += `\n**The proper usage would be:** ` +
                     `\`${prefix}${command.name} ${command.usage}\``;
        }

        return message.reply(reply);
    }

    if (!cooldowns.has(commandName)) {
        cooldowns.set(commandName, new Discord.Collection());
    }
        
    const now = Date.now();
    const timestamps = cooldowns.get(commandName);
    const cooldownAmount = (command.cooldown || 2) * 1000;

    if (timestamps.has(author.id)) {
        let expirationTime = timestamps.get(author.id) + cooldownAmount;

        if (now < expirationTime) {
            let timeLeft = (expirationTime - now) / 1000;
            let reply = `** please wait ${timeLeft.toFixed(1)} more second(s)` +
                        ` before reusing this command** ⏳`;

            return message.reply(reply);
        }
    }

    timestamps.set(author.id, now);
    setTimeout(() => timestamps.delete(author.id), cooldownAmount);

    try {
        command.execute(message, args, client, commandName);
    } catch (error) {
        console.error(error);
        message.reply(' **an unexpected error has occurred** ❌');
    }
});

client.login(token);