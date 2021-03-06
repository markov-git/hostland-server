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

  createNewRoom(res, {name = 'game', pass, nick = '', key, size}) {
    const sse = this.connected.get(key).sse

    if (Object.values(this.games).some(game => !!game.sses[key])) {
      sse.write(toSSE('error', 'Вы уже создали комнату'))
      return
    }

    const id = this._createNewId('R')
    this._addPlayerToGame(sse, id, key)
    this.games[id].name = name
    this.games[id].pass = pass || undefined
    this.games[id].nick = nick
    this.games[id].size = size
    sse.write(toSSE('message', 'Ждем второго игрока'))
    this.updateRoomsToAllClients()
  }

  updateRoomsToAllClients() {
    this.connected.forEach(({sse}) => sse.write(toSSE('rooms', this._freeRooms)))
  }

  _addPlayerToGame(sse, id, key) {
    const game = this.games[id] || this._createGame(id)
    if (Object.keys(game.sses).length + 1 > MAX_PLAYERS) {
      sse.write(toSSE('error', 'The number of players in the game is exceeded'))
      return
    }
    game.sses[key] = sse
    sse.write(toSSE('roomID', id))
    if (Object.keys(game.sses).length === MAX_PLAYERS) {
      this._initGame(id)
    }
  }

  addSecondPlayerToGame({key, id, pass}) {
    if (this._hasAccess(key, id, pass)) {
      const newPlayerSse = this.connected.get(key).sse
      this._addPlayerToGame(newPlayerSse, id, key)
      // newPlayerSse.write(toSSE('message', 'Игра началась!'))
    }
  }

  _hasAccess(key, id, pass, mod = 1) {
    const playerSse = this.connected.get(key).sse
    if (this.games[id].pass === pass && Object.keys(this.games[id].sses).length === mod) {
      playerSse.write(toSSE('connected', 'ok'))
      return true
    } else if (Object.keys(this.games[id].sses).length === 1) {
      playerSse.write(toSSE('error', 'Неправильный пароль'))
      return false
    } else {
      playerSse.write(toSSE('error', 'Превышено число игроков в комнате'))
      return false
    }
  }


  sendFreeRoomsSSE(key) {
    this.connected.get(key).sse.write(toSSE('rooms', this._freeRooms))
  }

  get _freeRooms() {
    return Object.keys(this.games)
      .filter(id => Object.keys(this.games[id].sses).length < MAX_PLAYERS)
      .map(id => ({
        uid: id,
        name: this.games[id].name,
        nick: this.games[id].nick,
        closed: !!this.games[id].pass,
        size: this.games[id].size
      }))
  }

  connect(sse) {
    const id = this._createNewId('G')
    sse.write(toSSE('key', id))
    this.connected.set(id, {sse})
  }

  _initGame(id) {
    const [s1, s2] = Object.values(this.games[id].sses)

    s1.write(toSSE('start', this.games[id].size))
    s2.write(toSSE('start', this.games[id].size))
  }

  sendNewState({data, id, key, pass}) {
    // smth go wrong with access !!
    // if (this._hasAccess(key, id, pass, 2) ) {
    const oppositeKey = Object.keys(this.games[id].sses).find(k => k !== key)
    this.games[id].sses[oppositeKey].write(toSSE('json', data))
    // }
  }

  sendNewMessage({data, id, key}) {
    const oppositeKey = Object.keys(this.games[id].sses).find(k => k !== key)
    this.games[id].sses[oppositeKey].write(toSSE('finished', data))
  }

  closeConnection({id, key}) {
    const sses = this.games[id].sses || {}
    if (Object.keys(sses).includes(key)) {
      this._removeGame(id)
    }
  }

  _clearClients() {
    if (this.connected.size) {
      this.connected.forEach(({sse}, id, map) => {
        if (!sse.write(toSSE('ping'))) {
          map.forEach(v => v.sse.write(toSSE('close')))
          this.connected.delete(id)
          this.updateRoomsToAllClients()
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