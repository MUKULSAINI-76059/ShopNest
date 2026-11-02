const express = require("express")
const router = express.Router()
const {registerUser, loginUser, updateProfile, getUsers} = require("../controllers/authController")
const {protect} = require("../middleware/authMiddleware")
const {admin} = require("../middleware/adminMiddleware")

router.post("/register", registerUser)
router.post("/login", loginUser)
router.put("/profile", protect, updateProfile)
router.get("/users",protect, admin, getUsers)



module.exports  = router