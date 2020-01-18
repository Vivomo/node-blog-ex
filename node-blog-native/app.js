const handleBlogRouter = require('./src/router/blog');
const handleUserRouter = require('./src/router/user');

const env = process.env.NODE_ENV;


const serverHandle = (req, res) => {
    // 设置返回格式
    res.setHeader('Content-type', 'application/json');

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
};

module.exports = serverHandle;