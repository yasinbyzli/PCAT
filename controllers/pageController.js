const Photo = require("../models/Photo");

exports.getAboutPage = (req, res) => {
  res.render("about");
};

exports.getAddPage = (req, res) => {
  res.render("add");
};

exports.getEditPage = async (req, res) => {
  let id = req.params.id;
  let selectPhoto = await Photo.findById(id, (err, data) => {
    if (err) throw err;
    return data;
  });
  res.render("edit", {
    selectPhoto,
  });
};
