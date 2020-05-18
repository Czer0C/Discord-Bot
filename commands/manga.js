const axios = require('axios');
const Discord = require('discord.js');
module.exports = {
	name: 'manga',
    description: 'Get a chapter or page.',
    args: true,
    usage: '<chapter number> <chapter page>',
	async execute(message, args) {
        const chapterNo = args[0];
        const pageNo = args[1];
        const mangaAPI = `https://mangadex.org/api/manga/2007`;
        
        if (isNaN(chapterNo) || isNaN(pageNo) || pageNo <= 0)
            return message.reply(" **invalid chapter or page number** :x:");

        const mangaResult = await axios.get(mangaAPI).catch((error) => {
            console.log(error);
            message.channel.send("**Something unexpected happened**, try again later :x:");
        });

        const chapterList = mangaResult.data.chapter;
        let chapter = {
            id: null,
            detail: null
        };

        for (let key of Object.keys(chapterList)) {
            let ch = chapterList[key];
            if (ch.chapter === chapterNo && ch.lang_code === "gb") {
                chapter.id = key;
                chapter.detail = ch;
                break;
            }            
        }

        if (!chapter.id) return message.reply(` **could not find chapter ${chapterNo}** :x:`);
        
        const chapterAPI = `https://mangadex.org/api/chapter/${chapter.id}`;

        const chapterResult = await axios.get(chapterAPI).catch((error) => {
            console.log(error);
            message.channel.send("**Something unexpected happened**, try again later :x:");
        });

        const chapterInfo = chapterResult.data;
        const pageList = chapterInfo.page_array;
        const pageCount = pageList.length;
        const mdURL = `https://mangadex.org/chapter/${chapter.id}`;
        if (pageNo > pageCount) return message.reply(` **invalid page number for chapter ${chapterNo}** :x:`);

        const pageURL = `${chapterInfo.server}${chapterInfo.hash}/${pageList[pageNo - 1]}`;

        console.log(pageURL)


        const chapterEmbed = new Discord.MessageEmbed()
            .setColor('#eedddd')
            .setTitle(`Chapter ${chapterInfo.chapter}: ${chapterInfo.title}`)
            .setDescription(`[Read on Mangadex](${mdURL})`)
            .setImage(pageURL)
            .setFooter(`Page: ${pageNo}/${pageCount}`);


        message.channel.send({ embed: chapterEmbed });
	},
};