const orderModel = require("../models/orderModel")
const productModel = require("../models/productModel")
const userModel = require("../models/userModel")
const {orderStatusEmail} = require("../utils/sendEmail")
const { orderConfirmationEmail } = require("../utils/sendEmail");

const createOrder = async (req, res) => {
  try {
    const { items, address, paymentId } = req.body;

    if (
      !Array.isArray(items) ||
      items.length === 0 ||
      items.some(item =>
        !item.productId ||
        !Number.isInteger(item.quantity) ||
        item.quantity <= 0 ||
        item.price === undefined
      ) ||
      !address?.city ||
      !address?.street ||
      !address?.postalCode ||
      !address?.country ||
      !paymentId
    ) {
      return res.status(400).json({
        message: "Invalid order data"
      });
    }

    const totalAmount = items.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );

    const quantitiesByProduct = items.reduce((quantities, item) => {
      quantities[item.productId] = (quantities[item.productId] || 0) + item.quantity;
      return quantities;
    }, {});

    const inventoryUpdates = Object.entries(quantitiesByProduct).map(
      ([productId, quantity]) => ({
        updateOne: {
          filter: { _id: productId, stock: { $gte: quantity } },
          update: { $inc: { stock: -quantity, totalSell: quantity } }
        }
      })
    );

    const inventoryResult = await productModel.bulkWrite(inventoryUpdates);
    if (inventoryResult.modifiedCount !== inventoryUpdates.length) {
      return res.status(409).json({
        message: "One or more products are out of stock"
      });
    }

    let order;
    try {
      order = await orderModel.create({
        userId: req.user._id,
        items,
        totalAmount,
        address: {
          fullName: req.user.name,
          ...address
        },
        paymentId
      });
    } catch (error) {
      await productModel.bulkWrite(
        Object.entries(quantitiesByProduct).map(([productId, quantity]) => ({
          updateOne: {
            filter: { _id: productId },
            update: { $inc: { stock: quantity, totalSell: -quantity } }
          }
        }))
      );
      throw error;
    }

    const formattedDate = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short"
    });

      await order.populate("items.productId", "name");
      const user = await userModel.findById(order.userId)
      console.log(user)
if (user?.email) {
  try {
    await orderConfirmationEmail(user.email, order);
  } catch (error) {
    console.error("Order confirmation email failed:", error.message);
  }
}

    return res.status(201).json({
      message: "Order created successfully",
      order
    });

  } catch (err) {
    console.log(err.message);

    return res.status(500).json({
      message: "Server Error"
    });
  }
};

const getOrders = async(req,res) =>{
    try{
        const orders = await orderModel
            .find({})
            .populate("userId", "id name")
            .populate("items.productId", "name")
        return res.status(200).json({message:"Fetch all orders", orders:orders})
    }catch(err){
        console.log("getOrders Error : ", err.message)
        return res.status(500).json({message:"Server Error"})
    }
} 

const getOrder = async(req,res) =>{
    try{
        const order = await orderModel
            .find({ userId: req.user._id })
            .populate("items.productId", "name price imgUrl")
            .sort({ createdAt: -1 });
        return res.status(200).json({message:"Fetch order", order:order})
    }catch(err){
        console.log("getOrder Error : ", err.message)
        return res.status(500).json({message:"Server Error"})
    }
} 


const updateOrderStatus = async(req,res)=>{
    const {status} = req.body;
    try{
        if(!["pending", "delivered", "shipped"].includes(status)){
            return res.status(400).json({message:"Invalid status"})
        }
        const order = await orderModel.findByIdAndUpdate({_id:req.params.id},{status:status},{ new: true, runValidators: true })
        if(!order){
            return res.status(404).json({message:"Order not found."})
        }
      
         const user = await userModel.findById(order.userId)
        await orderStatusEmail(user.email, order, order.status)
        return res.status(200).json({message:"order status Updated", order:order})
    }catch(err){
        console.log("updateOrderStatus Error : ", err.message)
        return res.status(500).json({message:"Server Error"})
    }
}

module.exports = {createOrder, getOrder, getOrders, updateOrderStatus}