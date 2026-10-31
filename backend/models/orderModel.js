const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.ObjectId, ref:"users", required:true
    },
    items:[{
        productId:{type:mongoose.Schema.ObjectId, ref:"products", required:true},
        quantity:{type:Number, min:1,required:true}, 
        price:{type:Number,required:true}
    }],
    totalAmount:{
        type:Number, required:true
    },
    address:{
        fullName:{type:String, required:true},
        city:{type:String, required:true},
        street:{type:String, required:true},
        postalCode:{type:String, required:true},
        country:{type:String, required:true},
    },
    paymentId:{
        type:String, required:true
    },
    status:{
        type:String,
        enum:["pending", "shipped", "delivered"],
        default:"pending"
    }
})

module.exports = mongoose.model("orders", orderSchema)