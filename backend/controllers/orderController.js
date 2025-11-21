const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      shippingPrice,
      taxPrice
    } = req.body;

    // Validation
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Aucun article dans la commande'
      });
    }

    // Validate and get product details
    const orderItems = [];
    let itemsTotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Produit non trouvé: ${item.product}`
        });
      }

      let stockAvailable = 0;
      let itemPrice = product.price;

      // NOUVEAU SYSTÈME: Avec variantes (storage + etat + couleur)
      if (item.storage && item.etat && item.color) {
        const variant = product.variants?.get(item.storage)?.[item.etat];

        if (!variant) {
          return res.status(400).json({
            success: false,
            message: `Variante non trouvée pour ${product.name}`
          });
        }

        // Trouver le stock de la couleur spécifique
        const couleur = variant.couleurs?.find(c => c.nom.toLowerCase() === item.color.toLowerCase());
        if (!couleur) {
          return res.status(400).json({
            success: false,
            message: `Couleur ${item.color} non disponible pour ${product.name}`
          });
        }

        stockAvailable = couleur.stock;
        itemPrice = variant.prix;
      }
      // ANCIEN SYSTÈME: Avec conditions
      else if (item.condition && product.conditions) {
        const condition = product.conditions.get(item.condition);
        if (!condition) {
          return res.status(400).json({
            success: false,
            message: `Condition non trouvée pour ${product.name}`
          });
        }
        stockAvailable = condition.stock;
        itemPrice = condition.price;
      }
      // Mode rétrocompatibilité totale
      else {
        stockAvailable = product.stock;
        itemPrice = product.price;
      }

      // Check stock
      if (stockAvailable < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Stock insuffisant pour ${product.name}. Stock disponible: ${stockAvailable}`
        });
      }

      // Add to order items
      orderItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price: itemPrice,
        storage: item.storage || '',
        etat: item.etat || '',
        color: item.color || '',
        condition: item.condition || ''
      });

      itemsTotal += itemPrice * item.quantity;

      // Decrease product stock
      if (item.storage && item.etat && item.color) {
        // NOUVEAU SYSTÈME: variantes avec stock par couleur
        const success = product.decreaseStockByVariant(item.storage, item.etat, item.color, item.quantity);
        if (!success) {
          return res.status(400).json({
            success: false,
            message: `Impossible de décrémenter le stock pour ${product.name}`
          });
        }
      } else if (item.condition) {
        // ANCIEN SYSTÈME: conditions
        const success = product.decreaseStockByCondition(item.condition, item.quantity);
        if (!success) {
          return res.status(400).json({
            success: false,
            message: `Impossible de décrémenter le stock pour ${product.name}`
          });
        }
      } else {
        // Mode rétrocompatibilité
        product.decreaseStock(item.quantity);
      }

      await product.save();
    }

    // Calculate total
    const totalAmount = itemsTotal + (shippingPrice || 0) + (taxPrice || 0);

    // Create order
    const order = await Order.create({
      user: req.user.id, // Should be set by auth middleware
      items: orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'stripe',
      shippingPrice: shippingPrice || 0,
      taxPrice: taxPrice || 0,
      totalAmount
    });

    res.status(201).json({
      success: true,
      message: 'Commande cr��e avec succ�s',
      data: { order }
    });
  } catch (error) {
    console.error('Error in createOrder:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la cr�ation de la commande',
      error: error.message
    });
  }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders/my
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: { orders }
    });
  } catch (error) {
    console.error('Error in getMyOrders:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la r�cup�ration des commandes',
      error: error.message
    });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
  try {
    const {
      status,
      page = 1,
      limit = 20
    } = req.query;

    // Build query
    let query = {};
    if (status) {
      query.status = status;
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const totalOrders = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      count: orders.length,
      total: totalOrders,
      page: pageNum,
      totalPages: Math.ceil(totalOrders / limitNum),
      data: { orders }
    });
  } catch (error) {
    console.error('Error in getAllOrders:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la r�cup�ration des commandes',
      error: error.message
    });
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
exports.markOrderPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Commande non trouv�e'
      });
    }

    // Check if user owns the order (unless admin)
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Non autoris� � modifier cette commande'
      });
    }

    // Check if already paid
    if (order.isPaid) {
      return res.status(400).json({
        success: false,
        message: 'Cette commande est d�j� pay�e'
      });
    }

    // Payment result from Stripe (should be in req.body)
    const paymentResult = {
      id: req.body.id || '',
      status: req.body.status || 'completed',
      update_time: req.body.update_time || new Date().toISOString(),
      email_address: req.body.email_address || req.user.email
    };

    // Mark as paid
    order.markAsPaid(paymentResult);
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Commande marqu�e comme pay�e',
      data: { order }
    });
  } catch (error) {
    console.error('Error in markOrderPaid:', error);

    // Handle invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Commande non trouv�e'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise � jour de la commande',
      error: error.message
    });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Commande non trouvée'
      });
    }

    // Check if user owns the order (unless admin)
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à voir cette commande'
      });
    }

    res.status(200).json({
      success: true,
      data: { order }
    });
  } catch (error) {
    console.error('Error in getOrderById:', error);

    // Handle invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Commande non trouvée'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la commande',
      error: error.message
    });
  }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
exports.markOrderDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Commande non trouv�e'
      });
    }

    // Check if already delivered
    if (order.isDelivered) {
      return res.status(400).json({
        success: false,
        message: 'Cette commande est d�j� livr�e'
      });
    }

    // Check if paid
    if (!order.isPaid) {
      return res.status(400).json({
        success: false,
        message: 'La commande doit �tre pay�e avant d\'�tre marqu�e comme livr�e'
      });
    }

    // Mark as delivered
    order.markAsDelivered();
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Commande marqu�e comme livr�e',
      data: { order }
    });
  } catch (error) {
    console.error('Error in markOrderDelivered:', error);

    // Handle invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Commande non trouv�e'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise � jour de la commande',
      error: error.message
    });
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private (user can delete their own orders)
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Commande non trouvée'
      });
    }

    // Vérifier que l'utilisateur est bien le propriétaire de la commande
    if (order.user.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à supprimer cette commande'
      });
    }

    // Empêcher la suppression de commandes déjà payées
    if (order.paymentStatus === 'paid' || order.status === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Impossible de supprimer une commande payée. Contactez le support.'
      });
    }

    await Order.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Commande supprimée avec succès'
    });
  } catch (error) {
    console.error('Error in deleteOrder:', error);

    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Commande non trouvée'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la commande',
      error: error.message
    });
  }
};
