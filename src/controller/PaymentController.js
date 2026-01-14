const OrderService = require("../service/OrderService");
const PaymentService = require("../service/PaymentService");
const SellerReportService = require("../service/SellerReportService");
const { getSellerById } = require("../service/SellerService");
const TransactionService = require("../service/TransactionService");


const paymentSuccessHandler = async (req, res) => {
  const { paymentId } = req.params;
  const { paymentLinkId } = req.query;

  try {
    // Get the user from JWT token
    const user = await req.user;

    const paymentOrder = await PaymentService.getPaymentOrderByPaymentLinkId(
      paymentLinkId
    );

    const paymentSuccess = await PaymentService.proceedPaymentOrder(
      paymentOrder,
      paymentId,
      paymentLinkId
    );

    if (paymentSuccess) {
      for (let orderId of paymentOrder.orders) {
        const order = await OrderService.findOrderById(orderId);

        // Create transaction for the order
        await TransactionService.createTransaction(order);

        // Get seller and update seller report
        const seller = await getSellerById(order.seller);
        const sellerReport = await SellerReportService.getSellerReport(seller);

        // Update the seller's report
        sellerReport.totalOrders += 1;
        sellerReport.totalEarnings += order.totalSellingPrice;
        sellerReport.totalSales += order.orderItems.length;

        const updatedReport = await SellerReportService.updateSellerReport(sellerReport);
        console.log("updated report: " + updatedReport)
      }
      // const cart=await c
     

      return res.status(201).json({
        message: "Payment successful",
        orders: paymentOrder.orders
      });
    } else {
      return res.status(400).json({
        message: "Payment failed",
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }

  
};
//mugalil ullath first chatha code
// const paymentSuccessHandler = async (req, res) => {
//   const { paymentId } = req.params;

//   try {
//     const payment = await razorpay.payments.fetch(paymentId);

//     if (payment.status !== "captured") {
//       return res.status(400).json({ message: "Payment not captured" });
//     }

//     // TODO: find order using receipt / metadata
//     // TODO: mark order as PAID

//     return res.status(200).json({
//       message: "Payment successful",
//     });

//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// };


// payment.controller.js
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const order = await PaymentService.createRazorpayOrder(amount);

    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
  paymentSuccessHandler,createRazorpayOrder
};
