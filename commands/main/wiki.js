const { argsToString } = require('../../utility/utility.js');
const { embed } = require('../../utility/embed.js');
const wikia = require('../../utility/externalAPI/wikia.js');

module.exports = {
	name: 'wiki',
    description: 'Look up stuff on Wikia.',
    args: true,
    usage: '<keyword>',
	async execute(message, args) {
        const query = argsToString(args).slice(0, -1);
        
        wikia.searchWikia(query).then(async wikiPages => {
            wikiPages = wikiPages.slice(0, 10);
            let content = await wikiPages.reduce(
                (acc, row) => acc + `[${row.title}](${row.url})\n`, '');
            
            const response = embed({
                color: "#541f1f",
                author: "",
                title: `Articles related to '${query}':`,
                content: content.length === 0 ? 'Nothing found ❌' : content,
                message: message,
                footer: false
            });

            message.channel.send(response);   
        });             
	},
};