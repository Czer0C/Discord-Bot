const { argsToString } = require('../../utility/utility.js');
const { embed } = require('../../utility/embed.js');

module.exports = {
	name: 'issue',
    description: 'File an issue in #server-issue.',
    args: true,
    usage: '<your suggestion/problem here>',
	async execute(message, args) {
        const content = args.reduce((line, word) => line + ' ' + word);
        const detail = {
            author: message.author.username,
            content: content,
            icon: true,
            message: message,
            image: message.attachments.first(),
            footer: false
        }
        const issueEmbed = embed(detail);
        const channel = message.guild.channels.cache.get('427652466880938004');
        channel.send(issueEmbed);
        message.delete();
	},
};