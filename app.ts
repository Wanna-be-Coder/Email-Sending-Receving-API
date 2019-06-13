import express from "express";
// import nodemailer from "nodemailer";
// import imaps from "imap-simple";
import passport from "passport";
import LocalStrategy from "passport-local";
import bodyParser from "body-parser";
import User from "./models/user";
import mongoose from "mongoose";

const app = express();


app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(require("express-session")({
	secret:"Dogs are good",
	resave:false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb://localhost/demo_app");

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// var config = {
//     imap: {
//         user: 'samsha1234elo@gmail.com',
//         password: 'lqsatwuutynkcsfr',
//         host: 'imap.gmail.com',
//         port: 993,
//         tls: true,
//         authTimeout: 3000
//     }
// };


// var transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: 'saminsharar2@gmail.com',
//       pass: 'Samsha123456!'
//     }
//   });
  
//   var mailOptions = {
//     from: 'saminsharar2@gmail.com',
//     to: 'fauzulkc@gmail.com',
//     // to: 'samin@elobyte.com',
//     subject: 'Sending Email using Node.js',
//     text: 'Told you it is easy',
//     attachments: [
//         {
         
//          path: 'angularTask.pdf'
//         },
//         {
//             path: 'test.jpg'
//         }
//      ]
//   };
  



app.listen('3000',() => {
    console.log('Server is up at port number 3000');
});

app.get('/',(req, res) => {
    // transporter.sendMail(mailOptions, function(error, info){
    //     if (error) {
    //       console.log(error);
    //     } else {
    //       console.log('Email sent: ' + info.response);
    //     }
    //   });

 
        // imaps.connect(config).then(function (connection) {
 
        //      connection.openBox('INBOX').then(function () {
        //         console.log('Here');
        //         var searchCriteria = [
        //             'ALL'
        //         ];
         
        //         var fetchOptions = {
        //             bodies: ['HEADER', 'TEXT'],
        //             markSeen: false
        //         };
        //         console.log("Above Connection search");
        //         return  connection.search(searchCriteria, fetchOptions).then((results) => {
        //             console.log('Inside Search');
        //             var subjects = results.map(function (res) {
        //                 return res.parts.filter(function (part) {
        //                     return part.which === 'HEADER';
        //                 })[0].body.subject[0];
        //             });
                    
        //             console.log(subjects);
        //             // =>
        //             //   [ 'Hey Chad, long time no see!',
        //             //     'Your amazon.com monthly statement',
        //             //     'Hacker Newsletter Issue #445' ]
        //         })
        //         .catch((e) => console.log("Colud not connect to search"+e));
        //     });
        // });

    res.render('index');



});

app.get('/login',(req, res) => {

    res.render("login");

});

app.get('/register',(req, res) => {

    res.render("register");

});

app.post('/register',(req,res) => {
    console.log('here');
    User.register(new User({username : req.body.email}), req.body.password, function(err: any, user: User) {
        if(err){console.log(err);}
        else{
            console.log("here2")
         passport.authenticate("local")(req, res, function() {
            res.redirect("/"); 
 
        });}
         
     });

})



