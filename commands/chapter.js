const { embed } = require('../utility/embed.js');
const chapterList = require('../asset/chapterList.json');

module.exports = {
	name: 'chapter',
    description: 'Get chapter link.',
    usage: '<chapter number>',
    aliases: ['ch', 'chap'],
    args: true,
	async execute(message, args) {
        for (let chapter of chapterList)
            if (chapter.no === args[0]) {
                const chapterEmbed = embed({
                    color: `#eedddd`,
                    title: `Chapter ${chapter.no}: ${chapter.title}`,
                    content: `[To Mangadex](${`https://mangadex.org/chapter/${chapter.id}`})`,
                    message: message
                });
                
                return message.channel.send(chapterEmbed);
            }

        message.channel.send("**Could not find that chapter** :x:");
	},
};