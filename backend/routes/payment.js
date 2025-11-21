const express = require('express');
const router = express.Router();
const {
  createStripeCheckoutSession,
  getCheckoutSession,
  stripeWebhook
} = require('../controllers/paymentController');
const auth = require('../middlewares/auth');

// @route   POST /api/payment/create-checkout-session
// @desc    Create Stripe checkout session for payment
// @access  Private
router.post('/create-checkout-session', auth, createStripeCheckoutSession);

// @route   GET /api/payment/session/:sessionId
// @desc    Get checkout session details
// @access  Private
router.get('/session/:sessionId', auth, getCheckoutSession);

// @route   POST /api/payment/webhook
// @desc    Stripe webhook handler
// @access  Public (verified with Stripe signature)
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

module.exports = router;
