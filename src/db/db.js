const { default: mongoose } = require("mongoose")
const  {initializeAdminUser} = require("../service/DataInitializeService")

const url=process.env.MONGODB_URI;

const connectDB=async (params)=> {
    try {
        const conn=await mongoose.connect(url)
        initializeAdminUser()
        console.log(`mongoDDb connected :${conn.connection.host}`)
        console.log("connected DB");
        
    } catch (error) {
        console.log(`mongoDb Error:${error}`)
    }
}

module.exports=connectDB