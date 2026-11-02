const express = require("express")
const router = express.Router()
const {protect} = require("../middleware/authMiddleware")
const {admin, adminWrite} = require("../middleware/adminMiddleware")
const {createOrder, getOrders, getOrder, updateOrderStatus} = require("../controllers/orderController")


router.route("/").post(protect, createOrder).get(protect, admin , getOrders)
router.route("/myorders").get(protect, getOrder)
router.route("/:id/status").patch(protect, adminWrite, updateOrderStatus)


module.exports = router