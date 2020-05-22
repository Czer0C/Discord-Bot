const utility = require('../../utility/utility.js');
const { embed } = require('../../utility/embed.js');

module.exports = {
	name: 'embed',
    description: 'Custom embed',
    usage: '<color> <author> <hasIcon: yes|no> <title> <content> <footer> <channel | optional>',
    args: true,
    staffOnly: true,
	execute(message, args) {
        let restructure = "";

        for (let j = 0; j < args.length; j++)
            restructure += args[j] + " ";

        let realArgs = utility.processArguments(restructure);
        
        if (realArgs.length < 6) return message.channel.send(`**Missing arguments :x:\nThe correct usage is: \`${this.usage}\`**`);

        let hexPattern = "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$";

        const detail = {
            color: realArgs[0].match(hexPattern) ? realArgs[0] : "#7289DA",
            author: realArgs[1] === "default" ? message.author.username : realArgs[1],
            icon: realArgs[2] === "yes" ? true : false,
            title: realArgs[3],
            content: realArgs[4],
            footer: realArgs[5] === "default" ? `${message.createdAt.toLocaleDateString()} • ${message.createdAt.toLocaleTimeString()}` : realArgs[5],
            message: message,
            channelID: realArgs[6]
        } 
        
        const ce = embed(detail);
        
        if (detail.channelID) {
            channel = message.guild.channels.cache.find(ch => ch.toString() === detail.channelID);

            if (!channel) return message.reply(" **invalid channel input** :x:");

            channel.send(ce);           
        }
        else {
            message.channel.send(ce)
        }   
        message.delete();    
	},
};