const { argsToString } = require('../../utility/utility.js');

module.exports = {
	name: 'botstatus',
    description: 'Set new bot status.',
    adminOnly: true,
    staffOnly: true,
    usage: "<new status>",
	async execute(message, args, client) {  
        let status = args ? argsToString(args) : null;
        client.user.setActivity(status).then(() => {
            message.channel.send("**Status set successfully** ✅");
        }).catch(error => {
            console.log(error);
            message.channel.send("**Something unexpected happened, try again later** ❌");
        });
    }   
}