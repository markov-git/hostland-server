const MAX_PLAYERS = 2
const CLEAR_DELAY = 5000

class GameState {
  constructor() {
    this.games = {}
    this.connected = new Map()

    setInterval(this._clearClients.bind(this), CLEAR_DELAY)
  }

  _createGame(id) {
    this.games[id] = {sses: {}}
    return this.games[id]
  }

  _createNewId(liter) {
    return `${this.connected.size}${liter}${new Date().getMilliseconds().toString().padStart(3, '0')}`
  }

  createNewRoom(res, {name = 'game', pass = '', nick = '', key}) {
    const id = this._createNewId('R')
    const sse = this.connected.get(key).sse
    this._addPlayerToGame(sse, id, key)
    this.games[id].name = name
    this.games[id].pass = pass
    this.games[id].nick = nick
    sse.write(toSSE('roomID', id))
    sse.write(toSSE('message', 'Ждем второго игрока'))
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
      const newPlayerSse = this.connected.get(key).sse
      newPlayerSse.write(toSSE('message', 'connected'))
      this._addPlayerToGame(newPlayerSse, id, key)
    }
  }

  _hasAccess(key, id, pass, mod = 1) {
    const playerSse = this.connected.get(key).sse
    if (this.games[id].pass === pass && Object.keys(this.games[id].sses).length === mod) {
      return true
    } else if (Object.keys(this.games[id].sses).length === 1) {
      playerSse.write(toSSE('error', 'The number of players in the game is exceeded'))
      return false
    } else {
      playerSse.write(toSSE('error', 'Wrong password'))
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
    this.connected.get(key).sse.write(toSSE('rooms', this._freeRooms))
  }

  get _freeRooms() {
    console.log(this.connected.keys())
    return Object.keys(this.games)
      .filter(key => Object.keys(this.games[key].sses).length < MAX_PLAYERS)
      .map(key => ({
        uid: key,
        name: this.games[key].name,
        nick: this.games[key].nick,
        closed: !!this.games[key].pass
      }))
  }

  connect(sse) {
    const id = this._createNewId('G')
    sse.write(toSSE('key', id))
    this.connected.set(id, {sse})
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

  closeConnection({id, key}) {
    if (Object.keys(this.games[id].sses).includes(key)) {
      this._removeGame(id)
    }
  }

  _clearClients() {
    if (this.connected.size) {
      this.connected.forEach(({sse}, id) => {
        if (!sse.write(toSSE('ping', ''))) {
          this.connected.delete(id)
        }
      })
    }
  }

  _removeGame(id) {
    this.connected.delete(id)
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