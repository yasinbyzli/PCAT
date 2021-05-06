const Photo = require("../models/Photo");
const fs = require("fs");

exports.getAllPhotos = async (req, res) => {

    const page = req.query.page || 1
    const photosPerPage = 3 // sayfada kaç fotograf gozukmesini isityoruz
    const totalPhotos = await Photo.find({}).countDocuments()
    const photos = await Photo.find({})
                            .sort('-dateCreated')
                            .skip((page-1) * photosPerPage)  // 1 ve 2 yi pas geç
                            .limit(photosPerPage);
    res.render("index", {
        photos,
        current : page,
        pages : Math.ceil(totalPhotos / photosPerPage)
    });
                            
  }

exports.getPhoto = async (req, res) => {
    let id = req.params.id;
    let selectPhoto = await Photo.findById(id, (err, data) => {
      if (err) throw err;
      return data;
    });
    res.render("photo", {
      selectPhoto,
    });
  }

exports.createPhoto = async (req, res) => {
    // post ekleme
    // upload image
    const uploadDir = "public/uploads";
  
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    const uploadImage = req.files.image;
    let uploadPath = __dirname + "/../" + uploadDir + "/" + uploadImage.name;
  
    uploadImage.mv(uploadPath, async () => {
      await Photo.create({
        ...req.body,
        image: "/uploads/" + uploadImage.name,
      });
      res.redirect("/");
    });
  }
  
exports.updatePhoto = async (req, res) => {
    let id = req.params.id;
    let selectPhoto = await Photo.findOne({ _id: id });
    selectPhoto.title = req.body.title;
    selectPhoto.description = req.body.description;
    selectPhoto.save();
    res.redirect(`/photos/${id}`);
  }

exports.deletePhoto = async (req, res) => {
    let id = req.params.id;
    let selectPhoto = await Photo.findOne({ _id: id });
    let deletedImage = __dirname + "/../public" + selectPhoto.image;
    fs.unlinkSync(deletedImage);
    await Photo.findByIdAndRemove({ _id: id });
    res.redirect("/");
  }