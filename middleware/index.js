function isLoggedIn(req, res, next){
    console.log(req.user);
    if(!req.user){
        return res.redirect('/login');
    }
    next();
}
module.exports.isLoggedIn = isLoggedIn;
