const http = require('http');
const https = require('https');
const fs = require('fs'); // Filesystem

// Parser: XML -> JS Object
const parserString = require('xml2js').parseString; 

/**
 * Baixa um XML, faz o parseamento, faz a filtragem de informações e aplica na callback (MAGICA)
 * @param {string} urlxml - URL do XML
 * @param {function} callback - Callback
 */
function magicXML(urlxml, callback){

    var protocol = https;
    let error;

    // Descobrindo o protocolo
    if(urlxml.match(/^http:/)){
        protocol = http;
    }else if(!urlxml.match(/^https:/)){
        error = "erro na URL";
        callback(new Error(error), error);
    }
    try{
        protocol.get(urlxml, (res) => {
            //console.log(res);
            let body = '';

            if (res.statusCode !== 200) {
                error = 'Falha na requisição';
                callback(new Error(error), error);
                return;
            }

            console.log("Adquirindo o XML...");

            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                console.log("Recebendo o dado...");
                body += chunk;
            });

            res.on('end', (err) => {
                console.log("Fim da Response.")
                if(err) { callback(err, "Erro na Response") ; return;}
                
                // Passando o xml para o PARSER
                console.log("Dado recebido, passando para o parser...");
                parserAndFilter(body, callback);
            });
        }).on('error', (e) => {
            console.error(e);
            callback(e, "Erro no aquisição do XML");
        });
    }catch(err){
        console.log(err.message);
        callback(err, err.message);
    }
}

/**
 * Parseia, filtra e aplica o resultado na callback
 * @param {*} data - XML para converter em JavaScript Object
 * @param {*} callback - Callback
 */
function parserAndFilter(data, callback){
    parserString(data, (err, res) => {
        if(err) callback(err, "Erro no parser do XML");
        else{
            console.log("Feito o parseamento do XML");
        // Filtrando as informações
            var obj = filter(res);
            callback(err, obj);
        }
    });
}
/**
 * Filtra algumas informações de um RSS-XML
 * @param {Object} object - Javascript Object 
 * @returns {Object} - Um objeto Javascript, com informações filtradas do RSS-XML
 */
function filter(object){
    var obj = object;
    var channel = obj.rss.channel[0];
    var data = {
        title: channel.title[0] || "",
        desc: channel.description[0] || "",
        img: channel.image ? channel.image[0].url : null,
        list: channel.item.map( o=> {
            return {
                title: o.title[0],
                link: o.link ? o.link[0] : null,
                pubdate: o.pubDate[0],
                desc: o.description[0],
                media: (o.enclosure != null)
                        ? {
                            url: o.enclosure[0].$.url,
                            type: o.enclosure[0].$.type
                        } : null
            }
        }).slice(0,10)
    }
    console.log("Extração de dados e filtragem concluida!");
    return data;
}


/**
 * Lê um arquivo e aplica o resultado na callback
 * @param {string} url_filename - URL do arquivo
 * @param {function} cb - Callback
 */
function read(url_filename, cb){
    fs.readFile(url_filename, 'utf8', (err, data) => {
        cb(data);
    });
}

module.exports.magicXML = magicXML;
