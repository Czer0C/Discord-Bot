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
		
        if (channel.permissionOverwrites.get(chatRole)) {
            return message.reply(' **this channel has already been locked** ⚠️'); 
        }            

        let reason = args.reduce((line, arg) => line + ' ' + arg, '')
        
        const lockEmbed = embed({
            color: '#AF7AC5',
            author: `This channel has been locked 🔒`,
            icon: false,
		    content: `${reason ? `**Reason:** ${reason}\n` : '\n'}`,
            message: message,
            footer: false
        })

        let lockReport = `
            **Reason:** ${reason ? reason : 'unspecified'}
            **Moderator:** ${message.author}
            `;

		const logEmbed = embed({
			color: '#AF7AC5',
            icon: false,
            author: `#${channel.name} has been locked. 🔒`,
			content: lockReport,
            message: message,
            footer: false
		})     
		
		channel.updateOverwrite(role, { SEND_MESSAGES: false }).then(() => {
			message.channel.send(lockEmbed);	
			logChannel.send(logEmbed);
		}).catch(error => {
			console.log(error);
			message.channel.send(" **Something unexpected happened, try again later** :x: ");
		});        
	},
};