/**
 * Script de nettoyage des états/variantes vides
 *
 * Ce script supprime tous les états vides dans la base de données:
 * - États sans prix valide (prix <= 0)
 * - États sans couleurs
 * - États avec des couleurs vides (sans nom ou stock invalide)
 * - Capacités de stockage sans aucun état valide
 *
 * Usage: node scripts/clean-empty-variants.js
 */

const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const cleanEmptyVariants = async () => {
  try {
    // Connexion à MongoDB
    console.log('🔌 Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connecté à MongoDB\n');

    // Récupérer tous les produits avec des variantes
    const products = await Product.find({ variants: { $exists: true, $ne: {} } });
    console.log(`📦 ${products.length} produit(s) avec variantes trouvé(s)\n`);

    let totalCleaned = 0;
    let totalProductsModified = 0;

    for (const product of products) {
      let hasChanges = false;
      const cleanedVariants = {};
      let removedCount = 0;

      // Parcourir chaque capacité de stockage
      for (const [storage, storageData] of product.variants) {
        const cleanedStorage = {};

        // Parcourir chaque état
        const etatsObj = storageData.toObject();
        Object.keys(etatsObj).forEach(etat => {
          const variant = etatsObj[etat];

          // Vérifier que l'état a des données valides
          if (variant && variant.prix > 0 && variant.couleurs && Array.isArray(variant.couleurs)) {
            // Filtrer les couleurs pour ne garder que celles avec nom et stock valides
            const validCouleurs = variant.couleurs.filter(c =>
              c && c.nom && c.nom.trim() !== '' && typeof c.stock === 'number' && c.stock >= 0
            );

            // Ne créer l'état QUE s'il a au moins une couleur valide
            if (validCouleurs.length > 0) {
              cleanedStorage[etat] = {
                prix: variant.prix,
                prixPublic: variant.prixPublic,
                couleurs: validCouleurs
              };
            } else {
              removedCount++;
              hasChanges = true;
              console.log(`   ❌ Suppression: ${storage}Go - ${etat} (aucune couleur valide)`);
            }
          } else {
            removedCount++;
            hasChanges = true;
            const reason = !variant ? 'variant null' : variant.prix <= 0 ? 'prix invalide' : 'pas de couleurs';
            console.log(`   ❌ Suppression: ${storage}Go - ${etat} (${reason})`);
          }
        });

        // Ne créer le storage QUE s'il a au moins un état valide
        if (Object.keys(cleanedStorage).length > 0) {
          cleanedVariants[storage] = cleanedStorage;
        } else {
          hasChanges = true;
          console.log(`   ❌ Suppression: Capacité ${storage}Go complète (aucun état valide)`);
        }
      }

      // Sauvegarder si des modifications ont été faites
      if (hasChanges) {
        product.variants = cleanedVariants;
        product.availableStorages = Object.keys(cleanedVariants);
        await product.save();

        totalProductsModified++;
        totalCleaned += removedCount;

        console.log(`📝 Produit: ${product.name}`);
        console.log(`   ✅ ${removedCount} état(s) vide(s) supprimé(s)`);
        console.log(`   ℹ️  ${Object.keys(cleanedVariants).length} capacité(s) restante(s)\n`);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 RÉSUMÉ DU NETTOYAGE');
    console.log('='.repeat(60));
    console.log(`✅ Produits modifiés: ${totalProductsModified}`);
    console.log(`❌ États vides supprimés: ${totalCleaned}`);
    console.log(`📦 Produits analysés: ${products.length}`);
    console.log('='.repeat(60) + '\n');

    // Fermer la connexion
    await mongoose.connection.close();
    console.log('👋 Déconnecté de MongoDB');

  } catch (error) {
    console.error('❌ Erreur:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Exécuter le script
cleanEmptyVariants();
