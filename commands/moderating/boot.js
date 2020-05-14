const Discord = require('discord.js');
const { staffRole } = require('../../config.json');

module.exports = {
	name: 'boot',
	description: 'Boot a user from the current channel.',
	guildOnly: true,
	modOnly: false,
	staffOnly: true,
	execute(message, args) {
		if (!message.mentions.users.size)
			return message.reply(' **you need to tag a user to use this command** :warning:');
		
        const target = message.mentions.members.first();
		const channel = message.channel;
		
        if (target.roles.cache.has(staffRole))
			return message.reply(' **you cannot boot a staff member** :warning: '); 
					
		if (channel.permissionOverwrites.get(target.id)) 
			return message.reply(' **this user has already been booted** :warning: ');
		
        let reason = ""

		if (args.length > 1)
			for (var i = 1; i < args.length; i++) 
				reason += args[i] + " "
		else 
			reason = "unspecified."

		const exampleEmbed = new Discord.MessageEmbed()
			.setColor('#48C9B0')
			.setAuthor(`${target.user.tag} has been boot from #${channel.name} ⛔`, target.user.displayAvatarURL({dynamic: true}))
			.setDescription(`**Reason:** ${reason}`)
			.setTimestamp();       
		
		channel.updateOverwrite(target, { SEND_MESSAGES: false }).then(() => {
			message.channel.send(exampleEmbed);
		}).catch(error => {
			message.channel.send(" **something unexpected happened, try again later** :warning: ");
		});        
	},
};