const mangadex = require('../../utility/externalAPI/mangadex.js');
const Discord = require('discord.js');

module.exports = {
	name: 'manga',
    description: 'Get a chapter or page.',
    args: true,
    usage: '<chapter number> <chapter page>',
	async execute(message, args) {
        const chapterNo = args[0];
        const pageNo = args[1] ? args[1] : 1;
        
        if (isNaN(chapterNo) || isNaN(pageNo) || pageNo <= 0)
            return message.reply(" **invalid chapter or page number** :x:");
      
        mangadex.getChapter(chapterNo).then(chapterID => {
            if (!chapterID) 
                return message.reply(` **could not find chapter ${chapterNo}** :x:`);
            
            mangadex.getPages(chapterID).then(chapterInfo => {
                
                const pageList = chapterInfo.page_array;
                const pageCount = pageList.length;
            
                if (pageNo > pageCount) 
                    return message.reply(` **invalid page number for chapter ${chapterNo}** :x:`);
        
                const mdURL = `https://mangadex.org/chapter/${chapterInfo.id}`;
                const pageURL = `${chapterInfo.server}${chapterInfo.hash}/${pageList[pageNo - 1]}`;
        
                const chapterEmbed = new Discord.MessageEmbed()
                    .setColor('#eedddd')
                    .setTitle(`Chapter ${chapterInfo.chapter}: ${chapterInfo.title}`)
                    .setDescription(`[Read on Mangadex](${mdURL})`)
                    .setImage(pageURL)
                    .setFooter(`Page: ${pageNo}/${pageCount}`);

                message.channel.send({ embed: chapterEmbed });
            })
            .catch(error => {
                console.log(error);
                throw error;
            })
        })
        .catch(error => {
            console.log(error)
            throw error;
        })             
	},
};