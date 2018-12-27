var express = require("express");
var router = express.Router();

var picture = require("../models/picture");
var comment = require("../models/comment");
var user = require("../models/user");


// landingPage
router.get("/landing", function (req, res){
  console.log("Someone is landing");
  res.render("landing/landing");
});

// Foyer
router.get("/foyer", function (req, res){
  console.log("Someone is in the foyer");
  res.render("other/foyer");
});

// About
router.get("/about", function (req, res){
  console.log("Someone is in the about");
  res.render("other/about");
});

// Contact
router.get("/contact", function (req, res){
  console.log("Someone is in the contact");
  res.render("other/contact");
});

// RGB Game
router.get("/colorGame", function (req, res){
  console.log("Someone is playing the RGB game");
  res.render("other/colorGame");
});

// 404
router.get("*", function (req, res){
  res.send("404 sorry we didn't find what you where looking for");
});

module.exports = router;
