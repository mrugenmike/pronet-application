var express = require('express');
var router = express.Router();
var http = require('http');
var Client = require('node-rest-client').Client;
var client = new Client();

function requireLogin (req, res, next) {
    console.log("requirelogin");
    if (!req.session.user) {
        console.log("req.user not found");
        res.redirect('/login');
    } else {
        next();
    }
};

router.get("/",function(req,res){
    res.render("index.ejs");
});

router.get("/about",function(req,res){
   res.render("about.ejs");
});

router.get("/signup",function(req,res){
    res.render('signup.ejs', {"error1":"", "name" :"" , "email" :"", "password" :"" ,  "role" :""});
});

router.post("/signuprest",function(req,res1){
    console.log("name: "+req.body.name);
    console.log("email: "+req.body.email);
    console.log("password: "+req.body.password);
    console.log("role: "+req.body.role);

    args={
        data:{name:req.body.name, email:req.body.email, password:req.body.password, role:req.body.role},
        headers:{"Content-Type": "application/json"}
    };

    client.post("http://localhost:8080/signingUp",args,function(data,res)
    {
        console.log(res.statusCode);
        if(res.statusCode == 400)
            res1.render('signup.ejs', {"error1":data.message, "name" :req.body.name , "email" :req.body.email, "password" :req.body.password ,  "role" :req.body.role});
        else
        {
            res1.redirect('/dashboard');
        }
    });

});

router.get("/login",function(req,res){
    res.render("login.ejs",{"error1":"" , "email" :"" , "password" :"" });
});

router.get("/template",requireLogin,function(req,res){
    res.render("template.ejs");
});

router.post('/auth',function(req,res1){
   console.log("auth username: "+req.body.uname);
    console.log("auth password: "+req.body.password);
    args={
        data:{email:req.body.uname , password:req.body.password},
        headers:{"Content-Type": "application/json"}
    };
    client.post("http://localhost:8080/signin",args,function(data,res)
    {
        console.log(res.statusCode);
        /*console.log(res.statusCode);
        if (res.statusCode != 200) {
            if (data.hasOwnProperty("error")) {
                console.log(data.error);
                console.log(data.message);
            } else {
                console.log(res.headers.status);
            }
        }*/

        if(res.statusCode == 200) {
            res1.render('login.ejs', {"error1":"Email or Password is invalid " , "email" :req.body.uname , "password" :req.body.password });
       }
        else
        {
            req.session.user = req.body.uname;
            res1.redirect('/dashboard');
        }
    });
});

router.get('/signout', function (req, res) {
    req.session.reset();
    res.redirect('/');
});

router.get("/dashboard",requireLogin,function(req,res){
    res.render("template");
})

router.get("/jobs",requireLogin,function(req,res){
   res.render("jobsearch")
});

router.get("/jobs/listings/:searchTerm",requireLogin,function(req,res){
    client.get("http://localhost:8080/api/v1/jobs?query="+req.param("searchTerm"),function(data){
        res.send(data);
    })
});

router.get("/feeds",requireLogin,function(req,res){
    res.render("feeds")
})
module.exports = router;