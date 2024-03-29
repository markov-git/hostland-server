const express = require('express')
const path = require('path')
const morgan = require('morgan')
const winston = require('./config/winston')
const exphbs = require('express-handlebars')
const helmet = require('helmet')
const compression = require('compression')
const minifyHTML = require('express-minify-html')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const flash = require('connect-flash')
const mongoose = require('mongoose')
const cors = require('cors')

const telegramRoutes = require('./routes/telegram')
const ticRoutes = require('./routes/tictac')
const excelRoutes = require('./routes/excel')
const authRoutes = require('./routes/auth')
const errorHandler = require('./middleware/error')
const sseRoutes = require('./routes/sse.maze')
const keys = require('./keys/keys')

const PORT = process.env.PORT || 3000

const dev = process.env.NODE_ENV === 'development'

if (dev) {
  winston.info = data => {
    console.log(data)
  }
  winston.warn = data => {
    console.warn(data)
  }
  winston.error = data => {
    console.error(data)
  }
}

const app = express()
app.use(morgan('combined', {stream: winston.stream}))
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs'
})
const store = new MongoStore({
  collection: 'sessions',
  uri: keys.MONGODB_URI
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use('/home', express.static(path.join(__dirname, 'public', 'newHome')))
app.use('/static', express.static(path.join(__dirname, 'public', 'newHome', 'static')))
app.use(express.json())
app.use(express.text())
// app.use(express.urlencoded({extended: true}))
app.use(session({
  secret: keys.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store
}))
app.use(flash())

app.use(helmet())
app.use(minifyHTML({
  override: true,
  exception_url: false,
  htmlMinifier: {
    removeComments: true,
    collapseWhitespace: true,
    collapseBooleanAttributes: true,
    removeAttributeQuotes: true,
    removeEmptyAttributes: true,
    minifyJS: true
  }
}))
app.use(compression({
  filter(req) {
    return req.headers.accept !== 'text/event-stream'
  }
}))

const corsOptions = {}
if (process.env.NODE_ENV === 'development') {
  corsOptions.origin = '*'
  corsOptions.methods = ['GET', 'POST']
  corsOptions.optionsSuccessStatus = 200
}

app.use('/', express.static(path.join(__dirname, 'public', 'newHome')))
app.use('/auth', authRoutes)
app.use('/telegram', telegramRoutes)
app.use('/tictac', ticRoutes)
app.use('/excel', excelRoutes)
app.use('/sse', cors(corsOptions), sseRoutes)
app.use(errorHandler)

async function start() {
  try {
    await mongoose.connect(keys.MONGODB_URI, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    })
    app.listen(PORT, () => {
      winston.info({
        date: new Date().toString(),
        message: `Server is running on port ${PORT}`
      })
      console.log(`http://localhost:${PORT}`)
      console.log('mode: ', process.env.NODE_ENV)
    })
  } catch (e) {
    winston.error(e)
  }
}

start()