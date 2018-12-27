var express = require("express");
var router = express.Router();
var request = require("request");

var picture = require("../models/picture");
var comment = require("../models/comment");
var user = require("../models/user");

var middleware = require("../middleware");

router.get("/adminPanel", middleware.isAdmin, function(req, res){
  console.log("People in adminPanel!");
  user.find({}).populate("comments").exec(function(err, users){
    if (err){
      console.log( err);
    } else {
      res.render("admin/admin", {users: users});
    }
  });
});

module.exports = router;
