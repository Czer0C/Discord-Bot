const { argsToString } = require('../utility/utility.js');
const { embed } = require('../utility/embed.js');

module.exports = {
	name: 'issue',
    description: 'File an issue in #server-issue.',
    args: true,
    usage: '<your suggestion/problem here>',
	async execute(message, args) {
        const query = argsToString(args).slice(0, -1);
        const detail = {
            content: query,
            icon: true,
            message: message,
            image: message.attachments.first()
        }
        const issueEmbed = embed(detail);
        const channel = message.guild.channels.cache.get('504496908346195999');
        channel.send(issueEmbed);
        message.delete();
	},
};