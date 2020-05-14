const Discord = require('discord.js');

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
        const role = message.guild.roles.cache.find(role => role.id === '505188874163585025');
        
        if (target.roles.cache.has('643435170162278438'))
            return message.reply(' **you cannot mute a staff member** :warning: '); 
		else if (target.roles.cache.has('505188874163585025'))
			return message.reply(' **this user has already been muted** :warning: ');

		let reason = ""

		if (args.length > 1)
			for (var i = 1; i < args.length; i++) 
				reason += args[i] + " "
		else 
			reason = "unspecified."

		const exampleEmbed = new Discord.MessageEmbed()
			.setColor('#5499C7')
			.setAuthor(`${target.user.tag} has been muted`, target.user.displayAvatarURL({dynamic: true}))
			.setDescription(`**Reason:** ${reason}`)
			.setTimestamp();       
        
        target.roles.add(role).then(target => {
			message.channel.send(exampleEmbed);
		}).catch(error => {		
			console.log(error);
		   	message.channel.send(" something unexpected happened, try again later :warning:");
	   	});
		
	},
};