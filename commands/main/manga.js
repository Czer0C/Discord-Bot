const mangadex = require('../../utility/externalAPI/mangadex.js');
const Discord = require('discord.js');

const emojiNext = '▶️'; // unicode emoji are identified by the emoji itself
const emojiPrevious = '◀️';
const reactionArrow = [emojiPrevious, emojiNext];

const time = 60000; // time limit: 1 min

const filter = (reaction, user) => {
  return !user.bot && reactionArrow.includes(reaction.emoji.name);
};

module.exports = {
  name: 'manga',
  description: 'Get a chapter or page.',
  args: true,
  cooldown: 60,
  usage: '<chapter number> <chapter page>',
  async execute(message, args) {
    const chapterNo = args[0];
    const pageNo = args[1] ? args[1] : 1;

    if (isNaN(chapterNo) || isNaN(pageNo) || pageNo <= 0)
      return message.reply(' **invalid chapter or page number** :x:');

    mangadex
      .getChapter(chapterNo)
      .then((chapterID) => {
        if (!chapterID)
          return message.reply(` **could not find chapter ${chapterNo}** :x:`);

        mangadex
          .getPages(chapterID)
          .then((chapterInfo) => {
            const { pages, id, server, hash, chapter, title } =
              chapterInfo.data;
            const pageList = pages;

            const pageCount = pageList.length;

            if (pageNo > pageCount) {
              return message.reply(
                ` **invalid page number for chapter ${chapterNo}** :x:`,
              );
            }

            const mdURL = `https://mangadex.org/chapter/${id}`;
            const pageURL = `${server}${hash}/${pageList[pageNo - 1]}`;

            let chapterEmbed = embedChapter(
              chapter,
              title,
              mdURL,
              pageURL,
              pageNo,
              pageCount,
            );

            let curr = parseInt(pageNo - 1);

            message.channel.send({ embed: chapterEmbed }).then(async (msg) => {
              msg
                .react(emojiPrevious)
                .then((msgReaction) => msgReaction.message.react(emojiNext))
                .then((msgReaction) => {
                  const collector = msg.createReactionCollector(filter, {
                    time,
                  });
                  collector.on('collect', (r) => {
                    if (r.emoji.name === emojiPrevious) {
                      if (curr - 1 < 0) {
                        curr = pageCount - 1;
                      } else {
                        --curr;
                      }
                    } else if (r.emoji.name === emojiNext) {
                      if (curr + 1 > pageCount - 1) {
                        curr = 0;
                      } else {
                        ++curr;
                      }
                    }

                    let currImg = `${server}${hash}/${pageList[curr]}`;
                    chapterEmbed.setImage(currImg);
                    chapterEmbed.setFooter(`Page: ${curr + 1}/${pageCount}`);

                    msg.edit({ embed: chapterEmbed });
                  });
                });
            });
          })
          .catch((error) => {
            console.log(error);
            throw error;
          });
      })
      .catch((error) => {
        console.log(error);
        throw error;
      });
  },
};

const embedChapter = (chapter, title, mdURL, pageURL, pageNo, pageCount) => {
  const chapterEmbed = new Discord.MessageEmbed()
    .setColor('#eedddd')
    .setTitle(`Chapter ${chapter}: ${title}`)
    .setDescription(`[Read on Mangadex](${mdURL})`)
    .setImage(pageURL)
    .setFooter(`Page: ${pageNo}/${pageCount}`);
  return chapterEmbed;
};
