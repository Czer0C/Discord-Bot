const Discord = require('discord.js');

embed = (detail) => {
    let {
        color, 
        author, 
        icon, 
        title, 
        content, 
        footer, 
        message,
        image
    } = detail;
    
    const colorRegex = /^#(?:[0-9a-fA-F]{3}){1,2}$/;
    if (!color || !color.match(colorRegex)) color = "#7289DA";
    if (icon === true || icon === undefined) icon = message.author.displayAvatarURL({dynamic: true});
    else if (icon === false) icon = null;

    if (footer === true || footer === undefined) footer = `${message.createdAt.toLocaleDateString()} • ${message.createdAt.toLocaleTimeString()}`;
    else if (footer === false) footer = null;

    const customEmbed = new Discord.MessageEmbed();

    customEmbed.setColor(color)
                .setTitle(title ? title : "")
                .setDescription(content ? content : message.content)

    if (author) customEmbed.setAuthor(author, icon);
    
    if (image) customEmbed.setImage(image.proxyURL || image);       

    if (footer) customEmbed.setFooter(footer);
    
    return customEmbed;
}

module.exports.embed = embed;