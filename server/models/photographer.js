const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Photographer = new Schema({
  name: String,
  availabilities: [{
    starts: Date,
    ends: Date,
    _id: false,
  }],
  bookings: [{
    starts: Date,
    ends: Date,
  }],
})

module.exports = mongoose.model('photographers', Photographer)
