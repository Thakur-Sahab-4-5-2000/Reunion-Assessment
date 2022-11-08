const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },

  comments: [
    {
      body: {
        type: String,
        required: true,
      },
      userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserSchema",
      },
    },
  ],
  likes: [
    {
      userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserSchema",
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserSchema",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("PostSchema", postSchema);
