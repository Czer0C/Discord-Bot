const { chatRole } = require('../config.json');
const welcomeChannel = '479655044183097345';

module.exports = {
	name: 'acknowledged',
    description: 'Unlock chat.',
	async execute(message, args) {
        if (message.channel.id === '713406898719817748') {
            message.member.roles.add(chatRole).then(target => {
                let channel = message.guild.channels.cache.get(welcomeChannel);
                // if (channel) {
                //     channel.send(`Welcome to the server ${message.author}`);
                // } else {

                // }
            }).catch(error => {		
                console.log(error);
            });
        }

        message.delete();
	},
};