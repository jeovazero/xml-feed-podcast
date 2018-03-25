// Autor: Jeova Pereira Gomes

const http = require('http');
const fs = require("fs"); // Filesystem
const url = require("url"); // Auxiliar para a url da Requisição
const querystring = require("querystring"); // Auxiliar para a Query da Requisição 
const path = require("path"); // Auxilar para o Path

// Para baixar o XML e filtra-lo
const magic_xml = require("./src/js/magic_xml.js");

// Para a renderização do conteudo filtrado do XML
const template = require('./src/js/template_render.js');


http.createServer(function(req, res){
    console.log("Opa, uma requisição...");

    let reqparams = url.parse(req.url, true);

    // Irá servir o (index.html)
    // ou o (style.css)
    // ou (nada)
    if(req.method == "GET"){
        
        console.log("Metodo: GET");
        console.log("Path: ", reqparams.pathname);

        if(reqparams.pathname == '/'){
            console.log("Lendo o index.html");
            fs.readFile('./views/index.html', 'utf8', (err, data) => {

                // Escrevendo o cabeçalho
                res.writeHead(200, {
                    'Content-Type':'text/html',
                    'Content-Length': Buffer.byteLength(data)
                });

                res.write(new Buffer(data), (err) => {
                    res.end();
                });

                console.log(">> Enviando o index.html");
            });
        }else{
            console.log("Tentando servir um arquivo...");

            // Pegando a extensão do arquivo na url
            let ext = path.extname(req.url);
            console.log("Extensão lida: ", ext);

            // Se for CSS, servirá o arquivo
            if(ext == '.css'){
                console.log("Tentando ler o CSS...");
                fs.readFile('.' + req.url, 'utf8', (err, data) => {
                    if(err) { console.error(err); return;}

                    // Escrevendo o cabeçalho para o css
                    res.writeHead(200, {
                        'Content-Type':'text/css',
                        'Content-Length': Buffer.byteLength(data)
                    });

                    res.write(new Buffer(data));
                    res.end();

                    console.log(">> Enviando o CSS");
                });
            }
        }
    }else if(req.method == "POST"){ // Em qualquer 'POST'
        console.log("Metodo: POST");
        var body = '';

        req.on('data', (data) => {
            console.log("Recebendo dados do cliente...");
            body += data;
        });

        req.on('end', () => {
            // Pegando os parametros do POST
            let params = querystring.parse(body);
            //console.log('body recebido: ', body);

            // MAGIC!
            // Baixa o xml, faz o parseamento para Javascript Object,
            // filtra as informações e aplica na callback
            magic_xml.magicXML(params.url, (err, obj) => {
                //console.log("OBJ", obj)
                let dataToSend = "";
                if(err){
                    // obj - nesse caso vai ter uma mensagem de erro 
                    dataToSend = obj;
                    res.writeHead(500, {
                        'Content-Type':'text/html',
                        'Content-Length': Buffer.byteLength(dataToSend)
                    });
                    res.write(new Buffer(dataToSend), (err) => {
                        res.end();
                        console.log(">> Enviando resposta...");
                    });
                    
                    return;
                }
                // obj - vai ser o Javascript Object, com as informações filtradas

                // Com o obj, aplica-se no render do EJS
                template.render('./views/template.html', obj, (err, data) => {
                    dataToSend = data                        

                    // data - vai ser o HMTL renderizado

                    // Escrevendo o cabeçalho para o html
                    res.writeHead(200, {
                        'Content-Type':'text/html',
                        'Content-Length': Buffer.byteLength(dataToSend)
                    });
                    res.write(new Buffer(dataToSend));
                    res.end();
                })
            });

        });
    }else{
        console.log("ERROR: Metodo não esperado");
    }
}).listen(process.env.PORT || 8888, function(){
    console.log('Escutando na porta ' + this.address().port );
});


