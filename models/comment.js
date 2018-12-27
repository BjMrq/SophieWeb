var mongoose = require ("mongoose");


//Schema setup (comment)
var commentSchema = new mongoose.Schema({
  text: String,
  pictitle: String,
  author: {
    id:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
    },
    name: String,
    surname: String,
    image: String,
  },
  created: {type : Date, default: Date.now}
});

module.exports = mongoose.model("comment", commentSchema);
