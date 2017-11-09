const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.ObjectId

let reviewSchma = new mongoose.Schema({
  user: { type: ObjectId, required: true, ref: 'User' },
  comment: { type: String, required: true },
  createdOn: { type: Date, default: Date.now() },
  hotel: { type: ObjectId, ref: 'Hotel' }
})

let Review = mongoose.model('Review', reviewSchma)

module.exports = Review
