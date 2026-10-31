const orderModel = require("../models/orderModel")
const productModel = require("../models/productModel")
const sendEmail = require("../utilis/sendEmail")

const createOrder = async (req, res) => {
  try {
    const { items, address, paymentId } = req.body;

    if (
      !Array.isArray(items) ||
      items.length === 0 ||
      items.some(item =>
        !item.productId ||
        !item.quantity ||
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

    const order = await orderModel.create({
      userId: req.user.id,
      items,
      totalAmount,
      address: {
        fullName: req.user.name,
        ...address
      },
      paymentId
    });

    const formattedDate = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short"
    });

    const message = `
Hi ${req.user.name},

Thank you for shopping with ShopNest!

Your order has been placed successfully.

Order ID: ${order._id}
Order Date: ${formattedDate}
Total Amount: ₹${totalAmount}
Order Status: ${order.status}

Thank you for choosing ShopNest!

Best regards,
Team ShopNest
Your shopping, made simple.
`;

    totalSell(order.items)

    await sendEmail(
      req.user.email,
      "Your Order Has Been Successfully Placed!",
      message
    );

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
        const orders = await orderModel.find({}).populate("userId","id name")
        return res.status(200).json({message:"Fetch all orders", orders:orders})
    }catch(err){
        console.log("getOrders Error : ", err.message)
        return res.status(500).json({message:"Server Error"})
    }
} 

const getOrder = async(req,res) =>{
    try{
        const order = await orderModel.find({userId:req.user.id}).populate("items.productId","name price")
        if(!order) {
            return res.status(404).json({message:"Order not found"})
        }
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
        return res.status(200).json({message:"order status Updated", order:order})
    }catch(err){
        console.log("updateOrderStatus Error : ", err.message)
        return res.status(500).json({message:"Server Error"})
    }
}

async function totalSell(id){
  const product = await productModel.findOneAndUpdate({_id:id[0].productId}, {$inc:{totalSell:id[0].quantity}})
}




module.exports = {createOrder, getOrder, getOrders, updateOrderStatus}