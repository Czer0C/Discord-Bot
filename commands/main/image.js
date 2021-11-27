// const imageList = require('../../asset/imageList.json');

const { findOne } = require("../../utility/supabase")

const { generalRole, staffRole } = require("../../config.json")

module.exports = {
  name: "image",
  description: "Return a pic.",
  cooldown: 60,
  async execute(message, args, client, commandName) {
    const { channel } = message

    const [item] = await findOne(commandName)


    //! Rank values:
    //! null : common usage
    //! 1: only staff can use
    //! 2: only admin can use
    if (item) {
      if (item?.rank) {
        const roleCache = message.member.roles.cache

        if (item.rank === 1 && !roleCache.has(staffRole)) {
          return message.reply("No weight!")
        }
      }

      channel.send(item.response || "Something went wrong ❌")
    } else {
      channel.send("This command does not exist ❌")
    }

    // channel.send({ embed: imageEmbed })

    // const image = imageList.find(
    //   (i) => i.name.toLocaleLowerCase() === commandName
    // )

    // if (image) {
    //   const imageEmbed = {
    //     image: {
    //       url: image.link,
    //     },
    //   }
    //   const roleCache = message.member.roles.cache

    //   if (image.rank === "1" && !roleCache.has(generalRole)) {
    //     return message.reply(" no weight!")
    //   } else if (image.rank === "2" && !roleCache.has(staffRole)) {
    //     return message.reply(" no weight again!")
    //   }

    //   message.channel.send({ embed: imageEmbed })
    // } else {
    //   message.channel.send(`**Invalid command's name or usage** :x:`)
    // }
  },
}
