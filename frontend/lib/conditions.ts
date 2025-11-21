// Types pour les états de produits (nouveau système avec 4 états)
export type EtatType = 'neuf_sous_blister' | 'neuf_sans_boite' | 'etat_parfait' | 'tres_bon_etat';

// Types pour les capacités de stockage
export type StorageType = '64' | '128' | '256' | '512' | '1024';

// Interface pour une couleur avec son stock
export interface Couleur {
  nom: string;
  stock: number;
}

// Interface pour une variante spécifique (état + stockage)
export interface Variant {
  prix: number;
  prixPublic?: number;
  couleurs: Couleur[];
}

// Interface pour les états d'une capacité de stockage
export interface StorageVariants {
  neuf_sous_blister?: Variant;
  neuf_sans_boite?: Variant;
  etat_parfait?: Variant;
  tres_bon_etat?: Variant;
}

// Interface pour toutes les variantes d'un produit
export interface ProductVariants {
  [storage: string]: StorageVariants;
}

// Types anciens (deprecated - pour rétrocompatibilité)
export type ConditionType = 'new_sealed' | 'new_open' | 'perfect' | 'good';

export interface Condition {
  price: number;
  stock: number;
  colors: string[];
}

export interface ProductConditions {
  new_sealed?: Condition;
  new_open?: Condition;
  perfect?: Condition;
  good?: Condition;
}

// Labels français des états (nouveau système)
export const ETAT_LABELS: Record<EtatType, string> = {
  neuf_sous_blister: 'Neuf sous blister',
  neuf_sans_boite: 'Neuf sans boîte',
  etat_parfait: 'État parfait',
  tres_bon_etat: 'Très bon état'
};

// Descriptions détaillées des états
export const ETAT_DESCRIPTIONS: Record<EtatType, string> = {
  neuf_sous_blister: 'Produit neuf, jamais ouvert, avec emballage d\'origine scellé',
  neuf_sans_boite: 'Produit neuf sans emballage d\'origine ou emballage ouvert',
  etat_parfait: 'Produit remis à neuf, aucune trace d\'usure visible. Garantie constructeur.',
  tres_bon_etat: 'Produit remis à neuf, très légères traces d\'usure. Entièrement fonctionnel.'
};

