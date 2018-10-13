const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
// const session = require('express-session');
// const passport = require('passport');
const mongoose = require('mongoose');

const index = require('./routes/index');
const users = require('./routes/users');
const rooms = require('./routes/rooms');
const messages = require('./routes/messages');
const userCheck = require('./middlewares/userCheck');

const app = express();

const configDB = require('./config/database.js');
const mqttBrokerConfig = require('./mqtt/client');

// init mqtt
const mqttBroker = require('./mqtt/broker');
const mqttClient = require('./mqtt/client');

mqttBroker(() => {
  // server ready
  mqttClient();
});


// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

// require('./config/passport')(passport); // pass passport for configuration


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client/build')));

// app.use(session({ secret: 'secretsecretsecretsecretsecretsecretsecret' }));
// app.use(passport.initialize());
// app.use(passport.session()); // persistent login sessions

app.use('/', index);
app.use('/users', users);

app.use('/rooms', userCheck.auth);
app.use('/rooms', rooms);

app.use('/mess', userCheck.auth);
app.use('/mess/:roomId', userCheck.isInRoom);
app.use('/mess/post', userCheck.isInRoom);
app.use('/mess', messages);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err);
});

module.exports = app;
