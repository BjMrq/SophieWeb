var express = require("express");
var router = express.Router();
var request = require("request");

var picture = require("../models/picture");
var comment = require("../models/comment");
var user = require("../models/user");

var middleware = require("../middleware");

// Multer config
var multer = require("multer");

var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});

var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

var upload = multer({ storage: storage, fileFilter: imageFilter});

//Cloudinary config
var cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: "syphblog",
  api_key: "227439363687431",
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Index
router.get("/", function(req, res){
  console.log("People here!");
  picture.find({}, function(err, pictures){
    if (err){
      console.log("oupsy can't get the pictures" + err);
    } else {
      res.render("pictures/index", {pictures: pictures});
    }
  });
});

// Creat New picture
router.post("/", middleware.isAdmin,  upload.single("image"), function (req, res){
  cloudinary.uploader.upload(req.file.path, function(result) {
  req.body.picture.image = result.secure_url;
  req.body.picture.imageId = result.public_id;
  req.body.picture.author = {
    id: req.user._id,
    name: req.user.name,
    surname: req.user.surname,
  };
  picture.create(req.body.picture, function(err, picture) {
    if (err) {
      console.log(err);
    }
    user.findById(req.user._id, function (err, user){
      if (err){
        console.log(err);
      } else {
        user.pictures.push(picture);
        user.save();
      }
    });
    req.flash("success", "Your picture is online!");
    res.redirect('/collection/' + picture.id);
  });
});
});


// Show form Creat New picture
router.get("/new", middleware.isAdmin, function (req, res){
  res.render("pictures/new");
});

// Edit picture form
router.get("/:id/edit", middleware.isPictureAuthor, function(req, res){
  picture.findById(req.params.id, function(err, foundpicture){
    if (err || !foundpicture){
      req.flash("error", "Oupsy we could not find what you where looking for..");
      res.redirect("back");
      console.log(err);
    }
    res.render("pictures/edit", {picture: foundpicture});
  });
});

// Edit picture
router.put("/:id", middleware.isPictureAuthor, upload.single("image"), function(req, res){
  picture.findById(req.params.id, async function(err, picture){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            if (req.file) {
              try {
                  await cloudinary.v2.uploader.destroy(picture.imageId);
                  var result = await cloudinary.v2.uploader.upload(req.file.path);
                  picture.imageId = result.public_id;
                  picture.image = result.secure_url;
              } catch(err) {
                  return res.redirect("back");
              }
            }
            picture.title = req.body.picture.title;
            picture.description = req.body.picture.description;
            picture.save();
            req.flash("success","Your picture was successfully updated!");
            res.redirect("/collection/" + picture._id);
        }
    });
});

// Destroy picture
router.delete('/:id', middleware.isPictureAuthor, function(req, res) {
  picture.findById(req.params.id, async function(err, picture) {
    if(err) {
      req.flash("error", err.message);
      return res.redirect("back");
    }
    try {
        await cloudinary.v2.uploader.destroy(picture.imageId);
        picture.remove();
        req.flash('success', 'You made some space for new pictures!');
        res.redirect('/collection');
    } catch(err) {
        if(err) {
          return res.redirect("back");
        }
    }
  });
});


// Show details
router.get("/:id", function(req, res){
  picture.findById(req.params.id).populate("comments").exec(function (err, foundpicture){
    if (err){
      console.log("error showing the picture" + err);
    } else {
      res.render("pictures/show", {picture: foundpicture});
      console.log("Someone is watching " + foundpicture.title);
    }
  });
});


module.exports = router;
