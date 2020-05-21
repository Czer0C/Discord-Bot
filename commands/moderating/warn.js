const { loggingChannel } = require('../../config.json');
const { embed } = require('../../utility/embed.js');

module.exports = {
	name: 'warn',
	description: 'Warn a user.',
	guildOnly: true,
	modOnly: false,
	staffOnly: true,
	execute(message, args) {
		if (!message.mentions.users.size)
			return message.reply(' **you need to tag a user to use this command** :warning:');
	
		const target = message.mentions.members.first();		
		const logChannel = message.guild.channels.cache.get(loggingChannel);
		
        if (target.roles.cache.has('643435170162278438'))
            return message.reply(` **can't do that to a staff member** :warning: `); 

        let reason = ""

		if (args.length > 1)
			for (var i = 1; i < args.length; i++) 
				reason += args[i] + " "
		else 
			reason = "unspecified."

		const warnEmbed = embed({
			color: '#F4D03F',
			author: `${target.user.tag} has been warned ⚠️`,
			icon: target.user.displayAvatarURL({dynamic: true}),
			content: `**Reason:** ${reason}\n**Moderator:** ${message.author}`,
			message: message
		})     
        
		message.channel.send(warnEmbed);
		logChannel.send(warnEmbed);
	},
};