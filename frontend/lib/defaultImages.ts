// Configuration des images par défaut par catégorie

export interface DefaultImage {
  id: string
  name: string
  path: string
  category: string
}

// Mapping des catégories vers les dossiers
export const categoryFolders: { [key: string]: string } = {
  phones: 'phones',
  watches: 'watches',
  earphones: 'earbuds',
  cases: 'cases',
  accessories: 'accessories'
}

// Images par défaut disponibles pour chaque catégorie
export const defaultImages: { [key: string]: DefaultImage[] } = {
  phones: [
    { id: 'phone-1', name: 'iPhone Générique', path: '/assets/default-products/phones/iphone-generic.png', category: 'phones' },
    { id: 'phone-2', name: 'Android Générique', path: '/assets/default-products/phones/android-generic.png', category: 'phones' },
    { id: 'phone-3', name: 'Smartphone Noir', path: '/assets/default-products/phones/phone-black.png', category: 'phones' },
    { id: 'phone-4', name: 'Smartphone Blanc', path: '/assets/default-products/phones/phone-white.png', category: 'phones' },
    { id: 'phone-5', name: 'Smartphone Bleu', path: '/assets/default-products/phones/phone-blue.png', category: 'phones' }
  ],
  watches: [
    { id: 'watch-1', name: 'Montre Connectée Noire', path: '/assets/default-products/watches/smartwatch-black.png', category: 'watches' },
    { id: 'watch-2', name: 'Montre Connectée Blanche', path: '/assets/default-products/watches/smartwatch-white.png', category: 'watches' },
    { id: 'watch-3', name: 'Montre Sport', path: '/assets/default-products/watches/watch-sport.png', category: 'watches' },
    { id: 'watch-4', name: 'Montre Élégante', path: '/assets/default-products/watches/watch-elegant.png', category: 'watches' },
    { id: 'watch-5', name: 'Montre Fitness', path: '/assets/default-products/watches/watch-fitness.png', category: 'watches' }
  ],
  earphones: [
    { id: 'earphone-1', name: 'Écouteurs Sans Fil Blancs', path: '/assets/default-products/earbuds/earbuds-white.png', category: 'earphones' },
    { id: 'earphone-2', name: 'Écouteurs Sans Fil Noirs', path: '/assets/default-products/earbuds/earbuds-black.png', category: 'earphones' },
    { id: 'earphone-3', name: 'Écouteurs Sport', path: '/assets/default-products/earbuds/earbuds-sport.png', category: 'earphones' },
    { id: 'earphone-4', name: 'Casque Audio', path: '/assets/default-products/earbuds/headphones.png', category: 'earphones' },
    { id: 'earphone-5', name: 'Écouteurs Intra', path: '/assets/default-products/earbuds/earbuds-intra.png', category: 'earphones' }
  ],
  cases: [
    { id: 'case-1', name: 'Coque Transparente', path: '/assets/default-products/cases/case-clear.png', category: 'cases' },
    { id: 'case-2', name: 'Coque Noire', path: '/assets/default-products/cases/case-black.png', category: 'cases' },
    { id: 'case-3', name: 'Coque Bleue', path: '/assets/default-products/cases/case-blue.png', category: 'cases' },
    { id: 'case-4', name: 'Coque Rose', path: '/assets/default-products/cases/case-pink.png', category: 'cases' },
    { id: 'case-5', name: 'Coque Cuir', path: '/assets/default-products/cases/case-leather.png', category: 'cases' }
  ],
  accessories: [
    { id: 'acc-1', name: 'Câble USB-C', path: '/assets/default-products/accessories/cable-usbc.png', category: 'accessories' },
    { id: 'acc-2', name: 'Chargeur Rapide', path: '/assets/default-products/accessories/charger-fast.png', category: 'accessories' },
    { id: 'acc-3', name: 'Adaptateur', path: '/assets/default-products/accessories/adapter.png', category: 'accessories' },
    { id: 'acc-4', name: 'Support Téléphone', path: '/assets/default-products/accessories/phone-stand.png', category: 'accessories' },
    { id: 'acc-5', name: 'Protection Écran', path: '/assets/default-products/accessories/screen-protector.png', category: 'accessories' }
  ]
}

// Obtenir l'image par défaut principale pour une catégorie
export function getDefaultImageForCategory(category: string): string {
  const folder = categoryFolders[category] || 'accessories'
  return `/assets/default-products/${folder}/default.png`
}

// Obtenir toutes les images disponibles pour une catégorie
export function getImagesForCategory(category: string): DefaultImage[] {
  return defaultImages[category] || defaultImages.accessories
}

// Obtenir la première image par défaut pour une catégorie
export function getFirstDefaultImage(category: string): DefaultImage | null {
  const images = getImagesForCategory(category)
  return images.length > 0 ? images[0] : null
}

// Vérifier si un chemin est une image par défaut
export function isDefaultImage(path: string): boolean {
  return path.startsWith('/assets/default-products/')
}
