var express = require('express');
var router = express.Router();
var http = require('http');
var Client = require('node-rest-client').Client;
var client = new Client();
var session= require('express-session');
var sesion_var;
var fs=require('fs');
var multer  = require('multer');
router.use(multer());
var aws=require('aws-sdk');
var redis = require('redis');
var client1 = redis.createClient(6379,'127.0.0.1');
var crypto = require('crypto');

aws.config.loadFromPath('AmazonCredentials/AccDetails.json');


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
    args={
        data:{name:req.body.name, email:req.body.email, password:req.body.password, role:req.body.role},
        headers:{"Content-Type": "application/json"}
    };

    client.post("http://localhost:8080/signingUp",args,function(data,res)
    {
        //console.log(res.statusCode);
        if(res.statusCode == 400)
            res1.render('signup.ejs', {"error1":data.message, "name" :req.body.name , "email" :req.body.email, "password" :req.body.password ,  "role" :req.body.role});
        else
        {
            session_var=req.session;
            session_var.name=req.body.name;
            session_var.role=req.body.role;
            res1.redirect('/login');
        }
    });

});

router.get("/login",function(req,res){
    res.render("login.ejs",{"error1":"" , "email" :"" , "password" :"" });
});

router.get("/template",requireLogin,function(req,res){
    res.render("template.ejs");
});

/*
router.post('/userProf',function(req,res1) {
         console.log("hi");
        console.log(req.body);
    res.render("userProfile.ejs");
});*/

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

        if(res.statusCode == 400) {
            res1.render('login.ejs', {"error1":data.message , "email" :req.body.uname , "password" :req.body.password });

        }
        else
        {
            //alert()
            //req.session.user = req.body.uname;
            //req.session.ID = req.body.uname;
            res1.redirect('/login');
        }
    });
});

router.get("/company_home",function(req,res){
    session.uname="xyz";
    res.render("companyhome.ejs");
});

router.get("/companyprofile",function(req,res){
    res.render("companyprofile.ejs",{"error1":""});
});

router.post("/companyrest",function(req,res){
    console.log("req"+JSON.stringify(req.files.file.path));
    var imgUrl=req.files.file.path;
    var companyId = randomValueHex(12);
    console.log("img path"+req.files.file.path);

    var s3bucket = new aws.S3({params: {Bucket: 'usergallery'}});
    //console.log(JSON.stringify(req.body));
    fs.readFile(imgUrl, function(err, data){
        if (err) { console.log(err); }
        else {
            s3bucket.upload({Key: companyId, Body: data, ContentType: req.files.file.mimetype},function(err,data){
                if (err) {
                    console.log("Error uploading data: ", err);
                }
                else {
                    console.log("Successfully uploaded data to bucket :"+JSON.stringify(data));

                    var params = { Key: 'companyname'};
                    var url = s3bucket.getSignedUrl('getObject', params);
                    console.log("Got a signed URL:", url);

                }
                client1.set('company:'+companyId,url,function(){


                });
                res.status(200).send("Insertion successful");
            });
        }
    });
});


router.get("/jobpost",function(req,res){
    res.render("jobpost.ejs",{"error1":""});
});

router.post("/jobpostrest",function(rest_req,rest_res){
//	console.log("req"+JSON.stringify(rest_req.body));
//    console.log("jtitle: "+rest_req.body.jtitle);
//    console.log("desc: "+rest_req.body.desc);
//    console.log("skills: "+rest_req.body.skills);
//   // console.log("role: "+rest_req.body.role);
//    console.log("start_date:"+rest_req.body.startdate);
//    console.log("ex_date:"+rest_req.body.exdate);
//    console.log("region:"+rest_req.body.region);
    //  console.log("status:"+rest_req.body.status);
    // console.log("company name:"+session_var.uname);


    args={
        data:{
            jtitle:rest_req.body.jtitle,
            desc:rest_req.body.desc,
            skills:rest_req.body.skills,
            start_date:rest_req.body.startdate,
            ex_date:rest_req.body.exdate,
            region:rest_req.body.region,
            status:rest_req.body.status
            // company_name:session_var.uname
        },
        headers:{"Content-Type": "application/json"}
    };

    client.post("http://localhost:3300/jobpost",args,function(data,res)
    {
        console.log(res.statusCode);
        if(res.statusCode == 400)
            rest_res.render('jobpost.ejs', {"error1":data.message});
        else
        {
            //change according to the dependent module (ask varuna)
            rest_res.redirect('/company_home');
        }
    });

});



router.get('/signout', function (req, res) {
    req.session.reset();
    res.redirect('/');
});

//router.get("/dashboard",requireLogin,function(req,res){
  //  res.render("userProfile.ejs");
//})

router.get("/dashboard",function(req,res){
    console.log("hi");
    console.log(req.body);
    res.render("userProfile.ejs");
})


router.post("/dashboard",function(req,res){
    console.log(JSON.stringify(req.body));
    console.log(JSON.stringify(req.files));
    //console.log("req"+JSON.stringify(req.files.userimageinput.path));
    //console.log("mime"+req.files.userimageinput.mimetype)
    //console.log("img path"+req.files.userimageinput.path);

})

function randomValueHex (len) {
    return crypto.randomBytes(Math.ceil(len/2))
        .toString('hex') // convert to hexadecimal format
        .slice(0,len);   // return required number of characters
}
router.get("/jobs",requireLogin,function(req,res){
   res.render("jobsearch")
});

router.get("/jobs/listings/:searchTerm",function(req,res){
    client.get("http://localhost:8080/api/v1/jobs/listings?query="+req.param("searchTerm"),function(data){
        console.log(data);
        res.send(data);
    })
});

router.get("/feeds",requireLogin,function(req,res){
    res.render("feeds")
})
module.exports = router;
