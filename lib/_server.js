'use strict';

require('dotenv').config();


// expressy stuff
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


module.exports = {
  start: (port, cb) => {
    app.listen(port, cb);
    console.log(`Server is up on PORT ${process.env.PORT}!`);
  },
  stop: (cb) => app.close(cb),
};
