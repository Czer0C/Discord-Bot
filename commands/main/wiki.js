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
        
        const searching = wikia.searchWikia(query).then(wikiPages => {
            let title = `Articles related to '${query}':`;
            let content = "";
            let searchLimit = wikiPages.length > 10 ? 10 : wikiPages.length;

            if (searchLimit === 0) 
                content = `Nothing found :x:`;
            else
                for (let i = 0; i < searchLimit; i++)
                    content += `[${wikiPages[i].title}](${wikiPages[i].url})\n`;
            
            const response = embed({
                color: "#541f1f",
                author: "",
                title: title,
                content: content,
                message: message
            });

            message.channel.send(response);   
        });             
	},
};