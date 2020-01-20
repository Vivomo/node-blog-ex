const queryStr = require('querystring');
const { get, set } = require('./src/db/redis');
const handleBlogRouter = require('./src/router/blog');
const handleUserRouter = require('./src/router/user');

const env = process.env.NODE_ENV;

// 获取 cookie 的过期时间
const getCookieExpires = () => {
    const d = new Date();
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
    return d.toGMTString()
};



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

    let needSetCookie = false;
    let userId = req.cookie.userid;
    if (!userId) {
        needSetCookie = true;
        userId = `${Date.now()}_${Math.random()}`;
        // 初始化 redis 中的 session 值
        set(userId, {})
    }
    // 获取 session
    req.sessionId = userId;

    get(req.sessionId).then(sessionData => {
        if (sessionData === null) {
            set(req.sessionId, {});
            req.session = {}
        } else {
            req.session = sessionData
        }
        return getPostData(req)
    }).then((postData) => {
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