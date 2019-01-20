require('dotenv').config();
var express               = require("express"),
    secure                = require('express-force-https'),
    bodyParser            = require("body-parser"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    localStrategy         = require("passport-local").Strategy,
    passportLocalMongoose = require("passport-local-mongoose"),
    methodOverride        = require("method-override"),
    async                 = require("async"),
    nodemailer            = require("nodemailer"),
    crypto                = require("crypto"),
    flash                 = require("connect-flash");

var collectionRoutes   = require("./routes/collection"),
    authRoutes         = require("./routes/auth"),
    commentRoutes      = require("./routes/comments"),
    otherRoutes        = require("./routes/other");
    userRoutes         = require("./routes/user");
    adminRoutes         = require("./routes/admin");


// Models
mongoose.connect(process.env.MONGODB, { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true });

var picture = require ("./models/picture");
var comment = require ("./models/comment");
var user = require ("./models/user");


// App setup
var app = express();

app.use(secure);

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());


//Authentication
app.use(require("express-session")({
  secret: "I like to eat bananas while taking a bath in Alaska",
  resave: false,
  saveUninitialized: false
}));

passport.use(user.createStrategy());

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

// Routes

app.use(adminRoutes);
app.use("/collection", collectionRoutes);
app.use(authRoutes);
app.use(userRoutes);
app.use("/collection/:id/comments",commentRoutes);
app.use(otherRoutes);



// Listen
app.listen(process.env.PORT, process.env.IP, function(){
  console.log("Server has started! Let's go!");
});
