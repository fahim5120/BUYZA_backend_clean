// Import necessary modules
const PaymentOrder = require("../modal/PaymentOrder"); // Assuming you have Mongoose models defined
const Razorpay = require("razorpay");
// const Order = require("../modal/Order");
// const User = require("../modal/User");
// const PaymentStatus = require("../domain/PaymentStatus");
const razorpay = require("../config/razorpayClient");
// const OrderStatus = require("../domain/OrderStatus");
const stripe = require("../config/stripe");



class PaymentService {
  async createOrder(user, orders) {
    const amount = orders.reduce(
      (sum, order) => sum + order.totalSellingPrice,
      0
    );

    const paymentOrder = new PaymentOrder({
      amount,
      user: user._id,
      orders: orders.map((order) => order._id), // Saving order IDs
    });

    return await paymentOrder.save();
  }

  async getPaymentOrderById(orderId) {
    const paymentOrder = await PaymentOrder.findById(orderId);
    if (!paymentOrder) {
      throw new Error("Payment order not found");
    }
    return paymentOrder;
  }

  async getPaymentOrderByPaymentLinkId(paymentLinkId) {
    const paymentOrder = await PaymentOrder.findOne({ paymentLinkId });
    if (!paymentOrder) {
      throw new Error("Payment order not found ");
    }
    return paymentOrder;
  }









  // async createRazorpayPaymentLink(user, amount, orderId) {
  //   try {
  //     const paymentLinkRequest = {
  //       amount: amount * 100,
  //       currency: "INR",
  //       customer: {
  //         name: user.fullName,
  //         email: user.email,
  //       },
  //       notify: {
  //         email: true,
  //       },
  //       callback_url: `http://localhost:5173/payment-success/${orderId}`,
  //       callback_method: "get",
  //     };

  //     const paymentLink = await razorpay.paymentLink.create(paymentLinkRequest);
  //     //   console.log("payment link",paymentLink);

  //     return paymentLink;
  //   } catch (error) {
  //     // console.error("razorr pay errror ", err);
  //     throw new Error(error.message);
  //   }
  // }


   async createRazorpayPaymentLink(user, amount, orderId) {
     const   apiKey=process.env.RAZORPAY_KEY_ID;
     const   apiSecret=RAZORPAY_KEY_SECRET;
        
        
        const razorpays = new Razorpay({
            key_id: apiKey,
            key_secret: apiSecret,
          });
        try {
            const paymentLinkRequest = {
                amount: amount * 100,
                currency: 'INR',
                customer: {
                    name: user.fullName,
                    email: user.email
                },
                notify: {
                    email: true
                },
                callback_url: `http://localhost:5173/payment-success/${orderId}`,
                callback_method: 'get'
            };

         
          
              const paymentLink = await razorpays.paymentLink.create(paymentLinkRequest);
          console.log("payment link",paymentLink);
             
            return paymentLink;
        } catch (err) {
            console.error("razorr pay errror ", err);
            throw new Error(err.message);
        }
    }









  // async proceedPaymentOrder(paymentOrder, paymentId, paymentLinkId) {
  //   if (paymentOrder.status === PaymentStatus.PENDING) {
  //     const payment = await razorpay.payments.fetch(paymentId);

  //     if (payment.status === "captured") {
  //       // Update each order's payment status
  //       await Promise.all(
  //         paymentOrder.orders.map(async (orderId) => {
  //           const order = await Order.findById(orderId);
  //           order.paymentStatus = PaymentStatus.COMPLETED;
  //           order.orderStatus = OrderStatus.PLACED;
  //           await order.save();
  //         })
  //       );

  //       paymentOrder.status = PaymentStatus.SUCCESS;

  //       await paymentOrder.save();

  //       return true;
  //     } else {
  //       paymentOrder.status = PaymentStatus.FAILED;
  //       await paymentOrder.save();
  //       return false;
  //     }
  //   }
  //   return false;
  // }






async createStripePaymentLink(user, amount, orderId) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: user.email,

      line_items: [
        {
          price_data: {
            currency: "inr",   // 🇮🇳 Razorpay uses INR → keep same
            unit_amount: amount * 100,
            product_data: {
              name: "Marketplace Order",
            },
          },
          quantity: 1,
        },
      ],

      success_url: `http://localhost:5173/payment-success/${orderId}`,
      cancel_url: `http://localhost:5173/payment-cancel`,
    });

    return session.url;
  } catch (err) {
    throw new Error(err.message);
  }
}


  async createRazorpayOrder(amount) {
  const order = await razorpay.orders.create({
    amount: amount * 100,   // INR → paise
    currency: "INR",
    receipt: "rcpt_" + Date.now(),
  });

  return order;
}

}

module.exports = new PaymentService();
