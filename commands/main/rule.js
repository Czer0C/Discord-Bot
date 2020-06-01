const {embed} = require('../../utility/embed.js');

module.exports = {
	name: 'rule',
	description: 'Display server rules.',
	execute(message, args) {
        const emote = ["<:b1:710674949349834762>", "<:d1:710674949484052530>"];
        let content = 
            `${emote[0]} Use common sense\n` + 
            `${emote[0]} Do not **spam**\n` + 
            `${emote[0]} **Respect** other members\n` + 
            `${emote[0]} Attempt to keep **sensitive** subjects off the server\n` + 
            `${emote[0]} No **NSFW** content\n` + 
            `${emote[0]} No **advertising**\n` + 
            `${emote[0]} No **alt** accounts\n` + 
            `${emote[0]} No inappropriate **names** or **avatars**\n` + 
            `${emote[0]} Don't link to manga **aggregator** websites\n` + 
            `${emote[0]} Keep **discussion** relevant\n` + 
            `${emote[0]} Put **spoilers** where they belong\n` + 
            `${emote[0]} Do not **backseat** mod\n` + 
            `${emote[0]} Abide by **staff** members' instructions\n`;
        
        let title = "📜 Server rules 📜";
        let hint = false;

        if (args[0]) {
            let keyword = args[0];

            if (keyword === "0" || keyword.startsWith("staff")) {
                title = `__**Abide by staff members' instructions**__\n`;
                content = 
                `${emote[1]} Rules are not exhaustive and actions judged detrimental lead to punitive measures as deemed necessary.\n` + 
                `${emote[1]} Do not start drama about being muted, banned or mistreated.\n` +
                `${emote[1]} If you feel like you have been mistreated, DM top level members with proof and context to see if it can be resolved.` +
                ``;
            } else if (keyword === "1" || keyword.startsWith("spam")) {
                title = ` __**Do not spam**__\n`;
                content = 
                `${emote[1]} Do not disrupt the chat with an immoderate amount of text, emoji, images, or bot commands as it is annoying for other users on the server.\n` +
                `${emote[1]} Do not overuse memes or topics of discussion. \n` +
                `${emote[1]} Excessive pinging is also not encouraged, try to keep it at a minimum level. \n` +
                `${emote[1]} Staff will have final say on spam.` +
                ``;
            } else if (keyword === "2" || keyword.startsWith("respect")) {
                title = `__**Respect other members**__\n`;
                content = 
                `${emote[1]} Refrain from upsetting other users by insult, slurs, name calling, denigration, threats, or any form of harassment.\n` +
                `${emote[1]} Do not start or feed public drama, solve any issues in private or DM a moderator.\n` +
                `${emote[1]} If someone is being rude to you or other members, report it to a staff member.` + 
                ``;
            } else if (keyword === "3" || keyword.startsWith("sensitive")) {
                title = `__**Attempt to keep sensitive subjects off the server**__\n`;
                content = 
                `${emote[1]} These include, but are not limited to anything discriminatory, illegal, political, religious, sexual, violent, or that may involve the grief of others.\n` + 
                `${emote[1]} Passing mentions might be tolerated, but tread carefully.\n` + 
                `${emote[1]} Discussions should be taken elsewhere.` +
                ``;
            } else if (keyword === "4" || keyword.startsWith("nsfw")) {
                title = `__**No NSFW content**__\n`;
                content = 
                `${emote[1]} No Porn, Gore, or anything you wouldn't show your employer. \n` +
                `${emote[1]} Remember, just because you find it SFW, does not mean it'll apply to other members.` + 
                ``; 
            } else if (keyword === "5" || keyword.startsWith("ad")) {
                title = `__**No advertising**__\n`;
                content = 
                `${emote[1]} No advertising stuff in general.\n` + 
                `${emote[1]} If you really want to, please message the server owner (@ Jason) to ask for permission.` + 
                ``;
            } else if (keyword === "6" || keyword.startsWith("alt")) {
                title = ` __**No alt accounts**__\n`;
                content = 
                `${emote[1]} Creating another account and using it to bypass punishment or in any way give the illusion that you are another person is against the rules.` + 
                ``;
            } else if (keyword === "7" || keyword.startsWith("avi") || keyword.startsWith("name") || keyword.startsWith("pfp") || keyword.startsWith("profile")) {
                title = `__**No inappropriate names or avatars**__\n`;
                content = 
                `${emote[1]} Please don't give yourself an inappropriate avatar/nickname.\n` +
                `${emote[1]} You may be asked to change it depending on how bad it is.` +
                ``;
            } else if (keyword === "8" || keyword.startsWith("aggregator")) {
                title = `__**Don't link to manga aggregator websites**__\n`;
                content = 
                `${emote[1]} All manga aggregation websites are banned except for MangaDex and Sense-Scans.\n` +
                `${emote[1]} When linking a page/chapter, grab the url from MangaDex or Sense-Scans reader.` + 
                ``;
            } else if (keyword === "9" || keyword.startsWith("discuss") || keyword.startsWith("channel") || keyword.startsWith("topic")) {
                title = `__**Keep discussion relevant**__\n`;
                content = 
                `${emote[1]} Please don't instigate unnecessary or unwanted conversations or discussions.\n` +
                `${emote[1]} Stay relatively on-topic!.\n` +
                `${emote[1]} The channel topic is located at the top of a text channel, please have a look at it before posting.` +
                ``;
            } else if (keyword === "10" || keyword.startsWith("spoil")) {
                title = `__**PUT SPOILERS WHERE THEY BELONG**__\n`;
                content = 
                `${emote[1]} There are two channels dedicated to spoilers discussions: <#400895139654008853> and <#400121599639945216>\n` +
                `${emote[1]} If you have theory/idea/opinion about history or next chapter spoilers, keep them in those 2 channels, not the non-spoilers ones.` +
                ``;
            } else if (keyword === "11" || keyword.startsWith("backseat")) {
                title = `__**Do not backseat mod**__\n`;
                content = 
                `${emote[1]} Backseat moderating is strictly not allowed.\n` + 
                `${emote[1]} Do not attempt to take matters into your own hands.\n` + 
                `${emote[1]} Contact the staff if any issues arise and they will see to the matter ASAP.` + 
                ``; 
            } else {
                hint = true;
            }           
        }
        else {
            hint = true;
        }

        const ruleEmbed = embed({
            title: title,
            content: content,
            footer: hint === true ? 'For detail type .rule <keyword>' : false,
            message: message
        })

		message.channel.send(ruleEmbed);
	},
};