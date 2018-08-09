const Post = require('../models/post');

function isLoggedIn(req, res, next){
    console.log(req.user);
    if(!req.user){
        return res.redirect('/login');
    }
    next();
}

function checkUserAuthentication(req, res, next){
    if(!req.user){
            res.redirect('/login');
            console.log('User not logged in');
        }else{
            console.log("User is logged in");
            Post.findById(req.params.id, function(err, foundPost){
            if(err){
                console.log(err);
                res.redirect('/');
            }else{
                console.log(foundPost);
                if(req.user._id.equals(foundPost.user.id)){
                    next();
                }else{
                    res.redirect('/');
                    console.log("You are not authorized to do that");
                }
            }
        })
        }
    }
    

module.exports.isLoggedIn = isLoggedIn;
module.exports.checkUserAuthentication = checkUserAuthentication;
