const { argsToString } = require('../../utility/utility.js');

module.exports = {
	name: 'botname',
    description: 'Set new bot name.',
    args: true,
    staffOnly: true,
    adminOnly: true,
    usage: "<new bot name>",
	async execute(message, args, client) {  
        const newName = argsToString(args);
        
        client.user.setUsername(newName).then(() => {
            message.channel.send("**New username set successfully** ✅");
        }).catch(error => {
            console.log(error);
            message.channel.send("**Something unexpected happened, try again later** ❌")
        });
    }   
}