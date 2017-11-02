'use strict';

const mongoose = require('mongoose');
const Costume = require('./costume');

const accessorySchema = mongoose.Schema({

  costume: {type: mongoose.Schema.Types.ObjectId, ref: 'Costume'},
  parts: {type: Array, required: true},

});

const Accessory = module.exports = mongoose.model('Accessory', accessorySchema);
