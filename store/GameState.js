const MAX_PLAYERS = 2

class GameState {
  constructor() {
    this.games = {}
    this.connected = {}
    return this
  }

  _createGame(id) {
    this.games[id] = {sses: {}}
    return this.games[id]
  }

  _createNewId(liter) {
    return `${Object.keys(this.connected).length}${liter}${new Date().getMilliseconds().toString().padStart(3, '0')}`
  }

  createNewRoom(res, {name = 'game', pass = '', key}) {
    const id = this._createNewId('R')
    const sse = this.connected[key]
    this._addPlayerToGame(sse, id, key)
    this.games[id].name = name
    this.games[id].pass = pass
    sse.write(toSSE('roomID', id))
    sse.write(toSSE('message', 'Waiting for second player'))
  }

  _addPlayerToGame(sse, id, key) {
    const game = this.games[id] || this._createGame(id)

    if (Object.keys(game.sses).length + 1 > MAX_PLAYERS) {
      sse.write(toSSE('error', 'The number of players in the game is exceeded'))
      throw new Error('The number of players in the game is exceeded')
    }

    this.games[id].sses[key] = sse
    // if (game.sses.length === MAX_PLAYERS) {
    //   this._initGame(id)
    // }
  }

  addSecondPlayerToGame({id, pass, key}) {
    if (this._hasAccess(key, id, pass)) {
      this.connected[key].write(toSSE('message', 'connected'))
      this._addPlayerToGame(this.connected[key], id, key)
    }
  }

  _hasAccess(key, id, pass, mod = 1) {
    if (this.games[id].pass === pass && Object.keys(this.games[id].sses).length === mod) {
      return true
    } else if (Object.keys(this.games[id].sses).length === 1) {
      this.connected[key].write(toSSE('error', 'Wrong password'))
      return false
    } else {
      this.connected[key].write(toSSE('error', 'The number of players in the game is exceeded'))
      return false
    }
  }

  sendNewState({data, id, key, pass}) {
    console.log('кто то шлет жсон')
    if (this._hasAccess(key, id, pass, 2)) {
      const oppositeKey = Object.keys(this.games[id].sses).find(k => k !== key)
      this.games[id].sses[oppositeKey].write(toSSE('json', data))
    }
  }

  sendFreeRoomsSSE(key) {
    this.connected[key].write(toSSE('rooms', this._freeRooms))
  }

  get _freeRooms() {
    return Object.keys(this.games)
      .filter(key => Object.keys(this.games[key].sses).length < MAX_PLAYERS)
      .map(key => ({[key]: this.games[key].name}))
  }

  connect(sse) {
    const id = this._createNewId('G')
    sse.write(toSSE('key', id))
    this.connected[id] = sse
  }


  // _initGame(id) {
  //   const [s1, s2] = this.games[id].sses
  //
  //   s1.onmessage = null
  //   s2.onmessage = null
  //
  //   s1.on('close', () => {
  //     s2.send(toSSE('error', 'connection closed'))
  //     this._removeGame(id)
  //   })
  //
  //   s2.on('close', () => {
  //     s1.send(toSSE('error', 'connection closed'))
  //     this._removeGame(id)
  //   })
  //
  //   s1.on('message', msg => s2.send(toSSE('data', JSON.parse(msg).message)))
  //
  //   s2.on('message', msg => s1.send(toSSE('data', JSON.parse(msg).message)))
  //
  //   s1.send(toSSE('info', 'connection opened'))
  //   s2.send(toSSE('info', 'connection opened'))
  // }

  _removeGame(id) {
    delete this.games[id]
  }
}

function toSSE(event, data) {
  if (['json', 'rooms'].includes(event)) {
    return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
  } else {
    return `event: ${event}\ndata: ${data}\n\n`
  }
}

module.exports = new GameState()