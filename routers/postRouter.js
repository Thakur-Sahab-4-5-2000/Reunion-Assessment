const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  addNewPost,
  deletePost,
  getAllPosts,
  getPostByID,
  addComment,
  like,
  unlike,
} = require("../controllers/postController");
const { verifyToken } = require("../utils/verifyToken");

router.post(
  "/posts",
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
  ],
  verifyToken,
  addNewPost
);

router.delete("/posts/:id", verifyToken, deletePost);

router.get("/posts/all_posts", verifyToken, getAllPosts);

router.get("/posts/:id", verifyToken, getPostByID);

router.post(
  "/comment/:id",
  [body("comment").notEmpty().withMessage("comment is required")],
  verifyToken,
  addComment
);

router.post("/like/:id", verifyToken, like);

router.post("/unlike/:id", verifyToken, unlike);

module.exports = router;
