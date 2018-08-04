const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Post = require('./models/post');
const User = require('./models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportLocalMongoose = require('passport-local-mongoose');
const session = require('express-session');

mongoose.connect("mongodb://localhost:27017/reddit-clone", {
  useNewUrlParser: true
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(__dirname + '/public'));
app.use(passport.initialize());
app.use(session({
  secret: "Super Secure message",
  saveUninitialized: false,
  resave: false
}));


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());





app.get('/', (req, res) => {
  Post.find({}, function (err, foundPosts) {
    if (err) {
      console.log(err);
      res.redirect('/');
    } else {
      console.log("Found Posts");
      console.log(foundPosts);
      res.render('index', {
        posts: foundPosts
      });
    }
  });
});

app.get('/new', (req, res) => {
  res.render('new');
});

app.post('/', (req, res) => {
  let body = req.body;
  Post.create({
    title: body.title,
    text: body.text
  }, function (err, newPost) {
    if (err) {
      console.log(err);
      res.redirect('/');
    } else {
      console.log("Created new post");
      console.log(newPost);
      res.redirect('/');
    }
  })
})

app.get('/register', (req, res) => {
  res.render("register");
});

app.post('/register', (req, res) => {
  var body = req.body;
  User.create({
    username: body.username,
    password: body.password
  })
});

app.get('/login', (req, res) => {
  res.render("login");
});

app.get('/users', (req, res) => {
  res.render("users");
});

app.listen(3000, function () {
  console.log("Server Started...");
});