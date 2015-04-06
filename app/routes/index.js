var express = require('express');
var router = express.Router();
var http = require('http');
var Client = require('node-rest-client').Client;
var client = new Client();
var session= require('express-session');

var fs=require('fs');
var multer  = require('multer');
router.use(multer());
var aws=require('aws-sdk');
var crypto = require('crypto');

aws.config.loadFromPath('AmazonCredentials/AccDetails.json');

function requireLogin (req, res, next) {
    console.log("requirelogin");
    if (!req.session.ID) {
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
    args={
        data:{email:req.body.uname , password:req.body.password},
        headers:{"Content-Type": "application/json"}
    };
    client.post("http://localhost:8080/signin",args,function(data,res)
    {
        console.log(res.statusCode);
        console.log(data);
        /*console.log(res.statusCode);
        if (res.statusCode != 200) {
            if (data.hasOwnProperty("error")) {
                console.log(data.error);
                console.log(data.message);
            } else {
                console.log(res.headers.status);
            }
        }*/

        if(res.statusCode == 400)
        {
            res1.render('login.ejs', {"error1":data.message , "email" :req.body.uname , "password" :req.body.password });
        }
        else
        {
            req.session.ID = data.id;
            req.session.page = data.page;
            if (req.session.page == 'U') {
                res1.redirect('/user/'+data.id);
            }
            else {
                res1.redirect('/company/' + data.id);
            }

        }
    });
});

router.get("/user/:userID",requireLogin,function(req,res1){
    var id = req.param("userID");
    console.log(req.session.ID);
    client.get("http://localhost:8080/userprofile/"+id+"/"+req.session.ID,function(data,res){
        console.log(res.statusCode);
        if(res.statusCode != 400)
        {
            if((id == req.session.ID) && (req.session.page =='U') )
                res1.render("userProfile.ejs", {"data": data});
            else
                res1.render("otheruserProfile.ejs" , {"data" : data});
        }
        else
        {
            res1.render("error.ejs",{"message" : "User not found"});
        }
    });
});


router.get("/company/:companyID",requireLogin,function(req,res1){
    var id = req.param("companyID");
    console.log(id);
    client.get("http://localhost:8080/companyprofile/"+id+"/"+req.session.ID,function(data,res){
        console.log(res.statusCode);
        if(res.statusCode != 400) {
            if ((id == req.session.ID) && (req.session.page =='C'))
                res1.render("companyprofile.ejs", {"data": data});
            else
                res1.render("othercompanyprofile.ejs", {"data": data});
        }
        else
        {
            res1.render("error.ejs",{"message" : "Company not found"});
        }
    });
});

router.post("/user/:userID",function(req,res){
    var id = req.param("userID");
    console.log(id);
    console.log(JSON.stringify(req.body));
    console.log(JSON.stringify(req.files));

    // function does not terminate - ask parin / mrugen
    //TODO update an image
    //console.log("req"+JSON.stringify(req.files.userimageinput.path));
    //console.log("mime"+req.files.userimageinput.mimetype)
    //console.log("img path"+req.files.userimageinput.path);
    args={
        data:{
            id: req.session.ID,
            name:req.body.name,
            //imgURL:
            role:req.body.role,
            region:req.body.region,
            education:req.body.education,
            workExperience:req.body.workex,
            summary:req.body.summary,
            educationDetails:req.body.educationdetails,
            skills:req.body.skills,
            certifications:req.body.certification
        },
        headers:{"Content-Type": "application/json"}
    };
    console.log(req.session.ID);
    client.put("http://localhost:8080/userprofile/"+req.session.ID,args,function(data,res)
    {
        console.log(res.statusCode);
        if(res.statusCode == 200)
        {
            //redirect("/user/"+id);
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
    //TODO update lastSeen !!
    req.session.reset();
    res.redirect('/');
});

router.get("/userfollowing",function(req,res1){
    client.get("http://localhost:8080/following/"+req.session.ID,function(data,res){
        console.log(data);
        //res.send(data);
        res1.render("following.ejs",{data:data});
    });
});


function randomValueHex (len) {
    return crypto.randomBytes(Math.ceil(len/2))
        .toString('hex') // convert to hexadecimal format
        .slice(0,len);   // return required number of characters
}

router.get("/jobs",requireLogin,function(req,res){
   res.render("jobsearch")
});

router.get("/jobs/listings/:searchTerm/:skip/:limit",function(req,res){
    var searchTerm = req.param("searchTerm");
    var skip = req.param("skip");
    var limit = req.param("limit");
    client.get("http://localhost:8080/api/v1/jobs/listings?query="+ searchTerm+"&&skip="+ skip+"&&limit="+ limit,function(data,response){
        console.log(data);
        res.header("Cache-Control", "no-cache, no-store, must-revalidate");
        res.header("Pragma", "no-cache");
        res.header("Expires", 0);
        res.send(data);
    })
});


router.post("/companyprofile",function(req,res){
    var id= req.session.ID ;

    args={
        data:{name:req.body.name , url:req.body.url, id:id}, //take id from session,
        headers:{"Content-Type": "application/json"}
    };
    console.log("args"+JSON.stringify(args));
    client.put("http://localhost:8080/company/",args,function(data,rest_res)
    {
        //        console.log(JSON.stringify(data));
        console.log(rest_res.statusCode);
        if(rest_res.statusCode == 201)
            res.redirect("/companyprofile");
    });
});

router.get("/feeds",requireLogin,function(req,res){
    res.render("feeds")
});


router.get("/userprofile",requireLogin,function(req,res){
    res.redirect('/user/'+req.session.ID);
})


router.post("/follow",requireLogin,function(req,res1) {
    console.log("in follow route");
    console.log(req.body.thisID);
    var value = req.body.thisID.split('|');
    var foll = value[4];

    if(foll == "Follow")
    {
        args = {
            data: {
                followerId : value[0],
                followerURL : value[1],
                followerRole : value[2],
                followerName : value[3]
            },
            headers: {"Content-Type": "application/json"}
        };
        console.log(args);
        client.post("http://localhost:8080/follow/"+req.session.ID, args, function (data, res) {
            console.log(res.statusCode);
            console.log(data);
        });
    }
    else
    {
        args = {
            data: { followerId : value[0]},
            headers: {"Content-Type": "application/json"}
        };
        client.delete("http://localhost:8080/follow/"+req.session.ID,args,function (data, res) {
        });
    }
});

module.exports = router;
