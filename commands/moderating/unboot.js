const { embed } = require('../../utility/embed.js');
const { staffRole, loggingChannel } = require('../../config.json');

module.exports = {
	name: 'unboot',
	description: 'Unboot a user from the current channel.',
	guildOnly: true,
	modOnly: false,
	staffOnly: true,
	execute(message, args) {
		if (!message.mentions.users.size)
			return message.reply(' **you need to tag a user to use this command** :warning:');

        const target = message.mentions.members.first();
		const channel = message.channel;
        const logChannel = message.guild.channels.cache.get(loggingChannel);
        
        if (target.roles.cache.has(staffRole))
			return message.reply(` **can't do that to a staff member** :warning: `); 
            
        const channelPermission = channel.permissionOverwrites.get(target.id);

        if (channelPermission) {
            let reason = ""

            if (args.length > 1)
                for (var i = 1; i < args.length; i++) 
                    reason += args[i] + " "
            else 
                reason = "unspecified."

            const unbootEmbed = embed({
                color: '#45B39D',
                author: `${target.user.tag} has unbooted from #${channel.name} ✅`,
                icon: target.user.displayAvatarURL({dynamic: true}),
                content: `**Reason:** ${reason}\n**Moderator:** ${message.author}`,
                message: message
            })

            channelPermission.delete().then(()=> {
                message.channel.send(unbootEmbed);
                logChannel.send(unbootEmbed);
            }).catch(error => {		
                message.channel.send("**Something unexpected happened, try again later** :x: ");
            });            	
        }
        else {
            return message.reply(' **this user has not been booted** :warning: ');
        }
	},
};