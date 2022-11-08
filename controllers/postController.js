const postSchema = require("../models/postSchema");
const { validationResult } = require("express-validator");

const addNewPost = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const newPost = new postSchema({
      title: req.body.title,
      description: req.body.description,
      createdBy: req.user.id,
    });
    const savedPost = await newPost.save();
    const { _id, title, description, date } = savedPost;
    res.status(200).json({ _id, title, description, date });
  } catch (err) {
    console.log("Error", err);
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await postSchema.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    if (post.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Unauthorized" });
    }
    await post.remove();
    res.json({ msg: "Post deleted Successfully" });
  } catch (err) {
    console.log("Error", err);
  }
};

const getAllPosts = async (req, res) => {
  try {
    const post = await postSchema.find().sort({ date: -1 });
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    const arrayPosts = post;
    const posts = [];
    arrayPosts.map((i) => {
      const { _id, title, description, comments, likes, createdBy, date } = i;
      let likeCount = 0;
      likes.map((i) => likeCount++);

      posts.push({
        _id,
        title,
        description,
        comments,
        likeCount,
        createdBy,
        date,
      });
    });
    res.status(200).json(posts);
  } catch (err) {
    console.log("Error", err);
  }
};

const getPostByID = async (req, res) => {
  try {
    const post = await postSchema.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    const { _id, comments, likes } = post;
    let commentCount = 0;
    comments.map((i) => commentCount++);
    let likeCount = 0;
    likes.map((i) => likeCount++);

    res.status(200).json({
      _id,
      commentCount,
      likeCount,
    });
  } catch (err) {
    console.log("Error", err);
  }
};

const addComment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const post = await postSchema.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    const newComment = {
      body: req.body.comment,
      userID: req.user.id,
    };
    post.comments.unshift(newComment);
    const saveComment = await post.save();
    const { _id } = saveComment;
    res.status(200).json({ _id });
  } catch (err) {
    console.log("Error", err);
  }
};

const like = async (req, res) => {
  try {
    const post = await postSchema.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    if (post) {
      if (post.likes.find((like) => like.userID.toString() === req.user.id)) {
        return res.status(400).json({ msg: "Post already liked" });
      } else {
        post.likes.push({
          userID: req.user.id,
        });
      }
      await post.save();
      res.status(200).send("Post Liked");
    }
  } catch (err) {
    console.log("Error", err);
  }
};

const unlike = async (req, res) => {
  try {
    const post = await postSchema.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    if (post) {
      if (post.likes.find((like) => like.userID.toString() === req.user.id)) {
        post.likes = post.likes.filter(
          (like) => like.userID.toString() !== req.user.id
        );
      } else {
        return res.status(400).json({ msg: "Post has not yet been liked" });
      }
      await post.save();
      res.status(200).send("Post Unliked");
    }
  } catch (err) {
    console.log("Error", err);
  }
};

module.exports = {
  addNewPost,
  deletePost,
  getAllPosts,
  getPostByID,
  addComment,
  like,
  unlike,
};
