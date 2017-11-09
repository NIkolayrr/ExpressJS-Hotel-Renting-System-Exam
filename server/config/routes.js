const controllers = require('../controllers')
const auth = require('./auth')

module.exports = (app) => {
  app.get('/', controllers.home.index)

  app.get('/users/register', controllers.users.registerGet)
  app.post('/users/register', controllers.users.registerPost)
  app.get('/users/login', controllers.users.loginGet)
  app.post('/users/login', controllers.users.loginPost)
  app.post('/users/logout', controllers.users.logout)

  app.get('/add', auth.isAuthenticated, controllers.hotel.addGet)
  app.post('/add', auth.isAuthenticated, controllers.hotel.addPost)
  app.get('/list', controllers.hotel.list)

  app.get('/hotel/:id/:title', controllers.hotel.details)
  app.post('/hotel/:id/:title', auth.isAuthenticated, controllers.hotel.addReview)
  app.post('/hotel/delete/:id/:title', auth.isInRole('Admin'), controllers.hotel.delete)
  app.get('/hotel/edit/:id/:title', auth.isInRole('Admin'), controllers.hotel.editGet)
  app.post('/hotel/edit/:id/:title', auth.isInRole('Admin'), controllers.hotel.editPost)
  app.post('/hotel/like/:id/:title', auth.isAuthenticated, controllers.hotel.like)

  app.get('/profile/:username', auth.isAuthenticated, controllers.users.profile)
  app.get('/admins/all', auth.isInRole('Admin'), controllers.users.all)
  app.post('/admins/add/:id', auth.isInRole('Admin'), controllers.users.addAdmin)
  app.post('/category/add', auth.isInRole('Admin'), controllers.category.add)

  app.all('*', (req, res) => {
    res.status(404)
    res.send('404 Not Found!')
    res.end()
  })
}
