var mongoose = require ("mongoose");


//Schema setup (picture)
var pictureSchema = new mongoose.Schema({
  title: String,
  image: String,
  imageId: String,
  description: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
    },
    name: String,
    surname: String
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comment",
    },
  ]
});

module.exports = mongoose.model("picture", pictureSchema);
