const queryStr = require('querystring');

const handleBlogRouter = require('./src/router/blog');
const handleUserRouter = require('./src/router/user');

const env = process.env.NODE_ENV;

// 获取 cookie 的过期时间
const getCookieExpires = () => {
    const d = new Date();
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
    return d.toGMTString()
};

// // session 数据
const SESSION_DATA = {};

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

    req.cookie = {};
    const cookieStr = req.headers.cookie || '';
    cookieStr.split(';').forEach(item => {
        if (!item) {
            return
        }
        const [k, v] = item.split('=');
        req.cookie[k.trim()] = v.trim();
    });

    // 解析 session
    let needSetCookie = false
    let userId = req.cookie.userid;
    if (userId) {
        if (!SESSION_DATA[userId]) {
            SESSION_DATA[userId] = {}
        }
    } else {
        needSetCookie = true;
        userId = `${Date.now()}_${Math.random()}`;
        SESSION_DATA[userId] = {}
    }
    req.session = SESSION_DATA[userId];

    getPostData(req).then((postData) => {
        req.body = postData;

        let blogResult = handleBlogRouter(req, res);
        if (needSetCookie) {
            res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
        }
        if (blogResult) {
            blogResult.then(blogData => {
                res.end(JSON.stringify(blogData));
            });
            return;
        }

        let userResult = handleUserRouter(req, res);
        if (userResult) {
            userResult.then(userData => {
                res.end(JSON.stringify(userData));
            });
            return;
        }

        res.writeHead(404, {'Content-type': 'text/plain'});
        res.write('404');
        res.end();
    });
};

module.exports = serverHandle;