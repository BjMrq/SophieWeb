var express = require("express");
var router = express.Router({mergeParams: true});

var picture = require("../models/picture");
var comment = require("../models/comment");
var user = require("../models/user");

var middleware = require("../middleware");

//Comments routes
// Create comment
router.post("/", middleware.isLoggedIn, function(req, res){
  picture.findById(req.params.id, function (err, picture){
    if (err) {
      req.flash("error", "Oupsy something went wrong!");
      console.log("Error posting comment " + err);
    } else {
      comment.create(req.body.comment, function (err, comment){
        if (err){
          req.flash("error", "Oupsy something went wrong!");
          console.log("Error posting comment " + err);
        } else {
          comment.author.id = req.user._id;
          comment.author.name = req.user.name;
          comment.author.surname = req.user.surname;
          comment.author.image = req.user.image;
          comment.pictitle = picture.title;
          comment.save();
          picture.comments.push(comment);
          picture.save();
          user.findById(req.user._id, function (err, user){
            if (err){
              console.log(err);
            } else {
              user.comments.push(comment);
              user.save();
            }
          });
          req.flash("success", "Your comment was posted!");
          res.redirect("/collection/" + picture._id);
        }
      });
    }
  });
});

//Updtate comment
router.put("/:comment_id", middleware.isCommentAuthor, function(req, res){
  comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, foundComment){
    if (err){
      req.flash("error", "Error updating your comment!");
      console.log(err);
    } else {
      req.flash("success", "Your comment was updated!");
      res.redirect("/collection/" + req.params.id);
    }
  });
});

//Delete route
router.delete("/:comment_id", middleware.isCommentAuthor, function(req, res){
  comment.findByIdAndRemove(req.params.comment_id, function(err){
    if (err){
      console.log(err);
    } else {
      req.flash("success", "Your comment was deleted!");
      res.redirect("/collection/" + req.params.id);
    }
  });
});



module.exports = router;
