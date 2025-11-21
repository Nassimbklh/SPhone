const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Product = require('../models/Product');
const Order = require('../models/Order');
const { isValidCondition } = require('../utils/conditions');
const { isValidEtat, isValidStorage, getEtatLabel, getStorageLabel } = require('../utils/variants');

// @desc    Create Stripe checkout session
// @route   POST /api/payment/create-checkout-session
// @access  Private
exports.createStripeCheckoutSession = async (req, res) => {
  try {
    const { items } = req.body;

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Le panier est vide ou invalide'
      });
    }

    // Validate each item in cart
    const lineItems = [];
    let totalAmount = 0;

    for (const item of items) {
      // Check required fields
      if (!item.productId || !item.quantity || !item.price || !item.name) {
        return res.status(400).json({
          success: false,
          message: 'Chaque article doit contenir: productId, quantity, price, name'
        });
      }

      // Vérifier le stockage et l'état si fournis (nouveau système)
      if (item.storage && !isValidStorage(item.storage)) {
        return res.status(400).json({
          success: false,
          message: `Capacité de stockage invalide: ${item.storage}`
        });
      }

      if (item.etat && !isValidEtat(item.etat)) {
        return res.status(400).json({
          success: false,
          message: `État invalide: ${item.etat}`
        });
      }

      // Vérifier l'ancienne condition si fournie (rétrocompatibilité)
      if (item.condition && !isValidCondition(item.condition)) {
        return res.status(400).json({
          success: false,
          message: `Condition invalide: ${item.condition}`
        });
      }

      // Verify product exists in database
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Produit non trouvé: ${item.name}`
        });
      }

      let itemPrice;
      let itemStock;

      // NOUVEAU SYSTÈME: Si storage + etat sont fournis, utiliser le système de variantes
      if (item.storage && item.etat && product.variants && product.variants.has(item.storage)) {
        const storageVariants = product.variants.get(item.storage);

        if (!storageVariants || !storageVariants[item.etat]) {
          return res.status(400).json({
            success: false,
            message: `Variante non disponible: ${getStorageLabel(item.storage)} - ${getEtatLabel(item.etat)}`
          });
        }

        const variant = storageVariants[item.etat];
        itemPrice = variant.prix;

        // Trouver le stock de la couleur spécifique
        if (item.color && variant.couleurs && variant.couleurs.length > 0) {
          const couleur = variant.couleurs.find(
            c => c.nom && c.nom.toLowerCase() === item.color.toLowerCase()
          );
          if (!couleur) {
            return res.status(400).json({
              success: false,
              message: `Couleur "${item.color}" non disponible pour ${product.name} - ${getStorageLabel(item.storage)} - ${getEtatLabel(item.etat)}`
            });
          }
          itemStock = couleur.stock;
        } else {
          // Pas de couleur spécifiée, calculer le stock total
          itemStock = variant.couleurs.reduce((total, c) => total + (c.stock || 0), 0);
        }
      }
      // ANCIEN SYSTÈME: Si condition est fournie, utiliser l'ancien système
      else if (item.condition && product.conditions && product.conditions.has(item.condition)) {
        const condition = product.conditions.get(item.condition);
        if (condition) {
          itemPrice = condition.price;
          itemStock = condition.stock;

          // Vérifier que la couleur est disponible pour cette condition
          if (item.color && condition.colors && condition.colors.length > 0) {
            const colorAvailable = condition.colors.some(
              c => c.toLowerCase() === item.color.toLowerCase()
            );
            if (!colorAvailable) {
              return res.status(400).json({
                success: false,
                message: `Couleur "${item.color}" non disponible pour ${product.name} en condition ${item.condition}`
              });
            }
          }
        } else {
          itemPrice = product.price;
          itemStock = product.stock;
        }
      } else {
        // Mode rétrocompatibilité: utiliser price et stock globaux
        itemPrice = product.price;
        itemStock = product.stock;
      }

      // Verify price matches (security check)
      if (itemPrice !== item.price) {
        return res.status(400).json({
          success: false,
          message: `Le prix de ${product.name} a changé. Veuillez actualiser votre panier.`
        });
      }

      // Check stock availability
      if (itemStock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Stock insuffisant pour ${product.name}. Stock disponible: ${itemStock}`
        });
      }

      // Calculate total
      totalAmount += itemPrice * item.quantity;

      // Construire le nom d'affichage avec storage, etat et couleur si disponibles
      let displayName = product.name;

      // Nouveau système: storage + etat
      if (item.storage && item.etat) {
        displayName += ` - ${getStorageLabel(item.storage)} - ${getEtatLabel(item.etat)}`;
      }
      // Ancien système: condition
      else if (item.condition) {
        const { getConditionLabel } = require('../utils/conditions');
        displayName += ` - ${getConditionLabel(item.condition)}`;
      }

      // Couleur (commun aux deux systèmes)
      if (item.color) {
        displayName += ` - ${item.color}`;
      }

      // Create Stripe line item
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: displayName,
            description: product.description.substring(0, 200), // Stripe limit
            images: product.images.length > 0 ? [product.images[0]] : [],
            metadata: {
              productId: product._id.toString(),
              storage: item.storage || '',
              etat: item.etat || '',
              condition: item.condition || '', // Ancien système
              color: item.color || ''
            }
          },
          unit_amount: Math.round(itemPrice * 100), // Convert to cents
        },
        quantity: item.quantity,
      });
    }

    // Prepare order items
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      orderItems.push({
        product: product._id,
        name: product.name,
        price: item.price,
        quantity: item.quantity,
        image: product.images && product.images.length > 0 ? product.images[0] : '',
        storage: item.storage || null,
        etat: item.etat || null,
        condition: item.condition || null, // Ancien système
        color: item.color || null
      });
    }

    // Create order in database with pending status
    const order = await Order.create({
      user: req.user.userId || req.user.id,
      items: orderItems,
      shippingAddress: {
        address: 'À remplir par Stripe',
        city: 'À remplir par Stripe',
        postalCode: 'À remplir par Stripe',
        country: 'À remplir par Stripe'
      },
      totalAmount,
      status: 'pending',
      paymentStatus: 'pending'
    });

    // Get frontend URL from environment
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      success_url: `${frontendUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/cancel`,
      customer_email: req.user.email, // From auth middleware
      client_reference_id: req.user.userId || req.user.id, // To identify user later
      metadata: {
        userId: req.user.userId || req.user.id,
        orderId: order._id.toString(),
        itemsCount: items.length,
        totalAmount: totalAmount.toFixed(2)
      },
      shipping_address_collection: {
        allowed_countries: ['FR', 'BE', 'CH', 'LU', 'MC']
      },
      billing_address_collection: 'required',
    });

    res.status(200).json({
      success: true,
      message: 'Session de paiement créée avec succès',
      data: {
        sessionId: session.id,
        url: session.url,
        totalAmount,
        orderId: order._id
      }
    });
  } catch (error) {
    console.error('Error in createStripeCheckoutSession:', error);

    // Handle Stripe specific errors
    if (error.type === 'StripeCardError') {
      return res.status(400).json({
        success: false,
        message: 'Erreur de carte bancaire',
        error: error.message
      });
    }

    if (error.type === 'StripeInvalidRequestError') {
      return res.status(400).json({
        success: false,
        message: 'Requête invalide vers Stripe',
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la session de paiement',
      error: error.message
    });
  }
};

