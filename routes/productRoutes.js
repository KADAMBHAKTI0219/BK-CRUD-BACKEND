const express = require('express');
const { createProductData, getProductData, updateProductData, deleteProductData, getSingleData } = require('../controllers/productControllers');
const router = express.Router();


router.post('/products', createProductData);
router.get('/products', getProductData);
router.put('/products/:id', updateProductData);
router.delete('/products/:id', deleteProductData);
router.get('/products/:id', getSingleData);

module.exports = router;