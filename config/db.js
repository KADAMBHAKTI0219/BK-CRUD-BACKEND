const mongoose = require('mongoose');
require('dotenv').config(); // Loads environment variables from .env

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_DB_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`); // Logs any connection errors
    process.exit(1); // Exits the app if connection fails
  }
};

module.exports = connectDB; // Exports the connection function