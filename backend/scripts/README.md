# 📦 Scripts de Seed - S.phone

## Seed des Produits

### 🚀 Utilisation

Pour ajouter 15 produits réalistes dans la base de données :

```bash
cd backend
npm run seed
```

### 📋 Produits inclus

Le script `seedProducts.js` ajoute **15 produits** répartis dans 4 catégories :

#### 📱 Smartphones (8 produits)
1. iPhone 14 Pro - 128 Go - Noir sidéral
2. iPhone 13 - 128 Go - Bleu
3. Samsung Galaxy S23 - 128 Go - Noir
4. Samsung Galaxy A54 - 128 Go - Vert
5. Xiaomi Redmi Note 12 - 128 Go - Gris
6. iPhone 12 - 64 Go - Blanc
7. Google Pixel 7 - 128 Go - Anthracite
8. iPhone 11 - 64 Go - Mauve

#### ⌚ Montres connectées (3 produits)
9. Apple Watch Series 8 - 45 mm - Noir
10. Samsung Galaxy Watch 6 - 44 mm - Argent
11. Xiaomi Mi Watch Lite - Noir

#### 🎧 Écouteurs et audio (2 produits)
12. AirPods Pro 2
13. Samsung Galaxy Buds 2

#### 🛡 Accessoires (2 produits)
14. Coque silicone iPhone 14 - Noir
15. Chargeur USB-C 20W - Apple Original

### ✨ Caractéristiques

Chaque produit contient :
- ✅ Nom complet et description détaillée
- ✅ Prix S.phone + Prix public (réduction automatique)
- ✅ Stock réaliste
- ✅ `soldCount` (nombre de ventes) pour le mode automatique des meilleures ventes
- ✅ Couleurs disponibles
- ✅ Marque (Apple, Samsung, Xiaomi, Google)
- ✅ Images de qualité
- ✅ Spécifications techniques complètes
- ✅ Catégorie correcte (phones, watches, earphones, cases, accessories)

### 🎯 Après l'exécution

Vous pouvez :
- Voir les 15 produits dans `/admin/products`
- Les utiliser pour tester la section "Meilleures ventes"
- Les modifier ou supprimer individuellement
- Ajouter certains produits en "Meilleures ventes" manuellement dans `/admin/best-sellers`

### ⚠️ Note

Par défaut, le script **ajoute** les produits sans supprimer les existants.

Si vous voulez réinitialiser complètement la base de données, décommentez cette ligne dans `seedProducts.js` :

```javascript
// await Product.deleteMany({});
```

### 📊 Données réalistes

- **Prix** : Prix public > Prix S.phone (réductions entre 13% et 40%)
- **Stock** : Entre 12 et 95 unités selon le produit
- **Ventes** : `soldCount` entre 94 et 341 (produits populaires = ventes élevées)
- **Images** : URLs réelles depuis les sites officiels des marques

---

## 👑 Script de Création d'Admin

Le script `createAdmin.js` permet de gérer les administrateurs de l'application.

### Prérequis

Assurez-vous que votre base de données MongoDB est en cours d'exécution et que vos variables d'environnement sont configurées correctement dans le fichier `.env`.

### Utilisation

#### 1. Créer un nouvel administrateur

```bash
cd backend
node scripts/createAdmin.js create
```

Cette commande vous demandera interactivement les informations suivantes :
- Prénom
- Nom
- Email
- Téléphone
- Mot de passe (minimum 6 caractères)

#### 2. Promouvoir un utilisateur existant en admin

```bash
node scripts/createAdmin.js promote email@example.com
```

Cette commande promeut un utilisateur existant (identifié par son email) en administrateur.

#### 3. Lister tous les administrateurs

```bash
node scripts/createAdmin.js list
```

Cette commande affiche la liste de tous les administrateurs avec leurs informations.

### Exemple d'utilisation

```bash
# Créer un nouvel admin
$ node scripts/createAdmin.js create

📝 Création d'un nouvel administrateur

Prénom: Jean
Nom: Dupont
Email: admin@cryptophone.com
Téléphone: +33612345678
Mot de passe (min 6 caractères): ******

✅ Admin créé avec succès!
📧 Email: admin@cryptophone.com
👤 Nom: Jean Dupont
🔑 Rôle: admin
```

```bash
# Promouvoir un utilisateur existant
$ node scripts/createAdmin.js promote user@example.com

✅ Utilisateur promu en admin avec succès!
📧 Email: user@example.com
👤 Nom: Marie Martin
🔑 Rôle: admin
```

```bash
# Lister les admins
$ node scripts/createAdmin.js list

📋 Liste des administrateurs (2):

1. Jean Dupont
   📧 admin@cryptophone.com
   📅 Créé le: 28/11/2025

2. Marie Martin
   📧 user@example.com
   📅 Créé le: 27/11/2025
```

### Notes importantes

- Par défaut, tous les utilisateurs créés via l'inscription normale ont le rôle 'user'
- Seuls les administrateurs peuvent accéder au panneau d'administration
- Seuls les administrateurs peuvent supprimer, créer ou modifier des produits
- Le mot de passe sera automatiquement hashé avant d'être stocké dans la base de données

### Dépannage

#### Erreur de connexion à MongoDB

Si vous obtenez une erreur de connexion, vérifiez que :
1. MongoDB est en cours d'exécution
2. La variable `MONGODB_URI` dans votre fichier `.env` est correcte

#### L'utilisateur existe déjà

Si vous essayez de créer un admin avec un email déjà utilisé, utilisez la commande `promote` à la place :
```bash
node scripts/createAdmin.js promote email@example.com
```

---

**Développé pour S.phone** 🔐📱
