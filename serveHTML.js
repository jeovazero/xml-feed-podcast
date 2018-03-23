const http = require('http');
const fs = require("fs");
const url = require("url");
const qs = require("querystring");

const mylib = require("./xmlAction.js");
const template = require('./ejs.js');

http.createServer(function(req, res){
    if(req.method === "GET"){
        fs.readFile('FEED.html', 'utf8', (err, data) => {
            res.writeHead(200, {
                'Content-Type':'text/html',
                'Content-Length': Buffer.byteLength(data)
            });
            res.write(new Buffer(data));
            res.end();
        });
    }else if(req.method === "POST"){
        var body = '';
        req.on('data', (data) => {
            body += data;
        })
        req.on('end', () => {
            let params = qs.parse(body);
            console.log(params, body);
            /*
            let div = '<div>jeova pereira gomes</div>';
            */
            mylib.getXml(params.url, (obj) => {
                template.render('INDEX.html', obj, (data) => {
                    res.writeHead(200, {
                        'Content-Type':'text/html',
                        'Content-Length': Buffer.byteLength(data)
                    });
                    res.write(new Buffer(data));
                    res.end();
                })
            });

        });
    }else{
        console.log("ERROR");
    }
    console.log(url.parse(req.url, true));
}).listen(8888, function(){
    console.log('on 8888');
});


