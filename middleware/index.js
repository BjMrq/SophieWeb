var picture = require("../models/picture");
var comment = require("../models/comment");
var user = require("../models/user");

// Middlewares

var middlewareObj = {};

middlewareObj.isAdmin = function(req, res, next){
  if (req.user === undefined || !user) {
    req.flash("error", "This is a very restricted area, sorry!");
    res.redirect("/login");
  } else if (req.user.isAdmin === true) {
    return next();
  } else {
    req.flash("error", "This is a very restricted area, sorry!");
    res.redirect("/login");
  }
};

middlewareObj.isCommentAuthor = function(req, res, next){
  if (req.isAuthenticated()){
    picture.findById(req.params.comment_id, function(err, foundcomment){
      if (err || !foundcomment){
        req.flash("error", "Couldn't find this comments!");
        console.log(err);
      } else {
        if (foundcomment.author.id.equals(req.user._id)){
          next();
        } else {
          req.flash("error", "You can only edit your own comments!");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
  }
};

middlewareObj.isPictureAuthor = function(req, res, next){
  if (req.isAuthenticated()){
    picture.findById(req.params.id, function(err, foundpicture){
      if (err || !foundpicture ){
      req.flash("error", "Oupsy couldn't find this picture!");
      console.log(err);
      } else {
        if (foundpicture.author.id.equals(req.user._id)){
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
  }
};

middlewareObj.isLoggedIn = function(req, res, next){
  if (req.isAuthenticated()){
    return next();
  }
  req.flash("error", "You need to be login to do that!");
  res.redirect("/login");
};

middlewareObj.isUser = function (req, res, next){
    if (req.isAuthenticated()){
      user.findById(req.params.user_id, function(err, user){
        if (err || !user){
          console.log(err);
        } else {
          if (user.id == req.user._id || req.user.isAdmin === true){
            next();
          } else {
            res.redirect("back");
          }
        }
      });
    } else {
      res.redirect("/login");
    }
};

module.exports = middlewareObj;
