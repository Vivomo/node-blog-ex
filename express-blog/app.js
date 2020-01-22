const createError = require('http-errors');
const express = require('express');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

const blogRouter = require('./routes/blog');
const userRouter = require('./routes/user');
const redisClient = require('./db/redis');

const app = express();
const sessionStore = new RedisStore({
    client: redisClient
});

const ENV = process.env.NODE_ENV;
if (ENV !== 'production') {
    // 开发环境 / 测试环境
    app.use(logger('dev'));
} else {
    // 线上环境
    const logFileName = path.join(__dirname, 'logs', 'access.log.txt');
    const writeStream = fs.createWriteStream(logFileName, {
        flags: 'a'
    });
    app.use(logger('combined', {
        stream: writeStream
    }));
}
app.use(express.json()); // 获取post data(json格式) => req.body
app.use(express.urlencoded({ extended: false }));// 获取post data(form data格式) => req.body
app.use(cookieParser());
app.use(session({
    secret: '#v',
    cookie: {
        path: '/',
        httpOnly: true,
        maxAge: 86400000
    },
    store: sessionStore
}));

app.use('/api/blog', blogRouter);
app.use('/api/user', userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'dev' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
