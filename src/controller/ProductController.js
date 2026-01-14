const Product = require("../modal/Product")
const Seller = require("../modal/Seller");
const { getProductBySeller, createProduct, deleteProduct, updateProduct, findProductById, searchProduct, getAllProducts } = require("../service/ProductService");
;




exports.getProductBySellerId=  async (req, res)=> {
    try {
      const seller = await req.seller;

      const products = await getProductBySeller(seller._id);
      res.status(200).json( products );
    } catch (error) {
      // console.log("------ ");
      res.status(400).json({ error: error.message });
    }
  }

  // Create a product
exports.createProduct=  async (req, res)=> {
    try {
    //   await createProductSchema.validate(req.body, { abortEarly: false });

      const seller = await req.seller;

      const product = await createProduct(req.body, seller);
      return res.status(201).json(product);
    } catch (error) {
      
      res.status(400).json({ error: error.message });
     
    }
  }

  // Delete a product
  exports. deleteProduct=async(req, res)=> {
    try {
      await deleteProduct(req.params.productId);
    return  res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  // Update a product
exports.updateProduct=async (req, res) =>   {
    try {
      const product = await updateProduct(
        req.params.productId,
        req.body
      );

    return  res.status(200).json(product);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  // Get product by ID
 exports.getProductById=async (req, res) =>{
    try {
      const product = await findProductById(
        req.params.productId
      );
    return   res.status(200).json(product);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  // Search for products by query
exports.searchProduct=async (req, res)=> {
    try {
      const query = req.query.q;
      const products = await searchProduct(query);
      return res.status(200).json(products);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

exports.getAllProducts=async (req, res) =>{
    try {
      const products = await getAllProducts(req.query);
     return res.status(200).json(products);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }



