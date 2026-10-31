const express = require("express")
const router = express.Router()
const{createPaymentOrder , verifyPayment} = require("../controllers/paymentController.js")

router.post("/order", createPaymentOrder)
router.post("/verify", verifyPayment)

module.exports = router