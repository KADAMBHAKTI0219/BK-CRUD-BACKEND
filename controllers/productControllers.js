const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { ProductDataModel } = require('../models/productModel');

// Ensure uploads folder exists (use lowercase for consistency)
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer for image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter for images only
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
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
}).single('image'); // Expect single file with field name 'image'

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
    });
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
            return res.status(400).json({ message: "Please fill all required fields" });
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
                return res.status(404).json({ message: "Product not found" });
            }
            return res.status(200).json({ message: "Product data updated successfully", data: updated }); // Ensure data is returned
        } catch (error) {
            if (req.file) {
                fs.unlinkSync(path.join(uploadDir, req.file.filename));
            }
            console.error("Database error:", error);
            return res.status(500).json({ message: `Failed to update product: ${error.message}` });
        }
    });
};

// Delete product
const deleteProductData = async (req, res) => {
    const id = req.params.id;
    try {
        const product = await ProductDataModel.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        // Optionally delete associated image file
        if (product.image) {
            fs.unlinkSync(path.join(__dirname, '..', product.image));
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