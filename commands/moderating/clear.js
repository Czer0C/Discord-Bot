module.exports = {
	name: 'clear',
	staffOnly: true,
	modOnly: false,
	description: 'Clear up to 99 messages.',
	execute(message, args) {
		const amount = parseInt(args[0]) + 1;

		if (isNaN(amount) || (amount <= 1 || amount > 100))
			return message.reply(' **you need to input a number between 1 and 99** :warning:');

		message.channel.bulkDelete(amount, true).catch(err => {
			console.error(err);
			message.channel.send(' **there was an error trying to clear messages in this channel** :warning:');
		});
	},
};