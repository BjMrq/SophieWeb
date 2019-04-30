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


// Authenticate routes
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


//Login
router.get("/login", function(req, res){
  res.render("rNL/login");
});

router.post("/login", passport.authenticate("local",
  {
    successRedirect: "/collection",
    failureRedirect: "/login",
    badRequestMessage : 'Hum sounds like it is missing username or password.',
    failureFlash: true,
    successFlash : "Hi there! Welcome back."
  }), function(req, res){
});

//Logout
router.get("/logout", function(req,res){
  req.logout();
  req.flash("success", "You are logged out, see you soon!");
  res.redirect("back");
});

// Forgot password
router.get("/forgot", function(req,res){
  res.render("rNL/forgot");
});

router.post("/forgot", function(req, res){
  async.waterfall([
    function(done){
      crypto.randomBytes(20, function(err, buf){
        var token = buf.toString("hex");
        done(err, token);
      });
    },
    function(token, done){
      user.findOne({email: req.body.email}, function(err, user){
        if (!user){
          req.flash("error", "Are you sure it is the right email? We didn't find any account with that email adress.");
          return res.redirect("/forgot");
        }
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000;
        user.save(function(err){
          done(err, token, user);
        });
      });
    },
    function(token, user, done){
      var smtpTransport = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: "rigantona.cracagnou@gmail.com",
          pass: process.env.GMAILPW,
        }
      });
      var mailOptions = {
        to: user.email,
        from: "Cracagnou",
        subject: "Your reset password link!",
        text: "Hey there! Here is your link to reset your password, just click on it or copy it in your browser " + "https://" + req.headers.host + "/reset/" + token + '\n\n' + ". Have a good day!"
      };
      smtpTransport.sendMail(mailOptions, function(err){
        console.log("password reset e-mail sent to " + user.email);
        req.flash("success", "An e-mail has been sent to " + user.email + " to reset your password, you should get it in a couple of minutes");
        res.redirect("/collection");
      });
    }
  ], function(err){
    if (err) return next(err);
    res.redirect("/forgot");
  });
});

// Update password
router.get("/reset/:token", function(req, res){
  user.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now() } }, function(err, user){
    if (!user){
      req.flash("error", "Your password reset token is invalid or has expired, please try again or contact us.");
      res.redirect("/forgot");
    }
    res.render("rNL/reset", {token: req.params.token});
  });
});

router.post("/reset/:token", function(req, res){
  async.waterfall([
    function(done){
      user.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now() } }, function(err, user){
        if (!user){
          req.flash("error", "password reset token is invalid or has expired, please try again or contact us.");
          res.redirect("/forgot");
        } if (req.body.password !== req.body.confirm) {
          req.flash("error","Your confirm password didn't match please try again" );
        } else {
          user.setPassword(req.body.password, function(err){
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            user.save(function(err){
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          });
        }
      });
    },
  ]);
});

module.exports = router;
