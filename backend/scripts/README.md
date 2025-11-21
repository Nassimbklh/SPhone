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

**Développé pour S.phone** 🔐📱
