const { checkMessageURL, embed } = require('./utility.js');

quote = async (message) => {
    let quoteMessageURL = checkMessageURL(message.content);
    let response = {
        isMessageURL: false,
        embedQuote: null
    };

    if (quoteMessageURL.isValid) {
        response.isMessageURL = true;
        const channel = message.guild.channels.cache.find(ch => ch.id === quoteMessageURL.channel)

        if (channel) {
            const t = await channel.messages.fetch(quoteMessageURL.message).then(m => {
                let content = `**[Jump to message](${message.content})** in <#${m.channel.id}>\n${m.content}`;
                let footer = `Quoted by ${message.author.username} - ${m.createdAt.toLocaleString()}`;
                response.embedQuote = embed(undefined, undefined, undefined, undefined, content, footer, m);
            }).catch(error => {
                console.log(error);
            });
        } 
    }

    return response;
}

module.exports.quote = quote;