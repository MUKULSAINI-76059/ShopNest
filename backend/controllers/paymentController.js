const razorpay = require("../config/razorpay");
const crypto = require("crypto");

const createPaymentOrder = async (req, res) => {
  try {
    const amount = 499;
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    });
    res
      .status(201)
      .json({ success: true, key: process.env.RAZORPAY_KEY_ID, order });
  } catch (err) {
    console.log("createPaymentOrder Error : ", err.message);
    return res.status(500).json({ message: "Unable to create payment order" });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        message: "Missing payment details",
      });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    const isValid = crypto.timingSafeEqual(
      Buffer.from(expectedSignature, "hex"),
      Buffer.from(razorpay_signature, "hex"),
    );

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment signature verified successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Payment verification failed",
    });
  }
};

module.exports = { createPaymentOrder, verifyPayment };
