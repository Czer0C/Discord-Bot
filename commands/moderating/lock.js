const Discord = require('discord.js');

module.exports = {
	name: 'lock',
	description: 'Lock the current channel.',
	guildOnly: true,
	modOnly: false,
	staffOnly: true,
	execute(message, args) {
		const channel = message.channel;
        let reason = "";

        const role = message.guild.roles.cache.find(role => role.id === '579274582431891466');
        
        if (channel.permissionOverwrites.get('579274582431891466')) 
            return message.reply(' **this channel has already been locked** :warning:'); 

        if (args.length === 0)
            reason = "unspecified.";
        else 
            for (var i = 0; i < args.length; i++) 
                reason += args[i] + " ";

		const exampleEmbed = new Discord.MessageEmbed()
			.setColor('#df80ff')
			.setAuthor(`#${channel.name} has been locked.`)
			.setDescription(`**Reason:** ${reason}`)
			.setTimestamp();       
		
		channel.updateOverwrite(role, { SEND_MESSAGES: false });

        message.channel.send(exampleEmbed);	
	},
};