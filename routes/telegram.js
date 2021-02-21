const {Router} = require('express')
const winston = require('../config/winston')
const router = Router()
const telegram = require('../emails/telegram')
process.env["NTBA_FIX_319"] = 1;
const TelegramBot = require('node-telegram-bot-api')
const keys = require('../keys/keys')
const rateLimit = require("express-rate-limit")

const createAccountLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 3,
  message:
    "Too many messages from this IP, please try again after an hour"
})

router.post('/sendFromSite', createAccountLimiter, (req, res) => {
  try {
    const bot = new TelegramBot(keys.TELEGRAM_TOKEN, {polling: true})
    bot.sendMessage(keys.MY_TELEGRAM_ID, telegram(req.body))
    res.status(200).json({})
  } catch (e) {
    winston.error({
      date: new Date().toString(),
      message: e
    })
    console.log(e)
  }
})

module.exports = router