const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const apiService = require('./api/http');
const spaRouter = require('./routes/index');
const apiRouter = require('./routes/api');
const cors = require('cors');
const app = express();

apiService.getData();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'build')));

app.use('/api', cors(), apiRouter);
app.use('*', spaRouter);

module.exports = app;
