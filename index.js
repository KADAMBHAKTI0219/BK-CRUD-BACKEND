const express = require('express');
const connectDB = require('./db');
const productRoutes = require('./routes/productRoutes');
const path = require('path');

const app = express();

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Await connection before setting up routes
const startServer = async () => {
  try {
    await connectDB();
    app.use('/product', productRoutes);
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server due to database connection error:', error);
    process.exit(1);
  }
};

startServer();