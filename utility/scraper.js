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

    const announcementID = '400121168218030082';

    const destinationChannel = await client.channels.fetch(announcementID);

    const parser = new Parser();
  
    try {
        const feed = await parser.parseURL(rss);
        const latestFeed = feed.items.filter(i => i.title.includes('Kingdom'))[0];
        
        if (latestUpdateContent !== latestFeed.link) {
            const msg =
            `${latestFeed.title} @everyone\n\n` +
            `Read Online: ${latestFeed.link}\n\n` +
            `Download: https://turnipfarmers.wordpress.com/\n\n` +
            ``;
            destinationChannel.send(msg);
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
    const koreanSiteURL = 'https://manatoki130.net/comic/116795';
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
