const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const blogRouter = require('./routes/blog');
const userRouter = require('./routes/user');

const app = express();


app.use(logger('dev'));
app.use(express.json()); // 获取post data(json格式) => req.body
app.use(express.urlencoded({ extended: false }));// 获取post data(form data格式) => req.body
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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
