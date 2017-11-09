const mongoose = require('mongoose')
const Category = mongoose.model('Category')

module.exports = {
  add: (req, res) => {
    let reqBody = req.body
    Category
      .create({
        name: reqBody.name
      })
      .then(thread => {
        res.redirect('/list')
      })
  }
}
