const axios = require('axios');

async function getChapter(chapterNo) {
    const mangaAPI = `https://mangadex.org/api/manga/642`;
    
    const searchChapter = await axios.get(mangaAPI).catch((error) => {
        console.log(error);
        throw error;
    });

    const chapterList = searchChapter.data.chapter;

    let chapterID = null;
    for (let key of Object.keys(chapterList)) {
        let ch = chapterList[key];
        if (chapterNo === "8" || chapterNo >= 17) {
            if (ch.chapter === chapterNo && ch.lang_code === "gb") {
                chapterID = key;
                break;
            } 
        }
        else {
            if (ch.chapter === chapterNo && ch.group_name === "V2k" && ch.lang_code === "gb") {
                chapterID = key;
                break;
            }                
        }             
    }
    
    return chapterID;
}    

async function getPages(chapterID) {
    const chapterAPI = `https://mangadex.org/api/chapter/${chapterID}`;

    const searchPages = await axios.get(chapterAPI).catch((error) => {
        console.log(error);
        throw error;
    });

    return searchPages.data;
}

module.exports.getChapter = getChapter;
module.exports.getPages = getPages;