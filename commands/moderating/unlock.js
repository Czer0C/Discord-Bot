const Discord = require('discord.js');

module.exports = {
	name: 'unlock',
	description: 'Unlock the current channel.',
	guildOnly: true,
	modOnly: false,
	staffOnly: true,
	execute(message, args) {
		const channel = message.channel;
        let reason = "";
        
        const channelPermission = channel.permissionOverwrites.get('579274582431891466')

        if (channelPermission) {
            channelPermission.delete();
            if (args.length === 0)
                reason = "unspecified.";
            else 
                for (var i = 0; i < args.length; i++) 
                    reason += args[i] + " ";

            const exampleEmbed = new Discord.MessageEmbed()
                .setColor('#df80ff')
                .setAuthor(`#${channel.name} has been unlocked.`)
                .setDescription(`**Reason:** ${reason}`)
                .setTimestamp();       

            message.channel.send(exampleEmbed);	
        }
        else {
            return message.reply(' **this channel has not been locked yet** :warning:'); 
        }
	},
};