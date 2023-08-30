//jshint esversion:6
import 'dotenv/config.js';
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import encrypt from "mongoose-encryption";


const app=express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
const port=3000;

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});

const userSchema= new mongoose.Schema({
    username:String,
    password:String,
});


console.log(process.env.SECRET);
userSchema.plugin(encrypt, {secret:process.env.SECRET, encryptedFields: ['password'] });
const User= new mongoose.model("User",userSchema);


app.get("/",(req,res)=>
{
    res.render("home.ejs");
});
app.get("/login",(req,res)=>{
    res.render("login.ejs");

});
app.get("/register",(req,res)=>{
    res.render("register.ejs");
});

app.post("/register",async(req,res)=>{
try{const username=req.body.username;
const password=req.body.password;
const newUser= new User({
    username:username,
    password:password,
})
await newUser.save();
res.render("login.ejs");}
catch(err){
    console.log(err);
}

//console.log(username);
});

app.post("/login",async(req,res)=>{
    try{
        const username=req.body.username;
        const password=req.body.password;
        const user=await User.findOne({username:username});
        if(user){
            if(user.password===password){
                res.render("secrets.ejs");
            }
        }
    }
    catch(err){
        console.log(err);
    }

});

app.listen(port,()=>{
    console.log("server is in port 3000");
}
);