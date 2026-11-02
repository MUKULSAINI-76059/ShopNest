const userModel = require("../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const {registerEmail} = require("../utils/sendEmail")

const generateToken = async (id,role)=>{
    return jwt.sign({id,role}, process.env.SECRET_KEY, {expiresIn:"1h"})
}

const registerUser = async(req, res)=>{
    const {name, email, password, role} = req.body;
    try{
        if(!name || !email || !password){
            return res.status(400).json({message:"All fields are required."})
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/;
        const checkEmail = emailRegex.test(email)
        const checkPass = passwordRegex.test(password)

        if(!checkEmail){
            return res.status(400).json({message:"Enter valid email."})
        }

        if(password.length <6){
            return res.status(400).json({message : "Password must be at least 6 characters long."})
        }else if(!checkPass){
            return res.status(400).json({message : "Password must contain an uppercase letter, a lowercase letter, a number, and a special character."})
        }

        const isExist = await userModel.findOne({email})
        if(isExist) return res.status(400).json({message:"User already registered.."})
        const hashedPassword = await bcrypt.hash(password,10)
        const user = new userModel({name, email, password:hashedPassword, role})
        if(user){
            const otp = Math.floor(100000 + Math.random() *900000).toString()
            const token = await generateToken(user._id,user.role)
            await registerEmail(email, name)
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax"
           });
            await user.save()
            return res.status(201).json({
                message:"User created successfully.",
                token:token,
                user:{name:user.name, email:user.email, role:user.role}
            })
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
        if(!email || !password){
            return res.status(400).json({message:"All fields are required."})
        }
        
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const checkEmail = emailRegex.test(email)
        if(!checkEmail){
            return res.status(400).json({message:"Enter valid email."})
        }

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
        return res.status(200).json({
            message:"User logged in successfully.",
            token:token,
            user:{name:isUser.name, email:isUser.email, role:isUser.role}
        })
    }catch(err){
        console.log(err.message)
        return res.status(500).json({message:"Server error"})
        
    }
    
}

const updateProfile = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email) {
            return res.status(400).json({ message: "Name and email are required." });
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Enter valid email." });
        }

        const existingUser = await userModel.findOne({
            email,
            _id: { $ne: req.user._id }
        });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already registered." });
        }

        const user = await userModel.findById(req.user._id);
        user.name = name;
        user.email = email;
        if (password) {
            if (password.length < 6) {
                return res.status(400).json({ message: "Password must be at least 6 characters long." });
            }
            user.password = await bcrypt.hash(password, 10);
        }
        await user.save();

        return res.status(200).json({
            message: "Profile updated successfully.",
            user: { name: user.name, email: user.email, role: user.role }
        });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: "Server error" });
    }
};

const getUsers = async(req,res) =>{
    try{
        const users = await userModel.find({}).select("-password")
        return res.status(200).json({users:users})
    }catch(err){
        return res.status(500).json({message:"Interval server error"})
    }
}

module.exports = {registerUser, loginUser, updateProfile, getUsers}