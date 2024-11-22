const { default: axios } = require('axios');
const { EmbedBuilder } = require('discord.js');

const MANGADEX_URL =
  'https://api.mangadex.org/manga/077a3fed-1634-424f-be7a-9a96b7f07b78/feed?translatedLanguage[]=en&limit=5&includes[]=scanlation_group&includes[]=user&includes[]=1071e71d-cc55-4fa6-81d1-4b5913a2fde5&order[volume]=desc&order[chapter]=desc&offset=0&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&contentRating[]=pornographic';

module.exports = {
  name: 'mangadex',
  description: 'Show status of mangadex',
  aliases: ['md', 'dex'],
  async execute(message) {
    try {
      const { data } = await axios(MANGADEX_URL);

      try {
        const list = data?.data || [];

        const msg = list
          .map(
            (chap) =>
              `[${chap.attributes.chapter}:\t${
                chap.attributes.title
              }](${`https://mangadex.org/chapter/${chap.id}/1`})`,
          )
          .join('\n');

        try {
          const exampleEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('Latest 5 Chapters By Sense Scans')
            .setDescription(msg);

          message.channel.send({ embeds: [exampleEmbed] });
        } catch (error) {
          console.log('Error:', error.message);
          message.channel.send(`Unexpected Error: ${error?.message} ‼️`);
        }
      } catch (error) {
        message.channel.send(`Unexpected Error: ${error?.message} ‼️`);
      }
    } catch (error) {
      const msg = `‼️=========================‼️\n**Mangadex** seems to be **OFFLINE**:\n${error?.message}\n${error?.response?.statusText}`;

      message.channel.send(msg);
    }
  },
};
