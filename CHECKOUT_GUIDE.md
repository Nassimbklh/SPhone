# 🛒 Guide du Système de Checkout

## Vue d'ensemble

Le nouveau système de checkout est un processus de commande en 3 étapes, moderne et intuitif, qui remplace l'ancien système Stripe direct.

## Architecture

### Pages créées

1. **`/app/checkout/page.tsx`** - Page principale du checkout multi-étapes
2. **`/app/order-success/page.tsx`** - Page de confirmation de commande

### Composants créés

Dans `/components/checkout/`:

1. **`PersonalInfoStep.tsx`** - Étape 1: Informations personnelles
2. **`AddressStep.tsx`** - Étape 2: Adresse de livraison
3. **`PaymentStep.tsx`** - Étape 3: Choix du paiement (CB ou Paylib)
4. **`OrderSummary.tsx`** - Résumé de commande (sidebar)

## Fonctionnalités

### ✨ Étape 1: Informations Personnelles

- **Auto-complétion** des données depuis le profil utilisateur
- Champs modifiables même si pré-remplis
- Validation en temps réel
- Champs requis:
  - Prénom (min 2 caractères)
  - Nom (min 2 caractères)
  - Email (format valide)
  - Téléphone (format français)

### 📍 Étape 2: Adresse de Livraison

- **Auto-complétion** depuis l'adresse enregistrée
- Validation du code postal (5 chiffres)
- Sélection du pays (France, Belgique, Suisse, Luxembourg)
- Champs requis:
  - Adresse complète (min 5 caractères)
  - Code postal (5 chiffres)
  - Ville
  - Pays

### 💳 Étape 3: Paiement

Deux modes de paiement disponibles:

#### 1. Carte Bancaire (CB)
- Saisie sécurisée du numéro de carte (16 chiffres)
- Date d'expiration (format MM/AA)
- CVV (3 chiffres)
- Validation complète des informations
- Formatage automatique (espaces entre groupes de 4 chiffres)

#### 2. Paylib
- Paiement mobile sécurisé
- Redirection vers l'application Paylib (à implémenter côté backend)

### 🎯 Indicateur de Progression

- Affichage visuel des 3 étapes
- Étape courante mise en évidence
- Étapes complétées marquées d'un ✓
- Barre de progression entre les étapes

### 📦 Résumé de Commande (Sidebar)

- Liste complète des articles
- Affichage du sous-total
- Calcul des frais de livraison
  - Gratuit à partir de 50€
  - 4.99€ sinon
  - Barre de progression pour la livraison gratuite
- Total TTC
- Badges de confiance (sécurité, livraison, garantie)

## Flux Utilisateur

```
Panier → Bouton "Passer la commande"
  ↓
Vérification authentification
  ↓
/checkout - Étape 1: Informations personnelles
  ↓
Étape 2: Adresse de livraison
  ↓
Étape 3: Paiement (CB ou Paylib)
  ↓
Création de la commande via API
  ↓
/order-success - Confirmation avec numéro de commande
```

## Navigation

- **Bouton "Continuer"** pour passer à l'étape suivante
- **Bouton "Retour"** pour revenir à l'étape précédente
- Validation obligatoire avant de pouvoir continuer

## Sécurité

- ✅ Validation côté client avant soumission
- ✅ Token JWT requis pour toutes les étapes
- ✅ Données de paiement jamais stockées
- ✅ HTTPS obligatoire en production
- ✅ Informations de carte validées avant envoi

## Intégration API

### Endpoint de création de commande

```typescript
POST /api/orders
Authorization: Bearer {token}

Body: {
  items: [...],
  shippingAddress: {
    street: string,
    city: string,
    postalCode: string,
    country: string
  },
  customerInfo: {
    firstname: string,
    lastname: string,
    email: string,
    phone: string
  },
  paymentMethod: 'card' | 'paylib',
  totalAmount: number
}
```

### Réponse attendue

```typescript
{
  success: true,
  data: {
    order: {
      _id: string,
      status: 'pending' | 'paid' | 'shipped' | 'delivered',
      totalAmount: number,
      ...
    }
  }
}
```

## Responsive Design

- ✅ Mobile-first
- ✅ Tablettes optimisées
- ✅ Desktop plein écran
- ✅ Sidebar sticky sur desktop
- ✅ Formulaires empilés sur mobile

## Validation

### Côté Client

- Email: Format valide (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)
- Téléphone: Format international
- Code postal: 5 chiffres (`/^[0-9]{5}$/`)
- Carte bancaire: 16 chiffres
- Date expiration: Format MM/AA et date future
- CVV: 3 chiffres

### Affichage des Erreurs

- Messages d'erreur clairs sous chaque champ
- Bordures rouges sur les champs invalides
- Fond rouge léger pour attirer l'attention
- Erreurs effacées dès que l'utilisateur commence à corriger

## UX/UI

### Couleurs

- Bleu (`#2563eb`) - Actions primaires, progression
- Vert (`#16a34a`) - Succès, validation
- Rouge (`#dc2626`) - Erreurs
- Gris - Textes et bordures

### Icônes

- 👤 Informations personnelles
- 📍 Adresse
- 💳 Paiement
- ✓ Validation
- 🔒 Sécurité

### Animations

- Transitions douces sur les boutons (0.2s)
- Changement d'étape fluide
- Hover effects sur les éléments cliquables

## Améliorations Futures

- [ ] Sauvegarde automatique du panier
- [ ] Plusieurs adresses de livraison
- [ ] Codes promo / réductions
- [ ] Calcul des frais de livraison selon le poids
- [ ] Choix du transporteur
- [ ] Points relais
- [ ] Paiement en plusieurs fois
- [ ] Apple Pay / Google Pay
- [ ] Suivi de commande en temps réel

## Testing

### Test manuel à effectuer

1. ✅ Panier vide → redirect vers /products
2. ✅ Non connecté → redirect vers /login
3. ✅ Données pré-remplies depuis le profil
4. ✅ Modification des données pré-remplies
5. ✅ Validation des champs à chaque étape
6. ✅ Navigation avant/arrière entre les étapes
7. ✅ Calcul correct du total avec livraison
8. ✅ Validation de la carte bancaire
9. ✅ Sélection Paylib
10. ✅ Création de commande réussie
11. ✅ Redirection vers page de succès
12. ✅ Panier vidé après commande

## Notes Importantes

- Le token est récupéré depuis le store Zustand (`useAuthStore`)
- Le panier est vidé automatiquement après une commande réussie
- Les informations de carte ne sont **JAMAIS** envoyées au backend pour le moment (à implémenter avec un processeur de paiement)
- La page de succès récupère les détails de la commande via l'API

---

**Développé pour S.phone** 🔐📱
