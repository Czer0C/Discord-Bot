const { embed } = require('../../utility/embed.js');
const { loggingChannel } = require('../../config.json');

module.exports = {
	name: 'clear',
	staffOnly: true,
	modOnly: false,
	description: 'Clear up to 99 messages.',
	execute(message, args) {
		const amount = parseInt(args[0]) + 1;
		const logChannel = message.guild.channels.cache.get(loggingChannel);
		let reason = "";

		if (isNaN(amount) || (amount <= 1 || amount > 100))
			return message.reply(' **you need to input a number between 1 and 99** :warning:');

		if (args.length > 1)
			for (var i = 1; i < args.length; i++) 
				reason += args[i] + " "
		else 
			reason = "unspecified."

		const clearEmbed = embed({
			color: '#F4D03F',
			author: `${amount} messages has been cleared in #${message.channel.name} 🧹`,
			icon: false,
			content: `**Reason:** ${reason}\n**Moderator:** ${message.author}`,
			message: message
		})    
        
		message.delete();
		message.channel.bulkDelete(amount, true).then(() => {
			message.channel.send(clearEmbed);
			logChannel.send(clearEmbed);
		}).catch(err => {
			console.error(err);			
			message.channel.send(" **Something unexpected happened, try again later** :x: ");
		});
	},
};