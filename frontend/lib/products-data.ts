// Données de référence pour les marques et modèles par catégorie

export const CATEGORIES = {
  PHONES: 'phones',
  WATCHES: 'watches',
  EARPHONES: 'earphones',
  CASES: 'cases',
  ACCESSORIES: 'accessories',
  ELECTRONICS: 'electronics'
} as const

export type CategoryType = typeof CATEGORIES[keyof typeof CATEGORIES]

// Marques par catégorie
export const BRANDS_BY_CATEGORY: Record<string, string[]> = {
  phones: ['Apple', 'Samsung', 'Xiaomi', 'Google', 'Oppo', 'Huawei', 'OnePlus', 'Sony', 'Motorola', 'Nokia', 'Realme', 'Vivo', 'Honor', 'Asus', 'Nothing'],
  watches: ['Apple', 'Samsung', 'Xiaomi', 'Huawei', 'Garmin', 'Fitbit', 'Amazfit', 'Fossil', 'TicWatch', 'Withings'],
  earphones: ['Apple', 'Samsung', 'Sony', 'Bose', 'JBL', 'Beats', 'Xiaomi', 'Jabra', 'Sennheiser', 'Anker', 'Nothing'],
  cases: ['Spigen', 'OtterBox', 'UAG', 'Ringke', 'ESR', 'Caseology', 'Tech21', 'Mous', 'Nomad', 'Apple', 'Samsung'],
  accessories: [],
  electronics: []
}

// Modèles par marque (téléphones)
export const PHONE_MODELS: Record<string, string[]> = {
  Apple: [
    'iPhone 17 Pro Max',
    'iPhone 17 Pro',
    'iPhone 17',
    'iPhone 16 Pro Max',
    'iPhone 16 Pro',
    'iPhone 16 Plus',
    'iPhone 16',
    'iPhone 15 Pro Max',
    'iPhone 15 Pro',
    'iPhone 15 Plus',
    'iPhone 15',
    'iPhone 14 Pro Max',
    'iPhone 14 Pro',
    'iPhone 14 Plus',
    'iPhone 14',
    'iPhone 13 Pro Max',
    'iPhone 13 Pro',
    'iPhone 13',
    'iPhone 13 mini',
    'iPhone 12 Pro Max',
    'iPhone 12 Pro',
    'iPhone 12',
    'iPhone 12 mini',
    'iPhone 11 Pro Max',
    'iPhone 11 Pro',
    'iPhone 11',
    'iPhone SE (2022)',
    'iPhone SE (2020)',
    'iPhone XS Max',
    'iPhone XS',
    'iPhone XR',
    'iPhone X'
  ],
  Samsung: [
    'Galaxy S24 Ultra',
    'Galaxy S24+',
    'Galaxy S24',
    'Galaxy S23 Ultra',
    'Galaxy S23+',
    'Galaxy S23',
    'Galaxy S22 Ultra',
    'Galaxy S22+',
    'Galaxy S22',
    'Galaxy S21 Ultra',
    'Galaxy S21+',
    'Galaxy S21',
    'Galaxy Z Fold 6',
    'Galaxy Z Fold 5',
    'Galaxy Z Fold 4',
    'Galaxy Z Flip 6',
    'Galaxy Z Flip 5',
    'Galaxy Z Flip 4',
    'Galaxy A54',
    'Galaxy A53',
    'Galaxy A34',
    'Galaxy A14'
  ],
  Xiaomi: [
    'Xiaomi 14 Ultra',
    'Xiaomi 14 Pro',
    'Xiaomi 14',
    'Xiaomi 13 Ultra',
    'Xiaomi 13 Pro',
    'Xiaomi 13',
    'Xiaomi 12 Pro',
    'Xiaomi 12',
    'Redmi Note 13 Pro+',
    'Redmi Note 13 Pro',
    'Redmi Note 13',
    'Redmi Note 12 Pro+',
    'Redmi Note 12 Pro',
    'Redmi Note 12',
    'Redmi Note 11',
    'Poco X6 Pro',
    'Poco X5 Pro',
    'Poco F5 Pro',
    'Poco F5'
  ],
  Google: [
    'Pixel 9 Pro XL',
    'Pixel 9 Pro',
    'Pixel 9',
    'Pixel 8 Pro',
    'Pixel 8',
    'Pixel 8a',
    'Pixel 7 Pro',
    'Pixel 7',
    'Pixel 7a',
    'Pixel 6 Pro',
    'Pixel 6',
    'Pixel 6a'
  ],
  Oppo: [
    'Find X7 Ultra',
    'Find X6 Pro',
    'Find X5 Pro',
    'Reno 11 Pro',
    'Reno 10 Pro+',
    'Reno 10 Pro',
    'A98',
    'A78'
  ],
  Huawei: [
    'P60 Pro',
    'P50 Pro',
    'Mate 60 Pro',
    'Nova 12 Pro',
    'Nova 11 Pro'
  ],
  OnePlus: [
    'OnePlus 12',
    'OnePlus 11',
    'OnePlus 10 Pro',
    'OnePlus 9 Pro',
    'OnePlus Nord 3',
    'OnePlus Nord 2T'
  ],
  Sony: [
    'Xperia 1 V',
    'Xperia 5 V',
    'Xperia 10 V',
    'Xperia 1 IV'
  ],
  Motorola: [
    'Edge 40 Pro',
    'Edge 40',
    'Edge 30 Ultra',
    'Moto G84',
    'Moto G73'
  ],
  Nokia: [
    'XR21',
    'X30',
    'G60',
    'G42'
  ],
  Realme: [
    'GT 5 Pro',
    'GT 3',
    '11 Pro+',
    '11 Pro'
  ],
  Vivo: [
    'X100 Pro',
    'X90 Pro',
    'V29 Pro',
    'V27 Pro'
  ],
  Honor: [
    'Magic 6 Pro',
    'Magic 5 Pro',
    '90 Pro',
    '70 Pro'
  ],
  Asus: [
    'ROG Phone 8 Pro',
    'ROG Phone 7 Ultimate',
    'Zenfone 11 Ultra',
    'Zenfone 10'
  ],
  Nothing: [
    'Phone (2)',
    'Phone (1)'
  ]
}

