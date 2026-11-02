const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log("Email server error:", error.message);
  } else {
    console.log("✅ Email server is ready to send messages");
  }
});

const sendEmail = async (to, subject, text, html) => {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    });

  console.log("Email accepted:", info.accepted);
  console.log("Email rejected:", info.rejected);
  console.log("Message ID:", info.messageId);

};

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[char];
  });
}

async function registerEmail(userEmail, name) {
  const to = userEmail;
  const customerName = name
    ? name.trim().replace(/\b\w/g, (char) => char.toUpperCase())
    : "Shopper";

  const weburl = process.env.WEBURL || "https://shopnest-ecom.vercel.app/";
  const subject = "🛍️ Welcome to ShopNest — Happy Shopping!";


const text = `
       🎉 Welcome to ShopNest!

       Hello ${customerName} 👋

       We’re excited to have you join ShopNest! 🚀
       Your account has been successfully created and everything is ready for you to start exploring.

       ━━━━━━━━━━━━━━━━━━━━━━━
       ✨ What you can do next:
       ━━━━━━━━━━━━━━━━━━━━━━━

       🔐 Log in and explore your account
       🛍️ Discover amazing products
       ❤️ Find your favorite items
       🛒 Add products to your cart
       📦 Place and manage your orders

       ━━━━━━━━━━━━━━━━━━━━━━━

       Our mission is to make your shopping experience simple, convenient, and enjoyable. 🛍️✨

       🚀 Get Started Now:
       ${weburl}

       ━━━━━━━━━━━━━━━━━━━━━━━

       💬 Need Help?
       Our support team is always here for you.

       ✨ Welcome aboard! We’re glad you’re here.

       Warm regards,
       ShopNest Team 🧡

       ━━━━━━━━━━━━━━━━━━━━━━━

       📩 Support: admin76059@gmail.com
       🔒 If you did not create this account, please contact us immediately.

       © ${new Date().getFullYear()} SHOPNEST — All Rights Reserved.
       `;

const html = `
<div style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,sans-serif;">

    <table align="center" width="100%" style="max-width:600px;margin:30px auto;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,0.08);">

      <!-- Header -->
      <tr>
        <td style="background: linear-gradient(135deg, #18181b, #f97316);;padding:30px;text-align:center;color:#fff;">
          <h1 style="margin:0;font-size:24px;">🎉 Welcome to ShopNest</h1>
          <p style="margin:8px 0 0;font-size:14px;opacity:0.9;">Smart Choices, Better Shopping</p>
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="padding:30px;">

          <h2 style="color:#333;margin-top:0;">Hello ${customerName} 👋</h2>

          <p style="color:#555;font-size:15px;line-height:1.6;">
            We’re excited to have you join <strong>ShopNest</strong>! 🚀<br/>
            Your account has been created successfully. You can now start exploring products and enjoy a convenient shopping experience. 🛍️
          </p>

          <!-- Features -->
          <div style="margin:20px 0;">
            <p style="margin:10px 0;font-size:14px;">🔐 Log in and explore your account</p>
            <p style="margin:10px 0;font-size:14px;">🛍️ Discover amazing products</p>
            <p style="margin:10px 0;font-size:14px;">❤️ Find your favorite items</p>
            <p style="margin:10px 0;font-size:14px;">🛒 Add products to your cart</p>
            <p style="margin:10px 0;font-size:14px;">📦 Place and manage your orders</p>
          </div>

          <p style="color:#555;font-size:15px;line-height:1.6;">
            Our mission is to make your shopping experience simple, convenient, and enjoyable. 🛍️✨
          </p>

          <!-- Button -->
          <div style="text-align:center;margin:30px 0;">
            <a href="${weburl}" target="_blank" rel="noopener noreferrer"
               style="display:inline-block;padding:14px 28px;background: linear-gradient(135deg, #18181b, #f97316);;;color:#fff;text-decoration:none;border-radius:8px;font-size:15px;font-weight:bold;">
              🚀 Get Started Now
            </a>
          </div>

          <!-- Help -->
          <p style="color:#555;font-size:14px;">
            💬 <strong>Need Help?</strong><br/>
            Our support team is always here to help you anytime.
          </p>

          <p style="color:#555;font-size:14px;">
            ✨ Welcome aboard! We’re glad you’re here.
          </p>

          <p style="margin-top:20px;color:#333;font-weight:bold;">
            Warm regards,<br/>
            The ShopNest Team 🧡
          </p>

        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background:#f9fafb;padding:20px;text-align:center;font-size:12px;color:#888;">

          📩 Support: admin76059@gmail.com<br/><br/>

          🔒 If you did not create this account, please contact us immediately.<br/><br/>

          © ${new Date().getFullYear()} SHOPNEST — All Rights Reserved.

        </td>
      </tr>

    </table>

</div>
`;


  await sendEmail(
    to,
    subject,
    text,
    html,
  );
}

