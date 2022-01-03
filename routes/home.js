const {Router} = require('express')
const router = Router()

router.get('/', (req, res) => {
    res.sendFile('../public/home/index.html');
})

module.exports = router