const MAX_PLAYERS = 2
const MSG = 'message'

class GameStore {
  constructor() {
    this.games = {}
    return this
  }

  _createGame(id) {
    if (this.games[id]) {
      throw new Error(`The game with ${id} already exist`)
    } else {
      this.games[id] = {}
    }
    return this.games[id]
  }

  addPlayerToGame(id, ws) {
    if (!ws) throw new Error('Second argument is required')
    const game = this.games[id] || this._createGame(id)

    if (Object.keys(game).length + 1 > MAX_PLAYERS) {
      ws.send('The number of players in the game is exceeded')
      throw new Error('The number of players in the game is exceeded')
    }

    const playerId = Object.keys(game).length
    this.games[id][playerId] = ws
    if (Object.keys(game).length === MAX_PLAYERS) {
      this._initGame(id)
    }
  }

  _initGame(id) {
    const game = this.games[id]
    const [pId1, pId2] = Object.keys(game)

    game[pId1].on(MSG, msg => {
      console.log('try to send from 1')
      game[pId2].send(msg)
    })

    game[pId2].on(MSG, msg => {
      console.log('try to send from 2')
      game[pId1].send(msg)
    })
  }
}

module.exports = new GameStore()