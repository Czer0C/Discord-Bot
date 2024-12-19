const imageList = require('../../asset/imageList.json');

const { generalRole, staffRole } = require('../../config.json');

module.exports = {
  name: 'image',
  description: 'Return a pic.',
  cooldown: 10,
  async execute(message, args, client, commandName) {
    const image = imageList.find(
      (i) => i.name.toLocaleLowerCase() === commandName,
    );

    if (image) {
      const roleCache = message.member.roles.cache;

      if (image.rank === '1' && !roleCache.has(generalRole)) {
        return message.reply(' no weight!');
      } else if (image.rank === '2' && !roleCache.has(staffRole)) {
        return message.reply(' no weight again!');
      }

      message.channel.send(image.link);
    } else {
      message.channel.send(`**Invalid command's name or usage** :x:`);
    }
  },
};
