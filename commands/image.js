const imageList = require('../asset/imageList.json');
const { generalRole, staffRole } = require('../config.json');

module.exports = {
	name: 'image',
    description: 'Return a pic.',
    async execute (message, args, client, commandName) {
        const image = imageList.find(i => i.name === commandName);
        
        if (image) {
            const imageEmbed = {
                image: {
                    url: image.link,
                },
            };

            if (image.rank === "1" && !message.member.roles.cache.has(generalRole)) 
                return message.reply(" no weight!");
            else if (image.rank === "2" && !message.member.roles.cache.has(staffRole)) 
                return message.reply(" no weight again!");
                 
            message.channel.send({ embed: imageEmbed });
        }
        else
            message.channel.send("**There was an error trying to execute that command** :x:");
    }
}