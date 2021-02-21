const key = require('../keys/keys')
const winston = require('../config/winston')

module.exports = function(req, res) {
    winston.info({
        date: new Date().toString(),
        message: `Страница не найдена`
    })

    res.status(404).render('404', {
        title: 'Страница не найдена',
        message: key.BASE_URL + req.originalUrl,
    })
}