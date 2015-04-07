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
var events = require('events');
var EventEmitter = events.EventEmitter;
var eventOnUpload = new EventEmitter();
aws.config.loadFromPath('AmazonCredentials/AccDetails.json');

var backendroute = "http://localhost:8080/api/v1";
function requireLogin (req, res, next) {
    console.log("requirelogin");
    if (!(req.session.ID && req.session.page && req.session.lastseen)) {
        console.log("req.user not found");
        res.redirect('/signin');
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


router.get('/signout', function (req, res) {
    req.session.reset();
    res.redirect('/');
});

router.get("/signin",function(req,res){
    res.render("login.ejs",{"error1":"" , "email" :"" , "password" :"" });
});

router.get("/userprofile",function(req,res1){
    res1.redirect('/user/'+req.session.ID);
});

router.get("/userfollowing",function(req,res1){
    res1.redirect('/following/'+req.session.ID);
});

router.get("/jobs",function(req,res1){
    res1.redirect('/jobs/'+req.session.ID);
});

router.get("/applications",function(req,res1){
    res1.redirect('/applications/'+req.session.ID);
});

router.get("/feeds",function(req,res1){
    res1.redirect('/feeds/'+req.session.ID);
});


router.post('/signin',function(req,res1){
    args={
        data:{email:req.body.uname , password:req.body.password},
        headers:{"Content-Type": "application/json"}
    };
    client.post(backendroute+"/signin",args,function(data,res)
    {
        console.log("response from server"+res.statusCode);
        if(res.statusCode !=200)
        {
            res1.redirect("/signin");//redirect to the page when auth fails
        }
        else
        {
            req.session.ID = data.id;
            req.session.page = data.page;
            req.session.lastseen = data.last_login;
            if (req.session.page == 'U') {
                res1.redirect('/user/'+data.id);
            }
            else {
                res1.redirect('/company/' + data.id);
            }

        }
    }).on("error",function(err){
        console.info("error occured"+err);
        res1.redirect("/signin");//redirect on sign in failure
    });
});

router.get("/signup",function(req,res){
    res.render('signup.ejs', {"error1":"", "name" :"" , "email" :"", "password" :"" ,  "role" :""});
});

router.post("/signup",function(req,res1){
    args={
        data:{ user_name:req.body.name, email:req.body.email, password:req.body.password, role:req.body.role},
        headers:{"Content-Type": "application/json"}
    };

    client.post(backendroute+"/signup",args,function(data,res)
    {
        if(res.statusCode == 201){
            res1.redirect('/signin'); // redirect user to sign in
        } else // send him back to sign in page
        {
            res1.render('signup.ejs', {"error1":data.message, "name" :req.body.name , "email" :req.body.email, "password" :req.body.password ,  "role" :req.body.role});
        }
    }).on("error",function(err){
        console.log("Error occured while signing up user");
         res1.redirect("/signup");
    });

});

router.get("/user/:userID",requireLogin,function(req,res1){
    var id = req.param("userID");
    console.log(req.session.ID);
    client.get(backendroute+"/userprofile/"+id+"/"+req.session.ID,function(data,res){
        console.log(data);
        console.log(res.statusCode);
        if(res.statusCode != 400)
        {
            if((id == req.session.ID) && (req.session.page =='U') )
                res1.render("userProfile.ejs", {"data": data , lastseen:req.session.lastseen });
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
    client.get(backendroute+"/companyprofile/"+id+"/"+req.session.ID,function(data,res){
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


router.get("/following/:userID",function(req,res1){
    var followerid = req.param("userID");
    client.get(backendroute+"/following/"+followerid,function(data,res){
        console.log(data);
        //res.send(data);
        res1.render("following.ejs",{data:data});
    });
});

router.post("/imgupload",function(req,res1){

    var imagName=req.session.ID;
    var imgUrl;
    var mimetype;

    if (req.session.page == 'U')
    {
        imgUrl=req.files.userimageinput.path;
        mimetype = req.files.userimageinput.mimetype;
    }
    else
    {
        imgUrl=req.files.imageinput.path;
        mimetype = req.files.imageinput.mimetype;
    }

    var s3bucket = new aws.S3({params: {Bucket: 'project.bucket1'}});

    fs.readFile(imgUrl, function(err, data){
        if (err) { console.log(err); }

        else {
            console.log(imagName);
            console.log(imgUrl);
            s3bucket.upload({Key: imagName, Body: data, ContentType: mimetype},function(err,data){
                if (err)
                {
                    console.log("Error uploading data: ", err);
                }
                else {
                    console.log("Successfully uploaded data to bucket :" + JSON.stringify(data));
                    var params = {Key: imagName};
                    var url = s3bucket.getSignedUrl('getObject', params);
                    //console.log("Got a signed URL:", url);
                    //eventOnUpload.emit('store',imagName,url);

                    args={
                        data:{img: url},
                        headers:{"Content-Type": "application/json"}
                    };
                    console.log(req.session.ID);

                    if (req.session.page == 'U') {
                        client.put(backendroute + "/userprofile/" + req.session.ID, args, function (data, res) {
                            console.log(res.statusCode);
                            if (res.statusCode == 200) {
                                res1.redirect("/user/"+req.session.ID);
                            }
                        });
                    }
                    else
                    {
                        //TODO Parin: company image upload route
                        //client.put(backendroute + "/userprofile/" + req.session.ID, args, function (data, res) {
                            console.log(res.statusCode);
                            if (res.statusCode == 200) {
                                //redirect("/user/"+id);
                            }
                        //});
                    }
                }

            });
        }
    });
});


eventOnUpload.on('store',function(name,url){
    client1.set(name,url);
    console.log(url);
    client1.get(name,function(error,data){
        console.log("DATA::"+data);
    });

    // image updation backend
});

router.post("/follow",requireLogin,function(req,res1) {
    console.log("in follow route");
    console.log(req.body.thisID);
    var value = req.body.thisID.split('|');
    var followeerole = value[2];
    var followeeID = value[0];
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
        client.post(backendroute+"/follow/"+req.session.ID, args, function (data, res) {
            console.log(res.statusCode);
           if(res.statusCode == 201)
           {
               console.log(followeerole);
               console.log(followeeID);
               if(followeerole == "C")
                   res1.redirect("/company/"+followeeID);
               else
                   res1.redirect("/user/"+followeeID);
           }
        });
    }
    else
    {
        args = {
            data: { followerId : value[0]},
            headers: {"Content-Type": "application/json"}
        };
        client.delete(backendroute+"/follow/"+req.session.ID,args,function (data, res) {
            if(res.statusCode == 200) {
                if (followeerole == "C")
                    res1.redirect("/company/" + followeeID);
                else
                    res1.redirect("/user/" + followeeID);
            }
        });
    }
});

router.post("/userDetails",function(req,res1){
    console.log(JSON.stringify(req.body));
    args={
        data:req.body,
        headers:{"Content-Type": "application/json"}
    };
    console.log(req.session.ID);
    console.log(args);
    client.put(backendroute+"/userprofile/"+req.session.ID,args,function(data,res)
    {
        console.log(res.statusCode);
        if(res.statusCode == 200)
        {
            res1.redirect("/user/"+req.session.ID);
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



module.exports = router;
