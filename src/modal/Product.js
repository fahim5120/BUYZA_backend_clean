const mongoose = require("mongoose");

// Define the Product schema
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,

    },
    mrpPrice: {
      type: Number,
      required: true,
        
    },
    sellingPrice: {
      type: Number,
      required: true,
    },
    discountPercent: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true
    },
    color: {
      type: String,
      required: true,
    },
    images: {
      type: [String], // Array of strings for image URLs
     
    },
   
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
  
    size: {
      type: String,
      required: true,
    },
 
},
//   {
//     timestamps: true,
//   }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
