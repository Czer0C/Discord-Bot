const axios = require('axios');

async function getChapter(chapterNo) {
    const mangaAPI = `https://api.mangadex.org/v2/manga/642/chapters`;
    
    const searchChapter = await axios.get(mangaAPI).catch((error) => {
        console.log(error);
        throw error;
    });
    const chapterList = searchChapter.data.data.chapters;
   
    let chapterID = null;
    for (let ch of chapterList) { 
        if (chapterNo === "8" || chapterNo >= 17) {            
            if (ch.chapter === chapterNo && ch.language === 'gb') {            
                chapterID = ch.id;
            }               
        } else  {
            if (ch.chapter === chapterNo && ch.groups[0] === 6423 && ch.language === "gb") {
                chapterID = ch.id;
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