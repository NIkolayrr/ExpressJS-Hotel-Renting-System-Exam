const mongoose = require('mongoose')
const Hotel = mongoose.model('Hotel')
const Review = mongoose.model('Review')
const Category = mongoose.model('Category')
const errorHandler = require('../utilities/error-handler')

module.exports = {
  addGet: (req, res) => {
    res.render('hotel/add')
  },
  addPost: (req, res) => {
    let hotelReq = req.body
    let userId = req.user._id

    if (!hotelReq.title) {
      res.locals.globalError = 'Hotel must have a title!'
      res.render('hotel/add', hotelReq)
      return
    } else if (!hotelReq.description) {
      res.locals.globalError = 'Hotel must have a description!'
      res.render('hotel/add', hotelReq)
      return
    } else if (!hotelReq.location) {
      res.locals.globalError = 'Hotel must have a location!'
      res.render('hotel/add', hotelReq)
      return
    } else if (!hotelReq.image) {
      res.locals.globalError = 'Hotel must have an image!'
      res.render('hotel/add', hotelReq)
      return
    }

    Category
      .find()
      .then(category => {
        res.render('hotel/add', {
          category: category
        })
          .then(
          Hotel
            .create({
              user: userId,
              title: hotelReq.title,
              description: hotelReq.description,
              location: hotelReq.location,
              image: hotelReq.image
            })
            .then(thread => {
              res.redirect('/list')
            })
            .catch(err => {
              let message = errorHandler.handleMongooseError(err)
              res.locals.globalError = message
              res.render('hotel/add', hotelReq)
            })
          )
      })
  },
  list: (req, res) => {
    let pageSize = 3
    let page = parseInt(req.query.page) || 1

    Hotel
      .find()
      .sort('-createdOn')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .then(hotel => {
        Category
          .find()
          .then(category => {
            res.render('hotel/list', {
              hotel: hotel,
              category: category,
              hasPrevPage: page > 1,
              hasNextPage: hotel.length > 0,
              prevPage: page - 1,
              nextPage: page + 1
            })
          })
      })
  },
  details: (req, res) => {
    let hotelId = req.params.id

    Hotel
      .findById(hotelId)
      .then(hotel => {
        hotel.views += 1
        hotel.save()
        Review
          .find({ hotel: hotelId })
          .sort('-createdOn')
          .populate('user')
          .then(review => {
            res.render('hotel/details', {
              hotel: hotel,
              review: review
            })
          })
      })
  },
  addReview: (req, res) => {
    let hotelId = req.params.id
    let userId = req.user._id
    let reviewReq = req.body

    Review
      .create({
        user: userId,
        comment: reviewReq.comment,
        hotel: hotelId
      })
      .then(() => {
        res.redirect(req.get('referer'))
      })
  },
  delete: (req, res) => {
    let hotelId = req.params.id
    Hotel
      .findByIdAndRemove(hotelId)
      .then(() => {
        Review
          .find({ hotel: hotelId })
          .remove()
          .then(() => {
            res.redirect('/list')
          })
      })
  },
  editGet: (req, res) => {
    let hotelId = req.params.id

    Hotel
      .findById(hotelId)
      .then(hotel => {
        res.render('hotel/edit', {
          hotel: hotel
        })
      })
  },
  editPost: (req, res) => {
    let hotelReq = req.body
    let hotelId = req.params.id

    Hotel
      .findById(hotelId)
      .update({
        title: hotelReq.title,
        description: hotelReq.description,
        location: hotelReq.location,
        image: hotelReq.image
      })
      .then(() => {
        res.redirect('/list')
      })
      .catch(err => {
        res.locals.globalError = err
      })
  },
  like: (req, res) => {
    let hotelId = req.params.id
    let userId = req.user._id

    Hotel
      .findById(hotelId)
      .then(hotel => {
        hotel.likes.push(userId)
        hotel.save()
          .then(() => {
            res.redirect(req.get('referer'))
          })
      })
  }
}
