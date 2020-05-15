module.exports = {
	name: 'say',
    description: 'Let the bot speak in your stead.',
    args: true,
    staffOnly: true,
    usage: '<content here>',
	execute(message, args) {
        let content = ""

        for (var i = 0; i < args.length; i++) 
            content += args[i] + " ";
            
        message.channel.send(content);
        message.delete();		
	},
};