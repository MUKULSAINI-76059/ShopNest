const userModel = require("../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const sendEmail = require("../utilis/sendEmail")

const generateToken = async (id,role)=>{
    return jwt.sign({id,role}, process.env.SECRET_KEY, {expiresIn:"4h"})
}

const registerUser = async(req, res)=>{
    const {name, email, password, role} = req.body;
    try{
        const isExist = await userModel.findOne({email})
        if(isExist) return res.status(400).json({message:"User already registered.."})
        const hashedPassword = await bcrypt.hash(password,10)
        const user = new userModel({name, email, password:hashedPassword, role})
        if(user){
            const otp = Math.floor(100000 + Math.random() *900000).toString()
            const message = `
                Welcome to ShopNest, ${name}! Thankyou for registration with us.Your otp for ShopNest registration is: ${otp}`
            const token = await generateToken(user._id,user.role)
            await sendEmail(email,"Welcome to ShopNest",message)
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax"
           });
            await user.save()
            return res.status(201).json({message:"User created successfully.",token:token})
        }else{
            return res.status(400).json({message:"Invalid user data."})
        }
    }catch(err){
        console.log(err)
        return res.status(500).json({message:"Server error "})
    }
}

const loginUser = async(req,res) =>{
    const {email, password} = req.body;
    try{
        const isUser = await userModel.findOne({email});
        if(!isUser){
            return res.status(404).json({message:"User does not exists."})
        }
        const isMatch = await bcrypt.compare( password,isUser.password);
        if(!isMatch){
            return res.status(400).json({message:"Something went wrong."})
        }
        const token = await generateToken(isUser._id, isUser.role)
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax"
           });        
        return res.status(200).json({message:"User logged in successfully.",token:token})
    }catch(err){
        console.log(err.message)
        return res.status(500).json({message:"Server error"})
        
    }
    
}

const getUsers = async(req,res) =>{
    try{
        const users = await userModel.find({}).select("-password")
        return res.status(200).json({users:users})
    }catch(err){
        return res.status(500).json({message:"Interval server error"})
    }
}

module.exports = {registerUser, loginUser, getUsers}