const encryption = require('../utilities/encryption')
const mongoose = require('mongoose')
const User = mongoose.model('User')
const Hotel = mongoose.model('Hotel')
const Review = mongoose.model('Review')

module.exports = {
  registerGet: (req, res) => {
    res.render('users/register')
  },
  registerPost: (req, res) => {
    let reqUser = req.body
    // Add validations!

    let salt = encryption.generateSalt()
    let hashedPassword = encryption.generateHashedPassword(salt, reqUser.password)

    User.create({
      username: reqUser.username,
      firstName: reqUser.firstName,
      lastName: reqUser.lastName,
      salt: salt,
      hashedPass: hashedPassword
    }).then(user => {
      req.logIn(user, (err, user) => {
        if (err) {
          res.locals.globalError = err
          res.render('users/register', user)
        }

        res.redirect('/')
      })
    })
  },
  loginGet: (req, res) => {
    res.render('users/login')
  },
  loginPost: (req, res) => {
    let reqUser = req.body
    User
      .findOne({ username: reqUser.username }).then(user => {
        if (!user) {
          res.locals.globalError = 'Invalid user data'
          res.render('users/login')
          return
        }

        if (!user.authenticate(reqUser.password)) {
          res.locals.globalError = 'Invalid user data'
          res.render('users/login')
          return
        }

        req.logIn(user, (err, user) => {
          if (err) {
            res.locals.globalError = err
            res.render('users/login')
          }

          res.redirect('/')
        })
      })
  },
  logout: (req, res) => {
    req.logout()
    res.redirect('/')
  },
  profile: (req, res) => {
    let userName = req.params.username

    User
      .find({ username: userName })
      .then(user => {
        Hotel
          .find({ user: user })
          .then(hotels => {
            Review
              .find({ hotel: hotels })
              .populate('hotel')
              .then(reviews => {
                res.render('users/profile', {
                  user: userName,
                  hotels: hotels,
                  reviews: reviews
                })
              })
          })
      })
  },
  all: (req, res) => {
    User
      .find()
      .then(users => {
        res.render('users/all', {
          users: users
        })
      })
  },
  addAdmin: (req, res) => {
    let userId = req.params.id

    User
      .findById(userId)
      .then(user => {
        user.roles.push('Admin')
        user.save()
        .then(() => {
          res.redirect('/admins/all')
        })
      })
  }
}
