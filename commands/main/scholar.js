module.exports = {
	name: 'scholar',
	description: 'Ping scholar.',
	execute(message, args) {
        const content = args.reduce((a, i) => a + ' ' + i);
        
        message.channel.send(`<@&715446627309060127> ${content}`)
	},
};