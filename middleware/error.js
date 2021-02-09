const key = require('../keys/keys')

module.exports = function(req, res) {
    res.status(404).render('404', {
        title: 'Страница не найдена',
        message: key.BASE_URL + req.originalUrl,
    })
}