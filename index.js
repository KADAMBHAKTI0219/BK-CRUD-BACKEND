const express = require('express');
const cors = require('cors');
const dotenv= require('dotenv');
const ProductRouter = require('./routes/productRoutes');
const path = require('path');
const connectDB = require('./config/db');
dotenv.config()
const app = express()
app.use(express.json());
app.use(cors({
    origin:  ["http://localhost:5173","http://localhost:5174","http://localhost:5175","http://localhost:3000","http://localhost:3001","http://localhost:3002"],   
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credential:true
}))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const startServer = async () => {
    try {
      await connectDB(); // Ensure DB connection
      app.use('/product', ProductRouter); // Register routes after connection
      const PORT = process.env.PORT || 3000;
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    } catch (error) {
      console.error('Failed to start server due to database connection error:', error);
      process.exit(1); // Exit with failure
    }
  };
  
  startServer();