const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.ObjectId

let categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  createdOn: { type: Date, default: Date.now() },
  hotels: { type: ObjectId, ref: 'Hotel' }
})

let Category = mongoose.model('Category', categorySchema)

module.exports = Category
