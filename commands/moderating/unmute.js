const Discord = require('discord.js');

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
        
        if (!target.roles.cache.has('505188874163585025'))
            return message.reply(' **this member has not been muted** :warning:');
        
        const role = message.guild.roles.cache.find(role => role.id === '505188874163585025');
		let reason = ""

		if (args.length > 1)
			for (var i = 1; i < args.length; i++) 
				reason += args[i] + " "
		else 
			reason = "unspecified."

		const exampleEmbed = new Discord.MessageEmbed()
			.setColor('#5DADE2')
			.setAuthor(`${target.user.tag} has been unmuted`, target.user.displayAvatarURL({dynamic: true}))
			.setDescription(`**Reason:** ${reason}`)
			.setTimestamp();       
        
        target.roles.remove(role).then(target => {
			message.channel.send(exampleEmbed);
		}).catch(error => {		
			console.log(error);
		   	message.channel.send(" **something unexpected happened, try again later** :warning: ");
	   	});
		
	},
};