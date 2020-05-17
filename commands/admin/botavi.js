module.exports = {
	name: 'botavi',
    description: 'Set new bot avatar.',
    args: true,
    adminOnly: true,
    staffOnly: true,
    usage: "<avatar URL>",
	async execute(message, args, client) {  
        client.user.setAvatar(args[0]).then(() => {
            message.channel.send("**Avatar set successfully** ✅");
        }).catch(error => {
            console.log(error);
            message.channel.send("**Something unexpected happened, try again later** ❌")
        });
    }   
}