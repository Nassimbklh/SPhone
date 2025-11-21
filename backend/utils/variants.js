// Constantes pour les états de produit
const ETATS = {
  NEUF_SOUS_BLISTER: 'neuf_sous_blister',
  NEUF_SANS_BOITE: 'neuf_sans_boite',
  ETAT_PARFAIT: 'etat_parfait',
  TRES_BON_ETAT: 'tres_bon_etat'
};

// Constantes pour les capacités de stockage
const STORAGES = {
  GB_64: '64',
  GB_128: '128',
  GB_256: '256',
  GB_512: '512',
  TB_1: '1024'
};

// Labels français des états
const ETAT_LABELS = {
  neuf_sous_blister: 'Neuf sous blister',
  neuf_sans_boite: 'Neuf sans boîte',
  etat_parfait: 'État parfait',
  tres_bon_etat: 'Très bon état'
};

// Descriptions détaillées des états
const ETAT_DESCRIPTIONS = {
  neuf_sous_blister: 'Produit neuf, jamais ouvert, avec emballage d\'origine scellé',
  neuf_sans_boite: 'Produit neuf sans emballage d\'origine ou emballage ouvert',
  etat_parfait: 'Produit remis à neuf, aucune trace d\'usure visible. Garantie constructeur.',
  tres_bon_etat: 'Produit remis à neuf, très légères traces d\'usure. Entièrement fonctionnel.'
};

// Badges de qualité pour l'affichage
const ETAT_BADGES = {
  neuf_sous_blister: { label: 'Neuf', color: 'bg-green-100 text-green-700 border-green-200' },
  neuf_sans_boite: { label: 'Neuf', color: 'bg-green-100 text-green-700 border-green-200' },
  etat_parfait: { label: 'Parfait', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  tres_bon_etat: { label: 'Très bon', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' }
};

// Ordre d'affichage des états (du meilleur au moins bon)
const ETAT_ORDER = [
  'neuf_sous_blister',
  'neuf_sans_boite',
  'etat_parfait',
  'tres_bon_etat'
];

// Labels pour les capacités de stockage
const STORAGE_LABELS = {
  '64': '64 Go',
  '128': '128 Go',
  '256': '256 Go',
  '512': '512 Go',
  '1024': '1 To'
};

// Catégories de spécifications techniques
const SPEC_CATEGORIES = {
  ECRAN: 'ecran',
  PROCESSEUR: 'processeur',
  RAM: 'ram',
  STOCKAGE: 'stockage',
  CAMERA: 'camera',
  BATTERIE: 'batterie',
  SYSTEME: 'systeme'
};

// Labels des catégories de spécifications
const SPEC_CATEGORY_LABELS = {
  ecran: 'Écran',
  processeur: 'Processeur',
  ram: 'RAM',
  stockage: 'Stockage',
  camera: 'Caméra',
  batterie: 'Batterie',
  systeme: 'Système'
};

// Suggestions pour les spécifications (auto-complétion)
const SPEC_SUGGESTIONS = {
  ecran: [
    '6,1" Liquid Retina',
    '6,7" Super Retina XDR',
    'AMOLED 6,5"',
    '120 Hz',
    '90 Hz',
    'HDR10+',
    'Always-On Display'
  ],
  processeur: [
    'A17 Pro',
    'A16 Bionic',
    'A15 Bionic',
    'Snapdragon 8 Gen 3',
    'Snapdragon 8 Gen 2',
    'Exynos 2400',
    'Google Tensor G3'
  ],
  ram: [
    '4 Go',
    '6 Go',
    '8 Go',
    '12 Go',
    '16 Go'
  ],
  stockage: [
    '64 Go',
    '128 Go',
    '256 Go',
    '512 Go',
    '1 To'
  ],
  camera: [
    '48 MP principale',
    '12 MP ultra grand-angle',
    'Téléobjectif 5x',
    'Mode nuit',
    'ProRAW',
    'Vidéo 4K 60fps',
    'Stabilisation optique'
  ],
  batterie: [
    '3110 mAh',
    '4000 mAh',
    '4500 mAh',
    '5000 mAh',
    'Charge rapide 25W',
    'Charge rapide 45W',
    'Charge sans fil',
    'MagSafe'
  ],
  systeme: [
    'iOS 17',
    'iOS 18',
    'Android 14',
    'Android 15',
    'One UI 6',
    'MIUI 14'
  ]
};

/**
 * Vérifie si un état est valide
 */
function isValidEtat(etat) {
  return Object.values(ETATS).includes(etat);
}

/**
 * Vérifie si une capacité de stockage est valide
 */
function isValidStorage(storage) {
  return Object.values(STORAGES).includes(storage);
}

/**
 * Récupère le label d'un état
 */
function getEtatLabel(etat) {
  return ETAT_LABELS[etat] || etat;
}

/**
 * Récupère la description d'un état
 */
function getEtatDescription(etat) {
  return ETAT_DESCRIPTIONS[etat] || '';
}

/**
 * Récupère le badge d'un état
 */
function getEtatBadge(etat) {
  return ETAT_BADGES[etat] || { label: etat, color: 'bg-gray-100 text-gray-700' };
}

/**
 * Récupère le label d'une capacité de stockage
 */
function getStorageLabel(storage) {
  return STORAGE_LABELS[storage] || `${storage} Go`;
}

/**
 * Récupère le label d'une catégorie de spécification
 */
function getSpecCategoryLabel(category) {
  return SPEC_CATEGORY_LABELS[category] || category;
}

/**
 * Récupère les suggestions pour une catégorie de spécification
 */
function getSpecSuggestions(category) {
  return SPEC_SUGGESTIONS[category] || [];
}

module.exports = {
  // Constantes
  ETATS,
  STORAGES,
  ETAT_LABELS,
  ETAT_DESCRIPTIONS,
  ETAT_BADGES,
  ETAT_ORDER,
  STORAGE_LABELS,
  SPEC_CATEGORIES,
  SPEC_CATEGORY_LABELS,
  SPEC_SUGGESTIONS,

  // Fonctions utilitaires
  isValidEtat,
  isValidStorage,
  getEtatLabel,
  getEtatDescription,
  getEtatBadge,
  getStorageLabel,
  getSpecCategoryLabel,
  getSpecSuggestions
};
