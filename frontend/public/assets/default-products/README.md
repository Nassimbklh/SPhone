# Images Par Défaut pour les Produits

Ce dossier contient les images par défaut utilisées automatiquement lors de la création de produits.

## Structure des Dossiers

```
default-products/
├── phones/        # Téléphones
├── watches/       # Montres connectées
├── earbuds/       # Écouteurs / Casques
├── cases/         # Coques de protection
└── accessories/   # Accessoires (câbles, chargeurs, etc.)
```

## Comment Ajouter des Images

### 1. Sources d'Images Libres de Droits Recommandées

**PNG avec fond transparent :**
- **PngTree** : https://pngtree.com/free-png (section Free)
- **PngWing** : https://www.pngwing.com/
- **FreePNGImg** : https://www.freepngimg.com/
- **Icons8** : https://icons8.com/illustrations (images 3D libres)
- **Pixabay** : https://pixabay.com/ (filtrer par PNG)
- **OpenMoji** : https://openmoji.org/ (icônes simples)

**Recherche recommandée :**
- "smartphone PNG transparent"
- "smartwatch PNG no background"
- "wireless earbuds PNG"
- "phone case PNG transparent"
- "USB cable PNG"

### 2. Critères des Images

✅ **Format** : PNG avec fond transparent
✅ **Résolution** : Minimum 800x800px (idéal : 1200x1200px)
✅ **Taille** : Maximum 500 KB par image
✅ **Style** : Moderne, minimaliste, style Apple/BackMarket
✅ **Licence** : Libre de droits pour usage commercial

### 3. Convention de Nommage

Utilisez des noms descriptifs en anglais :

**Téléphones (phones/) :**
- `iphone-generic.png`
- `android-generic.png`
- `phone-black.png`
- `phone-white.png`
- `phone-blue.png`

**Montres (watches/) :**
- `smartwatch-black.png`
- `smartwatch-white.png`
- `watch-sport.png`
- `watch-elegant.png`
- `watch-fitness.png`

**Écouteurs (earbuds/) :**
- `earbuds-white.png`
- `earbuds-black.png`
- `earbuds-sport.png`
- `headphones.png`
- `earbuds-intra.png`

**Coques (cases/) :**
- `case-clear.png`
- `case-black.png`
- `case-blue.png`
- `case-pink.png`
- `case-leather.png`

**Accessoires (accessories/) :**
- `cable-usbc.png`
- `charger-fast.png`
- `adapter.png`
- `phone-stand.png`
- `screen-protector.png`

### 4. Ajouter une Nouvelle Image

1. Téléchargez l'image PNG avec fond transparent
2. Optimisez-la si nécessaire (https://tinypng.com/)
3. Renommez-la selon la convention ci-dessus
4. Placez-la dans le bon dossier de catégorie
5. Mettez à jour `/lib/defaultImages.ts` pour référencer la nouvelle image

**Exemple d'ajout dans `defaultImages.ts` :**

\`\`\`typescript
phones: [
  // ... images existantes
  {
    id: 'phone-6',
    name: 'Smartphone Rouge',
    path: '/assets/default-products/phones/phone-red.png',
    category: 'phones'
  }
]
\`\`\`

### 5. Images Actuelles

Pour l'instant, des placeholders SVG sont fournis pour chaque catégorie. Remplacez-les progressivement par de vraies images PNG.

Le fichier `default.png` dans chaque dossier sera utilisé si aucune image n'est uploadée.

## Fonctionnement Automatique

- **Création de produit** : L'image par défaut de la catégorie s'affiche automatiquement
- **Changement de catégorie** : L'image par défaut est mise à jour
- **Upload manuel** : Remplace l'image par défaut
- **Galerie prédéfinie** : Permet de choisir parmi plusieurs images de la catégorie

## Optimisation

Pour de meilleures performances :
1. Utilisez **TinyPNG** (https://tinypng.com/) pour compresser les PNG
2. Gardez les images sous 500 KB
3. Résolution recommandée : 1200x1200px (ratio 1:1)

## Licence

Assurez-vous que toutes les images ajoutées sont :
- Libres de droits pour usage commercial
- Sans attribution obligatoire (ou attribution ajoutée dans ce fichier)
- PNG avec fond transparent de préférence

---

**Note** : Ce système permet de créer des produits professionnels rapidement sans avoir besoin de photographier chaque article. Les images peuvent toujours être remplacées par des photos réelles ultérieurement.
