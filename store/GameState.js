const MAX_PLAYERS = 2

class GameState {
  constructor() {
    this.games = {}
    return this
  }

  _createGame(id) {
    this.games[id] = {sockets: {}}
    return this.games[id]
  }

  _createNewId() {
    return `${Object.keys(this.games).length}G${new Date().getMilliseconds().toString().padStart(3, '0')}`
  }

  _createNewRoom(ws, {name = 'game', pass = ''}) {
    const id = this._createNewId()
    this._addPlayerToGame(ws, id)
    this.games[id].name = name
    this.games[id].pass = pass
    ws.send(sender('info', 'Waiting for second player'))
  }

  _addPlayerToGame(ws, id) {
    const game = this.games[id] || this._createGame(id)

    if (Object.keys(game.sockets).length + 1 > MAX_PLAYERS) {
      ws.send(sender('error', 'The number of players in the game is exceeded'))
      throw new Error('The number of players in the game is exceeded')
    }

    const playerId = Object.keys(game.sockets).length
    this.games[id].sockets[playerId] = ws
    if (Object.keys(game.sockets).length === MAX_PLAYERS) {
      this._initGame(id)
    }
  }

  _addSecondPlayerToGame(ws, {id, pass}) {
    if (this._hasAccess(ws, id, pass)) {
      this._addPlayerToGame(ws, id)
    }
  }

  _hasAccess(ws, id, pass) {
    if (this.games[id].pass === pass && Object.keys(this.games[id].sockets).length === 1) {
      return true
    } else if (Object.keys(this.games[id].sockets).length === 1) {
      ws.send(sender('error', 'Wrong password'))
      return false
    } else {
      ws.send(sender('error', 'The number of players in the game is exceeded'))
      return false
    }
  }

  _freeRooms() {
    return Object.keys(this.games)
      .filter(key => Object.keys(this.games[key].sockets).length < MAX_PLAYERS)
      .map(key => ({[key]: this.games[key].name}))
  }

  connect(ws) {
    ws.on('message', msg => {
      const {action, meta} = JSON.parse(msg)
      switch (action) {
        case 'newGame' : {
          this._createNewRoom(ws, meta)
          break
        }
        case 'info' : {
          ws.send(sender('rooms', this._freeRooms()))
          break
        }
        case 'connect' : {
          this._addSecondPlayerToGame(ws, meta)
          break
        }
      }
    })
  }

  _initGame(id) {
    const sockets = this.games[id].sockets
    const [s1, s2] = Object.values(sockets)

    s1.onmessage = null
    s2.onmessage = null

    s1.on('close', () => {
      s2.send(sender('error', 'connection closed'))
      this._removeGame(id)
    })

    s2.on('close', () => {
      s1.send(sender('error', 'connection closed'))
      this._removeGame(id)
    })

    s1.on('message', msg => s2.send(sender('data', JSON.parse(msg).message)))

    s2.on('message', msg => s1.send(sender('data', JSON.parse(msg).message)))

    s1.send(sender('info', 'connection opened'))
    s2.send(sender('info', 'connection opened'))
  }

  _removeGame(id) {
    delete this.games[id]
  }
}

function sender(type, data) {
  return JSON.stringify({
    type, // data: String, info: String, error: String, rooms: Array
    data
  })
}

module.exports = new GameState()