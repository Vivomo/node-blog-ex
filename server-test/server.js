let http = require('http');
let fs = require('fs');
let path = require('path');


http.createServer((req, res) => {
    let url = req.url.substr(1) || 'null';
    let queryIndex = url.indexOf('?');
    if (queryIndex !== -1) {
        url = url.substring(0, queryIndex);
    }

    console.log(url);
    res.write(url);
    res.end();

}).listen(9999);

console.log('服务器开启成功');
