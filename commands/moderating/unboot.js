const Discord = require('discord.js');

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
		
        if (target.roles.cache.has('643435170162278438'))
			return message.reply(' **you cannot boot a staff member** :warning: '); 
            
        const channelPermission = channel.permissionOverwrites.get(target.id);

        if (channelPermission) {
            let reason = ""

            if (args.length > 1)
                for (var i = 1; i < args.length; i++) 
                    reason += args[i] + " "
            else 
                reason = "unspecified."

            const exampleEmbed = new Discord.MessageEmbed()
                .setColor('#45B39D')
                .setAuthor(`${target.user.tag} has been unbooted from #${channel.name}`, target.user.displayAvatarURL({dynamic: true}))
                .setDescription(`**Reason:** ${reason}`)
                .setTimestamp();       
            
            channelPermission.delete().then(()=> {
                message.channel.send(exampleEmbed);
            }).catch(error => {		
                message.channel.send(" **something unexpected happened, try again later** :warning: ");
            });
            	
        }
        else {
            return message.reply(' **this user has not been booted** :warning: ');
        }
	},
};