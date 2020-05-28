const puppeteer = require('puppeteer');

scraper = async (client, keyword, count) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://manamoa.net/');
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
            let content = `<@&715446627309060127>\n${l.link}`;
            
            client.channels.fetch('479655044183097345')
                           .then(channel => channel.send(content));
        
            break;
        }
    }
    console.log(count++);
    await browser.close();
}

module.exports.scraper = scraper;