async function orderConfirmationEmail(userEmail, order) {
  const weburl = process.env.WEBURL || "https://shopnest-ecom.vercel.app/";
  const subject = "🛍️ Order Confirmed! — ShopNest";

  const orderId = order._id;
  const items = order.items || [];
  const totalAmount = Number(order.totalAmount || 0);

  const itemText = items.map((item) => {
    const productName = item.name || item.productId?.name || "Product";
    const quantity = Number(item.quantity || 0);
    const price = Number(item.price || 0) * quantity;
    return `• ${productName} × ${quantity} — ₹${price.toLocaleString("en-IN")}`;
  }).join("\n");

  const itemHtml = items.map((item) => {
    const productName = item.name || item.productId?.name || "Product";
    const quantity = Number(item.quantity || 0);
    const price = Number(item.price || 0) * quantity;

    return `
      <tr>
        <td style="padding:12px;border-bottom:1px solid #eee;color:#333;">
          ${escapeHtml(productName)}
        </td>
        <td style="padding:12px;border-bottom:1px solid #eee;text-align:center;color:#555;">
          ${quantity}
        </td>
        <td style="padding:12px;border-bottom:1px solid #eee;text-align:right;color:#ea580c;font-weight:bold;">
          ₹${price.toLocaleString("en-IN")}
        </td>
      </tr>
    `;
  }).join("");

  const text = `
🎉 Order Confirmed — ShopNest!

Hello 👋

Thank you for shopping with ShopNest!
Your order has been placed successfully.

📦 ORDER DETAILS
Order ID: ${orderId}
Status: ${order.status || "pending"}

🛒 ITEMS
${itemText}

💰 Total Amount: ₹${totalAmount.toLocaleString("en-IN")}

We'll keep you updated as your order progresses.

🚀 Visit ShopNest:
${weburl}

💬 Need Help?
Contact: admin76059@gmail.com

Thank you for choosing ShopNest! 🧡

The ShopNest Team

© ${new Date().getFullYear()} SHOPNEST — All Rights Reserved.
`;

  const html = `
  <div style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;">
    <table role="presentation" align="center" width="100%" cellpadding="0" cellspacing="0"
      style="max-width:600px;margin:30px auto;background:#fff;border-radius:14px;overflow:hidden;">

      <tr>
        <td style="background:linear-gradient(135deg,#18181b,#f97316);padding:30px;text-align:center;color:#fff;">
          <h1 style="margin:0;font-size:25px;">🎉 Order Confirmed!</h1>
          <p style="margin:10px 0 0;font-size:14px;">Thanks for shopping with ShopNest 🧡</p>
        </td>
      </tr>

      <tr>
        <td style="padding:30px;">
          <h2 style="margin-top:0;color:#18181b;">Your order is confirmed!</h2>
          <p style="color:#555;font-size:15px;line-height:1.7;">
            Thank you for choosing <strong>ShopNest</strong>.
            We've received your order and are preparing for the next steps.
          </p>

          <div style="padding:15px;background:#fff7ed;border-left:4px solid #f97316;border-radius:6px;margin:20px 0;">
            <p style="margin:0 0 8px;color:#333;font-size:14px;">
              <strong>Order ID:</strong> ${escapeHtml(String(orderId))}
            </p>
            <p style="margin:0;color:#333;font-size:14px;">
              <strong>Status:</strong>
              <span style="color:#ea580c;font-weight:bold;">
                ${escapeHtml(String(order.status || "pending").toUpperCase())}
              </span>
            </p>
          </div>

          <h3 style="color:#18181b;">🛒 Order Summary</h3>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
            style="border-collapse:collapse;font-size:13px;">
            <tr style="background:#f9fafb;">
              <th align="left" style="padding:12px;">Product</th>
              <th style="padding:12px;">Qty</th>
              <th align="right" style="padding:12px;">Price</th>
            </tr>
            ${itemHtml}
          </table>

          <div style="margin-top:20px;padding:18px;background:#18181b;border-radius:8px;text-align:right;">
            <span style="color:#fff;font-size:15px;">Total Amount: </span>
            <strong style="color:#f97316;font-size:20px;">
              ₹${totalAmount.toLocaleString("en-IN")}
            </strong>
          </div>

          <div style="text-align:center;margin:30px 0;">
            <a href="${escapeHtml(weburl)}" target="_blank"
              style="display:inline-block;padding:14px 28px;background:#f97316;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold;">
              Continue Shopping →
            </a>
          </div>

          <p style="color:#555;font-size:14px;line-height:1.7;">
            💬 Need Help?<br/>
            Contact us at
            <a href="mailto:admin76059@gmail.com" style="color:#ea580c;">
              admin76059@gmail.com
            </a>
          </p>

          <p style="color:#333;font-size:14px;line-height:1.7;">
            Happy Shopping! 🧡<br/>
            <strong>The ShopNest Team</strong>
          </p>
        </td>
      </tr>

      <tr>
        <td style="background:linear-gradient(135deg,#18181b,#f97316);padding:22px;text-align:center;color:#d4d4d8;font-size:12px;">
          Support: <a href="mailto:admin76059@gmail.com" style="color:#f97316;">admin76059@gmail.com</a>
          <br/><br/>
          © ${new Date().getFullYear()} SHOPNEST — All Rights Reserved.
        </td>
      </tr>
    </table>
  </div>
  `;

  await sendEmail(userEmail, subject, text, html);
}

