const { embed } = require('../../utility/embed.js');
const { muteRole, staffRole, loggingChannel } = require('../../config.json');

module.exports = {
	name: 'unmute',
	description: 'Unmute a user.',
	guildOnly: true,
	modOnly: false,
	staffOnly: true,
	execute(message, args) {
		if (!message.mentions.users.size) 
			return message.reply(' **you need to tag a user to use this command** :warning');

        const target = message.mentions.members.first();
		const logChannel = message.guild.channels.cache.get(loggingChannel);
		
        if (!target.roles.cache.has(muteRole))
            return message.reply(' **this member has not been muted** :warning:');
		if (target.roles.cache.has(staffRole))
			return message.reply(` **can't do that to a staff member** :warning: `);
			
        const role = message.guild.roles.cache.find(role => role.id === muteRole);
		let reason = ""

		if (args.length > 1)
			for (var i = 1; i < args.length; i++) 
				reason += args[i] + " "
		else 
			reason = "unspecified."

		const unmuteEmbed = embed({
			color: '#5DADE2',
			author: `${target.user.tag} has been unmuted 🔈`,
			icon: target.user.displayAvatarURL({dynamic: true}),
			content: `**Reason:** ${reason}\n**Moderator:** ${message.author}`,
			message: message
		})

        target.roles.remove(role).then(target => {
			message.channel.send(unmuteEmbed);
			logChannel.send(unmuteEmbed);
		}).catch(error => {		
			console.log(error);
		   	message.channel.send("**Something unexpected happened, try again later** :x: ");
	   	});
		
	},
};