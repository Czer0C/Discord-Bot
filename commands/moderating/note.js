const { embed } = require('../../utility/embed.js');
const { argsToString } = require('../../utility/utility.js');
const { muteRole, staffRole, loggingChannel } = require('../../config.json');
const fetch = require('node-fetch');

const { firebaseAdmin } = require('../../asset/firebaseAPI');

var admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert(firebaseAdmin),
  databaseURL: "https://test-26288.firebaseio.com"
});

const db = admin.database();

const emojiNext = '▶️'; // unicode emoji are identified by the emoji itself
const emojiPrevious = '◀️';
const reactionArrow = [emojiPrevious, emojiNext];

const time = 60000; // time limit: 1 min

const pagination = 7;

const filter = (reaction, user) => {
    return (!user.bot) && (reactionArrow.includes(reaction.emoji.name));
};

module.exports = {
	name: 'note',
	description: 'Marking a violator.',
	guildOnly: true,
	modOnly: false,
    staffOnly: true,
    usage: '<user ID> <charges> OR note view all OR note view <userID>',
	async execute(message, args) {       
        
        if (args.length < 2) {
            let m = `**\`note view all\` to see full list of violations**\n` +
            `**\`note view <userID>\` to see individual violation**\n` + 
            `**\`note <userID> <charges>\` to add or edit an entry**\n` + 
            `**\`note <remove> <userID>\` to remove an entry**`
        
            return message.channel.send(m);
            
        } else if (args[0] === 'view') {
            db.ref('/violators').once("value", snapshot => {
                let violators = snapshot.val();
                
                if (args[1] === 'all') {                        
                    let vArray = toArray(violators);
                    let curr = 0;                 

                    message.channel.send(getList(vArray, curr)).then(async msg => {
                         msg.react(emojiPrevious)
                            .then(msgReaction => msgReaction.message.react(emojiNext))
                            .then(msgReaction => {
                                let i = 0;
                                const collector = msg.createReactionCollector(filter, { time });
                                collector.on('collect', r => {
                                    if ((r.emoji.name === emojiPrevious)) {   
                                        if (curr - pagination < 0) {                                            
                                        } else {
                                            curr -= pagination;
                                        }
                                        msg.edit(getList(vArray, curr));
                                      } else if ((r.emoji.name === emojiNext)) {  
                                        if (curr + pagination > vArray.length - 1) {
                                            
                                        } else {
                                            curr += pagination;
                                        }         
                                        msg.edit(getList(vArray, curr));
                                      }
                                });
                            });              
                        
                        
                    });            

                    return;
                }
                else {
                    let violator = violators[args[1]]
                    let msg = ``
                    if (violator) {
                        msg = `<@${args[1]}>: ${violator.charge}\n`
                    }
                    else {
                        msg = `**<@${args[1]}> has not been marked as violator yet❗**`;
                    }
                    return message.channel.send(msg)
                }
                
            });
            
           
        } else if (args[0] === 'remove') {
            let violatorID = args[1];

            let guild = message.guild;

            const violator = await guild.members.fetch(violatorID);

            if (violator) {
                const res = await db.ref('/violators/' + violatorID).remove();
                return message.channel.send(
                    `**${violator.nickname}'s entry has been removed**✅`
                );
            }
            else {
                return message.channel.send(`**${violatorID} is not a valid user ID in this server ❗**`)
            }
        } else {
            let violatorID = args[0]
            let charge = args.slice(1).reduce((line, arg) => line + ' ' + arg)
            
            let guild = message.guild;

            const violator = await guild.members.fetch(violatorID);

            if (violator) {
                db.ref('/violators/'+ violatorID).set({ charge: charge }, (error) => {
                    if (error) {
                        return message.channel.send("Something bad happened, try again later.");
                    }
                    else {
                        return message.channel.send(`**${violator.nickname}\'s entry has been submitted** ✅`);
                    }
                })
            }
            else {
                return message.channel.send(`**${violatorID} is not a valid user ID in this server❗**`);
            }
            
        }

	},
};

const toArray = (list) => {
    let result = [];
    for (let i in list) {
        temp = `<@${i}>: ${list[i].charge}\n`;
        result.push(temp);
    }
    return result;
}

const getList = (vArray, curr) => {  
    let start = curr;
    let end = start + pagination;
    let temp = vArray;
    temp = temp.slice(start, end);
    
    let list = `⚠️**List of past violators**⚠️\n══════════════════\n`;

    for (v of temp) {
        list += v;
    }

    list += `══════════════════
    **Page ${curr / pagination + 1}/${Math.round(vArray.length / pagination)}**`;

    return list;
}