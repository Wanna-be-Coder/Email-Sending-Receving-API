import express from "express";
import nodemailer from "nodemailer";
import imaps from "imap-simple";
import passport, { authorize } from "passport";
import LocalStrategy from "passport-local";
import bodyParser from "body-parser";
import User, {IUser} from "./models/user";
import mongoose from "mongoose";
import middleware from "./middleware/index";
import cors from 'cors';

// import fs from 'fs';
// import readline from 'readline';
// import {google} from 'googleapis';

// const middleware = require('./middleware/index');

const app = express();



app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.json());
app.use(require("express-session")({
	secret:"Dogs are better then Cats",
	resave:false,
	saveUninitialized:false
}));


app.use(cors());

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb://localhost/demo_app");
app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	next();
});







var config = {
    imap: {
        user: 'samsha1234elo@gmail.com',
        password: 'lqsatwuutynkcsfr',
        host: 'imap.gmail.com',
        port: 993,
        tls: true,
        authTimeout: 3000
    }
};


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'saminsharar2@gmail.com',
      pass: 'Samsha123456!'
    }
  });
  
  var mailOptions = {
    from: 'saminsharar2@gmail.com',
    to: 'samin@elobyte.com',
    // to: 'samin@elobyte.com',
    subject: 'Sending Email using Node.js',
    text: 'Told you it is easy',
    html: '<a href="http://localhost:3000/secret/secret">Click Here To Go To The Secret Page</a>',
    attachments: [
        {
         
         path: 'angularTask.pdf'
        },
        {
            path: 'test.jpg'
        }
     ]
  };
  


//Connecting To The Port
app.listen('5000',() => {
    console.log('Server is up at port number 5000');
});


//Index Route
app.get('/',(req, res) => {
    // transporter.sendMail(mailOptions, function(error, info){
    //     if (error) {
    //       console.log(error);
    //     } else {
    //       console.log('Email sent: ' + info.response);
    //     }
    //   });

 
        imaps.connect(config).then(function (connection) {
 
             connection.openBox('INBOX').then(function () {
                console.log('Here');
                var searchCriteria = [
                    'ALL'
                ];
         
                var fetchOptions = {
                    bodies: ['HEADER', 'TEXT'],
                    markSeen: false
                };
                console.log("Above Connection search");
                return  connection.search(searchCriteria, fetchOptions).then((results) => {
                    console.log('Inside Search');
                    var subjects = results.map(function (res) {
                        return res.parts.filter(function (part) {
                            return part.which === 'HEADER';
                        })[0].body.subject[0];
                    });
                    
                    console.log(subjects);
                    // =>
                    //   [ 'Hey Chad, long time no see!',
                    //     'Your amazon.com monthly statement',
                    //     'Hacker Newsletter Issue #445' ]
                })
                .catch((e) => console.log("Colud not connect to search"+e));
            });
        });

    res.render('index');



});

app.post('/api/nodemailer',(req,res) => {
    console.log(req.body);
    const data = req.body;
    var mailInfo = {
        from: 'saminsharar2@gmail.com',   
        to: data.email,
        subject: data.subject,
        text: data.body,
        attachments: [
            {
             
             path: 'angularTask.pdf'
            },
            {
                path: 'test.jpg'
            }
         ]
      };
      transporter.sendMail(mailInfo, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    res.send(req.body);
});

//Login Routes
app.get('/login',(req, res) => {

    res.render("login");

});

app.get('/login/:id',(req, res) => {
   const route = req.params.id;
    res.render("elogin",{route});
});

app.post("/login", passport.authenticate("local", {

    successRedirect: '/',
    failureRedirect: '/login'


}));

app.post('/login/:id',passport.authenticate("local"),(req,res) =>{
    
    res.redirect(`/${req.params.id}`);
});






//Registration Routes
app.get('/register',(req, res) => {

    res.render("register");

});

app.post('/register',(req,res) => {
    console.log(req.body.role);
    User.register(new User({username : req.body.username, position : req.body.role}), req.body.password, function(err: any, user: IUser) {
        if(err) { 
            console.log(err);
            res.redirect("/register")
        }
        else{
         passport.authenticate("local")(req, res, function() {
         res.redirect("/"); 
 
        });}
         
     });

});


//Logout Routes
app.get("/logout", (req,res) => {
    req.logout();
    res.redirect("/");
});

//Secret Route for checking purpose

app.get("/secret/:id",middleware.isLoggedInFromEmail,(req,res) => {

res.send("Secret Route");

});

app.get("/secret",middleware.isLoggedIn,(req,res) => {

    res.send("Secret Route");
    
    });

//Upload Document Route

app.get("/upload_doc",middleware.isLoggedIn,(req,res) => {

    res.render("upload.ejs")
    
    });
app.post("/upload_doc",middleware.isLoggedIn,(req,res) => {

     transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      res.redirect("/");

//    const name = req.body.name;
//    const file = req.body.file;
//    const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];
//    const TOKEN_PATH = 'token.json';

// //    fs.readFile('credentials.json', (err, content) => {
// //     if (err) return console.log('Error loading client secret file:', err);
// //     // Authorize a client with credentials, then call the Google Drive API.
// //     authorize(JSON.parse(content), listFiles);
// //   });
  
//    console.log(name+'----'+file);
//    const clientID = '219921193221-1ts3afbd0j3csv23dkt6j33s1tfpj1ur.apps.googleusercontent.com';
//    const clientSecret = 'YKJu-2WvczEV58d2frXj3no1'
    });

//Error Route
app.get("*",(req,res) => {
    res.send('404 Error');
});



passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



