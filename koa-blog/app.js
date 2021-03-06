const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const session = require('koa-generic-session');
const redisStore = require('koa-redis');
const fs = require('fs');
const path = require('path');
const morgan = require('koa-morgan');

const blog = require('./routes/blog');
const user = require('./routes/user');
const {REDIS_CONF} = require('./conf/db');
// error handler
onerror(app);

const ENV = process.env.NODE_ENV;
if (ENV !== 'production') {
    // 开发环境 / 测试环境
    app.use(morgan('dev'));
} else {
    // 线上环境
    const logFileName = path.join(__dirname, 'logs', 'access.log.txt');
    const writeStream = fs.createWriteStream(logFileName, {
        flags: 'a'
    });
    app.use(morgan('combined', {
        stream: writeStream
    }));
}

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}));
app.use(json());
app.use(logger());
app.use(require('koa-static')(__dirname + '/public'));

app.use(views(__dirname + '/views', {
  extension: 'pug'
}));

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
});

app.keys = ['vv#'];
app.use(session({
    cookie: {
        path: '/',
        httpOnly: true,
        maxAge: 86400000
    },
    store: redisStore({
        all: `${REDIS_CONF.host}:${REDIS_CONF.port}`
    })
}));

// routes
app.use(blog.routes(), blog.allowedMethods());
app.use(user.routes(), user.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app;
