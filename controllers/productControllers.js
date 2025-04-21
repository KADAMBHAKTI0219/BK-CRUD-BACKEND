const { ProductDataModel } = require('../models/productModel'); // Ensure this matches your export
const fs = require('fs'); // For file system operations
const path = require('path'); // For handling file paths
const uploadDir = path.join(__dirname, '..', 'uploads'); // Define upload directory

const createProductData = async(req, res) => {
  const { title, price, description, category } = req.body;

  if (!title || !price || !description || !category) {
    return res.status(400).json({ message: 'Please fill all required fields' });
  }

  try {
    const imagePath = req.file ? `/uploads/${req.file.filename}` : undefined;
    const productData = await ProductDataModel.create({
      title,
      price,
      description,
      category,
      image: imagePath
    });
    return res.status(201).json({ message: 'Product created successfully', data: productData });
  } catch (error) {
    // Clean up uploaded file if database operation fails
    if (req.file) {
      fs.unlinkSync(path.join(uploadDir, req.file.filename));
    }
    console.error('Database error:', error);
    return res.status(500).json({ message: `Failed to create product: ${error.message}` });
  }
};

// Get all products
const getProductData = async (req, res) => {
  try {
    const data = await ProductDataModel.find().lean();
    console.log('Retrieved products:', data.length);
    return res.status(200).json({ message: 'Products retrieved successfully', data });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ message: `Failed to retrieve products: ${error.message}` });
  }
};

// Update product
const updateProductData = async(req, res) => {
  // Assuming upload middleware (e.g., multer) is applied in routes
  const { title, price, description, category } = req.body;
  const id = req.params.id;

  if (!title || !price || !description || !category) {
    return res.status(400).json({ message: 'Please fill all required fields' });
  }

  try {
    const updateData = { title, price, description, category };
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }
    const updated = await ProductDataModel.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) {
      if (req.file) {
        fs.unlinkSync(path.join(uploadDir, req.file.filename));
      }
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.status(200).json({ message: 'Product data updated successfully', data: updated });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(path.join(uploadDir, req.file.filename));
    }
    console.error('Database error:', error);
    return res.status(500).json({ message: `Failed to update product: ${error.message}` });
  }
};

// Delete product
const deleteProductData = async (req, res) => {
  const id = req.params.id;
  try {
    const product = await ProductDataModel.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    // Delete associated image file if it exists
    if (product.image) {
      const imagePath = path.join(__dirname, '..', product.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ message: `Failed to delete product: ${error.message}` });
  }
};

// Get single product
const getSingleData = async (req, res) => {
  const id = req.params.id;
  try {
    const product = await ProductDataModel.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.status(200).json({ message: 'Product retrieved successfully', data: product });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ message: `Failed to retrieve product: ${error.message}` });
  }
};

module.exports = { createProductData, getProductData, updateProductData, deleteProductData, getSingleData };