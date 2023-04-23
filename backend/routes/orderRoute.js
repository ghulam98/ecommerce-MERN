const express = require("express")
const { isAuthenticated, authorizedRoles } = require("../middleware/auth")
const { newOrder, myOrders, getSingleOrder, getAllOrders, updateOrder, deleteOrder } = require("../controllers/orderController")
const router = express.Router()

router.route("/order/new").post(isAuthenticated,newOrder)
router.route("/orders/me").get(isAuthenticated, myOrders)
router.route("/order/:id").get(isAuthenticated, getSingleOrder)

router.route("/admin/orders").get(isAuthenticated, authorizedRoles('admin'), getAllOrders)
router.route("/admin/order/:id")
.put(isAuthenticated, authorizedRoles('admin'), updateOrder)
.delete(isAuthenticated, authorizedRoles('admin'), deleteOrder)

module.exports = router
