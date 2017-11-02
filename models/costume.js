'use strict';

const mongoose = require('mongoose');
const Accessory = require('./accessory');

const costumeSchema = mongoose.Schema({

  name: {type: String, required: true, unique: true},
  profile: String,
  parts: {type: mongoose.Schema.Types.ObjectId, ref: 'Accessory'},
  createDate: {type: Date, default: Date.now},

});

costumeSchema.pre('save', (done) => {

  console.log('hiiiiiiiiiiii')
  Accessory.findByID(this.parts)
    .then(parts => {

      console.log('parts is ', parts);

      if(parts) return parts;
      else {
        let newParts = new Accessory({});
        return newParts.save();
      }

    })
    .then(parts => {
      this.parts = parts._id;
      done();
    })
    .catch(err => { console.log(err); done(); });
});

costumeSchema.pre('findOne', () => {

  this.populate({

    path: 'parts',
    populate: {
      path: 'accessories',
    },
  });
});


const Costume = module.exports = mongoose.model('Costume', costumeSchema);
