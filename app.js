const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Post = require('./models/post');
const User = require('./models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportLocalMongoose = require('passport-local-mongoose');
const expressSession = require('express-session');
const middleware  = require('./middleware');
const methodOverride = require('method-override');

mongoose.connect("mongodb://localhost:27017/reddit-clone", {
  useNewUrlParser: true
});

//setup session
app.use(expressSession({
  secret: "The secret message",
  resave: false,
  saveUninitialized: false
}));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(methodOverride('_method'));

//setup passport
app.use(express.static(__dirname + '/public'));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
  res.locals.user = req.user;
  next();
});



// Routes

app.get('/', (req, res) => {
  Post.find({}, function (err, foundPosts) {
    if (err) {
      console.log(err);
      res.redirect('/');
    } else {
      res.render('index', {
        posts: foundPosts
      });
    }
  });
});

app.get('/new', middleware.isLoggedIn , (req, res) => {
  res.render('new');
});

app.post('/', (req, res) => {
  let body = req.body;
  let username = {
    username: req.user.username,
    id: req.user._id
  };
  console.log(req.user._id);
  User.findById(req.user._id, function(err, foundUser){
    Post.create({
      title: body.title,
      text: body.text,
      user: username
    }, function (err, newPost) {
      if (err) {
        console.log(err);
        res.redirect('/');
      } else {
        console.log("Created new post");
        console.log(newPost);
        res.redirect('/');
      }
    });
  })
})

app.get('/posts/:id', (req, res) => {
  Post.findById(req.params.id, function(err, foundPost){
    if(err){
      console.log(err);
      res.redirect('/');
    }else{
      res.render('show', {post: foundPost});
    }
  })
});

app.put('/posts/:id', middleware.checkUserAuthentication ,(req, res) => {
  console.log("inside put route");
  Post.findByIdAndUpdate(req.params.id, {$set:req.body} ,function(err, updatePost){
    if(err){
      console.log("error");
      console.log(err);
      res.redirect('/');
    }else{
      console.log("Update Post wala");
      console.log(updatePost);
      res.render('edit', {post: updatePost});
    }
  });
});

app.get('/register', (req, res) => {
  res.render("register");
});

app.post('/register', (req, res) => {
  User.register({username: req.body.username}, req.body.password, function(err, user){
    if(err){
      console.log(err);
      res.redirect('/register');
    }else{
      console.log("Signed in: ", req.user);
      res.redirect('/');
    }
  })
});

app.delete('/posts/:id', middleware.checkUserAuthentication ,(req, res) => {
  Post.findByIdAndRemove(req.params.id, function(err, success){
    if(err){
      console.log(err);
    }else{
      console.log("Delete successful");
    }
    console.log(req.user);
    res.redirect('/');
  })
});

app.get('/login', (req, res) => {
  res.render("login");
});

app.post('/login', passport.authenticate('local', {
  successRedirect: "/",
  failureRedirect: "/login"
}) ,(req, res) => {
});

app.get('/logout', (req, res) => {
  console.log(req.user);
  req.logout();
  res.redirect("/");
  console.log(req.user);
});

app.get('/users', (req, res) => {
  User.find({}, function(err, users){
    if(err){
      console.log(err);
      res.redirect('/');
    }else{
      console.log(users);
      res.render("users", {users: users});
    }
  })
});

app.listen(3000, function () {
  console.log("Server Started...");
});
