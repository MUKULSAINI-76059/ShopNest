const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
    },
    password:{
        required:true,
        type:String
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },
    isVerified:{
        type:String,
        default:"false"
    }
}, { timestamps: true })

userSchema.index({ role: 1 })

module.exports = mongoose.model("users", userSchema)