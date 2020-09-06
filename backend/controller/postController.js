const Post = require("../models/postModel");

const catchAsync = require("../utils/catchAsync");
const AppErrors = require("../utils/appErrors");

exports.createPost = catchAsync(async (req, res, next) => {
  const { title, content } = req.body;
  const url = req.protocol + "://" + req.get("host");
  const filewithUrl = url + "/images/" + req.file.filename;
  const post = await Post.create({
    title,
    content,
    imagePath: filewithUrl,
    creator: req.userData.userId,
  });
  // const post = new Post({
  //   title,
  //   content,
  //   imagePath: filewithUrl,
  //   creator: req.userData.userId,
  // });
  // post.save();

  res.status(201).json({
    status: "success",
    post: {
      id: post._id,
      title: post.title,
      content: post.content,
      imagePath: post.imagePath,
      creator: req.userData.userId,
    },
  });
});

exports.getPosts = catchAsync(async (req, res, next) => {
  const currentpage = +req.query.currentpage;
  const pagesize = +req.query.pagesize;
  const PostQuery = Post.find();

  if (currentpage && pagesize) {
    PostQuery.skip(pagesize * (currentpage - 1)).limit(pagesize);
  }
  const posts = await PostQuery;
  const totalposts = await Post.count();
  res.status(200).json({
    status: "success",
    posts,
    totalposts,
  });
});

exports.getPost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return next(new AppErrors("401", "No post found for this selection"));
  }
  res.status(200).json({ status: "success", post });
});

exports.updatePost = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    const filewithUrl = url + "/images/" + req.file.filename;
    req.body.imagePath = filewithUrl;
  }
  const statusUpdate = await Post.findOneAndUpdate(
    { _id: id, creator: req.userData.userId },
    req.body
  );

  if (statusUpdate === null) {
    return next(
      new AppErrors("401", "Not Authorized to delete the others Post")
    );
  }
  res.status(200).json({ status: "success" });
});

exports.deletePost = catchAsync(async (req, res, next) => {
  const post = await Post.findOneAndDelete({
    _id: req.params.id,
    creator: req.userData.userId,
  });
  if (post === null) {
    return next(
      new AppErrors("401", "Not Authorized to delete the others Post")
    );
  }
  res.status(200).json({ status: "success" });
});
