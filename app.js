const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler: this is a JSON API, so errors are reported as JSON.
// Express 5 also routes rejected promises from async handlers here.
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const body = { error: err.message };
  if (req.app.get('env') === 'development' && status >= 500) {
    body.stack = err.stack;
  }
  res.status(status).json(body);
});

module.exports = app;
