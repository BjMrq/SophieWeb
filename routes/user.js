var express = require("express");
var router = express.Router();
var passport = require("passport");
var async = require ("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");

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


// Register
router.get("/user/register", function(req, res){
  res.render("rNL/register");
});

router.post("/user/register", function(req, res){
  var newUser = new user({
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,});
    user.register(newUser, req.body.password, function (err, user){
      if (err){
        req.flash("error", err.message);
        console.log("Something went wrong registering a new user " + err);
        res.render("rNL/register");
      } if (req.body.password !== req.body.confirm) {
        req.flash("error","Your confirm password didn't match please try again" );
      } else {
        console.log("New user: " + user);
        passport.authenticate("local")(req, res, function(){
          req.flash("success", "Welcome, " + user.name + "!");
          res.redirect("/user/" + user.id);
        });
      }
    });
});

// User profile
router.get("/user/:user_id", middleware.isUser, function(req, res){
  user.findById(req.params.user_id).populate("comments").exec(function(err, user){
    if (err){
      console.log( err);
      } else {
        res.render("rNL/profile", {user: user});
      }
  });
});

router.put("/user/:user_id", middleware.isUser,  upload.single("image"), function(req, res){
  user.findById(req.params.user_id, async function(err, user){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            if (req.file) {
              if (user.image !== "/ImagesSophie/defayltpic.jpg"){
                try {
                    await cloudinary.v2.uploader.destroy(user.imageId);
                    var result = await cloudinary.v2.uploader.upload(req.file.path);
                    user.imageId = result.public_id;
                    user.image = result.secure_url;
                    user.save();
                    res.redirect("/user/" + user._id);
                } catch(err) {
                    return res.redirect("back");
                }
              } else {
                cloudinary.uploader.upload(req.file.path, function(result) {
                req.body.image = result.secure_url;
                req.body.imageId = result.public_id;
                user.image = req.body.image;
                user.imageId = req.body.imageId;
                user.save();
                res.redirect("/user/" + user._id);
              });
            }
          }
        }
          user.name = req.body.user.name;
          user.surname = req.body.user.surname;
          user.facebook = req.body.user.facebook;
          user.instagram = req.body.user.instagram;
          user.save();
          req.flash("success","Your profile was successfully updated!");
          res.redirect("/user/" + user._id);
      });
});


router.get("/watch/:user_id", middleware.isLoggedIn, function(req, res){
  user.findById(req.params.user_id, function(err, user){
  if (err){
    console.log("oupsy can't get the pictures" + err);
  } else {
    res.render("rNL/watchprofile", {user: user});
  }
});
});






module.exports = router;
