const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const helmet = require('helmet')
const compression = require('compression')
const minifyHTML = require('express-minify-html')

const homeRoutes = require('./routes/home')
const telegramRoutes = require('./routes/telegram')
const ticRoutes = require('./routes/tictac')
const excelRoutes = require('./routes/excel')
const fetchRoutes = require('./routes/fetch')
const errorHandler = require('./middleware/error')
const corsHandler = require('./middleware/cors')

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
app.use(express.text())

app.use(corsHandler)    // all origin opened for api!

app.use(helmet())
app.use(minifyHTML({
    override:      true,
    exception_url: false,
    htmlMinifier: {
        removeComments:            true,
        collapseWhitespace:        true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes:     true,
        removeEmptyAttributes:     true,
        minifyJS:                  true
    }
}))
app.use(compression())

app.use('/', homeRoutes)
app.use('/telegram', telegramRoutes)
app.use('/tictac', ticRoutes)
app.use('/excel', excelRoutes)
app.use('/fetch', fetchRoutes)

app.use(errorHandler)

async function start() {
    try {

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
            console.log(`http://localhost:${PORT}`)
        })
    } catch (e) {
        console.log(e)
    }
}

start()