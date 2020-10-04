//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


const userDB = mongoose.connect("mongodb://localhost:27017/userDB",{useUnifiedTopology:true,useNewUrlParser:true});
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const secret = "thisisoursecretkey.";
userSchema.plugin(encrypt,{secret :secret, encryptedFields: [""]});
const user = new mongoose.model("User", userSchema);
app.get("/",function (req,res) {
  res.render("home");
});

app.get("/login",function (req,res) {
  res.render("login");
});

app.get("/register",function (req,res) {
  res.render("register");
});

app.post("/register",function (req,res) {
  const newUser = new user(
    {email:req.body.username,
    password:req.body.password});
    newUser.save(function (err) {
      if (!err) {
        res.render("secrets");
      } else {
        console.log(err);
      }
    });
});

app.post("/login",function (req,res) {
  const username = req.body.username;
  const password = req.body.password;
  user.findOne({email:username},function (err,founduser) {
    if(founduser.password === password){
      res.render("secrets");
    }else{
      res.send("record not found or wrong password");
    }
  })

})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
