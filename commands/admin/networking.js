const axios = require("axios");
const cheerio = require("cheerio");
const {
  argsToString,
  processArguments,
  standardize,
} = require("../../utility/utility.js");

const Discord = require("discord.js");

module.exports = {
  name: "networking",
  description: "Add a new partner",
  adminOnly: true,
  staffOnly: true,
  usage:
    "`server-name` `representative` `discord-url` `reddit-url` `icon` `banner` `description`",
  async execute(message, args, client) {
    const { channel } = message;

    const linkRex = /\<|\>/g;

    const [server, rep, discord, reddit, icon, banner, ...rest] = args;

    //! Handle validation

    try {
      const description = rest.join(" ").replace(/^"(.*)"$/, "$1");

      console.log(description);
      const exampleEmbed = new Discord.MessageEmbed()
        .setColor("#0099ff")
        .setTitle(server)
        .setURL(discord.replace(linkRex, ""))
        .setDescription(description)
        .setThumbnail(icon.replace(linkRex, ""))
        .addFields(
          { name: "Representative:", value: `<@${rep}>`, inline: true },
          {
            name: "Links",
            value: `[Discord](${discord.replace(
              linkRex,
              ""
            )}) - [Reddit](${reddit.replace(linkRex, "")})`,
            inline: true,
          }
        )
        .setImage(banner.replace(linkRex, ""));
      channel.send(exampleEmbed);
    } catch (error) {
      console.error(error);
      channel.send("An error has occurred ❌");
    }
  },
};
