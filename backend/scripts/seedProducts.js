const mongoose = require('mongoose');
const path = require('path');
const Product = require('../models/Product');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const products = [
  // SMARTPHONES (8 produits)
  {
    name: 'iPhone 14 Pro - 128 Go - Noir sidéral',
    description: 'iPhone 14 Pro avec Dynamic Island, écran Super Retina XDR de 6.1 pouces, puce A16 Bionic et triple caméra 48MP. Design premium en titane avec verre Ceramic Shield.',
    category: 'phones',
    price: 899,
    pricePublic: 1159,
    stock: 12,
    brand: 'Apple',
    colors: ['Noir sidéral', 'Argent', 'Or', 'Violet'],
    images: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-pro-finish-select-202209-6-1inch-deeppurple?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1663703841896'
    ],
    soldCount: 245,
    specifications: {
      'Écran': '6.1" Super Retina XDR',
      'Processeur': 'A16 Bionic',
      'RAM': '6 Go',
      'Stockage': '128 Go',
      'Caméra': '48MP + 12MP + 12MP',
      'Batterie': '3200 mAh',
      'Système': 'iOS 17'
    }
  },
  {
    name: 'iPhone 13 - 128 Go - Bleu',
    description: 'iPhone 13 avec puce A15 Bionic, écran Super Retina XDR de 6.1 pouces et double caméra 12MP. Performance exceptionnelle et autonomie toute la journée.',
    category: 'phones',
    price: 649,
    pricePublic: 809,
    stock: 24,
    brand: 'Apple',
    colors: ['Bleu', 'Minuit', 'Lumière stellaire', 'Rose', 'Rouge'],
    images: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-13-blue-select-2021?wid=940&hei=1112&fmt=p-jpg&qlt=80&.v=1645572315986'
    ],
    soldCount: 312,
    specifications: {
      'Écran': '6.1" Super Retina XDR',
      'Processeur': 'A15 Bionic',
      'RAM': '4 Go',
      'Stockage': '128 Go',
      'Caméra': '12MP + 12MP',
      'Batterie': '3227 mAh',
      'Système': 'iOS 17'
    }
  },
  {
    name: 'Samsung Galaxy S23 - 128 Go - Noir',
    description: 'Samsung Galaxy S23 avec processeur Snapdragon 8 Gen 2, écran AMOLED 120Hz de 6.1 pouces et triple caméra 50MP. Design élégant et performances flagship.',
    category: 'phones',
    price: 679,
    pricePublic: 859,
    stock: 18,
    brand: 'Samsung',
    colors: ['Noir', 'Crème', 'Vert', 'Lavande'],
    images: [
      'https://images.samsung.com/fr/smartphones/galaxy-s23/buy/product_color_phantom_black.png'
    ],
    soldCount: 187,
    specifications: {
      'Écran': '6.1" Dynamic AMOLED 120Hz',
      'Processeur': 'Snapdragon 8 Gen 2',
      'RAM': '8 Go',
      'Stockage': '128 Go',
      'Caméra': '50MP + 12MP + 10MP',
      'Batterie': '3900 mAh',
      'Système': 'Android 14'
    }
  },
  {
    name: 'Samsung Galaxy A54 - 128 Go - Vert',
    description: 'Samsung Galaxy A54 avec écran AMOLED 120Hz de 6.4 pouces, triple caméra 50MP et batterie 5000 mAh. Le meilleur rapport qualité-prix de Samsung.',
    category: 'phones',
    price: 329,
    pricePublic: 449,
    stock: 35,
    brand: 'Samsung',
    colors: ['Vert', 'Noir', 'Violet', 'Blanc'],
    images: [
      'https://images.samsung.com/fr/smartphones/galaxy-a54-5g/buy/product_color_awesome_lime.png'
    ],
    soldCount: 268,
    specifications: {
      'Écran': '6.4" Super AMOLED 120Hz',
      'Processeur': 'Exynos 1380',
      'RAM': '6 Go',
      'Stockage': '128 Go',
      'Caméra': '50MP + 12MP + 5MP',
      'Batterie': '5000 mAh',
      'Système': 'Android 14'
    }
  },
  {
    name: 'Xiaomi Redmi Note 12 - 128 Go - Gris',
    description: 'Xiaomi Redmi Note 12 avec écran AMOLED 120Hz, triple caméra 50MP et charge rapide 33W. Excellent choix pour un budget maîtrisé.',
    category: 'phones',
    price: 199,
    pricePublic: 299,
    stock: 42,
    brand: 'Xiaomi',
    colors: ['Gris', 'Noir', 'Bleu', 'Blanc'],
    images: [
      'https://i02.appmifile.com/mi-com-product/fly-birds/redmi-note-12/pc/specs1.png'
    ],
    soldCount: 156,
    specifications: {
      'Écran': '6.67" AMOLED 120Hz',
      'Processeur': 'Snapdragon 685',
      'RAM': '4 Go',
      'Stockage': '128 Go',
      'Caméra': '50MP + 8MP + 2MP',
      'Batterie': '5000 mAh',
      'Système': 'Android 13'
    }
  },
  {
    name: 'iPhone 12 - 64 Go - Blanc',
    description: 'iPhone 12 avec puce A14 Bionic, écran Super Retina XDR et 5G. Design élégant avec bordures plates en aluminium.',
    category: 'phones',
    price: 499,
    pricePublic: 689,
    stock: 16,
    brand: 'Apple',
    colors: ['Blanc', 'Noir', 'Bleu', 'Vert', 'Rouge'],
    images: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-12-white-select-2020?wid=940&hei=1112&fmt=p-jpg&qlt=80&.v=1604343704000'
    ],
    soldCount: 203,
    specifications: {
      'Écran': '6.1" Super Retina XDR',
      'Processeur': 'A14 Bionic',
      'RAM': '4 Go',
      'Stockage': '64 Go',
      'Caméra': '12MP + 12MP',
      'Batterie': '2815 mAh',
      'Système': 'iOS 17'
    }
  },
  {
    name: 'Google Pixel 7 - 128 Go - Anthracite',
    description: 'Google Pixel 7 avec puce Google Tensor G2, écran OLED 90Hz et la meilleure qualité photo du marché grâce à l\'IA Google.',
    category: 'phones',
    price: 449,
    pricePublic: 649,
    stock: 14,
    brand: 'Google',
    colors: ['Anthracite', 'Blanc neige', 'Vert citronnelle'],
    images: [
      'https://lh3.googleusercontent.com/vPRDWjf4W-tcpfBF98WJdGqKhwXgPTKbBLVC3w7gJALYnMvUP0t7i-8sDr6R8wDQGhHtPSjMUJLlDEGGP1H7mVQ=rw-e365-w1200'
    ],
    soldCount: 94,
    specifications: {
      'Écran': '6.3" OLED 90Hz',
      'Processeur': 'Google Tensor G2',
      'RAM': '8 Go',
      'Stockage': '128 Go',
      'Caméra': '50MP + 12MP',
      'Batterie': '4355 mAh',
      'Système': 'Android 14'
    }
  },
  {
    name: 'iPhone 11 - 64 Go - Mauve',
    description: 'iPhone 11 avec puce A13 Bionic, écran Liquid Retina et double caméra. Un classique toujours performant à prix accessible.',
    category: 'phones',
    price: 369,
    pricePublic: 539,
    stock: 22,
    brand: 'Apple',
    colors: ['Mauve', 'Noir', 'Blanc', 'Jaune', 'Vert', 'Rouge'],
    images: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-11-purple-select-2019?wid=940&hei=1112&fmt=p-jpg&qlt=80&.v=1566956144752'
    ],
    soldCount: 178,
    specifications: {
      'Écran': '6.1" Liquid Retina',
      'Processeur': 'A13 Bionic',
      'RAM': '4 Go',
      'Stockage': '64 Go',
      'Caméra': '12MP + 12MP',
      'Batterie': '3110 mAh',
      'Système': 'iOS 17'
    }
  },

  // MONTRES CONNECTÉES (3 produits)
  {
    name: 'Apple Watch Series 8 - 45 mm - Noir',
    description: 'Apple Watch Series 8 avec écran Always-On Retina, capteur de température, détection de chute et résistance à l\'eau 50m. Suivi santé complet.',
    category: 'watches',
    price: 389,
    pricePublic: 529,
    stock: 15,
    brand: 'Apple',
    colors: ['Noir', 'Argent', 'Or', 'Rouge'],
    images: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQDY3ref_VW_34FR+watch-45-alum-midnight-nc-8s_VW_34FR_WF_CO?wid=5120&hei=3280&fmt=p-jpg&qlt=80&.v=1683237706842'
    ],
    soldCount: 142,
    specifications: {
      'Écran': '1.9" OLED Always-On',
      'Processeur': 'Apple S8',
      'Autonomie': 'Jusqu\'à 18h',
      'Résistance': 'Eau 50m + Poussière IP6X',
      'Capteurs': 'Fréquence cardiaque, ECG, SpO2, Température',
      'Système': 'watchOS 10'
    }
  },
  {
    name: 'Samsung Galaxy Watch 6 - 44 mm - Argent',
    description: 'Samsung Galaxy Watch 6 avec écran AMOLED, suivi santé avancé, GPS et charge rapide. Compatible avec tous les smartphones Android.',
    category: 'watches',
    price: 279,
    pricePublic: 369,
    stock: 19,
    brand: 'Samsung',
    colors: ['Argent', 'Noir', 'Or'],
    images: [
      'https://images.samsung.com/fr/watches/galaxy-watch6/buy/product_color_silver.png'
    ],
    soldCount: 98,
    specifications: {
      'Écran': '1.5" Super AMOLED',
      'Processeur': 'Exynos W930',
      'Autonomie': 'Jusqu\'à 40h',
      'Résistance': 'Eau 5ATM + IP68',
      'Capteurs': 'Fréquence cardiaque, ECG, Composition corporelle',
      'Système': 'Wear OS 4'
    }
  },
  {
    name: 'Xiaomi Mi Watch Lite - Noir',
    description: 'Xiaomi Mi Watch Lite avec GPS intégré, écran TFT couleur et autonomie de 9 jours. Suivi d\'activité complet à prix mini.',
    category: 'watches',
    price: 49,
    pricePublic: 79,
    stock: 38,
    brand: 'Xiaomi',
    colors: ['Noir', 'Blanc', 'Bleu marine'],
    images: [
      'https://i02.appmifile.com/mi-com-product/fly-birds/mi-watch-lite/pc/watch.png'
    ],
    soldCount: 215,
    specifications: {
      'Écran': '1.4" TFT couleur',
      'GPS': 'Intégré',
      'Autonomie': 'Jusqu\'à 9 jours',
      'Résistance': 'Eau 5ATM',
      'Capteurs': 'Fréquence cardiaque, SpO2',
      'Compatibilité': 'Android & iOS'
    }
  },

  // ÉCOUTEURS ET AUDIO (2 produits)
  {
    name: 'AirPods Pro 2',
    description: 'AirPods Pro 2 avec réduction de bruit active 2x plus performante, son spatial personnalisé et autonomie jusqu\'à 6h. Boîtier MagSafe avec haut-parleur.',
    category: 'earphones',
    price: 249,
    pricePublic: 299,
    stock: 28,
    brand: 'Apple',
    colors: ['Blanc'],
    images: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1660803972361'
    ],
    soldCount: 256,
    specifications: {
      'Type': 'Intra-auriculaires sans fil',
      'Réduction de bruit': 'Active + Transparence adaptative',
      'Autonomie': 'Jusqu\'à 6h (30h avec boîtier)',
      'Résistance': 'IPX4 (écouteurs et boîtier)',
      'Puce': 'Apple H2',
      'Connectivité': 'Bluetooth 5.3'
    }
  },
  {
    name: 'Samsung Galaxy Buds 2',
    description: 'Samsung Galaxy Buds 2 avec réduction de bruit active, son AKG premium et design compact ultra-léger. Jusqu\'à 20h d\'autonomie avec le boîtier.',
    category: 'earphones',
    price: 89,
    pricePublic: 149,
    stock: 33,
    brand: 'Samsung',
    colors: ['Noir', 'Blanc', 'Olive', 'Lavande'],
    images: [
      'https://images.samsung.com/fr/buds/galaxy-buds2/buy/product_color_graphite.png'
    ],
    soldCount: 167,
    specifications: {
      'Type': 'Intra-auriculaires sans fil',
      'Réduction de bruit': 'Active (ANC)',
      'Autonomie': 'Jusqu\'à 5h (20h avec boîtier)',
      'Résistance': 'IPX2',
      'Son': 'AKG avec égaliseur 360°',
      'Connectivité': 'Bluetooth 5.2'
    }
  },

  // ACCESSOIRES / COQUES / CHARGEURS (2 produits)
  {
    name: 'Coque silicone iPhone 14 - Noir',
    description: 'Coque en silicone officielle Apple pour iPhone 14. Protection premium avec revêtement doux au toucher et intérieur en microfibre. Compatible MagSafe.',
    category: 'cases',
    price: 39,
    pricePublic: 55,
    stock: 67,
    brand: 'Apple',
    colors: ['Noir', 'Blanc', 'Bleu', 'Rouge', 'Jaune', 'Violet'],
    images: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MPTX3?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1661346168266'
    ],
    soldCount: 289,
    specifications: {
      'Matériau': 'Silicone premium',
      'Intérieur': 'Microfibre',
      'Compatibilité': 'iPhone 14 uniquement',
      'MagSafe': 'Compatible',
      'Protection': 'Boutons en aluminium'
    }
  },
  {
    name: 'Chargeur USB-C 20W - Apple Original',
    description: 'Adaptateur secteur USB-C 20W Apple Original pour charge rapide. Compatible iPhone, iPad et AirPods. Compact et sûr.',
    category: 'accessories',
    price: 19,
    pricePublic: 29,
    stock: 95,
    brand: 'Apple',
    colors: ['Blanc'],
    images: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MHJE3?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1603123830000'
    ],
    soldCount: 341,
    specifications: {
      'Puissance': '20W',
      'Connecteur': 'USB-C',
      'Charge rapide': 'Jusqu\'à 50% en 30 min',
      'Compatibilité': 'iPhone 8 et ultérieur, iPad, AirPods',
      'Sécurité': 'Protection surcharge et surchauffe'
    }
  }
];

async function seedProducts() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('✅ Connecté à MongoDB');

    // Supprimer tous les produits existants (optionnel - décommenter si besoin)
    // await Product.deleteMany({});
    // console.log('🗑️  Anciens produits supprimés');

    // Insérer les nouveaux produits
    const createdProducts = await Product.insertMany(products);
    console.log(`✅ ${createdProducts.length} produits ajoutés avec succès !`);

    console.log('\n📦 Produits créés :');
    createdProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - ${product.price}€ (${product.category})`);
    });

    console.log('\n✨ Seed terminé avec succès !');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du seed:', error);
    process.exit(1);
  }
}

// Exécuter le seed
seedProducts();
