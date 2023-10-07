const express = require("express");
const alert = require('alert');
const nodemailer = require('nodemailer');
const multer = require("multer");
const passwordHash=require("password-hash");
var bodyParser = require('body-parser');
const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())

const { initializeApp , cert } = require("firebase-admin/app");
const { getFirestore, body, where } = require("firebase-admin/firestore");
var serviceAccount = require("./key.json");
initializeApp({
credential: cert(serviceAccount),
});

const db = getFirestore();
 
app.set("view engine","ejs");
app.get("/signup",(req,res)=>{
    res.render("signup");
});

app.get("/signup3",(req,res)=>{
    res.render("signup3");
});
app.post("/signupsubmit", (req, res) => {
    const email = req.body.email;
    const firstName = req.body.firstName;
    const password = req.body.password;

    // Check if any of the required fields are missing
    if (!email || !firstName || !password) {
        res.status(400).send("Please provide all required information.");
        return;
    }

    // Check if the email already exists in the database
    db.collection("Students")
        .where("Email", "==", email)
        .get()
        .then((emailDocs) => {
            db.collection("Students")
                .where("Name", "==", firstName)
                .get()
                .then((nameDocs) => {
                    if (!emailDocs.empty || !nameDocs.empty) {
                        // Email or name already exists, send a message
                        res.send("Hey, this email or name is already registered.");
                    } else {
                        // Email and name don't exist, add the data to the database
                        db.collection("Students")
                            .add({
                                Name: firstName,
                                Email: email,
                                Password: passwordHash.generate(password),
                            })
                            .then(() => {
                                res.render("login");
                            })
                            .catch((error) => {
                                console.error("Error adding document to Firestore:", error);
                                res.status(500).send("Internal server error.");
                            });
                    }
                })
                .catch((error) => {
                    console.error("Error querying name in Firestore:", error);
                    res.status(500).send("Internal server error.");
                });
        })
        .catch((error) => {
            console.error("Error querying email in Firestore:", error);
            res.status(500).send("Internal server error.");
        });
});


app.get("/login",(req,res)=>{
    res.render("login");
});
app.post("/student_login", (req, res) => {
    const email = req.body.email;
     
    // Check if the email address exists in the database.
    db.collection("Students")
     .where("Email", "==", email)
     .get()
     .then((docs) => {
    if (docs.empty) {
     // The email address does not exist in the database.
     res.render("signup");
     return;
    }
     
    // Iterate over the results of the body and check each document for a matching password.
    let verified = false;
    docs.forEach((doc) => {
      verified = passwordHash.verify(req.body.password, doc.data().Password);
    });
     
    if (verified) {
     res.render("S_profile");
    } else {
        alert("Invalid Credentials")
       }
     });
      });
app.get("/signup2",(req,res)=>{
    res.render("signup2");
});
app.post("/F_login", (req, res) => {
        const email = req.body.email;
        const name= req.body.firstName;
        const password=req.body.password;
        
            // Check if the email already exists in the database
            db.collection("Faculty")
           .where("Email", "==", email)
           .get()
           .then((emailDocs) => {
              db.collection("Faculty")
                 .where("Name", "==", name)
                 .get()
                 .then((nameDocs) => {
                    if (emailDocs.size > 0 || nameDocs.size > 0) {
                       // Email or name already exists, send a message
                       res.send("Hey, this email or name is already registered.");
                    } else {
                       // Email and name don't exist, add the data to the database
                       db.collection("Faculty")
                          .add({
                             Name: req.body.firstName,
                             Email: req.body.email,
                             Password: passwordHash.generate(password),
                          })
                          .then(() => {
                             res.render("login");
                          });
                    }
                 });
           })
           .catch((error) => {
        console.error("Error checking email in Firestore:", error);
        });
        
        });
app.post("/faculty_login", (req, res) => {
    const email = req.body.email;
    
    // Check if the email address exists in the database.
    db.collection("Faculty")
    .where("Email", "==", email)
    .get()
    .then((docs) => {
    if (docs.empty) {
    // The email address does not exist in the database.
    res.render("signup2");
    return;
    }
    
    // Iterate over the results of the body and check each document for a matching password.
    let verified = false;
    docs.forEach((doc) => {
    verified = passwordHash.verify(req.body.password, doc.data().Password);
    });
    
    if (verified) {
    res.render("F_profile");
    } else {
        alert("Invalid Credentials")
       }
    });
});
app.post("/A_signup", (req, res) => {
    const email = req.body.email;
    const name= req.body.firstName;
    const password=req.body.password;
    
        // Check if the email already exists in the database
        db.collection("Admin")
       .where("Email", "==", email)
       .get()
       .then((emailDocs) => {
          db.collection("Admin")
             .where("Name", "==", name)
             .get()
             .then((nameDocs) => {
                if (emailDocs.size > 0 || nameDocs.size > 0) {
                   // Email or name already exists, send a message
                   res.send("Hey, this email or name is already registered.");
                } else {
                   // Email and name don't exist, add the data to the database
                   db.collection("Admin")
                      .add({
                         Name: req.body.firstName,
                         Email: req.body.email,
                         Password: passwordHash.generate(password),
                      })
                      .then(() => {
                         res.render("login");
                      });
                }
             });
       })
       .catch((error) => {
    console.error("Error checking email in Firestore:", error);
    });
    
});
app.post("/admin_login", (req, res) => {
    const email = req.body.email;
     
    // Check if the email address exists in the database.
    db.collection("Admin")
     .where("Email", "==", email)
     .get()
     .then((docs) => {
    if (docs.empty) {
     // The email address does not exist in the database.
     res.render("signup3");
     return;
    }
     
    // Iterate over the results of the body and check each document for a matching password.
    let verified = false;
    docs.forEach((doc) => {
      verified = passwordHash.verify(req.body.password, doc.data().Password);
    });
     
    if (verified) {
     res.render("A_profile");
    } else {
     alert("Invalid Credentials")
    }
     });
});
app.get("/A_profile",(req,res)=>{
    res.render("A_profile");
});
app.get("/S_profile",(req,res)=>{
    res.render("S_profile");
});
app.get("/F_profile",(req,res)=>{
    res.render("F_profile");
});
app.post("/generate-report", (req, res) => {
    const passoutYear = req.body.passoutYear;
    const packageCriteria = req.body.packageCriteria;

    // Perform report generation logic here based on the provided criteria

    // Send the generated report as a response or render a page with the report
    res.send(`Report for Passout Year: ${passoutYear}, Package Criteria: ${packageCriteria}`);
});





app.listen(port,()=>{
    console.log(`You are in port number ${port}`);
});
