const {Router} = require('express')
const router = Router()

router.get('/', (req, res) => {
  res.render('excel', {
    title: 'Pure JS Excel',
    isExcel: true,
  })
})

module.exports = router