// @desc    Get checkout session details
// @route   GET /api/payment/session/:sessionId
// @access  Private
exports.getCheckoutSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID manquant'
      });
    }

    // Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Verify session belongs to authenticated user
    const userId = req.user.userId || req.user.id;
    if (session.client_reference_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à accéder à cette session'
      });
    }

    // Get order from metadata
    const orderId = session.metadata.orderId;
    const order = await Order.findById(orderId).populate('items.product');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Commande introuvable'
      });
    }

    // If payment is successful and order is not yet marked as paid, update it
    if (session.payment_status === 'paid' && order.paymentStatus !== 'paid') {
      // Update order status
      order.status = 'paid';
      order.paymentStatus = 'paid';
      order.paidAt = new Date();

      // Update shipping address from Stripe
      if (session.shipping_details) {
        order.shippingAddress = {
          address: session.shipping_details.address.line1 || '',
          city: session.shipping_details.address.city || '',
          postalCode: session.shipping_details.address.postal_code || '',
          country: session.shipping_details.address.country || ''
        };
      }

      await order.save();

      // Update product stock
      for (const item of order.items) {
        const product = await Product.findById(item.product._id || item.product);

        if (product) {
          // Nouveau système: storage + etat
          if (item.storage && item.etat) {
            product.decreaseStockByVariant(item.storage, item.etat, item.quantity);
            await product.save();
          }
          // Ancien système: condition
          else if (item.condition) {
            product.decreaseStockByCondition(item.condition, item.quantity);
            await product.save();
          }
          // Mode rétrocompatibilité: stock global
          else {
            await Product.findByIdAndUpdate(product._id, {
              $inc: {
                stock: -item.quantity,
                soldCount: item.quantity
              }
            });
          }
        }
      }
    }

    res.status(200).json({
      success: true,
      data: {
        session: {
          id: session.id,
          payment_status: session.payment_status,
          customer_email: session.customer_email,
          amount_total: session.amount_total / 100, // Convert from cents
          currency: session.currency,
          metadata: session.metadata
        },
        order
      }
    });
  } catch (error) {
    console.error('Error in getCheckoutSession:', error);

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la session',
      error: error.message
    });
  }
};

// @desc    Stripe Webhook Handler
// @route   POST /api/payment/webhook
// @access  Public (but verified with Stripe signature)
exports.stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    try {
      const orderId = session.metadata.orderId;

      if (!orderId) {
        console.error('No orderId in session metadata');
        return res.json({ received: true });
      }

      const order = await Order.findById(orderId);

      if (!order) {
        console.error(`Order ${orderId} not found`);
        return res.json({ received: true });
      }

      // Only update if not already paid
      if (order.paymentStatus !== 'paid') {
        // Update order status
        order.status = 'paid';
        order.paymentStatus = 'paid';
        order.paidAt = new Date();

        // Update shipping address from Stripe
        if (session.shipping_details) {
          order.shippingAddress = {
            address: session.shipping_details.address.line1 || '',
            city: session.shipping_details.address.city || '',
            postalCode: session.shipping_details.address.postal_code || '',
            country: session.shipping_details.address.country || ''
          };
        }

        await order.save();

        // Update product stock
        for (const item of order.items) {
          const product = await Product.findById(item.product);

          if (product) {
            // Nouveau système: storage + etat
            if (item.storage && item.etat) {
              product.decreaseStockByVariant(item.storage, item.etat, item.quantity);
              await product.save();
            }
            // Ancien système: condition
            else if (item.condition) {
              product.decreaseStockByCondition(item.condition, item.quantity);
              await product.save();
            }
            // Mode rétrocompatibilité: stock global
            else {
              await Product.findByIdAndUpdate(product._id, {
                $inc: {
                  stock: -item.quantity,
                  soldCount: item.quantity
                }
              });
            }
          }
        }

        console.log(`Order ${orderId} successfully paid and updated via webhook`);
      }
    } catch (error) {
      console.error('Error processing webhook:', error);
    }
  }

  // Return a response to acknowledge receipt of the event
  res.json({ received: true });
};
