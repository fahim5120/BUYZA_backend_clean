const Category = require("../modal/Category");
const Product = require("../modal/Product");
const {
  calculateDiscountPercentage,
} = require("../util/calculateDiscountPercentage");
const { createOrGetCategory } = require("../util/createOrGetCategory");

exports.createProduct = async (req, seller) => {
  try {
    const discountPercent = calculateDiscountPercentage(
      req.mrpPrice,
      req.sellingPrice
    );
    const category1 = await createOrGetCategory(req.category, 1);
    const category2 = await createOrGetCategory(
      req.category2,
      2,
      category1._id
    );
    const category3 = await createOrGetCategory(
      req.category3,
      3,
      category2._id
    );

    const product = new Product({
      title: req.title,
      description: req.description,
      images: req.images,
      sellingPrice: req.sellingPrice,
      mrpPrice: req.mrpPrice,
      discountPercent,
      size: req.sizes,
      color: req.color,
      quantity: req.quantity,
      seller: seller._id,
      category: category3._id,
    });

    return await product.save();
  } catch (error) {
    throw new Error(error.message);
  }
};

//delete product

exports.deleteProduct = async (productId) => {
  try {
    await Product.findByIdAndDelete(productId);
    return "Products deleted successfully";
  } catch (error) {
    throw new Error(error.message);
  }
};

//updateProducts
exports.updateProduct = async (productId, updatedProductData) => {
  try {
    const product = await Product.findByIdAndUpdate(
      productId,
      updatedProductData,
      { new: true }
    );

    return product;
  } catch (error) {
    throw new Error(error.message);
  }
};

//findProductById
exports.findProductById = async (productId) => {
  // console.log("productId: " + productId);

  try {
    const product = await Product.findById(productId);
    if (!product) throw new Error("Product not found");
    return product;
  } catch (error) {
    throw new Error(error.message);
  }
};

//search product
exports.searchProduct = async (query) => {
  try {
    const produts = await Product.find({ title: new RegExp(query, "i") });
    return produts;
  } catch (error) {
    throw new Error(error.message);
  }
};

//seller nte id koduthal ayal add chaitha produts kannam
exports.getProductBySeller = async (sellerId) => {
  return await Product.find({ seller: sellerId });
};

exports.getAllProducts = async (req) => {
  const filterQuery = {};
  if (req.category) {
    const category = await Category.findOne({ categoryId: req.category });

    if (!category) {
      return {
        content: [],
        totalpages: 0,
        totalElement: 0,
      };
    }
    filterQuery.category = category._id.toString();
  }
  if (req.color) {
    filterQuery.color = req.color;
  }

  if (req.minPrice && req.maxPrice) {
    filterQuery.sellingPrice = { $gte: req.minPrice, $lte: req.maxPrice };
  }

  if (req.minDiscount) {
    filterQuery.discountPercent = { $gte: req.minDiscount };
  }
  if (req.size) {
    filterQuery.size = req.size;
  }
  if (req.stock) {
    filterQuery.stock = req.stock;
  }

  let sortQuery = {};
  if (req.sort === "price_low") {
    sortQuery.sellingPrice = 1;
  } else if (req.sort === "price_high") {
    sortQuery.sellingPrice = -1;
  }

  const products = await Product.find(filterQuery)
    .populate("seller", "bussinessDetails") // ✅ ADD THIS
    // .populate("category")
    .populate("category", "categoryId")
    .sort(sortQuery)
    .skip(req.pageNumber * 10)
    .limit(10);

  // Count the total number of products matching the filter query
  const totalElement = await Product.countDocuments(filterQuery);

  // Calculate the total number of pages
  const totalpages = Math.ceil(totalElement / 10);

  //   const page = parseInt(req.pageNumber) || 0;
  //   const pageSize = parseInt(req.pageSize) || 10;

  const res = {
    content: products,
    totalpages,
    totalElement,
  };

  return res;
};

// const Category = require("../modal/Category");
// const Product = require("../modal/Product");
// const { calculateDiscountPercentage } = require("../util/calculateDiscountPercentage");

// const createOrGetCategory = async (categoryId, level, parentId = null) => {
//   let category = await Category.findOne({ categoryId });
//   if (!category) {
//     category = new Category({
//       categoryId,
//       level,
//       parentCategory: parentId,
//     });
//     category = await category.save();
//   }
//   return category;
// };

// exports.createProduct = async (req, seller) => {
//   try {
//     const discountPercent = calculateDiscountPercentage(
//       req.mrpPrice,
//       req.sellingPrice
//     );

//     const category1 = await createOrGetCategory(req.category, 1);
//     const category2 = await createOrGetCategory(
//       req.category2,
//       2,
//       category1._id
//     );
//     const category3 = await createOrGetCategory(
//       req.category3,
//       3,
//       category2._id
//     );

//     const product = new Product({
//       title: req.title,
//       description: req.description,
//       images: req.images,
//       sellingPrice: req.sellingPrice,
//       mrpPrice: req.mrpPrice,
//       discountPercent,
//       size: req.sizes,
//       color: req.color,
//       quantity: req.quantity,
//       seller: seller._id,
//       category: category3._id,
//     });

//     return await product.save();
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };

// // delete product
// exports.deleteProduct = async (productId) => {
//   await Product.findByIdAndDelete(productId);
//   return "Products deleted successfully";
// };

// // update product
// exports.updateProduct = async (productId, updatedProductData) => {
//   return await Product.findByIdAndUpdate(
//     productId,
//     updatedProductData,
//     { new: true }
//   );
// };

// // find product by id
// exports.findProductById = async (productId) => {
//   const product = await Product.findById(productId);
//   if (!product) throw new Error("Product not found");
//   return product;
// };

// // search product
// exports.searchProduct = async (query) => {
//   return await Product.find({ title: new RegExp(query, "i") });
// };

// // get products by seller
// exports.getProductBySeller = async (sellerId) => {
//   return await Product.find({ seller: sellerId });
// };

// exports.getAllProducts = async (req) => {
//   const filterQuery = {};

//   if (req.category) {
//     const category = await Category.findOne({ categoryId: req.category });
//     if (!category) {
//       return { content: [], totalpages: 0, totalElement: 0 };
//     }
//     filterQuery.category = category._id;
//   }

//   if (req.color) filterQuery.color = req.color;

//   if (req.minPrice && req.maxPrice) {
//     filterQuery.sellingPrice = {
//       $gte: req.minPrice,
//       $lte: req.maxPrice,
//     };
//   }

//   if (req.minDiscount) {
//     filterQuery.discountPercent = { $gte: req.minDiscount };
//   }

//   if (req.size) filterQuery.size = req.size;
//   if (req.stock) filterQuery.stock = req.stock;

//   let sortQuery = {};
//   if (req.sort === "price_low") sortQuery.sellingPrice = 1;
//   if (req.sort === "price_high") sortQuery.sellingPrice = -1;

//   const products = await Product.find(filterQuery)
//     .sort(sortQuery)
//     .skip(req.pageNumber * 10)
//     .limit(10);

//   const totalElement = await Product.countDocuments(filterQuery);
//   const totalpages = Math.ceil(totalElement / 10);

//   return {
//     content: products,
//     totalpages,
//     totalElement,
//   };
// };
