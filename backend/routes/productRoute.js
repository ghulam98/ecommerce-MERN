const express = require('express')
const { getAllProducts, createProduct, updateProduct, deleteProduct, productDetail } = require('../controllers/productController');
const { isAuthenticated, authorizedRoles } = require('../middleware/auth');
const router = express.Router()


router.route("/products").get( isAuthenticated,getAllProducts);
router.route("/product/new").post(isAuthenticated, authorizedRoles('admin'),createProduct);
router.route("/product/:id")
.put(isAuthenticated,authorizedRoles('admin'),updateProduct)
.delete(isAuthenticated,authorizedRoles('admin'),deleteProduct)
.get(isAuthenticated,productDetail);

module.exports = router

 