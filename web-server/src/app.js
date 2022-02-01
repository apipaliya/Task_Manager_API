const express = require('express')
const path = require('path')
const hbs = require('hbs')

//const request = require('request')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

//define paths for Express config
const publicDir = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//define handlebars engine and views locations
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//setup static directory to server
app.use(express.static(publicDir))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: "ajay patel",
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        content: "This is my weather website , here you can find weather by location..",
        name: "Ajay Pipaliya"
    })
})

app.get('/help', (req, res) => {
    res.render('help', { name: "Ajay Pipaliya", title: "Help" })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }
    console.log(req.query)
    res.send({
        products: [req.query.search, req.query.rate]
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        console.log("address", req.query.address)
        return res.send({
            error: 'You must provide a city info..'
        })
    }
    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if (error)
                return res.send({ error })
            res.send({
                forecast: forecastData.data,
                extraInfo:forecastData.extraInfo,
                icon:forecastData.icon,
                location: location,
                address: req.query.address
            })

        })
    })
})


app.get('/help/*', (req, res) => {
    res.render('404', { errorMessage: "Help artical not found", title: 404 })
})

app.get('*', (req, res) => {
    res.render('404', { errorMessage: "Page not found", title: 404 })
})

app.listen(port, () => {
    console.log(`server is running on : 127.0.0.1:${port}`)
})