const mongoose = require("mongoose");
const dotenv = require('dotenv')
dotenv.config();
const connectionToDB = await mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 30000, // Increase to 30 seconds
  connectTimeoutMS: 30000,
  socketTimeoutMS: 45000,
});
module.exports = connectionToDB;