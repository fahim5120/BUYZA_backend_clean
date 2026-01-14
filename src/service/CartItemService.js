// const CartItem = require("../modal/CartItem");
// const User = require("../modal/User");

// exports.updateCartItem = async (userId, cartItemId, cartItemData) => {
//   const cartItem = await this.findCartItemById(cartItemId)

//   // console.log(cartItem,userId)

//   if (cartItem.userId.toString() === userId.toString()) {
//     const updated = {
//       quantity: cartItemData.quantity,
//       mrpPrice: cartItemData.quantity * cartItem.product.mrpPrice,
//       sellingPrice: cartItemData.quantity * cartItem.product.sellingPrice,
//     };

//     // Save updated cart item
//     return await CartItem.findByIdAndUpdate(cartItemId, updated, {
//       new: true,
//     }).populate("product");
//   } else {
//     throw new Error("You can't update another user's cart item..Unauthorized access");
//   }
// };

// // Remove a cart item from the user's cart
// exports.removeCartItem = async (userId, cartItemId) => {
//   // console.log(`userId: ${userId}, cartItemId: ${cartItemId}`);

//   // Find cart item by ID
//   const cartItem = await this.findCartItemById(cartItemId);

//   if (cartItem.userId.toString() === userId.toString()) {
//     // Delete the cart item
//     await CartItem.deleteOne({ _id: cartItem._id });
//   } else {
//     throw new Error("Unauthorized access");
//   }
// };

// // Find a cart item by its ID
// exports.findCartItemById = async (cartItemId) => {
//   const cartItem = await CartItem.findById(cartItemId).populate("product");

//   if (!cartItem) {
//     throw new Error(`Cart item not found with id: ${cartItemId}`);
//   }

//   return cartItem;
// };

const CartItem = require("../modal/CartItem");

exports.updateCartItem = async (userId, cartItemId, cartItemData) => {
  const cartItem = await exports.findCartItemById(cartItemId);

  if (cartItem.userId.toString() !== userId.toString()) {
    throw new Error("Unauthorized access");
  }

  if (cartItemData.quantity <= 0) {
    throw new Error("Quantity must be at least 1");
  }

  const updated = {
    quantity: cartItemData.quantity,
    mrpPrice: cartItemData.quantity * cartItem.product.mrpPrice,
    sellingPrice: cartItemData.quantity * cartItem.product.sellingPrice,
  };

  return await CartItem.findByIdAndUpdate(cartItemId, updated, {
    new: true,
  }).populate("product");
};

exports.removeCartItem = async (userId, cartItemId) => {
  const cartItem = await exports.findCartItemById(cartItemId);

  if (cartItem.userId.toString() !== userId.toString()) {
    throw new Error("Unauthorized access");
  }

  await CartItem.findByIdAndDelete(cartItemId);
};

exports.findCartItemById = async (cartItemId) => {
  const cartItem = await CartItem.findById(cartItemId).populate("product");

  if (!cartItem) {
    throw new Error(`Cart item not found with id: ${cartItemId}`);
  }

  return cartItem;
};
