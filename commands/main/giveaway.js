const { embed } = require('../../utility/embed.js');
const Discord = require('discord.js');
const { processArguments, standardize, checkMessageURL } = require('../../utility/utility');

module.exports = {
	name: 'giveaway',
    description: 'Host a giveaway event.',
    usage: '<add> <content> <no of winner> <duration>\n<finish> <message URL> <no of winners>',
    aliases: ['ga'],
    args: true,
	async execute(message, args) {
        const directives = [ 'add', 'finish' ];
        const directive = args.shift();

        if (!directives.find(i => i === directive))
            return message.channel.send(`**Please pick one of the 2 options in \`${directives}\`** :warning:`)
        else if (directive === 'add') {
            addGiveaway(message, args);            
        }
        else {
            finishGiveaway(message, args);
        }
        
	},
};

const addGiveaway = (message, args) => {
    let restructure = "";

    for (let j = 0; j < args.length; j++)
        restructure += args[j] + " ";

    const t = processArguments(standardize(restructure));
    //console.log(t);
    if (t.length !== 3) {
        return message.channel.send(`**Missing arguments :x:\nThe correct usage is: \`${this.usage}\`**`);
    }

    const content = 
        `${t[0]}\n**${t[1]}** winner(s) **|** Duration: **${t[2]}**\n__**React with 🎉 to join**__`;

    const giveawayEmbed = embed({
        color: '#F4D03F',
        author: "false",
        icon: false,
        title: `🎉 **GIVE AWAY** 🎉`,
        content: content,
        message: message,
        footer: `Requirement: 3000-man commander rank and above`
    });
    
    //message.delete();
    message.channel.send(giveawayEmbed);
}

const finishGiveaway = async (message, args) => {
    if (args.length !== 2) {
        return message.channel.send(`**Missing arguments, please provide both message URL and the number of winners** :warning:`);
    }

    let totalWinner = parseInt(args[1]);

    if (isNaN(totalWinner) || totalWinner < 1) {
        return message.channel.send(`**Invalid number of users, make sure to input a number** :warning:`);
    }

    const checkURL = checkMessageURL(args[0]);
    if (checkURL.isValid) {
        const channel = message.guild.channels.cache.find(ch => ch.id === checkURL.channel);

        if (channel) {
            await channel.messages.fetch(checkURL.message)
                 .then(async m => {
                        const reaction = 
                                m.reactions.cache.find(r => r._emoji.name === '🎉');
                        const users = await reaction.users.fetch();

                        const list = users.map(u => u.id.toString());

                        let validParticipants = await filterParticipants(message, list, totalWinner);
                        if (validParticipants.length < totalWinner) {
                            return message.channel.send("**Not enough number of participants, pick a smaller winner input!** ❌");
                        }  
                        
                        console.log(validParticipants);;
                        let winners = ``;

                        for (let i = 0; i < totalWinner; i++) { 
                            let rand = ~~(validParticipants.length * Math.random());

                            winners += `<@${validParticipants.splice(rand, 1)}>`
                        }

                        console.log(winners);

                        const customEmbed = new Discord.MessageEmbed();

                        customEmbed.setTitle(`**The winners**`)
                                    .setDescription(winners);

                        return message.channel.send(customEmbed);

                    }                                
                )
        }
    }
    else {
        return message.channel.send("**Invalid message link** ❌")
    }
}

Array.prototype.random = function () {
    return this[Math.floor(Math.random() * this.length)];
};

const filterParticipants = async (message, list, totalWinner) => {
    let validParticipants = [];
    for await (let i of list) {
        await message.guild.members.fetch(i)
        .then(u => {
            let roles = u._roles;

            // Check 2k commander rank  
            if (roles.indexOf('400134600397160458') !== -1) {
                validParticipants.push(i);
            }
        })
        .catch(error => {
            if (error.code === 10007) {

            }
            else {
                console.log(error);
            }
        });
        
    }
    return validParticipants;
}
  