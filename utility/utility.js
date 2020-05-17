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

embed = (color = "#7289DA", author, icon = true, title, content, footer, message) => {
    if (!author) author = message.author.username;
    if (icon) icon = message.author.displayAvatarURL({dynamic: true});
    else icon = null;
    if (!footer) footer = message.createdAt.toLocaleString();
    const embedQuote = new Discord.MessageEmbed()
        .setColor(color)
        .setAuthor(author, icon)
        .setTitle(title ? title : "")
        .setDescription(content ? content : message.content)
        .setFooter(footer);

    return embedQuote;
}

processArguments = (args) => {
    let pattern = /[^\s"]+|"([^"]*)"/gi;
    let result = [];
    let match = null;
    do {
        match = pattern.exec(args);
        if (match) {
            //Index 1 in the array is the captured group if it exists
            //Index 0 is the matched text, which we use if no captured group exists
            result.push(match[1] ? match[1] : match[0]);
        }
    } while (match != null);
    return result;
}

argsToString = (args) => {
    let result = "";
    for (let i = 0; i < args.length; i++)
        result += args[i] + " ";
    return result;
}

module.exports.checkMessageURL = checkMessageURL;
module.exports.embed = embed;
module.exports.processArguments = processArguments;
module.exports.argsToString = argsToString;