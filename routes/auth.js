const {Router} = require('express')
const keys = require('../keys/keys')
const winston = require('../config/winston')
const router = Router()
const adminURL = require('uuid').v4()

router.post('/', (req, res) => {
  const {password} = JSON.parse(req.body)
  if (password === keys.ADMIN_PASSWORD) {
    req.session.cookie.maxAge = 1000 * 60 * 30 //30 min
    req.session.isAuthenticated = true
    req.session.save(err => {
      if (err) {
        winston.error({
          date: new Date().toString(),
          message: err
        })
        console.log(err)
      }
      res.status(200).json(`auth/${adminURL}`)
    })
  } else {
    req.flash('loginError', 'Неверный пароль')
    res.status(403).json({message: 'wrong password'})
  }
})

router.get(`/${adminURL}`, (req, res) => {
  if (req.session.isAuthenticated) {
    res.render('admin', {
      title: 'Dashboard',
      isAdmin: true,
      isAuth: req.session.isAuthenticated
    })
  } else {
    req.session.destroy(err => {
      if (err) {
        winston.error({
          date: new Date().toString(),
          message: err
        })
        console.log(err)
      }
      res.redirect('/')
    })
  }
})

module.exports = router