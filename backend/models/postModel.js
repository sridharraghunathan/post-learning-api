const mongoose = require("mongoose");
const postSchema = mongoose.Schema({
  title: String,
  content: String,
  imagePath: String,
  creator: { type: mongoose.Schema.Types.ObjectId , required :true },
});
const Post = mongoose.model("Post", postSchema);
module.exports = Post;
