const { argsToString, htmlToDiscord } = require('../../utility/utility.js');
const { embed } = require('../../utility/embed.js');
const axios = require('axios');
const cheerio = require('cheerio');


module.exports = {
	name: 'wiki',
    description: 'Look up stuff on Wikia.',
    args: true,
    aliases: ['wikia'],
    usage: '<keyword>',
	async execute(message, args) {
        const keyword = argsToString(args).slice(0, -1);

        const query = 
        `https://kingdom.fandom.com/wiki/Special:Search?query=${keyword}&scope=internal&navigationSearch=true`;


        // Look up page

        try {
            const formatKeyword = 
            keyword
            .replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase())
            .replace(' ', '_');

            const pageURL = `https://kingdom.fandom.com/wiki/${formatKeyword}`;

            const page = await axios(pageURL).then(site => site.data);

            const $ = cheerio.load(page);

            const title = $('#firstHeading').text();

            const quickInfo = $('.mw-parser-output');

            const description = $('#toc').prev();

            const pictureLink = quickInfo.find('img')[0].attribs.src;

            const linkElements = description.children('a');

            let links = [];

            for (let i = 0; i < linkElements.length; i++) {
                links.push(`https://kingdom.fandom.com${linkElements[i].attribs.href}`);
            }

            const wikiEmbedContent = htmlToDiscord(description.html(), links);

            const response = embed({
                color: "#541f1f",
                author: "",
                title: `${title}`,
                URL: pageURL,
                content: wikiEmbedContent,
                message: message,
                footer: false,
                thumbnail: pictureLink || ''
            });

            message.channel.send(response); 
            
        } catch (error) {
            if (error.response && error.response.status === 404) { // Fallback to searching for related articles
                const searchResults = await axios(encodeURI(query)).then(site => site.data);

                const $ = cheerio.load(searchResults);

                const list = $('.unified-search__result__title');

                let board = [];

                for (let i = 0; i < list.length; i++) {
                    const {
                        href, 
                        "data-title": title
                    } = list[i].attribs;

                    board.push({href, title});
                }

                let content = board.slice(0, 10).reduce(
                    (acc, row) => acc + `[${row.title}](${row.href})\n`, '');
                
                const response = embed({
                    color: "#541f1f",
                    author: "",
                    title: `Articles related to '${keyword}':`,
                    content: content.length === 0 ? 'Nothing found ❌' : content,
                    message: message,
                    footer: false
                });

                message.channel.send(response);   
            } else {
                console.log(error);
            }

            
        }                 
	},
};