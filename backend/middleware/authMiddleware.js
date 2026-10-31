const jwt = require("jsonwebtoken")
const userModel = require("../models/userModel")

const protect = async(req, res, next)=>{
    const token = req.cookies.token
    try{
         if(!token){
             return res.status(401).json({message:"Access Denied"})}
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        req.user = await userModel.findById(decoded.id).select("-password")    
        if(!req.user) {
            return res.status(400).json({message:"User not found"})}
        next()    
    }catch(err){
        return res.status(401).json({message:"Invalid Token"})
    }
  
}

module.exports= {protect}