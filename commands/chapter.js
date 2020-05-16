const fs = require('fs');
const Discord = require('discord.js');
const fetch = require("node-fetch");

module.exports = {
	name: 'chapter',
    description: 'Get a chapter or page.',
    args: true,
    usage: '<chapter number> <chapter page>',
	execute(message, args) {
        // 565-564-563
        const chapterIDs = [407741, 402525, 392690];
        const chapter = args[0];
        const api = `https://mangadex.org/api/chapter/${chapterIDs[chapter]}`;
        const md = `https://mangadex.org/chapter/${chapterIDs[chapter]}`;
        // let pages = fs.readdirSync(`./asset/Kingdom/${chapter}`).filter(file => file.endsWith('.png'));
        // for (let i = 0; i < pages.length; i++) 
        //     pages[i] = `./asset/Kingdom/${chapter}/` + pages[i];


        // console.log(pages.length);
        fetch(api, {method: 'GET',
        headers: {
          Accept: 'application/json',
        }}).then(response => response.text()).then(body  => {
            let chapter_info = JSON.parse(body);
            let page_count = chapter_info.page_array.length;
            const page = args[1] ? args[1] : 0;

            if (page < page_count) {
                const page_url = `${chapter_info.server}/${chapter_info.hash}/${chapter_info.page_array[page]}`;
                //const attachment = new Discord.MessageAttachment(page_url);


                const exampleEmbed = {
                    title: `Chapter ${chapter_info.chapter} - ${chapter_info.title}`,
                    description: `[To mangadex](${md}) - Page: ${page}/${page_count}`,
                    image: {
                        url: page_url,
                    },
                };
        
                message.channel.send({ embed: exampleEmbed });
            }
                
        })
    

        

        

	},
};