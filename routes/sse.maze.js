const gameState = require('../store/GameState')
const {Router} = require('express')
const router = Router()


router.get('/init', (req, res) => {
  res.writeHead(200, {
    Connection: 'keep-alive',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache'
  })
  gameState.connect(res)
})

router.get('/info/:key', (req, res) => {
  gameState.sendFreeRoomsSSE(req.params.key)
  res.end()
})

router.post('/newRoom', (req, res) => {
  gameState.createNewRoom(res, req.body)
  res.end()
})

router.post('/connect', (req, res) => {
  gameState.addSecondPlayerToGame(req.body)
  res.end()
})

router.post('/newState', (req, res) => {
  gameState.sendNewState(req.body)
  res.end()
})

router.post('/remove', ((req, res) => {
  gameState.closeConnection(req.body)
  res.end()
}))

router.post('/message', ((req, res) => {
  gameState.sendNewMessage(req.body)
  res.end()
}))

module.exports = router