const express = require('express');
const { createProductData, getProductData, updateProductData, deleteProductData, getSingleData } = require('../controllers/productControllers');
const router = express.Router();


router.post('/create', createProductData);
router.get('/get', getProductData);
router.put('/update/:id', updateProductData);
router.delete('/delete/:id', deleteProductData);
router.get('/get/:id', getSingleData);

module.exports = router;