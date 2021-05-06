const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const methodOverride = require("method-override"); // delete ve update islemleri için
const photoController = require("./controllers/photoControllers");
const pageController = require("./controllers/pageController");
require("dotenv").config();
const app = express();

try {
  mongoose.connect(
    "mongodb://localhost/pcat-test-db",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }
  );
} catch (err) {
  console.log(err);
}

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
app.use(
  methodOverride("_method", {
    methods: ["POST", "GET"],
  })
);

// ROUTES PHOTO
app.get("/", photoController.getAllPhotos);
app.get("/photos/:id", photoController.getPhoto);
app.post("/photos", photoController.createPhoto);
app.put("/photos/:id", photoController.updatePhoto);
app.delete("/photos/:id", photoController.deletePhoto);
// ROUTES PAGE
app.get("/about", pageController.getAboutPage);
app.get("/add", pageController.getAddPage);
app.get("/photos/edit/:id", pageController.getEditPage);

const port = 3000;

app.listen(port, () => {
  console.log(`Sunucu ${port} portunda başlatıldı`);
});
