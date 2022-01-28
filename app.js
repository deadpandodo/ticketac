require('./models/dbconnect');

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var session = require("express-session");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var models = require('./routes/index')



var app = express();


app.locals.date_format = function (UTCDate) {
  // Takes a UTC date and return a DAY/MONTH/YEAR string
  let date = new Date(UTCDate)
  let returned_date = date.getDate() +'/'+ (Number(date.getMonth())+1) +'/'+  date.getFullYear()
  console.log(returned_date)
  return returned_date
}


const dotenv = require('dotenv');
dotenv.config();


app.use(
  session({
   secret: process.env.SESSION_SK,
   resave: false,
   saveUninitialized: false,
  })
  );
  
  

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
