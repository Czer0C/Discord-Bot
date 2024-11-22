const { default: axios } = require('axios');

const MANGADEX_URL =
  'https://api.mangadex.org/manga/077a3fed-1634-424f-be7a-9a96b7f07b78/feed?translatedLanguage[]=en&limit=4&includes[]=scanlation_group&includes[]=user&order[volume]=desc&order[chapter]=desc&offset=0&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&contentRating[]=pornographic';

module.exports = {
  name: 'mangadex',
  description: 'Show status of mangadex',
  aliases: ['md', 'dex'],
  async execute(message) {
    try {
      const { data } = await axios(MANGADEX_URL);

      const list = data?.data || [];

      let msg = 'Status Mangadex Normal';

      message.channel.send(msg);
    } catch (error) {
      // console.error('Scraping Mangadex Failed:\n',error?.message, '\n', error?.response?.statusText)

      const msg = `‼️=========================‼️\n**Mangadex** seems to be **OFFLINE**:\n${error?.message}\n${error?.response?.statusText}`;

      message.channel.send(msg);
    }
  },
};
