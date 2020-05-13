const Discord = require('discord.js');

module.exports = {
	name: 'boot',
	description: 'Boot a user from the current channel.',
	guildOnly: true,
	modOnly: false,
	staffOnly: true,
	execute(message, args) {
		if (!message.mentions.users.size) {
			return message.reply(' **you need to tag a user to use this command** :warning:');
		}

        const target = message.mentions.members.first();
        
        if (target.roles.cache.has('643435170162278438')) {
            return message.reply(' **you cannot boot a staff member** :warning: '); 
        }

        const channel = message.channel;
		
        let reason = ""

		if (args.length > 1)
			for (var i = 1; i < args.length; i++) 
				reason += args[i] + " "
		else 
			reason = "unspecified."

		const exampleEmbed = new Discord.MessageEmbed()
			.setColor('#3385ff')
			.setAuthor(`${target.user.tag} has been boot from #${channel.name}`, target.user.displayAvatarURL({dynamic: true}))
			.setDescription(`**Reason:** ${reason}`)
			.setTimestamp();       
		
		channel.updateOverwrite(target, { VIEW_CHANNEL: false });

        message.channel.send(exampleEmbed);	
	},
};