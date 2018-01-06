'use strict';

require('dotenv').config();

const express = require('express');
let app = express();

const mongoose = require('mongoose');
mongoose.Promise = Promise;
mongoose.connect(process.env.DB_URL || 'mongodb://localhost:27017/costumes_prod', {useMongoClient: true});

app.use('/api/1.0', require(__dirname + '/../routes/accessory-routes'));
app.use('/api/1.0', require(__dirname + '/../routes/costume-routes'));


app.use('*', (req, res, next) => {

  next(404, 'Page Does Not Exist');

});

app.use((err, req, res, next) => {

  res.status(err.statusCode || 500).send(err || 'server error');

});

let isRunning = false;
let http = null;

module.exports = {
  start: (port) => {
    let usePort = port || process.env.PORT;
    if ( isRunning ) {
      throw Error ('Server is already running');
    }
    http = app.listen(usePort, () => {
      isRunning = true;
      console.log('Server running on port ', usePort);
    });
  },

  stop: () => {
    if(! isRunning) {
      throw Error('Server is already off');
    }
    if ( ! http ) {
      throw Error('Invalid Server');
    }

    http.close( () => {
      http = null;
      isRunning = false;
      console.log('Server stopped');
    });
  },

};
