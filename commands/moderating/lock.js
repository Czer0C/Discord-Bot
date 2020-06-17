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
        
        let lockContent = 
            `This channel has been locked 🔒\n\n` + 
            `${reason ? `**Reason:** ${reason}\n` : ''}` + 
            ``;

        const lockEmbed = embed({
            color: '#AF7AC5',
		    content: lockContent,
            message: message,
            footer: false
        })

        let lockReport = 
            `<#${channel.id}> has been locked. 🔒\n
            **Reason:** ${reason ? reason : 'unspecified'}\n
            **Moderator:** ${message.author}
            `;

		const logEmbed = embed({
			color: '#AF7AC5',
			icon: false,
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