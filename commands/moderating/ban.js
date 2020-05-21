const { staffRole, loggingChannel } = require('../../config.json');
const { embed } = require('../../utility/embed.js');
module.exports = {
	name: 'ban',
	description: 'Ban a member.',
	guildOnly: true,
	modOnly: true,
	staffOnly: true,
	execute(message, args) {
		if (!message.mentions.users.size) 
			return message.reply('you need to tag a user to use this command!');

		const target = message.mentions.members.first();
		const logChannel = message.guild.channels.cache.get(loggingChannel);
		
		if (!message.guild.member(target)) return message.reply(` **this user isn't a member of the server** :warning:`);

		if (target.roles.cache.has(staffRole))
			return message.reply(` **can't do that to a staff member** :warning: `);
		
		let reason = ""

		if (args.length > 1)
			for (var i = 1; i < args.length; i++) 
				reason += args[i] + " "
		else 
			reason = "unspecified."

		const banEmbed = embed({
			color: '#E74C3C',
			author: `${target.user.tag} has been banned 🔨`,
			icon: target.user.displayAvatarURL({dynamic: true}),
			content: `**Reason:** ${reason}\n**Moderator:** ${message.author}`,
			message: message
		})

		target.ban().then(target => {
			message.channel.send(banEmbed);
			logChannel.send(banEmbed);
		}).catch(error => {		
			console.log(error);
		   	message.channel.send(" **Something unexpected happened, try again later** :x:");
	   	});
		
	},
};