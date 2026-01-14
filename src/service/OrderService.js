const mongoose = require("mongoose");
const OrderStatus = require("../domain/OrderStatus");
const Address = require("../modal/Address");
const Order = require("../modal/Order");
const OrderItem = require("../modal/OrderItem");
const User = require("../modal/User");











class OrderService {
  // async createOrder(user, shippingAddress, cart) {
  //   try {
  //     if (
  //       shippingAddress._id &&
  //       !user.addressess.includes(shippingAddress._id)
  //     ) {
  //       user.addressess.push(shippingAddress._id);
  //       await User.findByIdAndUpdate(user._id, user);
  //     }

  //     // let shippingAddress;

  //     if (!shippingAddress._id) {
  //       shippingAddress = await Address.create(shippingAddress);
  //       //    user.addresses.push(shippingAddress._id);
  //       //   await User.findByIdAndUpdate(user._id, user);
  //     }

  //     const itemsBySeller = cart.cartItems.reduce((acc, item) => {
  //       const sellerId = item.product.seller._id.toString();
  //       acc[sellerId] = acc[sellerId] || [];
  //       acc[sellerId].push(item);
  //       return acc;
  //     }, {});

  //     const orders = new Set();

  //     for (const [sellerId, cartItems] of Object.entries(itemsBySeller)) {
  //       const totalOrderPrice = cartItems.reduce(
  //         (sum, item) => sum + item.sellingPrice,0
          
  //       );
  //       console.log("--------",totalOrderPrice);
        
  //       const totalItem = cartItems.length;
  //       //   reduce(
  //       //     (sum, item) => sum + item.quantity,
  //       //     0
  //       //   );

  //       // Create the new order
  //       const newOrder = new Order({
  //         user: user._id,
  //           seller: sellerId,
  //         shippingAddress: shippingAddress._id,
  //         orderItems: [],
  //         totalMrpPrice: totalOrderPrice,
  //         totalSellingPrice:  totalOrderPrice,
  //         totalItem: totalItem,
  //       });

  //       // Save each order item
  //       const orderItems = await Promise.all(
  //         cartItems.map(async (cartItem) => {
  //           const orderItem = new OrderItem({
  //             // order: savedOrder._id,
  //             product: cartItem.product._id,
  //             quantity: cartItem.quantity,
  //             sellingPrice: cartItem.sellingPrice,
  //             mrpPrice: cartItem.mrpPrice,
  //             size: cartItem.size,
  //             userId: cartItem.userId,
  //           });

  //           const savedOrderItem = await orderItem.save();
  //           newOrder.orderItems.push(savedOrderItem._id);
  //           return savedOrderItem;
  //         })
  //       );

  //       const savedOrder = await newOrder.save();
  //       // TransactionService.createTransaction(savedOrder._id);
  //       orders.add(savedOrder);
  //     }

  //     return Array.from(orders);
  //   } catch (error) {
  //     console.log("orderr error ", error);
  //     throw new Error(error.message);
  //   }
  // }
 async createOrder(user, shippingAddress, cart) {
  try {
    let addressDoc;

    // ✅ CASE 1: existing address (has _id)
    if (shippingAddress?._id) {
      addressDoc = await Address.findById(shippingAddress._id);
      if (!addressDoc) throw new Error("Address not found");
    }

    // ✅ CASE 2: new address (NO _id)
   // ✅ CASE 2: new address (NO _id)
else {
  addressDoc = await Address.create({
    name: shippingAddress.name,
    address: shippingAddress.address || shippingAddress.addressess,
    locality: shippingAddress.locality,
    city: shippingAddress.city,
    state: shippingAddress.state,
    pincode: shippingAddress.pincode,
    mobile: shippingAddress.mobile,
  });

  if (!user.addressess.includes(addressDoc._id)) {
    user.addressess.push(addressDoc._id);
    await user.save();
  }
}


    // ---- orders creation logic stays SAME ----


    const itemsBySeller = cart.cartItems.reduce((acc, item) => {
      const sellerId = item.product.seller._id.toString();
      acc[sellerId] = acc[sellerId] || [];
      acc[sellerId].push(item);
      return acc;
    }, {});

    const orders = new Set();

    for (const [sellerId, cartItems] of Object.entries(itemsBySeller)) {
      const totalOrderPrice = cartItems.reduce(
        (sum, item) => sum + item.sellingPrice,
        0
      );

      const newOrder = new Order({
        user: user._id,
        seller: sellerId,
        shippingAddress: addressDoc._id, // ✅ ALWAYS ObjectId
        orderItems: [],
        totalMrpPrice: totalOrderPrice,
        totalSellingPrice: totalOrderPrice,
        totalItem: cartItems.length,
      });

      for (const cartItem of cartItems) {
        const orderItem = await new OrderItem({
          product: cartItem.product._id,
          quantity: cartItem.quantity,
          sellingPrice: cartItem.sellingPrice,
          mrpPrice: cartItem.mrpPrice,
          size: cartItem.size,
          userId: cartItem.userId,
        }).save();

        newOrder.orderItems.push(orderItem._id);
      }

      const savedOrder = await newOrder.save();
      orders.add(savedOrder);
    }

    return Array.from(orders);
  } catch (error) {
    console.log("orderr error 👉", error);
    throw error;
  }
}


  async findOrderById(orderId) {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new Error("Invalid Order ID...");
    }
    // console.log("order id ",orderId)
    const order = await Order.findById(orderId).populate([
      { path: "seller" },
      { path: "orderItems", populate: { path: "product" } },
      { path: "shippingAddress" },
    ]);

    if (!order) {
      throw new Error(`Order not found `);
    }
    return order;
  }

  async usersOrderHistory(userId) {
    return await Order.find({ user: userId }).populate([
      { path: "seller" },
      { path: "shippingAddress" },
      { path: "orderItems", populate: { path: "product" } },
    ]);
  }

  async getSellersOrder(sellerId) {
    return await Order.find({ seller: sellerId })
      .sort({ orderDate: -1 })
      .populate([
        { path: "seller" },
        { path: "shippingAddress" },
        { path: "orderItems", populate: { path: "product" } },
      ]);
  }

  async updateOrderStatus(orderId, status) {
    const order = await this.findOrderById(orderId);

    order.orderStatus = status;

    return await Order.findByIdAndUpdate(orderId, order, {
      new: true,
      // runValidators: true,
    }).populate([
      { path: "seller" },
      { path: "orderItems", populate: { path: "product" } },
      { path: "shippingAddress" },
    ]);
  }

  async cancelOrder(orderId, user) {
    const order = await this.findOrderById(orderId);
    if (user._id.toString() !== order.user.toString()) {
      throw new Error(`You can't cancel this order`);
    }
    order.status = OrderStatus.CANCELLED;
    return await Order.findByIdAndUpdate(orderId, order, {
      new: true,
    }).populate([
      { path: "seller" },
      { path: "orderItems", populate: { path: "product" } },
      { path: "shippingAddress" },
    ]);
  }

  async findOrderItemById(orderItemId) {
    if (!mongoose.Types.ObjectId.isValid(orderItemId)) {
      throw new Error("Invalid Order Item ID...");
    }
    // console.log("order id ",orderId)
    const orderItem = await OrderItem.findById(orderItemId).populate("product");

    if (!orderItem) {
      throw new Error(`Order item not found `);
    }
    return orderItem;
  }

  async deleteOrder(orderId) {
    const order = await this.findOrderById(orderId);
    if (!order) {
      throw new Error(`Order not found with id ${orderId}`);
    }
    return await Order.deleteOne({ _id: orderId });
  }
}

module.exports = new OrderService();
