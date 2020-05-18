const axios = require('axios');

async function searchWikia(query) {
    const url = `https://kingdom.fandom.com/api/v1/Search/List?query=${encodeURIComponent(query)}`;
    const result = await axios.get(url).catch((error) => {
        console.log(error);
        throw error;
    });
    return result.data.items;
}    

module.exports.searchWikia = searchWikia;