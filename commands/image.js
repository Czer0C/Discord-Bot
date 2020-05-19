module.exports = {
	name: 'image',
    description: 'Return a pic.',
    usage: '<pic codename>',
    async execute (message) {
        const exampleEmbed = {
            image: {
                url: 'https://i.imgur.com/j8RvAwY.jpg',
            },
        };

        message.channel.send({ embed: exampleEmbed });
    }
}