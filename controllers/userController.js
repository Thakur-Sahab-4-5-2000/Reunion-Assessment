const userSchema = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const dotenv = require("dotenv");
dotenv.config();

const createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { email } = req.body;
    const user = await userSchema.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = new userSchema({
      username: req.body.username,
      email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    const { _id, password, followers, following, date } = savedUser;
    res.status(400).json({ _id, email, password, followers, following, date });
  } catch (err) {
    console.log("Error", err);
  }
};

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { email } = req.body;
    const user = await userSchema.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    const { _id, password, followers, following, date } = user;
    if (!validPassword) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res
      .cookie("token", token, { httpOnly: true })
      .status(200)
      .json({ _id, email, token });
  } catch (err) {
    console.log("Error", err);
  }
};

const logout = async (req, res) => {
  res.clearCookie("token").json({ msg: "Logged out" });
};

const getUserProfile = async (req, res) => {
  try {
    const user = await userSchema.findById(req.user.id);
    if (!user) {
      res.status(400).send("No user found");
    }
    const { username, followers, following } = user;
    let followersCount = 0;
    followers.map((i) => {
      followersCount++;
    });
    let followingCount = 0;
    following.map((i) => {
      followingCount++;
    });
    res.status(200).json({ username, followersCount, followingCount });
  } catch (err) {
    console.log("Error", err);
  }
};

const follow = async (req, res) => {
  try {
    const user1 = await userSchema.findById(req.params.id);
    const user2 = await userSchema.findById(req.user.id);

    if (req.params.id === req.user.id) {
      res.status(400).json({ msg: "You cannot follow yourself" });
    }
    if (!user1 || !user2) {
      res.status(400).send("No user found");
    }

    if (user1 && user2) {
      if (user1.followers.find((i) => i.userID.toString() === req.user.id)) {
        return res.status(400).json({ msg: "Already following this person" });
      } else {
        user1.followers.push({
          userID: req.user.id,
        });
        user2.following.push({
          userID: req.params.id,
        });
        await user1.save();
        await user2.save();
        res.status(200).json({ msg: "Followed" });
      }
    }
  } catch (err) {
    res.status(400).json({ Error: err });
  }
};

const unfollow = async (req, res) => {
  try {
    const user1 = await userSchema.findById(req.params.id);
    const user2 = await userSchema.findById(req.user.id);

    if (req.params.id === req.user.id) {
      return res.status(400).json({ msg: "You cannot unfollow yourself" });
    }
    if (!user1 || !user2) {
      res.status(400).send("No user found");
    }
    if (user1 && user2) {
      if (user1.followers.find((i) => i.userID.toString() === req.user.id)) {
        user1.followers = user1.followers.filter(
          (i) => i.userID.toString() !== req.user.id
        );
        user2.following = user2.following.filter(
          (i) => i.userID.toString() !== req.params.id
        );
        await user1.save();
        await user2.save();
        res.status(200).json({ msg: "Unfollowed" });
      } else {
        return res.status(400).json({ msg: "You are not following this user" });
      }
    }
  } catch (err) {
    console.log("Error", err);
  }
};

module.exports = {
  createUser,
  login,
  logout,
  getUserProfile,
  follow,
  unfollow,
};
