const Coupon = require('../modal/Coupon');

const Cart = require('../modal/cart');



const couponService = {
  async applyCoupon(code, orderValue, user) {
    try {
      // Find coupon by code
      const coupon = await Coupon.findOne({ code });
      const cart = await Cart.findOne({ user: user._id });

      if (!coupon) {
        throw new Error('Coupon not found');
      }

      if (user.usedCoupons.includes(coupon._id)) {
        throw new Error('Coupon already used');
      }

      if (orderValue <= coupon.minimumOrderValue) {
        throw new Error(
          `Valid for minimum order value ${coupon.minimumOrderValue}`
        );
      }

      const currentDate = new Date();

      if (
        coupon.active &&
        currentDate >= coupon.validityStartDate &&
        currentDate <= coupon.validityEndDate
      ) {
        // Add the coupon to user's used coupons
        user.usedCoupons.push(coupon._id);
        await user.save();

        // Calculate discounted price and update cart
        const discount = Math.round((cart.totalSellingPrice * coupon.discountPercentage) / 100);
        cart.totalSellingPrice -= discount;
        cart.couponCode = code;
        cart.couponPrice = discount;

        return await cart.save();
      }

      throw new Error('Coupon not valid');
    } catch (error) {
      throw new Error(error.message);
    }
  },

 
  async removeCoupon(code, user) {
    try {
      const coupon = await Coupon.findOne({ code });

      if (!coupon) {
        throw new Error('Coupon not found');
      }

      user.usedCoupons = user.usedCoupons.filter((usedCoupon) => !usedCoupon.equals(coupon._id));
      await user.save();

      const cart = await Cart.findOne({ userId: user._id });
      cart.totalSellingPrice += cart.couponPrice; // Add the discount back to the cart's total
      cart.couponCode = null;
      cart.couponPrice = 0;

      return await cart.save();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  /**
   * Create a new coupon (admin only)
   * @param {Object} couponData - Coupon data (mongoose document)
   * @returns {Object} - Newly created coupon
   */
  async createCoupon(couponData) {
    try {
      const newCoupon = new Coupon(couponData);
      return await newCoupon.save();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  /**
   * Delete a coupon by ID (admin only)
   * @param {String} couponId - Coupon ID
   */
  async deleteCoupon(couponId) {
    try {
      await Coupon.findByIdAndDelete(couponId);
    } catch (error) {
      throw new Error(error.message);
    }
  },

  /**
   * Get all coupons (admin only)
   * @returns {Array} - List of all coupons
   */
  async getAllCoupons() {
    try {
      return await Coupon.find();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  /**
   * Get a coupon by ID
   * @param {String} couponId - Coupon ID
   * @returns {Object|null} - Coupon object or null if not found
   */
  async getCouponById(couponId) {
    try {
      return await Coupon.findById(couponId);
    } catch (error) {
      throw new Error('Coupon not found');
    }
  }
};

module.exports = couponService;
