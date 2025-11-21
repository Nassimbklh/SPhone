const mongoose = require('mongoose');

// Schéma pour une couleur avec son stock
const couleurSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Le stock ne peut pas être négatif'],
    validate: {
      validator: Number.isInteger,
      message: 'Le stock doit être un nombre entier'
    }
  }
}, { _id: false });

// Schéma pour une variante spécifique (état du produit pour un stockage donné)
const variantSchema = new mongoose.Schema({
  prix: {
    type: Number,
    default: 0,
    min: [0, 'Le prix ne peut pas être négatif']
  },
  prixPublic: {
    type: Number,
    default: 0,
    min: [0, 'Le prix public ne peut pas être négatif']
  },
  couleurs: {
    type: [couleurSchema],
    default: []
  }
}, { _id: false });

// Schéma pour les états d'un stockage spécifique
const storageVariantsSchema = new mongoose.Schema({
  neuf_sous_blister: { type: variantSchema, default: () => ({}) },
  neuf_sans_boite: { type: variantSchema, default: () => ({}) },
  etat_parfait: { type: variantSchema, default: () => ({}) },
  tres_bon_etat: { type: variantSchema, default: () => ({}) }
}, { _id: false });

// Schéma pour une spécification technique
const specificationItemSchema = new mongoose.Schema({
  label: { type: String, required: true, trim: true },
  value: { type: String, required: true, trim: true }
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom du produit est obligatoire'],
    trim: true,
    minlength: [3, 'Le nom doit contenir au moins 3 caractères'],
    maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
  },
  description: {
    type: String,
    required: [true, 'La description est obligatoire'],
    trim: true,
    minlength: [10, 'La description doit contenir au moins 10 caractères'],
    maxlength: [2000, 'La description ne peut pas dépasser 2000 caractères']
  },
  // Capacités de stockage disponibles (en Go)
  availableStorages: {
    type: [String],
    default: [],
    validate: {
      validator: function(array) {
        const validStorages = ['64', '128', '256', '512', '1024'];
        return array.every(storage => validStorages.includes(storage));
      },
      message: 'Capacité de stockage invalide. Les valeurs valides sont: 64, 128, 256, 512, 1024'
    }
  },
  // Structure des variantes: variants[stockage][état] = { prix, prixPublic, stock, couleurs }
  variants: {
    type: Map,
    of: storageVariantsSchema,
    default: {}
  },
  // Spécifications techniques organisées par catégories
  specifications: {
    ecran: { type: [specificationItemSchema], default: [] },
    processeur: { type: [specificationItemSchema], default: [] },
    ram: { type: [specificationItemSchema], default: [] },
    stockage: { type: [specificationItemSchema], default: [] },
    camera: { type: [specificationItemSchema], default: [] },
    batterie: { type: [specificationItemSchema], default: [] },
    systeme: { type: [specificationItemSchema], default: [] }
  },
  // Anciens champs pour rétrocompatibilité (deprecated, seront retirés progressivement)
  price: {
    type: Number,
    default: 0
  },
  pricePublic: {
    type: Number,
    default: 0
  },
  stock: {
    type: Number,
    default: 0
  },
  colors: {
    type: [String],
    default: []
  },
  // Anciennes conditions (deprecated)
  conditions: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },
  images: {
    type: [String],
    default: [],
    validate: {
      validator: function(array) {
        return array.length <= 10;
      },
      message: 'Un produit ne peut pas avoir plus de 10 images'
    }
  },
  category: {
    type: String,
    required: [true, 'La catégorie est obligatoire'],
    enum: {
      values: ['phones', 'cases', 'accessories', 'watches', 'earphones', 'electronics'],
      message: 'Catégorie invalide. Les catégories valides sont: phones, cases, accessories, watches, earphones, electronics'
    },
    trim: true,
    lowercase: true
  },
  brand: {
    type: String,
    trim: true
  },
  model: {
    type: String,
    trim: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  isBestSeller: {
    type: Boolean,
    default: false
  },
  bestSellerOrder: {
    type: Number,
    default: null,
    min: 1,
    max: 4,
    validate: {
      validator: function(value) {
        if (!value) return true;
        return Number.isInteger(value) && value >= 1 && value <= 4;
      },
      message: 'L\'ordre doit être un nombre entre 1 et 4'
    }
  },
  soldCount: {
    type: Number,
    default: 0,
    min: 0,
    validate: {
      validator: Number.isInteger,
      message: 'Le nombre de ventes doit être un nombre entier'
    }
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index pour am�liorer les performances de recherche
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });

// Méthode virtuelle pour vérifier si le produit est en stock (au moins une variante)
productSchema.virtual('inStock').get(function() {
  // Vérifier les variantes
  if (this.variants && this.variants.size > 0) {
    for (const [storage, etats] of this.variants) {
      const hasStock = Object.values(etats.toObject()).some(variant => {
        if (!variant || !variant.couleurs) return false;
        // Vérifier si au moins une couleur a du stock
        return variant.couleurs.some(couleur => couleur && couleur.stock > 0);
      });
      if (hasStock) return true;
    }
    return false;
  }

  // Fallback sur anciennes conditions
  if (this.conditions && this.conditions.size > 0) {
    for (const [key, condition] of this.conditions) {
      if (condition && condition.stock > 0) return true;
    }
    return false;
  }

  // Fallback sur ancien stock
  return this.stock > 0;
});

