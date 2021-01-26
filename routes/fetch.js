const {Router} = require('express')
const router = Router()
const fetch = require('node-fetch')
const rateLimit = require("express-rate-limit")

const createAccountLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 3,
  message:
    "Too many messages from this IP, please try again after an hour"
})

router.post('/', createAccountLimiter, async (req, res) => {
  try {
    const link = req.body

    const response = await fetch(link)
    const dom = await response.text()

    res.status(200).json(dom)
  } catch (e) {
    res.status(429).json(createAccountLimiter.message)
  }
})

module.exports = router