const Discord = require('discord.js');
const { chatRole, loggingChannel } = require('../../config.json');

module.exports = {
	name: 'unlock',
	description: 'Unlock the current channel.',
	guildOnly: true,
	modOnly: false,
	staffOnly: true,
	execute(message, args) {
		const channel = message.channel;
        const channelPermission = channel.permissionOverwrites.get(chatRole);
        const logChannel = message.guild.channels.cache.get(loggingChannel);
        let reason = "";

        if (channelPermission) {            
            if (args.length === 0)
                reason = "unspecified.";
            else 
                for (var i = 0; i < args.length; i++) 
                    reason += args[i] + " ";

            const exampleEmbed = new Discord.MessageEmbed()
                .setColor('#A569BD')
                .setAuthor(`This channel has been unlocked. ✅`)
                .setDescription(`**Reason:** ${reason}\n**Moderator:** ${message.author}`)
                .setTimestamp();    

            channelPermission.delete().then(() => {
                message.channel.send(exampleEmbed);	
                logChannel.send(exampleEmbed);
            }).catch(error => {
                console.log(error);
                message.channel.send(" **something unexpected happened, try again later** :warning: ");
            });           
        }
        else {
            return message.reply(' **this channel has not been locked yet** :warning:'); 
        }
	},
};