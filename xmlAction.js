const http = require('http');
const https = require('https');
const fs = require('fs');

const urllist = [
    'https://hipsters.tech/feed/podcast/',
    'https://devnaestrada.com.br/feed.xml',
    'https://www.lambda3.com.br/feed/',
    'https://mundopodcast.com.br/podprogramar/feed/',
    'http://www.grokpodcast.com/atom.xml'
];

const parserString = require('xml2js').parseString;

function getXml(urlxml, callback){
    var protocol = https;
    if(urlxml.match(/http:/)){
        protocol = http;
    }
    protocol.get(urlxml, (res) => {
        res.setEncoding('utf8');
        let body = '';
        res.on('data', (chunk) => {
            body += chunk;
        });
        res.on('end', (err) => {
            if(err) { console.error(err.message); }
            console.log(body);
            parser(body, callback);
        });
    }).on('error', (e) => {
        console.error(`Error: ${e.message}`);
    });
}

var c = 1;
function parser(data, callback){
    parserString(data, (err, res) => {
        //        console.log('c', c.rss.channel[0].item[0].title);
        /*
        fs.writeFile(`./${c}`, JSON.stringify(res), 'utf8', (err) => {
            if(err) throw err;
        })
        c++;
        */

        var obj = filter(res);
        callback(obj);
        // console.log(res.feed.entry[0]);
    });
}

    /*
urllist.map(o => {
    getXml(o);
})
*/


function read(url_filename, cb){
    fs.readFile(url_filename, 'utf8', (err, data) => {
        cb(data);
    });
}

function filter(json_data){
    var obj = json_data//JSON.parse(json_data);
    return obj.rss.channel[0].item.map( o=> {
        return {
            title: o.title[0],
            link: o.link[0],
            pubdate: o.pubDate[0],
            desc: o.description[0],
            media: (o.enclosure != null)
                    ? {
                        url: o.enclosure[0].$.url,
                        type: o.enclosure[0].$.type
                    } : null
        }
    })
    
}

//read('0', filter);
//read('1', filter);
/*
read('2', filter);
read('3', filter);
read('4', filter);
read('5', filter);
*/
module.exports.getXml = getXml;
