const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

if (!process.env.MONGO_DB_URL) {
  throw new Error('MONGO_DB_URL is not defined in .env file');
}

const connectToDB = async (retries = 3, delay = 5000) => {
    for (let i = 0; i < retries; i++) {
      try {
        mongoose.set('debug', true);
        console.log('Connecting to:', process.env.MONGO_DB_URL.replace(/\/\/.*@/, '//<hidden>@'));
        const options = {
          serverSelectionTimeoutMS: 15000,
          connectTimeoutMS: 15000,
          socketTimeoutMS: 20000,
          useNewUrlParser: true,
          useUnifiedTopology: true,
          maxPoolSize: 10,
          retryWrites: true,
        };
        await mongoose.connect(process.env.MONGO_DB_URL, options);
        console.log('Successfully connected to MongoDB');
        mongoose.connection.on('error', (err) => {
          console.error('MongoDB connection error:', err);
        });
        mongoose.connection.on('disconnected', () => {
          console.warn('MongoDB disconnected');
        });
        return mongoose.connection;
      } catch (error) {
        console.error(`Connection attempt ${i + 1} failed:`, {
          message: error.message,
          name: error.name,
          stack: error.stack,
        });
        if (i < retries - 1) {
          console.log(`Retrying in ${delay / 1000} seconds...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        } else {
          throw error;
        }
      }
    }
  };

module.exports = connectToDB;