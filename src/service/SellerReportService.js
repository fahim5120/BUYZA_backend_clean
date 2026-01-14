const OrderStatus = require("../domain/OrderStatus");
const SellerReport = require("../modal/SellerReport");
const OrderService = require("./OrderService");

class SellerReportService {
//   async getSellerReport(seller) {
//     try {
//       let sellerReport = await SellerReport.findOne({ seller: seller._id });
//       console.log("Seller Report", sellerReport);

//       const orders = await OrderService.getShopsOrders(seller._id);

//       const totalEarning = orders.reduce(
//         (total, order) => total + order.totalSellingPrice,
//         0
//       );

//       const canceledOrders = orders.filter(
//         (order) => order.orderStatus == OrderStatus.CANCELLED
//       );
//       console.log("canceled Orders", canceledOrders)
//       const totalRefunds = canceledOrders.reduce(
//         (total, order) => total + order.totalSellingPrice,
//         0
//       );

//       sellerReport = new SellerReport({
//         seller: seller._id,
//         totalOrders: orders.length,
//         totalEarnings: totalEarning,
//         totalSales: orders.length,
//         canceledOrders:canceledOrders.length,
//         totalRefunds:totalRefunds
//       });

//       sellerReport = await sellerReport.save();

//       return sellerReport;
//     } catch (err) {
//       throw new Error(`Error fetching seller report: ${err.message}`);
//     }
//   }

async getSellerReport(seller) {
  try {
    let sellerReport = await SellerReport.findOne({ seller: seller._id });
    console.log("Seller Report", sellerReport);

    // If the report does not exist, create a new one
    if (!sellerReport) {
      sellerReport = new SellerReport({
        seller: seller._id,
        totalOrders: 0,
        totalEarnings: 0,
        totalSales: 0,
      });

      sellerReport = await sellerReport.save();
    }

    return sellerReport;
  } catch (err) {
    throw new Error(`Error fetching seller report: ${err.message}`);
  }
}


  async updateSellerReport(sellerReport) {
    try {
      // Update and save the seller report
      return await SellerReport.findByIdAndUpdate(
        sellerReport._id,
        sellerReport,
        { new: true }
      );
    } catch (err) {
      throw new Error(`Error updating seller report: ${err.message}`);
    }
  }
}

module.exports = new SellerReportService();
