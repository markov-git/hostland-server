const gameState = require('../store/GameState')

module.exports = ws => {
  gameState.connect(ws)
}