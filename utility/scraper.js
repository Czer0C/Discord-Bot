const Parser = require('rss-parser');
const axios = require('axios');

const { rss } = require('../config.json');
const { filterSenseScans } = require('./utility');

const MANGADEX_URL =
  'https://api.mangadex.org/manga/077a3fed-1634-424f-be7a-9a96b7f07b78/feed?translatedLanguage[]=en&limit=10&includes[]=scanlation_group&includes[]=&order[volume]=desc&order[chapter]=desc&offset=0&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&contentRating[]=pornographic';

scrapSenseScan = async (client) => {
  const logChannelID = '721933602635644998';

  const logChannel = await client.channels.fetch(logChannelID);

  const latestUpdate = await logChannel.messages.fetch({ limit: 1 });

  const latestUpdateContent = latestUpdate.values().next().value?.content;

  const announcementID = '400121168218030082';

  const destinationChannel = await client.channels.fetch(announcementID);

  const parser = new Parser();

  try {
    const feed = await parser.parseURL(rss);
    const latestFeed = feed.items.filter((i) => i.title.includes('Kingdom'))[0];

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
    console.error(error);
  }
};

// The basic idea is to use Jquery on the korean site
// and pop the most recent element on the chapter link list
// .item-subject = target element
scrapKoreanScan = async (client) => {
  const { channels } = client;

  const cheerio = require('cheerio');
  const koreanSiteURL = 'https://manatoki130.net/comic/116795';
  const koreanLogID = '810119301838274600';
  const spoilerChannelID = '400121599639945216';

  try {
    const koreanLog = await channels.fetch(koreanLogID);
    const spoilerDestination = await channels.fetch(spoilerChannelID);

    const lastMessage = await koreanLog.messages.fetch({ limit: 1 });

    const koreanSite = await axios(koreanSiteURL).then((site) => site.data);

    const $ = cheerio.load(koreanSite);

    const latestLink = $('.item-subject')?.[0]?.attribs?.href;

    const checkLog = await lastMessage.values().next().value?.content;

    const id = checkLog.split('?')[0].split('/')[4];

    if (!checkLog || !checkLog.includes(id)) {
      // koreanLog.send(`<${latestLink}>`)
      // spoilerDestination.send(`Latest Korean Scan: ${latestLink}`)
    }
  } catch (error) {
    console.log(error);
  }
};

scrapMangadex = async (client) => {
  try {
    const { data } = await axios(MANGADEX_URL);

    //! Filter by Sense Scans because mangadex has no option params for scanlation group
    const list = filterSenseScans(data?.data);

    const latestChapter = list[0];

    //! Send to Log

    const logChannelID = '721933602635644998';

    const logChannel = await client.channels.fetch(logChannelID);

    const latestUpdate = await logChannel.messages.fetch({ limit: 1 });

    const latestUpdateContent = latestUpdate.values().next().value?.content;

    const uploader = latestChapter.relationships?.find(
      (i) => i.type === 'scanlation_group',
    )?.attributes?.name;

    // const announcementID = '400121168218030082';

    const staffChannelID = '400665733429985290';

    const staffRoleId = `<@&684289189390319638>`;

    const destinationChannel = await client.channels.fetch(staffChannelID);

    // const testingChannel = await client.channels.fetch('427652466880938004');

    const logContent = `${latestChapter?.attributes?.chapter}`;

    const title = `Chapter ${latestChapter?.attributes?.chapter}: ${latestChapter?.attributes?.title}`;

    const outdated =
      +`${latestChapter?.attributes?.chapter}` > +`${latestUpdateContent}`;

    const msg =
      `@everyone\n\n` +
      `${title} \n\n` +
      `Read Online: https://mangadex.org/chapter/${latestChapter?.id}/1\n` +
      `Uploader: **${uploader}**` +
      ``;

    if (outdated) {
      destinationChannel.send(msg);

      logChannel.send(logContent);
    }
  } catch (error) {
    // console.error('Scraping Mangadex Failed:\n',error?.message, '\n', error?.response?.statusText)
  }

  // const logChannelID = '721933602635644998';

  // const logChannel = await client.channels.fetch(logChannelID);

  // const latestUpdate = await logChannel.messages.fetch( { limit: 1} );

  // const latestUpdateContent = latestUpdate.values().next().value?.content;

  // const announcementID = '400121168218030082';

  // const destinationChannel = await client.channels.fetch(announcementID);

  // const parser = new Parser();

  // try {
  //     const feed = await parser.parseURL(rss);
  //     const latestFeed = feed.items.filter(i => i.title.includes('Kingdom'))[0];

  //     if (latestUpdateContent !== latestFeed.link) {
  //         const msg =
  //         `${latestFeed.title} @everyone\n\n` +
  //         `Read Online: ${latestFeed.link}\n\n` +
  //         `Download: https://turnipfarmers.wordpress.com/\n\n` +
  //         ``;
  //         destinationChannel.send(msg);
  //         logChannel.send(latestFeed.link);

  //     }
  // } catch (error) {
  //     console.error(error)
  // }
};

module.exports.scrapSenseScan = scrapSenseScan;
module.exports.scrapKoreanScan = scrapKoreanScan;
module.exports.scrapMangadex = scrapMangadex;