// Modèles par marque (montres)
export const WATCH_MODELS: Record<string, string[]> = {
  Apple: [
    'Apple Watch Series 9',
    'Apple Watch Series 8',
    'Apple Watch SE (2023)',
    'Apple Watch SE (2022)',
    'Apple Watch Ultra 2',
    'Apple Watch Ultra'
  ],
  Samsung: [
    'Galaxy Watch 6 Classic',
    'Galaxy Watch 6',
    'Galaxy Watch 5 Pro',
    'Galaxy Watch 5',
    'Galaxy Watch 4 Classic',
    'Galaxy Watch 4'
  ],
  Xiaomi: [
    'Watch S3',
    'Watch S2',
    'Watch S1',
    'Mi Watch'
  ],
  Huawei: [
    'Watch GT 4',
    'Watch GT 3 Pro',
    'Watch GT 3',
    'Watch Fit 3'
  ],
  Garmin: [
    'Fenix 7X',
    'Fenix 7',
    'Forerunner 965',
    'Forerunner 265',
    'Venu 3'
  ],
  Fitbit: [
    'Sense 2',
    'Versa 4',
    'Charge 6',
    'Inspire 3'
  ],
  Amazfit: [
    'GTR 4',
    'GTS 4',
    'T-Rex Ultra',
    'Bip 5'
  ]
}

// Modèles par marque (écouteurs)
export const EARPHONES_MODELS: Record<string, string[]> = {
  Apple: [
    'AirPods Pro (2ème génération)',
    'AirPods (3ème génération)',
    'AirPods (2ème génération)',
    'AirPods Max'
  ],
  Samsung: [
    'Galaxy Buds 3 Pro',
    'Galaxy Buds 2 Pro',
    'Galaxy Buds 2',
    'Galaxy Buds FE'
  ],
  Sony: [
    'WF-1000XM5',
    'WF-1000XM4',
    'WH-1000XM5',
    'WH-1000XM4',
    'LinkBuds S'
  ],
  Bose: [
    'QuietComfort Ultra Earbuds',
    'QuietComfort Earbuds II',
    'QuietComfort 45',
    'Sport Earbuds'
  ],
  JBL: [
    'Tour Pro 2',
    'Live Pro 2',
    'Tune 230NC',
    'Reflect Flow Pro'
  ],
  Beats: [
    'Fit Pro',
    'Studio Buds+',
    'Studio Buds',
    'Powerbeats Pro'
  ],
  Jabra: [
    'Elite 10',
    'Elite 8 Active',
    'Elite 7 Pro',
    'Elite 4'
  ],
  Nothing: [
    'Ear (2)',
    'Ear (stick)',
    'Ear (1)'
  ]
}

// Couleurs disponibles
export const PRODUCT_COLORS = [
  'Noir',
  'Blanc',
  'Bleu',
  'Mauve',
  'Or',
  'Argent',
  'Rouge',
  'Vert',
  'Rose',
  'Graphite',
  'Titanium',
  'Titane naturel',
  'Titane blanc',
  'Titane noir',
  'Bleu Pacifique',
  'Gris sidéral',
  'Vert Alpin',
  'Minuit',
  'Lumière stellaire',
  'Phantom Black',
  'Phantom Silver',
  'Phantom Violet'
]

// Capacités de stockage
export const STORAGE_CAPACITIES = [
  { value: '64', label: '64 Go' },
  { value: '128', label: '128 Go' },
  { value: '256', label: '256 Go' },
  { value: '512', label: '512 Go' },
  { value: '1024', label: '1 To' }
]

// Helper pour obtenir les modèles selon catégorie et marque
export function getModelsForBrand(category: string, brand: string): string[] {
  switch (category) {
    case 'phones':
      return PHONE_MODELS[brand] || []
    case 'watches':
      return WATCH_MODELS[brand] || []
    case 'earphones':
      return EARPHONES_MODELS[brand] || []
    default:
      return []
  }
}

// Helper pour vérifier si une catégorie nécessite des variantes
export function requiresVariants(category: string): boolean {
  return ['phones', 'watches'].includes(category)
}

// Helper pour vérifier si une catégorie nécessite des stockages
export function requiresStorage(category: string): boolean {
  return category === 'phones'
}
