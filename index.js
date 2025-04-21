const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectToDB = require('./config/db');
const ProductRouter = require('./routes/productRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Fixed typo
}));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'Uploads')));

// Routes
app.use('/product', ProductRouter);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    try {
      const connection = await connectToDB();
      console.log('Connection state:', connection.readyState); // 1 = connected, 0 = disconnected
      console.log(`Server is running on port ${PORT}`);
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  });