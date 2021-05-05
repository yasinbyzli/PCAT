const express = require('express')
const ejs = require('ejs')
const path = require('path')
const mongoose = require('mongoose')
const Photo = require('./models/Photo')


const app = express();

// connect DB
mongoose.connect("mongodb://localhost/pcat-test-db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


// TEMPLATE ENGİNE
app.set('view engine', 'ejs')

// MIDDLEWARE's
app.use(express.static('public'))
// fromdan gelen verileri okumamızı sağlayan iki middleware oluşturduk
app.use(express.urlencoded({extended : true}))
app.use(express.json())

// ROUTES GET
app.get('/', async (req, res) => {
    const photos = await Photo.find({}, (err, data) => {
        if (err) throw err
        return data
    })
    res.render('index', {
        photos
    })
})

app.get('/about', (req, res) => {
    res.render('about')
})

app.get('/add', (req, res) => {
    res.render('add')
})

app.get('/photos/:id', async (req, res) => {
    let id = req.params.id
    let selectPhoto = await Photo.findById(id, (err, data) => {
        if (err) throw err
        return data
    })
    res.render('photo', {
        selectPhoto
    })
})

// ROUTES POST
app.post('/photos', async (req, res) => {
    await Photo.create(req.body)
    res.redirect('/')
})


const port = 3000

app.listen(port , () => {
    console.log(`Sunucu ${port} portunda başlatıldı`)
})