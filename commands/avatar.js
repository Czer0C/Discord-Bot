const { embed } = require('../utility/embed.js');

module.exports = {
	name: 'avatar',
	description: 'Get the avatar URL of the tagged user(s), or your own avatar.',
	aliases: ['icon', 'pfp'],
	execute(message) {
		// const memlist = message.guild.members.cache;
		// console.log(memlist);
		let target = null;
		if (!message.mentions.users.size) 
			target = message.author;
		else 
			target = message.mentions.users.first();
		const avatar = target.displayAvatarURL({format: "png", dynamic: true, size: 1024})
		const avatarEmbed = embed({
			author: `${target.tag}`,
			icon: false,
			content: `[Direct link](${avatar})`,
			message: message,
			image: avatar
		})
		message.channel.send(avatarEmbed);
	},
};