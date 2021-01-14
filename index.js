const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const helmet = require('helmet')
const compression = require('compression')
const keys = require('./keys/keys')

const homeRoutes = require('./routes/home')
const telegramRoutes = require('./routes/telegram')
const ticRoutes = require('./routes/tictac')
const errorHandler = require('./middleware/error')

const PORT = process.env.PORT || 3000

const app = express()
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(express.json())

app.use(helmet())
app.use(compression())

app.use('/', homeRoutes)
app.use('/telegram', telegramRoutes)
app.use('/tictac', ticRoutes)

app.use(errorHandler)

async function start() {
    try {
        await mongoose.connect(keys.MONGODB_URI, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        })
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
            console.log(`http://localhost:${PORT}`)
        })
    } catch (e) {
        console.log(e)
    }
}

start()