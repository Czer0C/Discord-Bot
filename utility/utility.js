const Discord = require('discord.js');

checkMessageURL = (URL) => {
    let result = {
        server: '',
        channel: '',
        message: '',
        isValid: false
    }
    if (URL.startsWith("https://discordapp.com/channels/")) {
        let ids = URL.split("/");
        result.server = ids[4];
        result.channel = ids[5];
        result.message = ids[6];
        result.isValid = !isNaN(ids[4]) && !isNaN(ids[5]) && !isNaN(ids[6]);      
    }
    return result;  
}

embed = (color = "#7289DA", message, author, icon, title, content, by, timestamp) => {
    const embedQuote = new Discord.MessageEmbed()
        .setColor(color)
        .setAuthor(author ? author : message.author.username, icon ? icon : message.author.displayAvatarURL({dynamic: true}))
        .setTitle(title ? title : "")
        .setDescription(content ? content : message.content)
        .setFooter(`${by ? `Requested by ${by} - Quote from:` : ""} ${timestamp ? timestamp : message.createdAt.toLocaleString()}`)

    return embedQuote;
}


module.exports.checkMessageURL = checkMessageURL;
module.exports.embed = embed;