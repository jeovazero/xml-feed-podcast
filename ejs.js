const ejs = require('ejs');

// var list = ['jeova', 'pereira', 'gomes']
var list = [
    { title: 'Lambda3 Podcast 80 – Visual Studio App Center',
        link: 'https://www.lambda3.com.br/2018/02/lambda3-podcast-80-visual-studio-app-center/',
        pubdate: 'Fri, 02 Feb 2018 12:00:11 +0000',
        desc: '<p>Veja o que Visual Studio App Center tem a oferecer para você que desenvolve aplicativos mobile, independente da tecnologia.</p>\n<p><span id="more-32804"></span></p>\n<p>Ele te ajuda no ciclo de vida inteiro da sua aplicação, desde o desenvolvimento até o pós-lançamento: build, release, testes, analytics, crash reports, tudo em único lugar.&#8230; <a href="https://www.lambda3.com.br/2018/02/lambda3-podcast-80-visual-studio-app-center/" class="read-more"><br/><br/>Continue lendo</a></p>',
        media:
        { url: 'http://feeds.soundcloud.com/stream/393376647-lambdatres-80-app-center.mp3',
            type: 'audio/mpeg' } }
]

function render(filename, obj, cb){
    ejs.renderFile(filename, {list: obj}, {}, function(err, str){
        cb(str);
    })
}
//render((o) => console.log(o));
module.exports.render = render
