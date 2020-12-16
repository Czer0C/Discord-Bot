const http = require('http');
const fs = require('fs');
const puppeteer = require('puppeteer');
const linkList = require('../asset/linkList.json');
checkMessageURL = (URL) => {
    let result = {
        url: URL,
        server: '',
        channel: '',
        message: '',
        isValid: false
    }

    if (URL.startsWith("https://discordapp.com/channels/") || 
        URL.startsWith("https://discord.com/channels/")) {
        let ids = URL.split("/");
        result.server = ids[4];
        result.channel = ids[5];
        result.message = ids[6];
        result.isValid = !isNaN(ids[4]) && !isNaN(ids[5]) && !isNaN(ids[6]);
    }

    return result;
}

getAllFiles = (dirPath, arrayOfFiles) => {
    files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
        } else {
            arrayOfFiles.push(`./${dirPath}/${file}`);
        }
    });

    return arrayOfFiles;
}

processArguments = (args) => {

    let pattern = /[^\s"]+|"([^"]*)"/gi;
    let result = [];
    let match = null;
    do {
        match = pattern.exec(args);

        if (match) {
            //Index 1 in the array is the captured group if it exists
            //Index 0 is the matched text, which we use if no captured group exists
            result.push(match[1] ? match[1] : match[0]);
        }
    } while (match != null);
    return result;
}

argsToString = (args) => {
    let result = "";
    for (let i = 0; i < args.length; i++)
        result += args[i] + " ";
    return result;
}

getASOT = (link) => {
    var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    let result = [];

    http.get(link, (res) => {
        res.setEncoding('utf8');
        res.on('data', body => {
            let t = body.toString();
            t.replace(urlRegex, function (url) {
                if (url.includes(".mp3"))
                    result.push(url)
            });

        });
        res.on('end', () => {
            return result;
        })
    });
}


getPages = async (link) => {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    
    await page.goto('https://hako.re/forum/');
    await page.click('.p-navgroup-link.p-navgroup-link--textual.p-navgroup-link--logIn');
    await page.waitFor(5000);

    await page.screenshot({path: 'test.png'});

    await page.type('[name=login]', 'CzeroC');
    await page.type('[name=password]', 'helsangel123');

    await page.screenshot({path: 'test2.png'});

    await page.click('.button--primary.button.button--icon.button--icon--login');

    await page.screenshot({path: 'test3.png'});

    
    let t = linkList.slice(0, 10);
    
    for (let link of linkList) {
        await page.
        goto(link.link).
        then().
        catch(error => console.error());
    
        await page.waitFor(2000);

        await page.pdf({
            path: `./VN/${link.title}.pdf`,
            format: "A4",
            printBackground: true,
            margin: {
            left: "0px",
            top: "0px",
            right: "0px",
            bottom: "0px"
            }
        }).then().catch(error => console.error());
    }    
    console.log("done");
}


standardize = (string) => {
    return string.replace(/[\u2018\u2019]/g, "'") // smart single quotes
        .replace(/[\u201C\u201D]/g, '"'); // smart double quotes;
}

module.exports.standardize = standardize;
module.exports.checkMessageURL = checkMessageURL;
module.exports.processArguments = processArguments;
module.exports.argsToString = argsToString;
module.exports.getASOT = getASOT;
module.exports.getAllFiles = getAllFiles;
module.exports.getPages = getPages;