const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Le produit est obligatoire']
  },
  quantity: {
    type: Number,
    required: [true, 'La quantit� est obligatoire'],
    min: [1, 'La quantit� doit �tre au moins 1'],
    validate: {
      validator: Number.isInteger,
      message: 'La quantit� doit �tre un nombre entier'
    }
  },
  price: {
    type: Number,
    required: [true, 'Le prix est obligatoire'],
    min: [0, 'Le prix ne peut pas �tre n�gatif']
  },
  // Capacité de stockage (pour le nouveau système de variantes)
  storage: {
    type: String,
    trim: true,
    enum: {
      values: ['', '64', '128', '256', '512', '1024'],
      message: 'Capacité de stockage invalide'
    }
  },
  // État du produit (nouveau système avec 4 états)
  etat: {
    type: String,
    trim: true,
    enum: {
      values: ['', 'neuf_sous_blister', 'neuf_sans_boite', 'etat_parfait', 'tres_bon_etat'],
      message: 'État invalide'
    }
  },
  // Couleur du produit
  color: {
    type: String,
    trim: true
  },
  // Ancien champ condition (deprecated - pour rétrocompatibilité)
  condition: {
    type: String,
    trim: true,
    enum: {
      values: ['', 'new_sealed', 'new_open', 'perfect', 'good'],
      message: 'Condition invalide'
    }
  },
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: ''
  }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'L\'utilisateur est obligatoire']
  },
  items: {
    type: [orderItemSchema],
    required: [true, 'Les articles sont obligatoires'],
    validate: {
      validator: function(items) {
        return items.length > 0;
      },
      message: 'La commande doit contenir au moins un article'
    }
  },
  totalAmount: {
    type: Number,
    required: [true, 'Le montant total est obligatoire'],
    min: [0, 'Le montant total ne peut pas �tre n�gatif']
  },
  status: {
    type: String,
    required: true,
    enum: {
      values: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
      message: 'Statut invalide. Les statuts valides sont: pending, paid, shipped, delivered, cancelled'
    },
    default: 'pending'
  },
  shippingAddress: {
    street: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    postalCode: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      trim: true,
      default: 'France'
    }
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'paypal', 'stripe'],
    default: 'stripe'
  },
  paymentResult: {
    id: String,
    status: String,
    update_time: String,
    email_address: String
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  paidAt: {
    type: Date
  },
  isDelivered: {
    type: Boolean,
    default: false
  },
  deliveredAt: {
    type: Date
  },
  shippingPrice: {
    type: Number,
    default: 0,
    min: 0
  },
  taxPrice: {
    type: Number,
    default: 0,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index pour am�liorer les performances
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

// M�thode pour calculer le sous-total des articles
orderSchema.methods.calculateItemsTotal = function() {
  return this.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
};

// M�thode pour marquer la commande comme pay�e
orderSchema.methods.markAsPaid = function(paymentResult) {
  this.isPaid = true;
  this.paidAt = Date.now();
  this.status = 'paid';
  this.paymentResult = paymentResult;
};

// M�thode pour marquer la commande comme livr�e
orderSchema.methods.markAsDelivered = function() {
  this.isDelivered = true;
  this.deliveredAt = Date.now();
  this.status = 'delivered';
};

// Pr�-validation pour v�rifier la coh�rence du montant total
orderSchema.pre('validate', function(next) {
  const itemsTotal = this.calculateItemsTotal();
  const expectedTotal = itemsTotal + this.shippingPrice + this.taxPrice;

  // Tol�rance de 0.01 pour les arrondis
  if (Math.abs(this.totalAmount - expectedTotal) > 0.01) {
    next(new Error(`Le montant total (${this.totalAmount}) ne correspond pas � la somme des articles (${expectedTotal})`));
  } else {
    next();
  }
});

// Population automatique de l'utilisateur et des produits
orderSchema.pre(/^find/, function(next) {
  this.populate('user', 'name email').populate('items.product', 'name images');
  next();
});

module.exports = mongoose.model('Order', orderSchema);
