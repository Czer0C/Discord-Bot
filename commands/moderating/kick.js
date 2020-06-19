const { embed } = require('../../utility/embed.js');
const { staffRole, loggingChannel } = require('../../config.json');

module.exports = {
	name: 'kick',
	description: 'Kick a user.',
	guildOnly: true,
	modOnly: true,
	staffOnly: true,
	execute(message, args) {
		if (!message.mentions.users.size)
			return message.reply(' **you need to tag a user to use this command** ⚠️');

		const target = message.mentions.members.first();
		const logChannel = message.guild.channels.cache.get(loggingChannel);

		if (!message.guild.member(target)) {
            return message.reply(` **this user isn't a member of the server** ⚠️`);
        }

		if (target.roles.cache.has(staffRole)) {
            return message.reply(` **can't do that to a staff member** ⚠️`);
        }
			
		let reason = args.length > 1 ? 
                     args.slice(1).reduce((line, arg) => line + ' ' + arg) :
                     'unspecified';

		const kickEmbed = embed({
			color: '#EB984E',
			author: `${target.user.tag} has been kicked 👢`,
			icon: target.user.displayAvatarURL({dynamic: true}),
            content: `**Reason:** ${reason}`,
            footer: false,
			message: message
        })

        const kickLogEmbed = embed({
            color: '#5499C7',
			author: `${target.user.tag} has been kicked 👢`,
			icon: target.user.displayAvatarURL({dynamic: true}),
            content: `**Reason:** ${reason}\n**Moderator**: ${message.author}`,
            footer: false,
			message: message
        })
        
		target.kick().then(target => {
			message.channel.send(kickEmbed);
			logChannel.send(kickLogEmbed);
		}).catch(error => {		
			console.log(error);
		   	message.channel.send("**Something unexpected happened, try again later** :x:");
	   	});		
	},
};