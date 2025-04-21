const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { ProductDataModel } = require('../models/productModel');

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, '../Uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and GIF files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single('image');

// Create product
const createProductData = async (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: `Multer error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }

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
        image: imagePath,
      });
      return res.status(201).json({ message: 'Product created successfully', data: productData });
    } catch (error) {
      if (req.file) {
        fs.unlinkSync(path.join(uploadDir, req.file.filename));
      }
      console.error('Database error:', error);
      return res.status(500).json({ message: `Failed to create product: ${error.message}` });
    }
  });
};

// Get all products
const getProductData = async (req, res) => {
  try {
    const data = await ProductDataModel.find()
      .limit(100)
      .lean();
    console.log('Retrieved products:', data.length);
    return res.status(200).json({ message: 'Products retrieved successfully', data });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ message: `Failed to retrieve products: ${error.message}` });
  }
};

// Update product
const updateProductData = async (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: `Multer error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }

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
      const updated = await ProductDataModel.findByIdAndUpdate(id, updateData, { new: true }).lean();
      if (!updated) {
        if (req.file) {
          fs.unlinkSync(path.join(uploadDir, req.file.filename));
        }
        return res.status(404).json({ message: 'Product not found' });
      }
      return res.status(200).json({ message: 'Product updated successfully', data: updated });
    } catch (error) {
      if (req.file) {
        fs.unlinkSync(path.join(uploadDir, req.file.filename));
      }
      console.error('Database error:', error);
      return res.status(500).json({ message: `Failed to update product: ${error.message}` });
    }
  });
};

// Delete product
const deleteProductData = async (req, res) => {
  const id = req.params.id;
  try {
    const product = await ProductDataModel.findByIdAndDelete(id).lean();
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (product.image) {
      try {
        fs.unlinkSync(path.join(__dirname, '..', product.image));
      } catch (err) {
        console.warn('Failed to delete image:', err.message);
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
    const product = await ProductDataModel.findById(id)
      .select('title price description category image')
      .lean();
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