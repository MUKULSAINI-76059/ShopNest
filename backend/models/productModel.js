const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    name:{type:String, required:true},
    description:{type:String, required:true},
    price:{type:Number, required:true},
    category:{type:String, required:true},
    stock:{type:Number, required:true},
    rating:{type:Number, default:0},
    numReviews:{type:Number, default:0},
    imgUrl:{type:String, required:true},
    totalSell:{type:Number, default:0}
},{timestamps:true})

module.exports = mongoose.model("products", productSchema)