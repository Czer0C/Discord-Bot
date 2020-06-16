const { loggingChannel } = require('../../config.json');
const { embed } = require('../../utility/embed.js');

module.exports = {
	name: 'announce',
    description: 'Announce new chapter release.',
    args: true,
	guildOnly: true,
	modOnly: false,
    staffOnly: true,
    usage: '<chapter link> <reddit link>',
	execute(message, args) {			
		const logChannel = message.guild.channels.cache.get(loggingChannel);
        const announceChannel = message.guild.channels.cache.get('716872988171042877');
        console.log(args);
        let content = '';

		for (var i = 1; i < args.length; i++) {
            content += args[i] + ' ';
        }

        let chapterNo = '999';
            
        const announcement = `@everyone\n` + 
        `Kingdom chapter ${chapterNo}:\n\n` +
        `Read Online: ${args[0]}\n\n` +
        `Download: https://turnipfarmers.wordpress.com/\n\n` +
        `Reddit Discussion: ${args[1]}\n` +
        ``;

		const announceEmbed = embed({
			color: '#F4D03F',
			author: `${message.author.username} has just made an announcement 📢`,
			icon: message.author.displayAvatarURL({dynamic: true}),
			content: announcement,
			message: message
		})          
        
        announceChannel.send(announcement);
        
		logChannel.send(announceEmbed);
	},
};