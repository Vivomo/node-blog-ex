const queryStr = require('querystring');

const handleBlogRouter = require('./src/router/blog');
const handleUserRouter = require('./src/router/user');

const env = process.env.NODE_ENV;

const getPostData = (req) => {
    return new Promise((resolve, reject) => {
        if (req.method !== 'POST') {
            resolve({});
            return
        }
        if (req.headers['content-type'] !== 'application/json') {
            resolve({});
            return
        }
        let postData = '';
        req.on('data', chunk => {
            postData += chunk.toString()
        });
        req.on('end', () => {
            if (!postData) {
                resolve({});
                return
            }
            resolve(
                JSON.parse(postData)
            )
        })
    });
};


const serverHandle = (req, res) => {
    // 设置返回格式
    res.setHeader('Content-type', 'application/json');

    let [path, search] = req.url.split('?');
    req.path = path;
    req.query = queryStr.parse(search);

    getPostData(req).then((postData) => {
        req.body = postData;

        let blogData = handleBlogRouter(req, res);
        if (blogData) {
            res.end(JSON.stringify(blogData));
            return;
        }

        let userData = handleUserRouter(req, res);
        if (userData) {
            res.end(JSON.stringify(userData));
            return;
        }

        res.writeHead(404, {'Content-type': 'text/plain'});
        res.write('404');
        res.end();
    });
};

module.exports = serverHandle;