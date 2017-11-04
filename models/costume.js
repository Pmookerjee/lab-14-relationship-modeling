'use strict';

const mongoose = require('mongoose');
const Accessory = require('./accessory');

const costumeSchema = new mongoose.Schema({

  name: {type: String},
  profile: String,
  parts: {type: mongoose.Schema.Types.ObjectId, ref: 'Accessory'},
  createDate: {type: Date, default: Date.now}

});

costumeSchema.pre('save', function(done) {

  Accessory.findById(this.parts)
    .then( acc => {
      if (! acc) {
        let newAcc = new Accessory({costume: this._id, parts:[]});
        return newAcc.save();
      }
      else { return acc; }
    })
    .then(acc => {
      this.parts = acc._id;
      done();
    })
    .catch(done);

});

costumeSchema.pre('findOne', function(done) {

  this.populate({

    path: 'parts'

  });
  done();
});

const Costume = module.exports = mongoose.model('Costume', costumeSchema);
