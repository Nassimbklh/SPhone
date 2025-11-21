// Conditions disponibles pour les produits
const CONDITIONS = {
  NEW_SEALED: 'new_sealed',
  NEW_OPEN: 'new_open',
  PERFECT: 'perfect',
  GOOD: 'good'
};

// Traductions françaises des conditions
const CONDITION_LABELS = {
  new_sealed: 'Neuf sous blister',
  new_open: 'Neuf sans boîte',
  perfect: 'Reconditionné - État parfait',
  good: 'Reconditionné - État correct'
};

// Descriptions détaillées
const CONDITION_DESCRIPTIONS = {
  new_sealed: 'Produit neuf, jamais ouvert, avec emballage d\'origine scellé',
  new_open: 'Produit neuf sans emballage d\'origine ou emballage ouvert',
  perfect: 'Produit remis à neuf, aucune trace d\'usure visible',
  good: 'Produit remis à neuf, quelques traces d\'usure mineures'
};

// Valider qu'une condition existe
function isValidCondition(condition) {
  return Object.values(CONDITIONS).includes(condition);
}

// Obtenir toutes les conditions disponibles
function getAllConditions() {
  return Object.values(CONDITIONS);
}

// Obtenir le label d'une condition
function getConditionLabel(condition) {
  return CONDITION_LABELS[condition] || condition;
}

// Obtenir la description d'une condition
function getConditionDescription(condition) {
  return CONDITION_DESCRIPTIONS[condition] || '';
}

module.exports = {
  CONDITIONS,
  CONDITION_LABELS,
  CONDITION_DESCRIPTIONS,
  isValidCondition,
  getAllConditions,
  getConditionLabel,
  getConditionDescription
};
