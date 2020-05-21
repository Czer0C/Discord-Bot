const { embed } = require('../../utility/embed.js');

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
				
		const lockEmbed = embed({
			color: '#AF7AC5',
			author: `This channel has been locked. 🔒`,
			icon: false,
			content: `**Reason:** ${reason}\n**Moderator:** ${message.author}`,
			message: message
		})     
		
		channel.updateOverwrite(role, { SEND_MESSAGES: false }).then(() => {
			message.channel.send(lockEmbed);	
			logChannel.send(lockEmbed);
		}).catch(error => {
			console.log(error);
			message.channel.send(" **Something unexpected happened, try again later** :x: ");
		});        
	},
};