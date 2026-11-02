const productModel = require("../models/productModel");
const cloudinary = require("../config/cloudinary");

const getProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    if (products.length === 0) {
      return res.status(404).json({ message: "Products not found" });
    }
    return res
      .status(200)
      .json({ message: "Products founded successfully", products: products });
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
};

const getProductById = async (req, res) => {
  const id = req.params.id;
  try {
    const product = await productModel.findById({ _id: id });
    if (!product) {
      return res.status(404).json({ message: "Product does not exist." });
    }
    return res
      .status(200)
      .json({ message: "Product founded successfully", product: product });
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
};

const createProduct = async (req, res) => {
  const { name, description, price, category, stock, image } = req.body;
  let imgUrl = "";
  try {
    if (
      !name ||
      !description ||
      price === undefined ||
      !category ||
      stock === undefined ||
      (!req.file && !image)
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      var imgSrc = result.secure_url;
    }
    if (image) {
      const result = await cloudinary.uploader.upload(image);
      var image2 = result.secure_url;
    }
    imgUrl = image2 || imgSrc;
    const product = new productModel({
      name,
      description,
      price,
      category,
      stock,
      imgUrl,
    });
    const savedProduct = await product.save();
    return res
      .status(201)
      .json({ message: "Product Created successfully", product: savedProduct });
  } catch (err) {
    console.log(err.message)
    return res.status(500).json({ message: "Server Error" });
  }
};

const createProducts = async (req, res) => {
  try {
    const products  = req.body; 

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        message: "Please provide a valid products array",
      });
    }

    const savedProducts = [];

    for (const product of products) {
      const {
        name,
        description,
        price,
        category,
        stock,
        image,
      } = product;

      if (
        !name ||
        !description ||
        price === undefined ||
        !category ||
        stock === undefined ||
        !image
      ) {
        return res.status(400).json({
          message: "All product fields are required",
          product: name || "Unknown product",
        });
      }

      // Upload image to Cloudinary
      const result = await cloudinary.uploader.upload(image, {
        folder: "products",
      });

      // Save product in MongoDB
      const savedProduct = await productModel.create({
        name,
        description,
        price,
        category,
        stock,
        imgUrl: result.secure_url,
      });

      savedProducts.push(savedProduct);
    }

    return res.status(201).json({
      message: "Products created successfully",
      count: savedProducts.length,
      products: savedProducts,
    });
  } catch (err) {
    console.log(err.message);

    return res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
};
  
const updateProduct = async (req, res) => {
  const id = req.params.id;
  const { name, description, price, category, stock, image } = req.body;
  try {
    const existingProduct = await productModel.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product is not found" });
    }
    let imgUrl = existingProduct.imgUrl;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imgUrl = result.secure_url;
    } else if (image) {
      const result = await cloudinary.uploader.upload(image);
      imgUrl = result.secure_url;
    }
    const isProduct = await productModel.findByIdAndUpdate(
      { _id: id },
      { name, description, price, category, stock, imgUrl },
      { new: true, runValidators: true },
    );
    return res
      .status(200)
      .json({
        message: "Product updated successfully",
        updatedProduct: isProduct,
      });
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
};

const deleteProduct = async (req, res) => {
  const id = req.params.id;
  try {
    const product = await productModel.findById({ _id: id });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const deleteProduct = await productModel.findByIdAndDelete({ _id: id });
    return res.status(200).json({ message: "Product deleted successfully." });
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getProductById,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  createProducts
};
