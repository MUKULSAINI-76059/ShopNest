const express = require("express")
const router = express.Router()
const {protect} = require("../middleware/authMiddleware")
const {admin, adminWrite} = require("../middleware/adminMiddleware")
const multer = require("multer")
const upload = multer({dest: 'uploads/'})
const {getProductById, getProducts , createProduct,  updateProduct, deleteProduct, createProducts} =require("../controllers/productController")


router.route("/").get(getProducts).post(protect, adminWrite,upload.single("image"), createProduct)
router.route("/:id").get(getProductById).put(protect, adminWrite, upload.single("image"), updateProduct).delete(protect, adminWrite, deleteProduct)
router.post("/bulk", protect, adminWrite, createProducts)

module.exports = router