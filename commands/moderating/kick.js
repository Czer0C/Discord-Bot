const Discord = require('discord.js');

module.exports = {
	name: 'kick',
	description: 'Kick a user.',
	guildOnly: true,
	modOnly: true,
	staffOnly: true,
	execute(message, args) {
		if (!message.mentions.users.size) {
			return message.reply('you need to tag a user to use this command!');
		}

		const target = message.mentions.members.first();
		
		let reason = ""

		if (args.length > 1)
			for (var i = 1; i < args.length; i++) 
				reason += args[i] + " "
		else 
			reason = "unspecified."

		const exampleEmbed = new Discord.MessageEmbed()
			.setColor('#FFFF00')
			.setAuthor(`${target.user.tag} has been kicked`, target.user.displayAvatarURL({dynamic: true}))
			.setDescription(`**Reason:** ${reason}`)
			.setTimestamp();

		target.kick().then(target => {
			message.channel.send(exampleEmbed);
		}).catch(error => {		
		   	message.channel.send(" something unexpected happened, try again later :warning:");
	   	});
		
	},
};