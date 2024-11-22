const { embed } = require('../../utility/embed.js');
const { muteRole, staffRole, loggingChannel } = require('../../config.json');

module.exports = {
  name: 'unmute',
  description: 'Unmute a user.',
  guildOnly: true,
  modOnly: false,
  staffOnly: true,
  execute(message, args) {
    if (!message.mentions.users.size) {
      return message.reply(
        ' **you need to tag a user to use this command** ⚠️',
      );
    }

    const target = message.mentions.members.first();
    const logChannel = message.guild.channels.cache.get(loggingChannel);

    if (!target.roles.cache.has(muteRole)) {
      return message.reply(' **this member has not been muted** ⚠️');
    } else if (target.roles.cache.has(staffRole)) {
      return message.reply(` **can't do that to a staff member** ⚠️`);
    }

    let role = message.guild.roles.cache.find((role) => role.id === muteRole);

    let reason = args.slice(1).reduce((line, arg) => line + ' ' + arg, '');

    const unmuteEmbed = embed({
      color: '#5DADE2',
      author: `${target.user.tag} has been unmuted ✅`,
      icon: target.user.displayAvatarURL({ dynamic: true }),
      content: reason ? `**Reason:** ${reason}` : '\n',
      footer: false,
      message: message,
    });

    let unmuteReport = `**Reason:** ${reason ? reason : 'unspecified'}
            **Moderator**: ${message.author.username}
            `;

    const unmuteLogEmbed = embed({
      color: '#5499C7',
      author: `${target.user.tag} has been been unmuted ✅`,
      icon: target.user.displayAvatarURL({ dynamic: true }),
      content: unmuteReport,
      footer: false,
      message: message,
    });

    target.roles
      .remove(role)
      .then((target) => {
        message.channel.send(unmuteEmbed);
        logChannel.send(unmuteLogEmbed);
      })
      .catch((error) => {
        console.log(error);
        message.channel.send(`**Unexpected error: ** \n ${error?.message} ⚠️`);
      });
  },
};
