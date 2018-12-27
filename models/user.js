var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
  name: String,
  surname: String,
  image: { type: String, default:"/ImagesSophie/defayltpic.jpg"},
  imageId: String,
  facebook: String,
  instagram: String,
  email: {type: String, unique: true, required: true},
  password: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  isAdmin: {type: Boolean, default: false},
  pictures:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "picture",
  },],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comment",
    },
  ]
});


userSchema.plugin(passportLocalMongoose, { usernameField: "email" });

module.exports = mongoose.model("user", userSchema);
