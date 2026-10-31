const dotenv = require("dotenv")
dotenv.config()
const express = require("express");
const connectDB = require("./config/db")
const cors = require("cors")
const authRoutes = require("./routes/authRoutes")
const paymentRoutes = require("./routes/paymentRoutes")
const orderRoutes = require("./routes/orderRoutes")
const productRoutes = require("./routes/productRoutes")
const analyticsRoutes = require("./routes/analyticsRoutes")

const dns = require('dns');
const cookieParser = require('cookie-parser');
dns.setServers(['8.8.8.8'], ['8.8.4.4'])
const app = express()

connectDB()
app.use(cookieParser());
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.use("/api/auth", authRoutes)
app.use("/api/product", productRoutes)
app.use("/api/order", orderRoutes)
app.use("/api/payment", paymentRoutes)
app.use("/api/analytics", analyticsRoutes)


app.get("/", (req,res)=>{
    res.send("Jai Jai Shree Ram")
})


const port = process.env.PORT || 5000
app.listen(port,()=>{
    console.log("Server started")
})
