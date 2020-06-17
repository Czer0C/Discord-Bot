const puppeteer = require('puppeteer');
const Parser = require('rss-parser');
const fs = require('fs');
const log = require('../asset/log.json');
const { rss } = require('../config.json');

scrapeSenseScan = async (client) => {
    let parser = new Parser();
    

    parser.parseURL(rss, (err, feed) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log(feed.items.length)

        for (let i of feed.items) {
            if (i.title.includes('Kingdom')) {
                client.channels.fetch('721933602635644998')
                .then(ch => {       
                    
                    ch.messages.fetch({limit: 1})
                               .then(messages => {     
                                    let latestLink = messages.values().next().value.content;
                                    if (latestLink !== i.link) {                            
                                        const announcement =
                                        `${i.title} @everyone\n\n` +
                                        `Read Online: ${i.link}\n\n` +
                                        `Download: https://turnipfarmers.wordpress.com/\n\n` +
                                        `Reddit Discussion: "pending"\n` +
                                        ``;
                                    // #announcement
                                    client.channels.fetch('716872988171042877')
                                                   .then(channel => channel.send(announcement));
                                    ch.send(i.link);                        
                        }
                    })
                    .catch(console.error);    
                })
                .catch(console.error);
                
                break;
            }
        }
    });
    
    
    
}

scraper = async (client, keyword, count) => {
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
            if (l.title.includes(keyword)) {
                let checkRelease = log.koreanScans.find(r => r.link === l.link);
                
                if (!checkRelease) {
                    let chapterNo = log.koreanScans.slice(-1)[0].chapterNo + 1;
                    let newEntry = {
                        chapterNo: chapterNo,
                        link: l.link
                    };
                    
                    await log.koreanScans.push(newEntry)
                    
                    let content = `<@&715446627309060127>\n${l.link}`;
                
                    await client.channels.fetch('479655044183097345')
                                .then(channel => channel.send(content));
                
                    fs.writeFileSync('asset/log.json', JSON.stringify(log), error => {
                        if (error) {
                            return console.log(error);
                        }       
                        console.log("Saved");
                    })
                }
                break;
            }
        }
        console.log(`Another one.`);
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


scraper3 = async() => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("http://sensescans.com/index.php?action=.xml;type=rss;board=45.0;sa=news").then(async () => {
        await page.waitFor(2000);
        await page.screenshot({path: 'test.png'});

        page.evaluate()
        // const SELECTOR = ".view-content.scroll-viewer img";
        // const links = 
        //     await page.$$eval(SELECTOR, nodes => 
        //         nodes.map(element => {
        //             return {
        //                 link: element.src,
        //             };
        //         })
        //     )
        
        await browser.close();
    }).catch(error => {
        console.log(error);
    });
}
module.exports.scraper = scraper;
module.exports.scraper2 = scraper2;
module.exports.scrapeSenseScan = scrapeSenseScan;