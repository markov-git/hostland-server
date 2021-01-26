module.exports = function(req, res, next) {

  if (req.originalUrl === '/fetch') {
    res.header("Access-Control-Allow-Origin", "*")
  }

  next()
}