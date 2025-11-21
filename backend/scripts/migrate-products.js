const mongoose = require('mongoose');
const Product = require('../models/Product');

// Configuration de la connexion MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongo:27017/sphone';

// Couleurs disponibles par marque
const COLORS_BY_BRAND = {
  'Apple': ['Noir', 'Blanc', 'Bleu', 'Argent', 'Or'],
  'Samsung': ['Noir', 'Blanc', 'Bleu', 'Vert', 'Violet'],
  'Google': ['Noir', 'Blanc', 'Bleu Ciel', 'Corail'],
  'Xiaomi': ['Noir', 'Blanc', 'Bleu', 'Vert'],
  'OnePlus': ['Noir', 'Bleu Glacé', 'Vert Forêt'],
  'default': ['Noir', 'Blanc', 'Bleu']
};

// Capacités de stockage standard
const STORAGE_CAPACITIES = ['128', '256', '512', '1024'];

// États disponibles
const ETATS = ['neuf_sous_blister', 'neuf_sans_boite', 'etat_parfait', 'tres_bon_etat'];

// Fonction pour générer un prix basé sur le stockage et l'état
function generatePrice(basePrice, storage, etat) {
  let price = basePrice;

  // Ajustement selon le stockage
  const storageMultipliers = {
    '64': 0.85,
    '128': 1.0,
    '256': 1.3,
    '512': 1.6,
    '1024': 2.0
  };

  price *= (storageMultipliers[storage] || 1.0);

  // Ajustement selon l'état
  const etatMultipliers = {
    'neuf_sous_blister': 1.0,
    'neuf_sans_boite': 0.95,
    'etat_parfait': 0.85,
    'tres_bon_etat': 0.75
  };

  price *= (etatMultipliers[etat] || 0.8);

  return Math.round(price);
}

// Fonction pour générer un stock aléatoire
function generateStock(min = 5, max = 20) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Fonction pour migrer un produit
async function migrateProduct(product) {
  console.log(`\n📦 Migration du produit: ${product.name}`);

  // Si le produit est dans la catégorie phones, ajouter des variantes
  if (product.category === 'phones') {
    const variants = {};
    const basePrice = product.price || 500;
    const brand = product.brand || 'default';
    const colors = COLORS_BY_BRAND[brand] || COLORS_BY_BRAND['default'];

    // Déterminer les capacités de stockage selon le produit
    let storages = STORAGE_CAPACITIES;
    if (basePrice < 300) {
      storages = ['64', '128', '256']; // Téléphones entrée de gamme
    } else if (basePrice < 600) {
      storages = ['128', '256', '512']; // Téléphones milieu de gamme
    }

    // Créer les variantes pour chaque stockage
    for (const storage of storages) {
      variants[storage] = {};

      // Pour chaque état
      for (const etat of ETATS) {
        const prix = generatePrice(basePrice, storage, etat);
        const prixPublic = Math.round(prix * 1.25); // +25% pour le prix public

        // Créer les couleurs avec leur stock
        const couleurs = colors.map(nomCouleur => ({
          nom: nomCouleur,
          stock: generateStock(3, 15)
        }));

        variants[storage][etat] = {
          prix,
          prixPublic,
          couleurs
        };
      }
    }

    // Mettre à jour le produit
    product.variants = variants;
    product.availableStorages = storages;

    console.log(`  ✅ Variantes créées:`);
    console.log(`     - ${storages.length} capacités de stockage`);
    console.log(`     - ${ETATS.length} états`);
    console.log(`     - ${colors.length} couleurs par état`);
  }
  // Pour les autres catégories (accessoires, etc.)
  else {
    console.log(`  ℹ️  Produit de catégorie "${product.category}" - pas de variantes ajoutées`);

    // S'assurer qu'il a au moins un prix et un stock
    if (!product.price || product.price === 0) {
      product.price = 50; // Prix par défaut
    }
    if (!product.stock || product.stock === 0) {
      product.stock = 20; // Stock par défaut
    }
  }

  // Sauvegarder
  await product.save();
  console.log(`  💾 Produit sauvegardé avec succès`);

  return product;
}

// Fonction principale
async function migrateAllProducts() {
  try {
    console.log('🚀 Début de la migration des produits\n');
    console.log(`📡 Connexion à MongoDB: ${MONGODB_URI}`);

    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✅ Connecté à MongoDB\n');

    // Récupérer tous les produits
    const products = await Product.find({});
    console.log(`📊 ${products.length} produits trouvés\n`);

    if (products.length === 0) {
      console.log('⚠️  Aucun produit à migrer');
      return;
    }

    // Migrer chaque produit
    let migratedCount = 0;
    let errorCount = 0;

    for (const product of products) {
      try {
        await migrateProduct(product);
        migratedCount++;
      } catch (error) {
        console.error(`  ❌ Erreur lors de la migration de ${product.name}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📈 Résumé de la migration:');
    console.log(`   ✅ Produits migrés avec succès: ${migratedCount}`);
    console.log(`   ❌ Erreurs: ${errorCount}`);
    console.log('='.repeat(60));

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Connexion MongoDB fermée');
  }
}

// Exécuter la migration
if (require.main === module) {
  migrateAllProducts()
    .then(() => {
      console.log('\n✨ Migration terminée avec succès!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 La migration a échoué:', error);
      process.exit(1);
    });
}

module.exports = { migrateAllProducts, migrateProduct };
