const Parser = require('rss-parser');
const { rss } = require('../config.json');
const {
    staffRole,
} = require('../config.json');

scrapSenseScan = async (client) => {
    const logChannelID = '721933602635644998';

    const logChannel = await client.channels.fetch(logChannelID);

    const latestUpdate = await logChannel.messages.fetch( { limit: 1} );

    const latestUpdateContent = latestUpdate.values().next().value?.content;

    const staffChannelID = '400665733429985290';

    const staffChannel = await client.channels.fetch(staffChannelID);

    const parser = new Parser();

    try {
        const feed = await parser.parseURL(rss);

        const latestFeed = feed.items.filter(i => i.title.includes('Kingdom'))[0];

        if (latestUpdateContent !== latestFeed.link) {
            const announcement =
                `${latestFeed.title} <@&${staffRole}>\n\n` +
                `Read Online: ${latestFeed.link}\n\n` +
                `Download: https://turnipfarmers.wordpress.com/\n\n` +
                ``;
    
            staffChannel.send(announcement);
            logChannel.send(latestFeed.link); 
            
        } 
    } catch (error) {
        console.error(error)
    }

  
}

// The basic idea is to use Jquery on the korean site
// and pop the most recent element on the chapter link list
// .item-subject = target element
scrapKoreanScan = async (client) => {
    const { channels } = client;
    const axios = require('axios');
    const cheerio = require('cheerio');
    const koreanSiteURL = 'https://manatoki.net/comic/116795';
    const koreanLogID = '810119301838274600';
    const spoilerChannelID = '400121599639945216'; 

    try {
        const koreanLog = await channels.fetch(koreanLogID);
        const spoilerDestination = await channels.fetch(spoilerChannelID);

        const lastMessage = await koreanLog.messages.fetch({limit: 1});

        const koreanSite = await axios(koreanSiteURL).then(site => site.data);

        const $ = cheerio.load(koreanSite);

        const latestLink = $('.item-subject')?.[0]?.attribs?.href;

        const checkLog = await lastMessage.values().next().value?.content;

        const id = checkLog.split('?')[0].split('/')[4]
       console.log(latestLink);
        if (!checkLog || !checkLog.includes(id)) {
            // koreanLog.send(`<${latestLink}>`)
            // spoilerDestination.send(`Latest Korean Scan: ${latestLink}`)
        }    
    }
    catch (error) {
        console.log(error);
    }    
}

module.exports.scrapSenseScan = scrapSenseScan;
module.exports.scrapKoreanScan = scrapKoreanScan;
