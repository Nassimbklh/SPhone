const mongoose = require('mongoose');
const Product = require('../models/Product');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongo:27017/sphone';

async function verifyProducts() {
  try {
    console.log('🔍 Vérification des produits migrés\n');
    console.log(`📡 Connexion à MongoDB: ${MONGODB_URI}`);

    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✅ Connecté à MongoDB\n');

    const products = await Product.find({});
    console.log(`📊 ${products.length} produits dans la base de données\n`);

    let phonesCount = 0;
    let variantsCount = 0;
    let totalVariants = 0;
    let totalColors = 0;

    for (const product of products) {
      console.log('─'.repeat(80));
      console.log(`📱 ${product.name}`);
      console.log(`   Catégorie: ${product.category}`);
      console.log(`   Marque: ${product.brand || 'N/A'}`);

      if (product.category === 'phones' && product.variants) {
        phonesCount++;
        const variantsObj = product.variants.toObject ? product.variants.toObject() : product.variants;
        const storages = Object.keys(variantsObj);

        console.log(`   \n   📦 Variantes:`);

        storages.forEach(storage => {
          const storageData = variantsObj[storage];
          const etats = Object.keys(storageData);

          etats.forEach(etat => {
            const variant = storageData[etat];
            if (variant && variant.couleurs) {
              variantsCount++;
              totalVariants++;
              const stockTotal = variant.couleurs.reduce((sum, c) => sum + (c.stock || 0), 0);
              totalColors += variant.couleurs.length;

              console.log(`      ${storage} Go - ${etat}:`);
              console.log(`         Prix: ${variant.prix}€ ${variant.prixPublic ? `(Public: ${variant.prixPublic}€)` : ''}`);
              console.log(`         Couleurs: ${variant.couleurs.length} (${variant.couleurs.map(c => `${c.nom}: ${c.stock}`).join(', ')})`);
              console.log(`         Stock total: ${stockTotal}`);
            }
          });
        });
      } else {
        console.log(`   Prix: ${product.price}€`);
        console.log(`   Stock: ${product.stock}`);
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log('📈 Statistiques globales:');
    console.log(`   📱 Téléphones avec variantes: ${phonesCount}`);
    console.log(`   📦 Total de variantes créées: ${totalVariants}`);
    console.log(`   🎨 Total de couleurs configurées: ${totalColors}`);
    console.log(`   🛍️  Autres produits: ${products.length - phonesCount}`);
    console.log('='.repeat(80));

  } catch (error) {
    console.error('❌ Erreur:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Connexion fermée');
  }
}

if (require.main === module) {
  verifyProducts()
    .then(() => {
      console.log('\n✅ Vérification terminée!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Erreur:', error);
      process.exit(1);
    });
}

module.exports = { verifyProducts };
