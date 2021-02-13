const mangadex = require('../../utility/externalAPI/mangadex.js');
const Discord = require('discord.js');
const fetch = require("node-fetch");
const http = require('http');
const { getASOT } = require('../../utility/utility.js');
const fs = require('fs');
module.exports = {
    name: 'test',
    staffOnly: true,
    adminOnly: true,
    description: 'Get a chapter or page.',
	async execute(message, args) {
        var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        let result = [];       
    
        // for (let i = 4; i < 10; i++) {
        //     let link = `http://asotarchive.org/episode/a-state-of-trance-${i}/`;
        //     http.get(link, (res) => {
        //         res.setEncoding('utf8');
        //         res.on('data', body => {
        //             let t = body.toString();            
        //             t.replace(urlRegex, function(url) {
        //                 if (url.includes(".mp3"))
        //                     result.push(url)
        //             });  
                    
        //         });
        //         res.on('end', () => {
        //             if (i === 99) {
        //                 fs.writeFile('asotlinks.txt', result, function (err) {
        //                     if (err) throw err;
        //                     console.log("Done.");
                           
        //                 });
        //             }
                    
        //         })
        //     });
        // }

        
	},
};