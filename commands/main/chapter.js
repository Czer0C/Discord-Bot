const axios = require('axios');
const baseUrl = 'https://api.mangadex.org';

module.exports = {
  name: 'chapter',
  description: 'Get chapter link. with optional language (default is English)',
  usage: '<chapter number> <language code ISO>',
  aliases: ['ch', 'chap', 'read'],
  args: true,
  cooldown: 5,
  async execute(message, args) {
    const [chapter, lang = 'en'] = args;

    try {
      const resp = await axios({
        method: 'GET',
        url: `${baseUrl}/manga/077a3fed-1634-424f-be7a-9a96b7f07b78/aggregate`,
        params: {
          translatedLanguage: [lang],
        },
      });

      let all = [];

      for (let i of Object.values(resp.data?.volumes)) {
        const chapters = Object.values(i?.chapters).map((i) => ({
          chapter: i.chapter,
          id: i.id,
        }));

        all.push(...chapters);
      }

      const target = all.find((i) => i.chapter === chapter);

      if (target) {
        return message.channel.send(
          `https://mangadex.org/chapter/${target.id}`,
        );
      } else {
        return message.channel.send(
          '**Could not find this chapter - Check chapter number or language code (*ISO*)** :x:',
        );
      }
    } catch (error) {
      console.error(error.message);
      return message.channel.send('Error finding chapter: ' + error.message);
    }
  },
};
