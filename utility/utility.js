checkMessageURL = (URL) => {
    let result = {
        server: '',
        channel: '',
        message: '',
        isValid: false
    }

    if (URL.startsWith("https://discordapp.com/channels/")) {
        let ids = URL.split("/");
        result.server = ids[4];
        result.channel = ids[5];
        result.message = ids[6];
        result.isValid = !isNaN(ids[4]) || !isNaN(ids[5]) || !isNaN(ids[6]);      
    }
    return result;  
}

module.exports.checkMessageURL = checkMessageURL;