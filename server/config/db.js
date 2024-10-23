const mongoose = require("mongoose");
require('dotenv').config();

const ConnectDB= async ()=>{
  try {
    const mongoUrl = process.env.MONGOD_URI
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true, 
      useUnifiedTopology: true,
    })
    console.log("MongoDB connected....");
  } catch (error) {
    console.log("MONGODB connection FAILED ", error);
    process.exit(1)
  }
}

ConnectDB();