const { embed } = require('../../utility/embed.js');
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

        if (channelPermission) {            
            let reason = args.reduce((line, arg) => line + ' ' + arg, '');
            
            const unlockEmbed = embed({
                color: '#A569BD',
                author: `This channel has been unlocked ✅`,
                icon: false,
                content: `${reason ? `**Reason:** ${reason}\n` : '\n'}`,
                message: message,
                footer: false
            })

            let unlockReport =
                `<#${channel.id}> has been unlocked. ✅\n
                **Reason:** ${reason ? reason : 'unspecified'}
                **Moderator:** ${message.author}
                `;

            const logEmbed = embed({
                color: '#A569BD',
                icon: false,
                content: unlockReport,
                message: message,
                footer: false
            })  

            channelPermission.delete().then(() => {
                channel.send(unlockEmbed);	
                logChannel.send(logEmbed);
            }).catch(error => {
                console.log(error);
                channel.send("**Something unexpected happened, try again later** ⚠️");
            });           
        }
        else {
            return message.reply(' **this channel has not been locked yet** ⚠️'); 
        }
	},
};