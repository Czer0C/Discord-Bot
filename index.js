const {
  GatewayIntentBits,
  Client,
  Collection,
  Partials,
  EmbedBuilder,
} = require('discord.js');

require('dotenv').config();

const imageList = require('./asset/imageList.json');

const { prefix, staffRole, modRole, adminRole } = require('./config.json');
const { quote } = require('./utility/quote.js');
const { getAllFiles } = require('./utility/utility.js');
const { scrapMangadex } = require('./utility/scraper.js');
const { embed } = require('./utility/embed.js');

const commandFiles = getAllFiles('commands');

const VALID_CHANNEL_TYPES = [0, 2, 4, 5, 10, 11, 12, 13, 14, 15];

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [Partials.Message],
});

client.commands = new Collection();

for (let fileName of commandFiles) {
  const command = require(fileName);
  client.commands.set(command.name, command);
}

const cooldowns = new Collection();

client.once('ready', () => {
  console.log('Ready!');
});

// setInterval(scrapKoreanScan, 10000, client);
// setInterval(scrapSenseScan, 10000, client);
setInterval(scrapMangadex, 5000, client);

client.on('messageDelete', async (message) => {
  const logs = message.guild.channels.cache.find(
    (channel) => channel.name === 'bot-testing',
  );

  if (message.partial) {
    logs.send(`A message was deleted, but it was not cached.`);
    return;
  }

  if (!logs) {
    return;
  }

  const fetchedLogs = await message.guild.fetchAuditLogs();

  const firstEntry = fetchedLogs.entries.first();

  const isModDelete =
    firstEntry.targetType === 'Message' &&
    firstEntry.actionType === 'Delete' &&
    firstEntry.targetId === message.author.id;

  const executor = isModDelete ? firstEntry.executor.tag : message.author.tag;

  const logEmbed = new EmbedBuilder();

  logEmbed
    .setColor('LuminousVividPink')
    .setAuthor({
      name: message.author?.tag,
      iconURL: message.author?.avatarURL(),
    })
    .setTitle(`<#${message.channel.id}>`)
    .setDescription(message.content || '**Empty or bot message**')
    .setFooter({
      text: `By: ${executor}`,
      iconURL: isModDelete
        ? firstEntry.executor.avatarURL()
        : message.author.avatarURL(),
    })
    .setTimestamp();

  logs.send({
    embeds: [logEmbed],
  });
});

client.on('messageCreate', (message) => {
  const { channel, content, author, member } = message;

  if (!author.bot && !member.roles.cache.has('684289189390319638')) {
    return;
  }

  if (channel.id === '713406898719817748' && content !== '.acknowledged') {
    return message.delete();
  }

  if (!content.startsWith(prefix) || author.bot) {
    quote(message).then((result) => {
      if (result.isMessageURL) {
        if (result.embedQuote) {
          message.delete();
          return channel.send(result.embedQuote);
        } else {
          return channel.send('**Invalid message link** ❌');
        }
      }
    });

    return;
  }

  const args = content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();

  let command =
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName),
    );

  if (!command) {
    command = client.commands.get('image');
  }

  if (command.guildOnly && !VALID_CHANNEL_TYPES.includes(channel.type)) {
    return message.reply("I can't execute that command inside DMs!");
  }

  if (command.staffOnly) {
    if (!member.roles.cache.has(staffRole)) {
      return message.reply(` **only staff can use this command**⚠️`);
    } else if (command.modOnly && !member.roles.cache.has(modRole)) {
      return message.reply(' **only moderators can use this command**⚠️');
    } else if (command.adminOnly && !member.roles.cache.has(adminRole)) {
      return message.reply(' **only admins can use this command**⚠️');
    }
  }

  if (command.args && !args.length) {
    let reply = `** you didn't provide any arguments** ⚠️`;

    if (command.usage) {
      reply +=
        `\n**The proper usage would be:** ` +
        `\`${prefix}${command.name} ${command.usage}\``;
    }

    return message.reply(reply);
  }

  if (!cooldowns.has(commandName)) {
    cooldowns.set(commandName, new Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(commandName);
  const cooldownAmount = (command.cooldown || 2) * 1000;

  if (timestamps.has(author.id)) {
    let expirationTime = timestamps.get(author.id) + cooldownAmount;

    if (now < expirationTime) {
      let timeLeft = (expirationTime - now) / 1000;
      let reply =
        `** please wait ${timeLeft.toFixed(1)} more second(s)` +
        ` before reusing this command** ⏳`;

      return message.reply(reply);
    }
  }

  timestamps.set(author.id, now);
  setTimeout(() => timestamps.delete(author.id), cooldownAmount);

  try {
    command.execute(message, args, client, commandName);
  } catch (error) {
    console.error(error);
    message.reply(' **an unexpected error has occurred** ❌');
  }
});

client.login(process.env.BOT_API_TOKEN);
