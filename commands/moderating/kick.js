const { embed } = require('../../utility/embed.js');
const { staffRole, loggingChannel } = require('../../config.json');

module.exports = {
	name: 'kick',
	description: 'Kick a user.',
	guildOnly: true,
	modOnly: true,
	staffOnly: true,
	execute(message, args) {
		if (!message.mentions.users.size)
			return message.reply(' **you need to tag a user to use this command** :warning:');

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

		const kickEmbed = embed({
			color: '#EB984E',
			author: `${target.user.tag} has been kicked 👢`,
			icon: target.user.displayAvatarURL({dynamic: true}),
			content: `**Reason:** ${reason}\n**Moderator:** ${message.author}`,
			message: message
		})
		target.kick().then(target => {
			message.channel.send(kickEmbed);
			logChannel.send(kickEmbed);
		}).catch(error => {		
			console.log(error);
		   	message.channel.send("**Something unexpected happened, try again later** :x:");
	   	});		
	},
};