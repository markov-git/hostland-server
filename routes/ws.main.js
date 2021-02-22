const gameStore = require('../store/GameStore')

module.exports = (ws, req) => {
  // after connecting ws
  const {id} = req.params
  gameStore.addPlayerToGame(id, ws)
}