async function orderStatusEmail(userEmail, order, newStatus) {
  const weburl = process.env.WEBURL || "https://shopnest-ecom.vercel.app/";

  const status = String(newStatus).toLowerCase();

  const statusMessages = {
    pending: "Your order is awaiting processing.",
    shipped: "Great news! Your order has been shipped. 🚚",
    delivered: "Your order has been delivered successfully. Enjoy your purchase! 🎉",
    cancelled: "Your order has been cancelled.",
  };

  const statusMessage =
    statusMessages[status] || `Your order status is now ${status}.`;

  const subject = `📦 Order Update: ${status.toUpperCase()} — ShopNest`;

  const text = `
Hello 👋

There's an update regarding your ShopNest order.

📦 ORDER UPDATE
Order ID: ${order._id}
New Status: ${status.toUpperCase()}

${statusMessage}

💰 Order Total: ₹${Number(order.totalAmount || 0).toLocaleString("en-IN")}

Visit ShopNest:
${weburl}

💬 Need Help?
Support: admin76059@gmail.com

Thank you for shopping with ShopNest! 🧡

The ShopNest Team

© ${new Date().getFullYear()} SHOPNEST — All Rights Reserved.
`;

  const html = `
  <div style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;">
    <table role="presentation" align="center" width="100%" cellpadding="0" cellspacing="0"
      style="max-width:600px;margin:30px auto;background:#fff;border-radius:14px;overflow:hidden;">

      <tr>
        <td style="background:linear-gradient(135deg,#18181b,#f97316);padding:30px;text-align:center;color:#fff;">
          <h1 style="margin:0;font-size:25px;">📦 Order Status Update</h1>
          <p style="margin:10px 0 0;font-size:14px;">Your ShopNest order has an update.</p>
        </td>
      </tr>

      <tr>
        <td style="padding:30px;">
          <h2 style="color:#18181b;margin-top:0;">Hello 👋</h2>

          <p style="color:#555;font-size:15px;line-height:1.7;">
            There's an update regarding your order. Here are the latest details.
          </p>

          <div style="margin:22px 0;padding:22px;background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;text-align:center;">
            <p style="margin:0 0 10px;color:#555;font-size:13px;">CURRENT ORDER STATUS</p>

            <h2 style="margin:0;color:#ea580c;font-size:24px;">
              ${escapeHtml(status.toUpperCase())}
            </h2>

            <p style="margin:15px 0 0;color:#333;font-size:14px;line-height:1.7;">
              ${escapeHtml(statusMessage)}
            </p>
          </div>

          <p style="color:#555;font-size:14px;">
            <strong>Order ID:</strong> ${escapeHtml(String(order._id))}
          </p>

          <p style="color:#555;font-size:14px;">
            <strong>Order Total:</strong>
            <span style="color:#ea580c;font-weight:bold;">
              ₹${Number(order.totalAmount || 0).toLocaleString("en-IN")}
            </span>
          </p>

          <div style="text-align:center;margin:30px 0;">
            <a href="${escapeHtml(weburl)}" target="_blank"
              style="display:inline-block;padding:14px 28px;background:#f97316;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold;">
              Visit ShopNest →
            </a>
          </div>

          <p style="color:#555;font-size:14px;line-height:1.7;">
            💬 Need Help?<br/>
            Contact us at
            <a href="mailto:admin76059@gmail.com" style="color:#ea580c;">
              admin76059@gmail.com
            </a>
          </p>

          <p style="color:#333;font-size:14px;line-height:1.7;">
            Thank you for shopping with us! 🧡<br/>
            <strong>The ShopNest Team</strong>
          </p>
        </td>
      </tr>

      <tr>
        <td style="background:linear-gradient(135deg,#18181b,#f97316);padding:22px;text-align:center;color:#d4d4d8;font-size:12px;">
          Support: <a href="mailto:admin76059@gmail.com" style="color:#f97316;">admin76059@gmail.com</a>
          <br/><br/>
          © ${new Date().getFullYear()} SHOPNEST — All Rights Reserved.
        </td>
      </tr>
    </table>
  </div>
  `;

  await sendEmail(userEmail, subject, text, html);
}

module.exports = {
  registerEmail,
  orderConfirmationEmail,
  orderStatusEmail,
};
