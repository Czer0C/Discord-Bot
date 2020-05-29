const puppeteer = require('puppeteer');

scraper = async (client, count) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://manamoa.net/").then(async () => {
        const SELECTOR = ".post-subject";
        const links = 
            await page.$$eval(SELECTOR, nodes => 
                nodes.map(element => {
                    return {
                        link: element.querySelector("a").href,
                        title: element.querySelector("a").innerText
                    };
                })
            )
        for (let l of links) {
            if (l.title.includes(keyword) || l.title.includes('act-age')) {
                let content = `<@&715446627309060127>\n${l.link}`;
                
                client.channels.fetch('479655044183097345')
                            .then(channel => channel.send(content));
            
                break;
            }
        }
        console.log(count++);
        await browser.close();
    }).catch(error => {
        console.log(error);
    });
    
    
}

scraper2 = async (client, site, keyword, count) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://manamoa.net/bbs/board.php?bo_table=manga&wr_id=3066332").then(async () => {
        await page.waitFor(20000);

        const SELECTOR = ".view-content.scroll-viewer img";
        const links = 
            await page.$$eval(SELECTOR, nodes => 
                nodes.map(element => {
                    return {
                        link: element.src,
                    };
                })
            )
        
        console.log(links);
        console.log(count++);
        await browser.close();
    }).catch(error => {
        console.log(error);
    });
}

module.exports.scraper = scraper;
module.exports.scraper2 = scraper2;