// Badges de qualité des états
export const ETAT_BADGES: Record<EtatType, { label: string; color: string }> = {
  neuf_sous_blister: { label: 'Neuf', color: 'bg-green-100 text-green-700 border-green-200' },
  neuf_sans_boite: { label: 'Neuf', color: 'bg-green-100 text-green-700 border-green-200' },
  etat_parfait: { label: 'Parfait', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  tres_bon_etat: { label: 'Très bon', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' }
};

// Ordre d'affichage des états (du meilleur au moins bon)
export const ETAT_ORDER: EtatType[] = ['neuf_sous_blister', 'neuf_sans_boite', 'etat_parfait', 'tres_bon_etat'];

// Labels pour les capacités de stockage
export const STORAGE_LABELS: Record<StorageType, string> = {
  '64': '64 Go',
  '128': '128 Go',
  '256': '256 Go',
  '512': '512 Go',
  '1024': '1 To'
};

// Labels français des conditions (ancien système - deprecated)
export const CONDITION_LABELS: Record<ConditionType, string> = {
  new_sealed: 'Neuf sous blister',
  new_open: 'Neuf sans boîte',
  perfect: 'Reconditionné - État parfait',
  good: 'Reconditionné - État correct'
};

// Descriptions détaillées (ancien système - deprecated)
export const CONDITION_DESCRIPTIONS: Record<ConditionType, string> = {
  new_sealed: 'Produit neuf, jamais ouvert, avec emballage d\'origine scellé',
  new_open: 'Produit neuf sans emballage d\'origine ou emballage ouvert',
  perfect: 'Produit remis à neuf, aucune trace d\'usure visible. Garantie constructeur.',
  good: 'Produit remis à neuf, quelques traces d\'usure mineures. Entièrement fonctionnel.'
};

// Badges de qualité (ancien système - deprecated)
export const CONDITION_BADGES: Record<ConditionType, { label: string; color: string }> = {
  new_sealed: { label: 'Neuf', color: 'bg-green-100 text-green-700 border-green-200' },
  new_open: { label: 'Neuf', color: 'bg-green-100 text-green-700 border-green-200' },
  perfect: { label: 'Parfait', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  good: { label: 'Correct', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' }
};

// Ordre d'affichage des conditions (ancien système - deprecated)
export const CONDITION_ORDER: ConditionType[] = ['new_sealed', 'new_open', 'perfect', 'good'];

/**
 * Vérifie si un état est valide (nouveau système)
 */
export function isValidEtat(etat: string): etat is EtatType {
  return ['neuf_sous_blister', 'neuf_sans_boite', 'etat_parfait', 'tres_bon_etat'].includes(etat);
}

/**
 * Vérifie si une capacité de stockage est valide
 */
export function isValidStorage(storage: string): storage is StorageType {
  return ['64', '128', '256', '512', '1024'].includes(storage);
}

/**
 * Vérifie si une condition est valide (ancien système - deprecated)
 */
export function isValidCondition(condition: string): condition is ConditionType {
  return ['new_sealed', 'new_open', 'perfect', 'good'].includes(condition);
}

/**
 * Récupère le label d'un état (nouveau système)
 */
export function getEtatLabel(etat: EtatType): string {
  return ETAT_LABELS[etat] || etat;
}

/**
 * Récupère la description d'un état (nouveau système)
 */
export function getEtatDescription(etat: EtatType): string {
  return ETAT_DESCRIPTIONS[etat] || '';
}

/**
 * Récupère le badge d'un état (nouveau système)
 */
export function getEtatBadge(etat: EtatType) {
  return ETAT_BADGES[etat] || { label: etat, color: 'bg-gray-100 text-gray-700' };
}

/**
 * Récupère le label d'une capacité de stockage
 */
export function getStorageLabel(storage: StorageType | string): string {
  return STORAGE_LABELS[storage as StorageType] || `${storage} Go`;
}

/**
 * Récupère le label d'une condition (ancien système - deprecated)
 */
export function getConditionLabel(condition: ConditionType): string {
  return CONDITION_LABELS[condition] || condition;
}

/**
 * Récupère la description d'une condition (ancien système - deprecated)
 */
export function getConditionDescription(condition: ConditionType): string {
  return CONDITION_DESCRIPTIONS[condition] || '';
}

/**
 * Récupère le badge d'une condition (ancien système - deprecated)
 */
export function getConditionBadge(condition: ConditionType) {
  return CONDITION_BADGES[condition] || { label: condition, color: 'bg-gray-100 text-gray-700' };
}

/**
 * Récupère toutes les conditions disponibles pour un produit
 */
export function getAvailableConditions(conditions?: ProductConditions): ConditionType[] {
  if (!conditions) return [];

  return CONDITION_ORDER.filter(
    condition => conditions[condition] && conditions[condition]!.stock > 0
  );
}

/**
 * Trouve le prix le plus bas parmi toutes les conditions disponibles
 */
export function getLowestPrice(conditions?: ProductConditions): number | null {
  if (!conditions) return null;

  const prices = CONDITION_ORDER
    .filter(condition => conditions[condition] && conditions[condition]!.stock > 0)
    .map(condition => conditions[condition]!.price);

  return prices.length > 0 ? Math.min(...prices) : null;
}

/**
 * Trouve le prix le plus élevé parmi toutes les conditions disponibles
 */
export function getHighestPrice(conditions?: ProductConditions): number | null {
  if (!conditions) return null;

  const prices = CONDITION_ORDER
    .filter(condition => conditions[condition] && conditions[condition]!.stock > 0)
    .map(condition => conditions[condition]!.price);

  return prices.length > 0 ? Math.max(...prices) : null;
}

/**
 * Calcule le stock total de toutes les conditions
 */
export function getTotalStock(conditions?: ProductConditions): number {
  if (!conditions) return 0;

  return CONDITION_ORDER.reduce((total, condition) => {
    const cond = conditions[condition];
    return total + (cond ? cond.stock : 0);
  }, 0);
}

/**
 * Vérifie si une couleur est disponible pour une condition spécifique
 */
export function isColorAvailableForCondition(
  conditions: ProductConditions | undefined,
  condition: ConditionType,
  color: string
): boolean {
  if (!conditions || !conditions[condition]) return false;

  const cond = conditions[condition];
  if (!cond || !cond.colors || cond.colors.length === 0) return false;

  return cond.colors.some(c => c.toLowerCase() === color.toLowerCase());
}

/**
 * Récupère toutes les couleurs disponibles pour une condition
 */
export function getColorsForCondition(
  conditions: ProductConditions | undefined,
  condition: ConditionType
): string[] {
  if (!conditions || !conditions[condition]) return [];

  const cond = conditions[condition];
  return cond ? cond.colors : [];
}

// ===== NOUVELLES FONCTIONS POUR LE SYSTÈME DE VARIANTES =====

/**
 * Récupère toutes les capacités de stockage disponibles pour un produit
 */
export function getAvailableStorages(variants?: ProductVariants): string[] {
  if (!variants || typeof variants !== 'object') return [];

  try {
    return Object.keys(variants).filter(storage => {
      const storageVariants = variants[storage];
      if (!storageVariants || typeof storageVariants !== 'object') return false;

      // Un stockage est disponible s'il a au moins un état avec du stock
      return ETAT_ORDER.some(etat => {
        const variant = storageVariants[etat];
        if (!variant || typeof variant !== 'object') return false;
        // Vérifier si au moins une couleur a du stock
        return Array.isArray(variant.couleurs) && variant.couleurs.some(c => c && c.stock > 0);
      });
    }).sort((a, b) => parseInt(a) - parseInt(b)); // Trier par capacité croissante
  } catch (error) {
    console.error('Error in getAvailableStorages:', error);
    return [];
  }
}

/**
 * Récupère tous les états disponibles pour une capacité de stockage donnée
 */
export function getAvailableEtats(variants?: ProductVariants, storage?: string): EtatType[] {
  if (!variants || typeof variants !== 'object' || !storage || !variants[storage]) return [];

  try {
    const storageVariants = variants[storage];
    if (!storageVariants || typeof storageVariants !== 'object') return [];

    return ETAT_ORDER.filter(etat => {
      const variant = storageVariants[etat];
      if (!variant || typeof variant !== 'object') return false;
      // Vérifier si au moins une couleur a du stock
      return Array.isArray(variant.couleurs) && variant.couleurs.some(c => c && c.stock > 0);
    });
  } catch (error) {
    console.error('Error in getAvailableEtats:', error);
    return [];
  }
}

/**
 * Récupère toutes les couleurs disponibles pour une variante spécifique (storage + état)
 */
export function getCouleursForVariant(
  variants: ProductVariants | undefined,
  storage: string,
  etat: EtatType
): string[] {
  if (!variants || typeof variants !== 'object') return [];

  try {
    const storageData = variants[storage];
    if (!storageData || typeof storageData !== 'object') return [];

    const variant = storageData[etat];
    if (!variant || typeof variant !== 'object') return [];

    if (!Array.isArray(variant.couleurs)) return [];

    // Retourner uniquement les noms des couleurs
    return variant.couleurs.map(c => c.nom);
  } catch (error) {
    console.error('Error in getCouleursForVariant:', error);
    return [];
  }
}

/**
 * Récupère toutes les couleurs avec stock disponible pour une variante spécifique
 */
export function getCouleursWithStockForVariant(
  variants: ProductVariants | undefined,
  storage: string,
  etat: EtatType
): Couleur[] {
  if (!variants || typeof variants !== 'object') return [];

  try {
    const storageData = variants[storage];
    if (!storageData || typeof storageData !== 'object') return [];

    const variant = storageData[etat];
    if (!variant || typeof variant !== 'object') return [];

    if (!Array.isArray(variant.couleurs)) return [];

    // Retourner uniquement les couleurs avec stock > 0
    return variant.couleurs.filter(c => c.stock > 0);
  } catch (error) {
    console.error('Error in getCouleursWithStockForVariant:', error);
    return [];
  }
}

/**
 * Récupère le stock pour une couleur spécifique d'une variante
 */
export function getStockForCouleur(
  variants: ProductVariants | undefined,
  storage: string,
  etat: EtatType,
  couleurNom: string
): number {
  if (!variants || typeof variants !== 'object') return 0;

  try {
    const storageData = variants[storage];
    if (!storageData || typeof storageData !== 'object') return 0;

    const variant = storageData[etat];
    if (!variant || typeof variant !== 'object') return 0;

    if (!Array.isArray(variant.couleurs)) return 0;

    const couleur = variant.couleurs.find(c => c.nom.toLowerCase() === couleurNom.toLowerCase());
    return couleur ? couleur.stock : 0;
  } catch (error) {
    console.error('Error in getStockForCouleur:', error);
    return 0;
  }
}

/**
 * Vérifie si une couleur est disponible pour une variante spécifique (avec ou sans stock)
 */
export function isCouleurAvailableForVariant(
  variants: ProductVariants | undefined,
  storage: string,
  etat: EtatType,
  couleur: string
): boolean {
  const couleurs = getCouleursForVariant(variants, storage, etat);
  return couleurs.some(c => c.toLowerCase() === couleur.toLowerCase());
}

/**
 * Vérifie si une couleur a du stock disponible pour une variante spécifique
 */
export function isCouleurInStockForVariant(
  variants: ProductVariants | undefined,
  storage: string,
  etat: EtatType,
  couleur: string
): boolean {
  return getStockForCouleur(variants, storage, etat, couleur) > 0;
}

/**
 * Trouve le prix le plus bas parmi toutes les variantes disponibles
 * Parcourt TOUTES les capacités + TOUS les états + TOUTES les couleurs
 */
export function getLowestPriceFromVariants(variants?: ProductVariants): number | null {
  if (!variants || typeof variants !== 'object') return null;

  try {
    const prices: number[] = [];

    // Parcourir toutes les capacités de stockage
    Object.keys(variants).forEach(storage => {
      const storageVariants = variants[storage];
      if (!storageVariants || typeof storageVariants !== 'object') return;

      // Parcourir tous les états pour cette capacité
      ETAT_ORDER.forEach(etat => {
        const variant = storageVariants[etat];
        if (!variant || typeof variant !== 'object') return;

        // Vérifier si au moins une couleur a du stock
        const hasStock = Array.isArray(variant.couleurs) &&
          variant.couleurs.some(c => c && c.stock > 0);

        if (hasStock && typeof variant.prix === 'number' && variant.prix > 0) {
          prices.push(variant.prix);
        }
      });
    });

    return prices.length > 0 ? Math.min(...prices) : null;
  } catch (error) {
    console.error('Error in getLowestPriceFromVariants:', error);
    return null;
  }
}

/**
 * Alias pour getLowestPriceFromVariants - trouve le prix absolu le plus bas
 * Parcourt TOUTES les capacités + TOUS les états + TOUTES les couleurs
 */
export function getAbsoluteLowestPrice(variants?: ProductVariants): number | null {
  return getLowestPriceFromVariants(variants);
}

/**
 * Trouve le prix le plus élevé parmi toutes les variantes disponibles
 */
export function getHighestPriceFromVariants(variants?: ProductVariants): number | null {
  if (!variants || typeof variants !== 'object') return null;

  try {
    const prices: number[] = [];

    Object.values(variants).forEach(storageVariants => {
      if (!storageVariants || typeof storageVariants !== 'object') return;

      ETAT_ORDER.forEach(etat => {
        const variant = storageVariants[etat];
        if (!variant || typeof variant !== 'object') return;

        // Vérifier si au moins une couleur a du stock
        const hasStock = Array.isArray(variant.couleurs) &&
          variant.couleurs.some(c => c.stock > 0);

        if (hasStock && typeof variant.prix === 'number') {
          prices.push(variant.prix);
        }
      });
    });

    return prices.length > 0 ? Math.max(...prices) : null;
  } catch (error) {
    console.error('Error in getHighestPriceFromVariants:', error);
    return null;
  }
}

/**
 * Calcule le stock total de toutes les variantes
 */
export function getTotalStockFromVariants(variants?: ProductVariants): number {
  if (!variants || typeof variants !== 'object') return 0;

  try {
    let total = 0;

    Object.values(variants).forEach(storageVariants => {
      if (!storageVariants || typeof storageVariants !== 'object') return;

      ETAT_ORDER.forEach(etat => {
        const variant = storageVariants[etat];
        if (!variant || typeof variant !== 'object') return;

        // Sommer le stock de toutes les couleurs
        if (Array.isArray(variant.couleurs)) {
          variant.couleurs.forEach(couleur => {
            if (couleur && typeof couleur.stock === 'number') {
              total += couleur.stock;
            }
          });
        }
      });
    });

    return total;
  } catch (error) {
    console.error('Error in getTotalStockFromVariants:', error);
    return 0;
  }
}

/**
 * Récupère une variante spécifique
 */
export function getVariant(
  variants: ProductVariants | undefined,
  storage: string,
  etat: EtatType
): Variant | null {
  if (!variants || typeof variants !== 'object') return null;

  try {
    const storageData = variants[storage];
    if (!storageData || typeof storageData !== 'object') return null;

    const variant = storageData[etat];
    if (!variant || typeof variant !== 'object') return null;

    return variant;
  } catch (error) {
    console.error('Error in getVariant:', error);
    return null;
  }
}

/**
 * Vérifie si une variante a du stock disponible (au moins une couleur)
 */
export function hasVariantStock(
  variants: ProductVariants | undefined,
  storage: string,
  etat: EtatType
): boolean {
  const variant = getVariant(variants, storage, etat);
  if (!variant) return false;

  // Vérifier si au moins une couleur a du stock
  if (!Array.isArray(variant.couleurs)) return false;
  return variant.couleurs.some(c => c.stock > 0);
}
