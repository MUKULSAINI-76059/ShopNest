const orderModel = require("../models/orderModel");
const userModel = require("../models/userModel");
const productModel = require("../models/productModel");

const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await userModel.countDocuments({ role: "user" });
    const totalOrders = await orderModel.countDocuments({});
    const totalProducts = await productModel.countDocuments({});

    const orders = await orderModel.find({});
    const totalRevenueData = orders.reduce(
      (acc, order) => acc + order.totalAmount,
      0,
    );

    return res
      .status(200)
      .json({
        totalUsers,
        totalOrders,
        totalProducts,
        totalRevenue: totalRevenueData,
      });
  } catch (err) {
    console.log("getAdminStats error :", err.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getAdminStats };
