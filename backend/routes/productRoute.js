const express = require('express')
const { getAllProducts, createProduct, updateProduct, deleteProduct, productDetail, createProductReview } = require('../controllers/productController');
const { isAuthenticated, authorizedRoles } = require('../middleware/auth');
const router = express.Router()


router.route("/products").get( isAuthenticated,getAllProducts);
router.route("/admin/product/new").post(isAuthenticated, authorizedRoles('admin'),createProduct);
router.route("/admin/product/:id")
.put(isAuthenticated,authorizedRoles('admin'),updateProduct)
.delete(isAuthenticated,authorizedRoles('admin'),deleteProduct)

router.route("/product/:id").get(isAuthenticated,productDetail);
router.route("/review").put(isAuthenticated,createProductReview)

module.exports = router

 