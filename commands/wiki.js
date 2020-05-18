const { argsToString, embed } = require('../utility/utility.js');
const axios = require('axios');

module.exports = {
	name: 'wiki',
    description: 'Look up stuff on Wikia.',
    args: true,
    usage: '<keyword>',
	async   execute(message, args) {
        const query = argsToString(args);
        const url = `https://kingdom.fandom.com/api/v1/Search/List?query=${encodeURIComponent(query)}`;
        
        const result = await axios.get(url).catch((error) => {
            console.log(error);
            message.channel.send("**Something unexpected happened**, try again later :x:");
        });
        
        const wikiPages = result.data.items;
        let title = `Results for '${query}':`;
        let content = "";
        let searchLimit = wikiPages.length > 10 ? 10 : wikiPages.length;
        if (searchLimit === 0) content = `Nothing found.`;
        else
            for (let i = 0; i < searchLimit; i++)
                content += `[${wikiPages[i].title}](${wikiPages[i].url})\n`;
        const response = embed("#541f1f", title, false, undefined, content, undefined, message);

        message.channel.send(response);        
	},
};