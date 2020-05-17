const fs = require('fs');
const Discord = require('discord.js');
const utility = require('./utility/utility.js');
const { prefix, token, staffRole, modRole, adminRole } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const moderatingCommandFiles = fs.readdirSync('./commands/moderating').filter(file => file.endsWith('.js'));
const adminCommandFiles = fs.readdirSync('./commands/admin').filter(file => file.endsWith('.js'));
const otherCommandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of moderatingCommandFiles) {
	const command = require(`./commands/moderating/${file}`);
	client.commands.set(command.name, command);
}

for (const file of adminCommandFiles) {
	const command = require(`./commands/admin/${file}`);
	client.commands.set(command.name, command);
}

for (const file of otherCommandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	
    if (!message.content.startsWith(prefix) || message.author.bot) {
		let quoteMessageURL = utility.checkMessageURL(message.content);
		if (!quoteMessageURL.isValid) return;
		
		const channel = message.guild.channels.cache.find(ch => ch.id === quoteMessageURL.channel)
    
		if (!channel) return message.reply(" **invalid message link** :warning:");
		else {
			channel.messages.fetch(quoteMessageURL.message).then(m => {
				let content = `**[Jump to message](${message.content})** in <#${m.channel.id}>\n${m.content}`;
				let footer = `Quoted by ${message.author.username} - ${m.createdAt.toLocaleString()}`;
				let embed = utility.embed(undefined, undefined, undefined, undefined, content, footer, m);
				message.delete();
				return message.channel.send(embed);
			}).catch(error => {
				console.log(error);
				return message.reply(" **invalid message link** :warning:");
			});
			return;
		}  			
	}
	
	const args = message.content.slice(prefix.length).split(/ +/);

	const commandName = args.shift().toLowerCase();
	
	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    
	if (!command) return;

	if (command.guildOnly && message.channel.type !== 'text')
		return message.reply('I can\'t execute that command inside DMs!');
	
    if (command.staffOnly) {
		if (!message.member.roles.cache.has(staffRole))
			return message.reply(` **this command is only accesible to staff** :warning:`);
		else if (command.modOnly && !message.member.roles.cache.has(modRole))
			return message.reply(' **this command is only accessible to moderators** :warning:');
		else if (command.adminOnly && !message.member.roles.cache.has(adminRole))
        	return message.reply(' **this command is only accessible to admins** :warning:');
	}
   
	if (command.args && !args.length) {
		let reply = `**You didn't provide any arguments**, ${message.author}!`;

		if (command.usage) 
			reply += `\n**The proper usage would be:** \`${prefix}${command.name} ${command.usage}\``;

		return message.channel.send(reply);
	}

	if (!cooldowns.has(command.name))
		cooldowns.set(command.name, new Discord.Collection());
	
	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 2) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(` **please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command** ⏳`);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		command.execute(message, args, client);
	} catch (error) {
		console.error(error);
		message.reply(' **there was an error trying to execute that command** ❌');
	}
});

client.login(token);