const express = require('express');
const { createProductData, getProductData, updateProductData, deleteProductData, getSingleData } = require('../controllers/productControllers');
const ProductRouter = express.Router();

ProductRouter.post('/create', createProductData);
ProductRouter.get('/get', getProductData);
ProductRouter.put('/update/:id', updateProductData);
ProductRouter.delete('/delete/:id', deleteProductData);
ProductRouter.get('/get/:id', getSingleData);

module.exports = ProductRouter;