// Méthode virtuelle pour obtenir le stock total de toutes les variantes
productSchema.virtual('totalStock').get(function() {
  // Calculer le stock total des variantes
  if (this.variants && this.variants.size > 0) {
    let total = 0;
    for (const [storage, etats] of this.variants) {
      const etatsObj = etats.toObject();
      Object.values(etatsObj).forEach(variant => {
        if (variant && variant.couleurs) {
          // Sommer le stock de toutes les couleurs
          variant.couleurs.forEach(couleur => {
            if (couleur && couleur.stock) {
              total += couleur.stock;
            }
          });
        }
      });
    }
    return total;
  }

  // Fallback sur anciennes conditions
  if (this.conditions && this.conditions.size > 0) {
    let total = 0;
    for (const [key, condition] of this.conditions) {
      if (condition && condition.stock) {
        total += condition.stock;
      }
    }
    return total;
  }

  // Fallback sur ancien stock
  return this.stock;
});

// Méthode virtuelle pour calculer le pourcentage de réduction (deprecated)
productSchema.virtual('discount').get(function() {
  if (!this.pricePublic || this.pricePublic <= this.price) {
    return null;
  }
  return Math.round(((this.pricePublic - this.price) / this.pricePublic) * 100);
});

// Méthode pour diminuer le stock d'une variante spécifique (storage + état + couleur)
productSchema.methods.decreaseStockByVariant = function(storage, etat, couleur, quantity) {
  const validEtats = ['neuf_sous_blister', 'neuf_sans_boite', 'etat_parfait', 'tres_bon_etat'];

  if (!validEtats.includes(etat)) {
    throw new Error('État invalide');
  }

  if (!this.variants || !this.variants.has(storage)) {
    return false;
  }

  const storageVariants = this.variants.get(storage);
  if (!storageVariants || !storageVariants[etat]) {
    return false;
  }

  const variant = storageVariants[etat];
  if (!variant.couleurs || !Array.isArray(variant.couleurs)) {
    return false;
  }

  // Trouver la couleur
  const couleurObj = variant.couleurs.find(c => c.nom.toLowerCase() === couleur.toLowerCase());
  if (!couleurObj) {
    return false;
  }

  // Vérifier et diminuer le stock
  if (couleurObj.stock >= quantity) {
    couleurObj.stock -= quantity;
    this.soldCount = (this.soldCount || 0) + quantity;
    this.markModified('variants');
    return true;
  }

  return false;
};

// Méthode pour augmenter le stock d'une variante spécifique (storage + état + couleur)
productSchema.methods.increaseStockByVariant = function(storage, etat, couleur, quantity) {
  const validEtats = ['neuf_sous_blister', 'neuf_sans_boite', 'etat_parfait', 'tres_bon_etat'];

  if (!validEtats.includes(etat)) {
    throw new Error('État invalide');
  }

  if (!this.variants || !this.variants.has(storage)) {
    return false;
  }

  const storageVariants = this.variants.get(storage);
  if (!storageVariants || !storageVariants[etat]) {
    return false;
  }

  const variant = storageVariants[etat];
  if (!variant.couleurs || !Array.isArray(variant.couleurs)) {
    return false;
  }

  // Trouver la couleur
  const couleurObj = variant.couleurs.find(c => c.nom.toLowerCase() === couleur.toLowerCase());
  if (!couleurObj) {
    return false;
  }

  couleurObj.stock += quantity;
  this.markModified('variants');
  return true;
};

// Méthode pour diminuer le stock d'une condition spécifique (DEPRECATED - pour rétrocompatibilité)
productSchema.methods.decreaseStockByCondition = function(condition, quantity) {
  const validConditions = ['new_sealed', 'new_open', 'perfect', 'good'];

  if (!validConditions.includes(condition)) {
    throw new Error('Condition invalide');
  }

  if (!this.conditions || !this.conditions.has(condition)) {
    return false;
  }

  const cond = this.conditions.get(condition);
  if (cond && cond.stock >= quantity) {
    cond.stock -= quantity;
    this.soldCount = (this.soldCount || 0) + quantity;
    this.markModified('conditions');
    return true;
  }

  return false;
};

// Méthode pour augmenter le stock d'une condition spécifique (DEPRECATED - pour rétrocompatibilité)
productSchema.methods.increaseStockByCondition = function(condition, quantity) {
  const validConditions = ['new_sealed', 'new_open', 'perfect', 'good'];

  if (!validConditions.includes(condition)) {
    throw new Error('Condition invalide');
  }

  if (!this.conditions || !this.conditions.has(condition)) {
    return false;
  }

  const cond = this.conditions.get(condition);
  if (cond) {
    cond.stock += quantity;
    this.markModified('conditions');
    return true;
  }

  return false;
};

// Méthode pour diminuer le stock (ancienne méthode pour rétrocompatibilité)
productSchema.methods.decreaseStock = function(quantity) {
  if (this.stock >= quantity) {
    this.stock -= quantity;
    return true;
  }
  return false;
};

// Méthode pour augmenter le stock (ancienne méthode pour rétrocompatibilité)
productSchema.methods.increaseStock = function(quantity) {
  this.stock += quantity;
};

module.exports = mongoose.model('Product', productSchema);
