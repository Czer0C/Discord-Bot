module.exports = {
	name: 'weak',
	description: 'Danto command',
	execute(message) {
		const exampleEmbed = {
            image: {
                url: 'https://i.imgur.com/j8RvAwY.jpg',
            },
        };

        message.channel.send({ embed: exampleEmbed });
	},
};