const fs = require('fs');
const Discord = require('discord.js');
const utility = require('./utility/utility.js');
const { prefix, token, staffRole, modRole, adminRole } = require('./config.json');
const imageList = require('./asset/imageList.json');
const { quote } = require('./utility/quote.js');

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
		// Check quote command (pass a message URL)
		quote(message).then(r => {
			if (r.isMessageURL)
				if (r.embedQuote) {
					message.delete();
					return message.channel.send(r.embedQuote);
				}
				else return message.channel.send("**Invalid message link** :x:");
		});		
		return;
	}
	
	const args = message.content.slice(prefix.length).split(/ +/);

	const commandName = args.shift().toLowerCase();
	
	let command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    
	if (!command)  {
		if (imageList.find(i => i.name === commandName))
			command = client.commands.get("image");
		else
			return message.channel.send("**There's no such command** :x:");
	}

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
	
	if (!cooldowns.has(commandName))
		cooldowns.set(commandName, new Discord.Collection());
	
	const now = Date.now();
	
	const timestamps = cooldowns.get(commandName);
	const cooldownAmount = (command.cooldown || 2) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(` **please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${commandName}\` command** ⏳`);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		command.execute(message, args, client, commandName);
	} catch (error) {
		console.error(error);
		message.reply(' **there was an error trying to execute that command** ❌');
	}
});

client.login(token);