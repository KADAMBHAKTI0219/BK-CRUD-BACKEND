const express = require('express');
const { createProductData, getProductData, updateProductData, deleteProductData, getSingleData } = require('../controllers/productControllers');
const ProductRouter = express.Router();


ProductRouter.post('/create', createProductData);
ProductRouter.get('/products', getProductData);
ProductRouter.put('/products/:id', updateProductData);
ProductRouter.delete('/products/:id', deleteProductData);
ProductRouter.get('/products/:id', getSingleData);

module.exports = ProductRouter;