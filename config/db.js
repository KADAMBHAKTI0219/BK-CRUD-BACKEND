const mongoose = require("mongoose");
const dotenv = require('dotenv');
const retry = require('async-retry');
dotenv.config();

let connection;

const connectDB = async () => {
  if (connection) {
    return connection;
  }

  try {
    connection = await retry(
      async () => {
        return await mongoose.connect(process.env.MONGO_DB_URL, {
          serverSelectionTimeoutMS: 30000,
          socketTimeoutMS: 45000,
          maxPoolSize: 10,
          bufferCommands: false,
        });
      },
      { retries: 3, minTimeout: 1000 }
    );
    console.log(`MongoDB Connected: ${connection.connection.host}`);
    return connection;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    throw error; // Throw error to be caught by startServer
  }
};

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('Mongoose disconnected. Attempting to reconnect...');
  connection = null;
});

module.exports = connectDB;