const Discord = require('discord.js');

module.exports = {
	name: 'lock',
	description: 'Lock the current channel.',
	guildOnly: true,
	modOnly: false,
	staffOnly: true,
	execute(message, args) {
		const channel = message.channel;
        const role = message.guild.roles.cache.find(role => role.id === '579274582431891466');
		let reason = "";
		
        if (channel.permissionOverwrites.get('579274582431891466')) 
            return message.reply(' **this channel has already been locked** :warning:'); 

        if (args.length === 0)
            reason = "unspecified.";
        else 
            for (var i = 0; i < args.length; i++) 
                reason += args[i] + " ";

		const exampleEmbed = new Discord.MessageEmbed()
			.setColor('#AF7AC5')
			.setAuthor(`#${channel.name} has been locked.`)
			.setDescription(`**Reason:** ${reason}`)
			.setTimestamp();       
		
		channel.updateOverwrite(role, { SEND_MESSAGES: false }).then(() => {
			message.channel.send(exampleEmbed);	
		}).catch(error => {
			console.log(error);
			message.channel.send(" **something unexpected happened, try again later** :warning: ");
		});        
	},
};