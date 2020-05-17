module.exports = {
	name: 'say',
    description: 'Let the bot speak in your stead.',
    args: true,
    staffOnly: true,
    usage: '<channel (optional)> <content here>',
	execute(message, args) {
        let channelID = args[0];
        let content = "";
        let i = 0;
        let notHere = false;

        channel = message.guild.channels.cache.find(ch => ch.toString() === channelID);

        if (channel)
            i = 1, notHere = true;
        else 
            channel = message.channel;

        while (i < args.length)
            content += args[i++] + " ";      
            
        channel.send(content).then(() => {
            if (notHere) message.channel.send(`**The message has been sent in** <#${channel.id}> ✅`);
            message.delete(); 
        }).catch(error => {
            console.log(error);
            message.channel.send("**Something unexpected happened, try again later :x:");
        });
	},
};