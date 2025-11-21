// Système de traduction centralisé pour S.phone

// Traduction des catégories
export const categoryTranslations: { [key: string]: string } = {
  phones: 'Téléphones',
  watches: 'Montres',
  accessories: 'Accessoires',
  cases: 'Coques',
  earphones: 'Écouteurs',
  all: 'Tous les produits'
}

// Traduction des labels génériques
export const labelTranslations: { [key: string]: string } = {
  color: 'Couleur',
  quantity: 'Quantité',
  stock: 'Stock',
  price: 'Prix',
  description: 'Description',
  brand: 'Marque',
  specifications: 'Spécifications techniques',
  addToCart: 'Ajouter au panier',
  viewDetails: 'Voir les détails',
  inStock: 'En stock',
  outOfStock: 'Rupture de stock',
  limitedStock: 'Stock limité',
  discount: 'Réduction',
  bestSeller: 'Meilleure vente'
}

// Fonction pour traduire une catégorie
export function translateCategory(category: string): string {
  return categoryTranslations[category.toLowerCase()] || category
}

// Fonction pour traduire un label
export function translateLabel(label: string): string {
  return labelTranslations[label] || label
}

// Emojis des catégories
export function getCategoryEmoji(category: string): string {
  const emojis: { [key: string]: string } = {
    phones: '📱',
    cases: '🛡️',
    accessories: '🔌',
    watches: '⌚',
    earphones: '🎧'
  }
  return emojis[category.toLowerCase()] || '📦'
}
