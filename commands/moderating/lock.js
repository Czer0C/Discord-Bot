const Discord = require('discord.js');
const { chatRole, loggingChannel } = require('../../config.json');

module.exports = {
	name: 'lock',
	description: 'Lock the current channel.',
	guildOnly: true,
	modOnly: false,
	staffOnly: true,
	execute(message, args) {
		const channel = message.channel;
		const role = message.guild.roles.cache.find(role => role.id === chatRole);
		const logChannel = message.guild.channels.cache.get(loggingChannel);
		let reason = "";
		
        if (channel.permissionOverwrites.get(chatRole)) 
            return message.reply(' **this channel has already been locked** :warning:'); 

        if (args.length === 0)
            reason = "unspecified.";
        else 
            for (var i = 0; i < args.length; i++) 
                reason += args[i] + " ";

		const exampleEmbed = new Discord.MessageEmbed()
			.setColor('#AF7AC5')
			.setAuthor(`This channel has been locked. ⛔`)
			.setDescription(`**Reason:** ${reason}\n**Moderator:** ${message.author}`)
			.setTimestamp();       
		
		channel.updateOverwrite(role, { SEND_MESSAGES: false }).then(() => {
			message.channel.send(exampleEmbed);	
			logChannel.send(exampleEmbed);
		}).catch(error => {
			console.log(error);
			message.channel.send(" **something unexpected happened, try again later** :warning: ");
		});        
	},
};