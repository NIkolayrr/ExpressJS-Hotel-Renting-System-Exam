const mongoose = require('mongoose')
const Hotel = mongoose.model('Hotel')

module.exports = {
  index: (req, res) => {
    Hotel
      .find()
      .sort('-createdOn')
      .limit(20)
      .then(hotel => {
        res.render('home/index', {
          hotel: hotel
        })
      })
  }
}
