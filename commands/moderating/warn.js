const Discord = require('discord.js');

module.exports = {
	name: 'warn',
	description: 'Warn a user.',
	guildOnly: true,
	modOnly: false,
	staffOnly: true,
	execute(message, args) {
		if (!message.mentions.users.size)
			return message.reply(' **you need to tag a user to use this command** :warning:');
	
        const target = message.mentions.members.first();
        
        if (target.roles.cache.has('643435170162278438'))
            return message.reply(' **you cannot warn a staff member** :warning: '); 

        let reason = ""

		if (args.length > 1)
			for (var i = 1; i < args.length; i++) 
				reason += args[i] + " "
		else 
			reason = "unspecified."

		const exampleEmbed = new Discord.MessageEmbed()
			.setColor('#F4D03F')
			.setAuthor(`${target.user.tag} has been warned ⚠️`, target.user.displayAvatarURL({dynamic: true}))
			.setDescription(`**Reason:** ${reason}`)
			.setTimestamp();       
        
        message.channel.send(exampleEmbed);		
	},
};