const ejs = require('ejs');

function render(filename, obj, cb){
    ejs.renderFile(filename, obj, {}, function(err, str){
        if(err){
            cb(err, "Erro na renderização do HTML");
        }
        console.log("HMTL renderizado com os dados!")
        cb(err, str);
    })
}

module.exports.render = render