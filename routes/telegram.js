const {Router} = require('express')
const router = Router()
const telegram = require('../emails/telegram')
const TelegramBot = require('node-telegram-bot-api')
const keys = require('../keys/keys')


router.post('/sendFromSite', (req, res) => {
    const bot = new TelegramBot(keys.TELEGRAM_TOKEN, {polling: true})
    bot.sendMessage(keys.MY_TELEGRAM_ID, telegram(req.body))
    res.status(200).json({})
})

module.exports = router