const { embed } = require('../../utility/embed.js');

module.exports = {
	name: 'avatar',
	description: 'Get avatar of your own or a tagged user',
	aliases: ['icon', 'pfp'],
	execute(message) {
		let target = null;
		if (!message.mentions.users.size)  {
            target = message.author;
        } else {
            target = message.mentions.users.first();
        }
			
		const avatar = target.displayAvatarURL({
            format: "png", dynamic: true, size: 1024
        });
		const avatarEmbed = embed({
			author: `${target.tag}`,
			icon: false,
			content: `[Direct link](${avatar})`,
			message: message,
			image: avatar
        });
        
		message.channel.send(avatarEmbed);
	},
};