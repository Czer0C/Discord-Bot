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

		if (isNaN(amount) || (amount <= 1 || amount > 100)) {
            return message.reply(' **you need to input a number between 1 and 99** ⚠️');
        }
			

		let reason = args.length > 1 ? 
                     args.slice(1).reduce((line, arg) => line + ' ' + arg) :
                     'unspecified';

		const clearEmbed = embed({
			color: '#F4D03F',
			author: `${amount} messages has been cleared in #${message.channel.name} 🧹`,
			icon: false,
            content: `  **Reason:** ${reason}\n**Moderator:** ${message.author}`,
            footer: false,
			message: message
		})    
        
		message.delete();
		message.channel.bulkDelete(amount, true).then(() => {
			logChannel.send(clearEmbed);
		}).catch(err => {
			console.error(err);			
			message.channel.send(" **Something unexpected happened, try again later** ❌");
		});
	},
};