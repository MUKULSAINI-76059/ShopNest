const express = require("express")
const router = express.Router()
const {protect} = require("../middleware/authMiddleware")
const {admin} = require("../middleware/adminMiddleware")
const {createOrder, getOrders, getOrder, updateOrderStatus} = require("../controllers/orderController")


router.route("/").post(protect, createOrder).get(protect, admin , getOrders)
router.route("/myorder").get(protect, getOrder)
router.route("/:id/status").patch(protect, admin, updateOrderStatus)


module.exports = router