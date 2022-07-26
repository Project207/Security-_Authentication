//jshint esversion:6

const express = require("express")
const app = express()

const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({extended:true}))

app.set("view engine","ejs")

app.use(express.static("public"))


app.listen(3000,function(req,res){
    console.log("server is runnig on port 3000")
})

///////////////////////Database code //////////////////////

const mongoose = require("mongoose")

const encrypt = require('mongoose-encryption');

mongoose.connect("mongodb://localhost:27017/userDB")

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

//excryption should happen before model

const SECRET_KEY="ThisisMyOwnSecretString."
userSchema.plugin(encrypt, { secret:SECRET_KEY ,encryptedFields: ['password']});
//can enter more filed in an array above by ,

const User = new  mongoose.model("user",userSchema)



////////////////////////// APP code ///////////////////////

app.get("/",function(req,res){
    res.render("home")

})
app.get("/login",function(req,res){
    res.render("login")

})
app.get("/register",function(req,res){
    res.render("register")

})

//////////////////// Post code ////////////////////////////


app.post("/register",function(req,res){
   
    const newUser = new User({
       email:req.body.username,
       password:req.body.password
    })

    newUser.save(function(err){
        if(err){
            console.log(err)
        }else{
            res.render("secrets");
        }
    }); 
 });

 app.post("/login",function(req,res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email:username},function(err,foundUser){
        if(foundUser){
            if(foundUser.password === password){
                res.render("secrets");}
            else{
                res.send("Invalid Password")
            }
        }
        else{ 
            res.send("Invalid Email")
        }
    })
 })
