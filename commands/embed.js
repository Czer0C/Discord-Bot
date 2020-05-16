const utility = require('../utility/utility.js');
module.exports = {
	name: 'embed',
    description: 'Custom embed',
    usage: '<color> <author> <hasIcon?> <title> <content> <footer> <channel>',
    args: true,
    staffOnly: true,
	execute(message, args) {
        let restructure = "";
        
        for (let j = 0; j < args.length; j++)
            restructure += args[j] + " ";

        let realArgs = utility.processArguments(restructure);

        let hexPattern = "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$";

        let color = realArgs[0].match(hexPattern) ? realArgs[0] : "#7289DA",
            author = realArgs[1],
            icon = realArgs[2] === "yes" ? true : false,
            title = realArgs[3],
            content = realArgs[4],
            footer = realArgs[5],
            channelID = realArgs[6]
        
        const ce = utility.embed(color, author, icon, title, content, footer, message);
        
        if (channelID) {
            channel = message.guild.channels.cache.find(ch => ch.toString() === channelID);

            if (!channel) return message.reply(" **invalid channel input** :warning:");

            channel.send(ce);           
        }
        else {
            message.channel.send(ce)
        }   
        message.delete();    
	},
};