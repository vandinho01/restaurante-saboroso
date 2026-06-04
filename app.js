require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var formidable = require('formidable');
var path = require('path');
//Nova maneira de utilizar o Redis
const { createClient } = require('redis');
const { RedisStore } = require('connect-redis');

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  },
  RESP: 2
});
redisClient.connect().catch(console.error);

var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');

var app = express();

app.use(function (req, res, next) {

  if (req.method === 'POST') {

    var form = formidable.IncomingForm({

      uloadDir: path.join(__dirname, '/public/images'),
      keepExtensions: true

    });

    form.parse(req, function (err, fields, files) {

      req.fields = fields;
      req.files = files;

      next();

    });

  } else {

    next();

  }

})
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/admin', adminRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;