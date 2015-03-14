var express = require('express');
var router = express.Router();

function requireLogin (req, res, next) {
    console.log("requirelogin");
    if (!req.session.user) {
        console.log("req.user not found");
        res.redirect('/login');
    } else {
        next();
    }
};

router.get('/',function(req, res) {
  res.redirect("/dashboard");
});

router.get("/login",function(req,res){
    res.render("login.ejs",{error:"Please Login"});
});


var user = {uname:"mrugen",password:"password"};

router.post('/auth',function(req,res){
    console.log("auth: "+req.body.uname);
        if (req.body.uname===user.uname) {
            if (req.body.password === user.password) {
                // sets a cookie with the user's info
                req.session.user = user;
                res.redirect('/dashboard');
            } else {
                res.render('login.ejs', { error: 'Invalid email or password.' });
            }

        } else {
            res.render('login.ejs', { error: 'Invalid email or password.' });
        }
});

router.post('/logout', function (req, res) {
    req.session.reset();
    res.redirect('/');
});


router.get("/dashboard",requireLogin,function(req,res){
    console.log("dashboard");
    res.render("dashboard",{"name":"dummy"});
})
module.exports = router;
