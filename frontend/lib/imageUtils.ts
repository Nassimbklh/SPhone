/**
 * Utilitaire pour construire les URLs d'images correctement
 * @param imagePath - Chemin de l'image (peut être une URL complète, un chemin relatif, ou un nom de fichier)
 * @returns URL complète de l'image prête à être utilisée
 */
export function buildImageUrl(imagePath: string | undefined | null): string | null {
  if (!imagePath) return null;

  // Si c'est déjà une URL complète (http ou https)
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  // Si c'est un chemin relatif commençant par /, préfixer avec l'URL de l'API
  if (imagePath.startsWith('/')) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
    return `${apiUrl}${imagePath}`;
  }

  // Sinon, c'est un nom de fichier seul, construire le chemin complet
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
  return `${apiUrl}/uploads/${imagePath}`;
}

/**
 * Récupère la première image d'un produit
 * @param images - Tableau d'images du produit
 * @returns URL de la première image ou null
 */
export function getProductMainImage(images: string[] | undefined | null): string | null {
  if (!images || !Array.isArray(images) || images.length === 0) {
    return null;
  }

  const firstImage = images[0];
  if (!firstImage || typeof firstImage !== 'string') {
    return null;
  }

  return buildImageUrl(firstImage);
}

/**
 * Récupère toutes les images d'un produit avec URLs complètes
 * @param images - Tableau d'images du produit
 * @returns Tableau d'URLs complètes
 */
export function getProductImages(images: string[] | undefined | null): string[] {
  if (!images || !Array.isArray(images)) {
    return [];
  }

  return images
    .filter(img => img && typeof img === 'string')
    .map(img => buildImageUrl(img))
    .filter((url): url is string => url !== null);
}
