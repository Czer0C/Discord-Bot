const imageList = require('../asset/imageList.json');

const Discord = require('discord.js');

module.exports = {
	name: 'image',
    description: 'Return a pic.',
    usage: '<pic codename>',
    async execute (message, args, client, commandName) {
        const image = imageList.find(i => i.name === commandName);
        if (image) {
            const imageEmbed = {
                image: {
                    url: image.link,
                },
            };
    
            message.channel.send({ embed: imageEmbed });
        }
        else
            message.channel.send("**There was an error trying to execute that command** :x:");
    }
}