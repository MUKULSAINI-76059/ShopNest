const orderModel = require("../models/orderModel");
const userModel = require("../models/userModel");
const productModel = require("../models/productModel");

let statsCache = null;
let statsCacheTime = 0;
const STATS_CACHE_TTL = 10000;

const getAdminStats = async (req, res) => {
  try {
    if (statsCache && Date.now() - statsCacheTime < STATS_CACHE_TTL) {
      return res.status(200).json(statsCache);
    }

    const [totalUsers, totalOrders, totalProducts, revenueResult] =
      await Promise.all([
        userModel.countDocuments({ role: "user" }),
        orderModel.countDocuments({}),
        productModel.countDocuments({}),
        orderModel.aggregate([
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: "$totalAmount" }
            }
          }
        ])
      ]);

    statsCache = {
      totalUsers,
      totalOrders,
      totalProducts,
      totalRevenue: revenueResult[0]?.totalRevenue || 0
    };
    statsCacheTime = Date.now();

    return res.status(200).json(statsCache);
  } catch (err) {
    console.log("getAdminStats error :", err.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getAdminStats };
