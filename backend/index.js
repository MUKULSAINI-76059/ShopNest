const dotenv = require("dotenv")
dotenv.config()
const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db")
const cors = require("cors")
const path = require("path");
const authRoutes = require("./routes/authRoutes")
const paymentRoutes = require("./routes/paymentRoutes")
const orderRoutes = require("./routes/orderRoutes")
const productRoutes = require("./routes/productRoutes")
const analyticsRoutes = require("./routes/analyticsRoutes")
const { apiRateLimiter, authRateLimiter } = require("./middleware/rateLimiters")

const dns = require('dns');
const cookieParser = require('cookie-parser');
dns.setServers(['8.8.8.8'], ['8.8.4.4'])
const app = express()

connectDB()
app.use(cookieParser());
app.use(cors(
    {
        origin: process.env.FRONTEND_URL
            ? [process.env.FRONTEND_URL, "http://localhost:3000", "http://127.0.0.1:3000"]
            : ["http://localhost:3000", "http://127.0.0.1:3000"],
        credentials:true
    }
))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use("/api", apiRateLimiter)

const healthCheck = (req, res) => {
    const databaseReady = mongoose.connection.readyState === 1;
    const status = databaseReady ? "ok" : "degraded";

    return res.status(databaseReady ? 200 : 503).json({
        status,
        service: "shopnest-api",
        database: databaseReady ? "connected" : "disconnected",
        uptime: Math.floor(process.uptime()),
        timestamp: new Date().toISOString()
    });
};

app.get("/health", healthCheck);
app.get("/api/health", healthCheck);


app.use("/api/auth", authRateLimiter, authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/payments", paymentRoutes)
app.use("/api/analytics", analyticsRoutes)

// Server frontend in production 
if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, '../frontend/build')))

    app.get("/{*splat}", (req, res)=>{
        res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'))
    })
}else{
    app.get("/", (req, res)=>{
        res.send("ShopNest API is running in Development mode...")
    })
}

app.get("/", (req,res)=>{
    res.send("Jai Jai Shree Ram")
})


const port = process.env.PORT || 5000
app.listen(port,()=>{
    console.log("Server started")
})
