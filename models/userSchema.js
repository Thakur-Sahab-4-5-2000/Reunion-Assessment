const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },

  followers: [
    {
      userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserSchema",
      },
    },
  ],
  following: [
    {
      userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserSchema",
      },
    },
  ],

  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("UserSchema", userSchema);
