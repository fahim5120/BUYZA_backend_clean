require("dotenv").config();
const express = require('express');
const connectDB = require('./db/db');
const bodyParser = require('body-parser');
const app=express()
const cors = require('cors');



app.get("/",(req,res)=>{
    res.send({message:"Hello Welcome To Buyza Backend System!"})
})
// app.use(cors(
//   {  origin: process.env.CLIENT_URL,
//     credentials: true,}
// ))
app.use(cors({
  origin:  process.env.CLIENT_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));


app.use(bodyParser.json())


const adminRoutes=require("./routers/AdminRoutes")
const sellerRoutes=require("./routers/SellerRoutes");
const authRoutes=require("./routers/AuthRoutes");
const userRoutes=require("./routers/UserRoutes");
const productRoutes=require("./routers/ProductsRoutes");
const sellerProdutRoutes=require("./routers/sellerProductRoutes");
const cartRoutes=require("./routers/CartRoutes");
const orderRoutes=require("./routers/orderRoutes");
const sellerOrderRoutes=require("./routers/sellerOrderRoutes");
const PaymentRoutes=require("./routers/PaymentRoutes");
const transactionRoutes=require("./routers/TransactionRoutes");
const sellerReportRoutes=require("./routers/SellerReportRoutes");
const couponRouters=require("./routers/couponRoutes");
const homeCategoryRoutes=require("./routers/HomeCategoryRoutes");
const dealRoutes=require("./routers/DealRoutes");
const revenueRouters=require("./routers/revenueRoutes");



app.use("/products",productRoutes)
app.use("/api/sellers/products",sellerProdutRoutes)
app.use("/api/cart",cartRoutes)
app.use("/api/orders",orderRoutes)
app.use("/api/seller/orders",sellerOrderRoutes)
app.use("/api/payment",PaymentRoutes)
app.use("/api/transaction",transactionRoutes)
app.use("/api/sellers/report",sellerReportRoutes)




app.use("/api/auth",authRoutes)
app.use("/api/users",userRoutes)
app.use("/sellers",sellerRoutes)


app.use("/admin",adminRoutes)
app.use("/api/coupons",couponRouters)
app.use("/home",homeCategoryRoutes)
app.use("/admin/deals",dealRoutes)
app.use("/api/sellers/revenue",revenueRouters)











const port=process.env.PORT || 5000;
app.listen(port,async()=>{
    console.log(`server is running on port ${port}`);
    await connectDB()
})


//lRE5jAik7m0HJryk



