const express = require("express")
const router = express.Router()
const {admin} = require("../middleware/adminMiddleware")
const {protect} = require("../middleware/authMiddleware")
const {getAdminStats} = require("../controllers/analyticsController")

router.get("/", protect, admin, getAdminStats)


module.exports = router