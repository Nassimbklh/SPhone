# Support des Formats d'Images - S.phone

Date: 2025-11-21

## Formats Supportés

Le système accepte et affiche maintenant tous les formats d'images courants:

- ✅ **PNG** (.png) - image/png
- ✅ **JPEG/JPG** (.jpg, .jpeg) - image/jpeg, image/jpg
- ✅ **WEBP** (.webp) - image/webp
- ✅ **SVG** (.svg) - image/svg+xml

## Modifications Effectuées

### 1. Backend - Configuration Multer

#### `/backend/routes/upload.js`
- ✅ Mis à jour `fileFilter` pour accepter tous les formats (lignes 43-60)
- ✅ Mis à jour la limite de taille: 10 MB par fichier
- ✅ Mis à jour les routes DELETE et LIST pour gérer tous les formats
- ✅ Mis à jour les messages d'erreur

**Types MIME autorisés:**
```javascript
const allowedTypes = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/svg+xml'
];
```

**Extensions autorisées:**
```javascript
const allowedExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.svg'];
```

#### `/backend/middleware/upload.js`
- ✅ Mis à jour le regex pour inclure SVG
- ✅ Limite de taille: 5 MB par fichier

### 2. Frontend - Configuration Next.js

#### `/frontend/next.config.js`
- ✅ Déjà configuré pour accepter tous les domaines (localhost, remotePatterns)
- ✅ `dangerouslyAllowSVG: true` activé pour les SVG
- ✅ Support WebP et AVIF via `formats: ['image/webp', 'image/avif']`

### 3. Frontend - Composants d'Upload

#### `/frontend/components/ImageUpload.tsx`
- ✅ Mis à jour `accept` dans useDropzone pour inclure `.svg`
- ✅ Mis à jour le message d'aide utilisateur

**Configuration React Dropzone:**
```typescript
accept: {
  'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.svg']
}
```

#### `/frontend/components/admin/ImageUploader.tsx`
- ✅ Mis à jour `handleFiles` pour accepter tous les formats
- ✅ Mis à jour l'attribut `accept` de l'input file
- ✅ Mis à jour le message d'erreur et les instructions

### 4. Affichage des Images

Les composants suivants affichent déjà correctement tous les formats grâce à `imageUtils.ts`:

- ✅ `/frontend/components/ProductCard.tsx` - Utilise `buildImageUrl()`
- ✅ `/frontend/components/BestSellers.tsx` - Utilise `buildImageUrl()`
- ✅ `/frontend/app/product/[id]/page.tsx` - Utilise `buildImageUrl()`
- ✅ `/frontend/components/DefaultImageGallery.tsx` - Supporte tous les formats

## Stockage en Base de Données

Les images sont stockées dans MongoDB avec leur chemin complet ou relatif:

```javascript
// Exemples de formats stockés:
product.images = [
  "/uploads/product-1234567890.png",
  "/uploads/product-1234567891.jpg",
  "/uploads/product-1234567892.webp",
  "/uploads/product-1234567893.svg"
]
```

Le helper `buildImageUrl()` dans `/frontend/lib/imageUtils.ts` construit automatiquement l'URL complète:
- Si l'image commence par `http`: retourne tel quel
- Si l'image commence par `/`: préfixe avec `API_URL`
- Sinon: construit `/uploads/{filename}`

## Limites de Taille

- **Backend uploads route**: 10 MB par fichier
- **Backend middleware**: 5 MB par fichier
- **Frontend ImageUpload**: 5 MB par fichier (configurable via prop `maxSize`)
- **Frontend ImageUploader**: 10 MB par fichier

## Nombre d'Images

- **Maximum par produit**: 5-10 images selon le composant
- **Upload simultané**: Jusqu'à 10 images à la fois

## Tests à Effectuer

### Upload
1. ✅ Tester l'upload d'un fichier PNG
2. ✅ Tester l'upload d'un fichier JPG/JPEG
3. ✅ Tester l'upload d'un fichier WEBP
4. ✅ Tester l'upload d'un fichier SVG
5. ✅ Tester l'upload de plusieurs fichiers en même temps

### Affichage
1. ✅ Vérifier l'affichage dans la page produit
2. ✅ Vérifier l'affichage dans le listing des produits
3. ✅ Vérifier l'affichage dans la section "Meilleures ventes"
4. ✅ Vérifier l'affichage dans l'admin (création/édition)

### Suppression
1. ✅ Tester la suppression d'une image PNG
2. ✅ Tester la suppression d'une image JPG
3. ✅ Tester la suppression d'une image WEBP
4. ✅ Tester la suppression d'une image SVG

## API Endpoints

### Upload une image
```bash
POST /api/upload/image
Content-Type: multipart/form-data
Authorization: Bearer {token}

Body: { image: File }
```

### Upload plusieurs images
```bash
POST /api/upload/images
Content-Type: multipart/form-data
Authorization: Bearer {token}

Body: { images: File[] }
```

### Lister les images
```bash
GET /api/upload/list
Authorization: Bearer {token}
```

### Supprimer une image
```bash
DELETE /api/upload/:filename
Authorization: Bearer {token}
```

## Exemples d'Utilisation

### Dans le code frontend
```typescript
import { buildImageUrl } from '@/lib/imageUtils'

// Pour une seule image
const imageUrl = buildImageUrl(product.images[0])

// Pour toutes les images
import { getProductImages } from '@/lib/imageUtils'
const allImages = getProductImages(product.images)
```

### Upload via fetch
```typescript
const formData = new FormData()
formData.append('image', file)

const response = await fetch('/api/upload/image', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
})
```

## Notes Importantes

1. **Sécurité**: Les fichiers sont validés côté serveur ET côté client
2. **Performance**: Les images WEBP sont optimisées automatiquement par Next.js
3. **SVG**: Les SVG sont autorisés mais avec CSP strict pour la sécurité
4. **URLs**: Toutes les URLs d'images sont construites de manière cohérente via `imageUtils.ts`

## Résolution de Problèmes

### Image ne s'affiche pas
- Vérifier que le fichier existe dans `/backend/uploads/`
- Vérifier l'URL complète dans la console (devrait être `http://localhost:5001/uploads/...`)
- Vérifier que le backend expose bien le dossier uploads (ligne dans `server.js`: `app.use('/uploads', express.static(...))`)

### Upload échoue
- Vérifier la taille du fichier (max 10 MB)
- Vérifier le format du fichier
- Vérifier les permissions du dossier `uploads/`
- Vérifier le token d'authentification

### Format non accepté
- Vérifier que le MIME type du fichier correspond aux types autorisés
- Certains navigateurs peuvent envoyer des MIME types différents pour le même format

---

**Dernière mise à jour**: 2025-11-21
**Version**: 1.0.0
