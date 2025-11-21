const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  markOrderPaid,
  markOrderDelivered,
  deleteOrder
} = require('../controllers/orderController');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');

// @route   POST /api/orders
// @desc    Create a new order
// @access  Private
router.post('/', auth, createOrder);

// @route   GET /api/orders/my
// @desc    Get logged in user's orders
// @access  Private
router.get('/my', auth, getMyOrders);

// @route   GET /api/orders
// @desc    Get all orders
// @access  Private/Admin
router.get('/', auth, admin, getAllOrders);

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', auth, getOrderById);

// @route   PUT /api/orders/:id/pay
// @desc    Update order to paid
// @access  Private
router.put('/:id/pay', auth, markOrderPaid);

// @route   PUT /api/orders/:id/deliver
// @desc    Update order to delivered
// @access  Private/Admin
router.put('/:id/deliver', auth, admin, markOrderDelivered);

// @route   DELETE /api/orders/:id
// @desc    Delete order (only non-paid orders)
// @access  Private
router.delete('/:id', auth, deleteOrder);

module.exports = router;
