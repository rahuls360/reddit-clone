const express = require('express');
const app = express();
const mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
  title: String,
  text: String
});

var Post = mongoose.model('Post', postSchema);

module.exports = Post;