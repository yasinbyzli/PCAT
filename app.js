const express = require("express");
const ejs = require("ejs");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const Photo = require("./models/Photo");
const fileUpload = require("express-fileupload");
const methodOverride = require('method-override');

const app = express();

// connect DB
mongoose.connect("mongodb://localhost/pcat-test-db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// TEMPLATE ENGİNE
app.set("view engine", "ejs");

// MIDDLEWARE's
app.use(express.static("public"));
// fromdan gelen verileri okumamızı sağlayan iki middleware oluşturduk
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// görsel yükleme
app.use(fileUpload());
// guncelleme - put
app.use(methodOverride('_method'))

// ROUTES GET
app.get("/", async (req, res) => {
  const photos = await Photo.find({}, (err, data) => {
    if (err) throw err;
    return data;
  });
  res.render("index", {
    photos,
  });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/add", (req, res) => {
  res.render("add");
});

app.get("/photos/:id", async (req, res) => {
  let id = req.params.id;
  let selectPhoto = await Photo.findById(id, (err, data) => {
    if (err) throw err;
    return data;
  });
  res.render("photo", {
    selectPhoto,
  });
});

app.get('/edit/:id', async (req, res) => {
    let id = req.params.id
    let selectPhoto = await Photo.findById(id, (err, data) => {
        if (err) throw err
        return data
    })
    res.render('edit', {
        selectPhoto
    })
})


// ROUTES POST
app.post("/photos", async (req, res) => {
    // post ekleme
    // upload image
  const uploadDir = "public/uploads";

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }
  const uploadImage = req.files.image;
  let uploadPath = __dirname + "/" + uploadDir + '/' + uploadImage.name;

  uploadImage.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body,
      image: "/uploads/" + uploadImage.name,
    });
    res.redirect("/");
  });
});

// guncelleme
app.put('/edit/:id', async (req, res) => {
    let id = req.params.id
    let selectPhoto = await Photo.findOne({_id : id})
    selectPhoto.title = req.body.title
    selectPhoto.description = req.body.description
    selectPhoto.save()
    res.redirect(`/photos/${id}`)
})



const port = 3000;

app.listen(port, () => {
  console.log(`Sunucu ${port} portunda başlatıldı`);
});
