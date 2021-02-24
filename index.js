const express = require('express')
const path = require('path')
const enableWs = require('express-ws')

const PORT = process.env.PORT || 3000

const app = express()
enableWs(app)
app.use(express.static(path.join(__dirname, 'public')))

app.ws('/', ws => {
  ws.send('Ok. Connected to NodeJS.')
  console.log('smb was connected')
})

function start() {
  app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
  })
}

start()