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
    if (!author) author = message.author.username;
    if (icon) icon = message.author.displayAvatarURL({dynamic: true});
    else icon = null;
    if (!footer) footer = `${message.createdAt.toLocaleDateString()} • ${message.createdAt.toLocaleTimeString()}`;

    const customEmbed = new Discord.MessageEmbed();
    customEmbed.setColor(color)
                .setAuthor(author, icon)
                .setTitle(title ? title : "")
                .setDescription(content ? content : message.content)
                .setFooter(footer);
    
    if (image) 
        customEmbed.setImage(image.proxyURL || image);        
    
    return customEmbed;

}

module.exports.embed = embed;