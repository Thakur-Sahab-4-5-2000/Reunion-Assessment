const express = require("express");
const router = express.Router();
const {
  createUser,
  login,
  logout,
  getUserProfile,
  follow,
  unfollow,
} = require("../controllers/userController");
const { body } = require("express-validator");
const { verifyToken } = require("../utils/verifyToken");

router.post(
  "/register",
  [
    body("email").isEmail(),
    body("password")
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
      })
      .withMessage(
        "Password must be greater than 8 and contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    body("username").isLength({ min: 5 }),
  ],
  createUser
);

router.post(
  "/authenticate",
  [
    body("email").isEmail(),
    body("password")
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
      })
      .withMessage(
        "Password must be greater than 8 and contain at least one uppercase letter, one lowercase letter, and one number"
      ),
  ],
  login
);

router.get("/logout", logout);

router.get("/user", verifyToken, getUserProfile);

router.post("/follow/:id", verifyToken, follow);

router.post("/unfollow/:id", verifyToken, unfollow);

module.exports = router;
