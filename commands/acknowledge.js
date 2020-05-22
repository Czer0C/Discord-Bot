const { chatRole } = require('../config.json');

module.exports = {
	name: 'acknowledged',
    description: 'Unlock chat.',
	async execute(message, args) {
        if (message.channel.id === '713406898719817748') {
            message.member.roles.add(chatRole).then(target => {
                
            }).catch(error => {		
                console.log(error);
            });
        }
        message.delete();
	},
};