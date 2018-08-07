const express = require('express');
const app = express();
const mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
  title: String,
  text: String,
  user: {
    username: String,
    id: mongoose.Schema.Types.ObjectId
  }
});

var Post = mongoose.model('Post', postSchema);

module.exports = Post;