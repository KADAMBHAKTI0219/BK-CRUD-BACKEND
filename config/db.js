const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config();

let connection;

const connectDB = async () => {
  if (connection) {
    return connection;
  }

  try {
    connection = await mongoose.connect(process.env.MONGO_DB_URL, {
      serverSelectionTimeoutMS: 30000, // 30 seconds timeout
      socketTimeoutMS: 45000, // 45 seconds socket timeout
      maxPoolSize: 10, // Maximum number of connections in pool
      bufferCommands: false, // Disable buffering to fail fast
    });
    console.log(`MongoDB Connected: ${connection.connection.host}`);
    return connection;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

// Handle connection events
mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('Mongoose disconnected. Attempting to reconnect...');
  connection = null; // Reset connection to trigger reconnect
});

module.exports = connectDB;