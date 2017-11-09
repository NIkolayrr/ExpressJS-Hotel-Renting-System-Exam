const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.ObjectId

let hotelSchema = new mongoose.Schema({
  user: { type: ObjectId, required: true, ref: 'User' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  image: { type: String, required: true },
  createdOn: { type: Date, default: Date.now() },
  views: { type: Number, default: 0 },
  likes: [
    { type: ObjectId, ref: 'User' }
  ],
  reviews: { type: ObjectId, ref: 'Review' }
})

let Hotel = mongoose.model('Hotel', hotelSchema)

module.exports = Hotel
