const Discord = require('discord.js');
const utility = require('../utility/utility.js');

module.exports = {
	name: 'poll',
    description: 'Make a poll.',
    args: true,
    usage: "Poll <Topic:Text - Description of the poll> <Option1:Text> <Option2:Text> [Option3:Text] [Option4:Text] [Option5:Text] [Option6:Text] [Option7:Text] [Option8:Text] [Option9:Text] [Option10:Text]",
	async execute(message, args) {  
        if (args.length < 3) 
            return message.reply(' **insufficient arugments for this command** :warning:\n\n**Command usage:**\n' + this.usage);

        let restructure = "";
        let detail = "";
        const options = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣','🔟'];

        for (let j = 0; j < args.length; j++)
            restructure += args[j] + " ";

        realArgs = utility.processArguments(restructure);

        for (let k = 1; k < realArgs.length; k++) 
            detail += `${options[k - 1]} : ${realArgs[k]}\n`;

        const exampleEmbed = new Discord.MessageEmbed()
			.setColor('#F4D03F')
            .setAuthor(`${message.author.username} started a poll`, message.author.displayAvatarURL({dynamic: true}))
            .setTitle(`**${realArgs[0]}**\n\n`)
			.setDescription(detail)
            .setTimestamp();      
            
        message.delete();
        message.channel.send(exampleEmbed).then(async m => {
            for (let n = 0; n < realArgs.length - 1; n++)
                await m.react(options[n]);
            
        });
        
	},
};