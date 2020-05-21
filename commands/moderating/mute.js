const { embed } = require('../../utility/embed.js');
const { muteRole, staffRole, loggingChannel } = require('../../config.json');

module.exports = {
	name: 'mute',
	description: 'Mute a user.',
	guildOnly: true,
	modOnly: false,
	staffOnly: true,
	execute(message, args) {
		if (!message.mentions.users.size)
			return message.reply(' **you need to tag a user to use this command** :warning:');

		const target = message.mentions.members.first();
        const role = message.guild.roles.cache.find(role => role.id === muteRole);
		const logChannel = message.guild.channels.cache.get(loggingChannel);
		
        if (target.roles.cache.has(staffRole))
            return message.reply(` **can't do that to a staff member** :warning: `); 
		else if (target.roles.cache.has(muteRole))
			return message.reply(' **this user has already been muted** :warning: ');

		let reason = ""

		if (args.length > 1)
			for (var i = 1; i < args.length; i++) 
				reason += args[i] + " "
		else 
			reason = "unspecified."

		const muteEmbed = embed({
			color: '#5499C7',
			author: `${target.user.tag} has been been muted 🔇`,
			icon: target.user.displayAvatarURL({dynamic: true}),
			content: `**Reason:** ${reason}\n**Moderator:** ${message.author}`,
			message: message
		})

        target.roles.add(role).then(target => {
			message.channel.send(muteEmbed);
			logChannel.send(muteEmbed);
		}).catch(error => {		
			console.log(error);
		   	message.channel.send("*Something unexpected happened, try again later* :x:");
	   	});
		
	},
};