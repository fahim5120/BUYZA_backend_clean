const { removeCartItem, updateCartItem } = require("../service/CartItemService");
const {findUserCart, addCartItem} = require("../service/CartService");
const { findProductById } = require("../service/ProductService");


exports.findUserCartHandler=  async (req, res) =>{
    try {
      const user = await req.user;


      const cart = await findUserCart(user);

      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Add item to cart
 exports.addItemToCart= async (req, res)=> {
    try {
      const user = await req.user;
    //   console.log("req ",req.body)
      const product = await findProductById(req.body.productId);

      const cartItem = await addCartItem(
        user,
        product,
        req.body.size,
        req.body.quantity
      );

      res.status(202).json(cartItem);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Delete a cart item
exports.deleteCartItemHandler= async (req, res)=> {
    try {

      const user = await req.user;
      await removeCartItem(user._id, req.params.cartItemId);

      res.status(202).json({ message: "Item removed from cart" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Update a cart item
 exports.updateCartItemHandler= async (req, res)=> {
    try {
      const cartItemId = req.params.cartItemId;
      const { quantity } = req.body;

      const user = await req.user;
      let updatedCartItm;
      if (quantity > 0) {
        updatedCartItm = await updateCartItem(
          user._id,
          cartItemId,
          { quantity }
        );
      }

      res.status(202).json(updatedCartItm);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }



