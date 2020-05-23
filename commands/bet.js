const { staffRole } = require('../config.json');
const { checkMessageURL } = require('../utility/utility.js');
const { embed } = require('../utility/embed.js');
const editmsg = require('./admin/editmsg.js');
const betTracking = require('../asset/betTracking.json');
const fs = require('fs');

module.exports = {
	name: 'bet',
    description: 'Make and update bet.',
    args: true,
    usage: '<add | close | stat> <message URL> <winners list>',
	async execute(message, args) {
        const directive = args[0];
        const directives = [ 'add', 'close', 'stat'];
        if (!directives.find(i => i === directive))
            return message.channel.send(`**Please pick one of the 3 options in \`${directives}\`** :warning:`)

        if (directive !== 'stat') { 
            if (!message.member.roles.cache.has(staffRole))
			    return message.channel.send(`**You don't have permission to use this feature** :x: `); 
            if (!args[1]) return message.channel.send("**Please provide a message link** :warning:");

            const messageLink = args[1];
            const parseMessageLink = checkMessageURL(messageLink);

            if (!parseMessageLink.isValid) return message.channel.send("**Invalid message link** :x:");
            
            if (directive === 'add') addBet(message, parseMessageLink);
            else closeBet(message, args);

        }
        else {
            const query = args[1];
            showStat(message, query);
        }
        
	},
};

const addBet = async (message, messageURL) => {
    const channel = message.guild.channels.cache.find(ch => ch.id === messageURL.channel)
    if (channel) {
        const t = await channel.messages.fetch(messageURL.message).then(m => {
            let content = `**[Jump to message](${messageURL.url})** in <#${m.channel.id}>\n${m.content}`;
            let footer = `Added by ${message.author.username} - ${m.createdAt.toLocaleDateString()} • ${m.createdAt.toLocaleTimeString()}`;
            let attachment = m.attachments.first();

            const addBetEmbed = embed({
                author: `${message.author.username} started a bet`,
                content: content,
                icon: true,
                footer: footer,
                message: m,
                image: attachment ? attachment.proxyURL : null
            });

            message.channel.send(addBetEmbed);
        }).catch(error => {
            console.log(error);
        });
    } 
}

const closeBet = async (message, args) => {
    if (!message.mentions.users.size) 
            return message.channel.send('**Please provide the winners\' ids** :warning:');

    let betID = args[1];
    let winnerList = message.mentions.members;
    let updateMsg = "**Winners:** ";
    
    if (betTracking.closedBets.find(item => item === args[1]))
        return message.channel.send("**This bet has already been concluded** :x:")

    betTracking.closedBets.push(args[1]);

    for (let w of winnerList) {
        
        let betEntry = betTracking.winnerList.find(item => {
            return item.id === w[0]
        });

        if (betEntry) {
            betEntry.winCount += 1;
            betEntry.betList.push(betID);
            betTracking.winnerList[w[0]] = betEntry;
        }
        else {
            betEntry = {
                id: w[0],
                winCount: 1,
                betList: [ betID ]
            }
            betTracking.winnerList.push(betEntry)            
        }
        updateMsg += `<@${w[0]}> `
    }

    fs.writeFile('asset/betTracking.json', JSON.stringify(betTracking), e => {
        if (e) throw e;
    })
    
    let editMSGArgs = [
        betID,
        updateMsg
    ]       

    editmsg.execute(message, editMSGArgs); 
}

const showStat = async (message, query) => {
    if (query === "top") {
        const topBettors = betTracking.winnerList.sort((a, b) => parseInt(b.winCount) - parseInt(a.winCount)).slice(0, 10);
        let leaderboard = "```ml\n 🏆 Top 10 Bet Ranking 🏆\n\n";    

        for (let i = 0; i < topBettors.length; i++) {
            await message.guild.members.fetch(topBettors[i].id).then(member => {
                leaderboard += `[${i + 1}] "${member.user.username}"\n\t Bet Won: ${topBettors[i].winCount}\n\n`;
            }).catch(error => {
                if (error) throw error;
                return message.channel.send("**An unexpected error has occurred, try again later** :x:");
            })            
        }           
        leaderboard += "```";        
        message.channel.send(leaderboard);
    }
    else {
        let userID = null;
        if (message.mentions.users.size) userID = message.mentions.members.first().id;
        else userID = message.author.id;
        
        const userStat = betTracking.winnerList.find(entry => entry.id === userID);
        
        if (!userStat)
            return message.channel.send("**No bet record found** :x:");
        else {
            await message.guild.members.fetch(userID).then(member => {
                const uname = member.user.username;
                let author = `${uname}`;
                let title = `**Total bet won: ${userStat.winCount}\n**`;
                let content = "**History:**\n";
                for (let i = 0; i < userStat.betList.length; i++)
                    content += `[Jump to bet no. ${i + 1}](${userStat.betList[i]})` + "\n";
                const statEmbed = embed({
                    author: author,
                    icon: member.user.displayAvatarURL({dynamic: true}),
                    title: title,
                    content: content,
                    message: message
                })
                message.channel.send(statEmbed);
            })
        }
    }
}