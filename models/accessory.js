'use strict';

const mongoose = require('mongoose');

const accessorySchema = new mongoose.Schema({

  parts: {type: Array}

});

module.exports = mongoose.model('Accessory', accessorySchema);
