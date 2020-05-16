const utility = require('../utility/utility.js');

module.exports = {
	name: 'editmsg',
    description: 'Edit a bot message.',
    args: true,
    staffOnly: true,
    usage: '<message ID> <new content>',
	execute(message, args) {
        if (args.length > 1) {
            const messageURL = args[0];
            const parse = utility.checkMessageURL(messageURL)
            
            if (parse.isValid) {
                let newContent = "";

                for (var i = 1; i < args.length; i++) 
                    newContent += args[i] + " ";
                    
                const channel = message.guild.channels.cache.find(ch => ch.id === parse.channel)
                if (!channel) return message.reply(" **invalid message link** :warning:");
                
                channel.messages.fetch(parse.message).then(m => {
                    m.edit(newContent).then(() => {
                        return message.reply(" **the message has been successfully edited** 📝✅");
                    }).catch(e => {
                        console.log(e);
                        return message.reply(" **cannot edit a message of another user** :warning:");
                    })
                    
                }).catch(error => {
                    console.log(error);
                    return message.reply(" **invalid message link** :warning:");
                });
            
            }
        }
        else 
            return message.reply(` **wrong syntax** :warning:\nThe correct usage is: \`.editmsg ${this.usage}\``);        
	},
};