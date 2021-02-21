const http = require('http');
const fs = require('fs');
const htmlparser = require('htmlparser2');

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

standardize = (string) => {
    return string.replace(/[\u2018\u2019]/g, "'") // smart single quotes
        .replace(/[\u201C\u201D]/g, '"'); // smart double quotes;
}

escapeFormatting = (text = '', isMarkdown = false, keepLinks = false) => {
	if ( !isMarkdown ) text = text.replace( /[()\\]/g, '\\$&' );
	if ( !keepLinks ) text = text.replace( /\/\//g, '\\$&' );
	return text.replace( /[`_*~:<>{}@|]/g, '\\$&' );
};
htmlToDiscord = (html, pagelink = '', ...escapeArgs) => {
	var text = '';
	var code = false;
	var href = '';
	var ignoredTag = '';
	var listlevel = -1;
	var parser = new htmlparser.Parser( {
		onopentag: (tagname, attribs) => {
			if ( ignoredTag || code ) return;
			if ( tagname === 'sup' && attribs.class === 'reference' ) ignoredTag = 'sup';
			if ( tagname === 'span' && attribs.class === 'smwttcontent' ) ignoredTag = 'span';
			if ( tagname === 'code' ) {
				code = true;
				text += '`';
			}
			if ( tagname === 'pre' ) {
				code = true;
				text += '```\n';
			}
			if ( tagname === 'b' ) text += '**';
			if ( tagname === 'i' ) text += '*';
			if ( tagname === 's' ) text += '~~';
			if ( tagname === 'u' ) text += '__';
			if ( tagname === 'br' ) {
				text += '\n';
				if ( listlevel > -1 ) text += '\u200b '.repeat(4 * listlevel + 3);
			}
			if ( tagname === 'hr' ) {
				text = text.replace( / +$/, '' );
				if ( !text.endsWith( '\n' ) ) text += '\n';
				text += '─'.repeat(10) + '\n';
			}
			if ( tagname === 'p' && !text.endsWith( '\n' ) ) text += '\n';
			if ( tagname === 'ul' ) listlevel++;
			if ( tagname === 'li' ) {
				text = text.replace( / +$/, '' );
				if ( !text.endsWith( '\n' ) ) text += '\n';
				if ( attribs.class !== 'mw-empty-elt' ) {
					if ( listlevel > -1 ) text += '\u200b '.repeat(4 * listlevel);
					text += '• ';
				}
			}
			if ( tagname === 'dl' ) listlevel++;
			if ( tagname === 'dt' ) {
				text = text.replace( / +$/, '' );
				if ( !text.endsWith( '\n' ) ) text += '\n';
				if ( attribs.class !== 'mw-empty-elt' ) {
					if ( listlevel > -1 ) text += '\u200b '.repeat(4 * listlevel);
					text += '**';
				}
			}
			if ( tagname === 'dd' ) {
				text = text.replace( / +$/, '' );
				if ( !text.endsWith( '\n' ) ) text += '\n';
				if ( listlevel > -1 && attribs.class !== 'mw-empty-elt' ) text += '\u200b '.repeat(4 * (listlevel + 1));
			}
			if ( tagname === 'img' ) {
				if ( attribs.alt && attribs.src ) {
					let showAlt = true;
					if ( attribs['data-image-name'] === attribs.alt ) showAlt = false;
					else {
						let regex = new RegExp( '/([\\da-f])/\\1[\\da-f]/' + attribs.alt.replace( / /g, '_' ).replace( /\W/g, '\\$&' ) + '(?:/|\\?|$)' );
						if ( attribs.src.startsWith( 'data:' ) && attribs['data-src'] ) attribs.src = attribs['data-src'];
						if ( regex.test(attribs.src.replace( /(?:%[\dA-F]{2})+/g, partialURIdecode )) ) showAlt = false;
					}
					if ( showAlt ) {
						if ( href && !code ) attribs.alt = attribs.alt.replace( /[\[\]]/g, '\\$&' );
						if ( code ) text += attribs.alt.replace( /`/g, 'ˋ' );
						else text += escapeFormatting(attribs.alt, ...escapeArgs);
					}
				}
			}
			if ( tagname === 'h1' ) {
				text = text.replace( / +$/, '' );
				if ( !text.endsWith( '\n' ) ) text += '\n';
				text += '***__';
			}
			if ( tagname === 'h2' ) {
				text = text.replace( / +$/, '' );
				if ( !text.endsWith( '\n' ) ) text += '\n';
				text += '**__';
			}
			if ( tagname === 'h3' ) {
				text = text.replace( / +$/, '' );
				if ( !text.endsWith( '\n' ) ) text += '\n';
				text += '**';
			}
			if ( tagname === 'h4' ) {
				text = text.replace( / +$/, '' );
				if ( !text.endsWith( '\n' ) ) text += '\n';
				text += '__';
			}
			if ( tagname === 'h5' ) {
				text = text.replace( / +$/, '' );
				if ( !text.endsWith( '\n' ) ) text += '\n';
				text += '*';
			}
			if ( tagname === 'h6' ) {
				text = text.replace( / +$/, '' );
				if ( !text.endsWith( '\n' ) ) text += '\n';
				text += '';
			}
			if ( !pagelink ) return;
			if ( tagname === 'a' && attribs.href && attribs.class !== 'new' && /^(?:(?:https?:)?\/\/|\/|#)/.test(attribs.href) ) {
				href = new URL(attribs.href, pagelink).href;
				if ( text.endsWith( '](<' + href.replace( /[()]/g, '\\$&' ) + '>)' ) ) {
					text = text.substring(0, text.length - ( href.replace( /[()]/g, '\\$&' ).length + 5 ));
				}
				else text += '[';
			}
		},
		ontext: (htmltext) => {
			if ( !ignoredTag ) {
				if ( href && !code ) htmltext = htmltext.replace( /[\[\]]/g, '\\$&' );
				if ( code ) text += htmltext.replace( /`/g, 'ˋ' );
				else text += escapeFormatting(htmltext, ...escapeArgs);
			}
		},
		onclosetag: (tagname) => {
			if ( tagname === ignoredTag ) {
				ignoredTag = '';
				return;
			}
			if ( code ) {
				if ( tagname === 'code' ) {
					code = false;
					text += '`';
				}
				if ( tagname === 'pre' ) {
					code = false;
					text += '\n```';
				}
				return;
			}
			if ( tagname === 'b' ) text += '**';
			if ( tagname === 'i' ) text += '*';
			if ( tagname === 's' ) text += '~~';
			if ( tagname === 'u' ) text += '__';
			if ( tagname === 'ul' ) listlevel--;
			if ( tagname === 'dl' ) listlevel--;
			if ( tagname === 'dt' ) text += '**';
			if ( tagname === 'h1' ) text += '__***';
			if ( tagname === 'h2' ) text += '__**';
			if ( tagname === 'h3' ) text += '**';
			if ( tagname === 'h4' ) text += '__';
			if ( tagname === 'h5' ) text += '*';
			if ( tagname === 'h6' ) text += '';
			if ( !pagelink ) return;
			if ( tagname === 'a' && href ) {
				if ( text.endsWith( '[' ) ) text = text.substring(0, text.length - 1);
				else text += '](<' + href.replace( /[()]/g, '\\$&' ) + '>)';
				href = '';
			}
		},
		oncomment: (commenttext) => {
			if ( pagelink && /^LINK'" \d+:\d+$/.test(commenttext) ) {
				text += '*UNKNOWN LINK*';
			}
		}
	} );
	parser.write( html );
	parser.end();
	return text;
};

module.exports.standardize = standardize;
module.exports.checkMessageURL = checkMessageURL;
module.exports.processArguments = processArguments;
module.exports.argsToString = argsToString;
module.exports.getASOT = getASOT;
module.exports.getAllFiles = getAllFiles;
module.exports.escapeFormatting = escapeFormatting;
module.exports.htmlToDiscord = htmlToDiscord;
