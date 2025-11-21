const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middlewares/auth');

const router = express.Router();

// Middleware pour vérifier si l'utilisateur est admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Accès refusé. Droits administrateur requis.'
    });
  }
};

// Créer le dossier uploads s'il n'existe pas
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuration de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Générer un nom unique : timestamp-random-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '_');
    cb(null, `${sanitizedName}-${uniqueSuffix}${ext}`);
  }
});

// Filtre pour accepter tous les formats d'images courants
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
    'image/svg+xml'
  ];
  const allowedExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.svg'];

  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Seuls les fichiers PNG, JPG, JPEG, WEBP et SVG sont acceptés'), false);
  }
};

// Configuration multer avec limites
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB max
  }
});

/**
 * @route   POST /api/upload/image
 * @desc    Upload une seule image (PNG, JPG, JPEG, WEBP, SVG)
 * @access  Private/Admin
 */
router.post('/image', auth, isAdmin, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier fourni'
      });
    }

    // Retourner l'URL de l'image
    const imageUrl = `/uploads/${req.file.filename}`;

    res.status(200).json({
      success: true,
      message: 'Image uploadée avec succès',
      data: {
        filename: req.file.filename,
        url: imageUrl,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });
  } catch (error) {
    console.error('Erreur upload image:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'upload de l\'image'
    });
  }
});

/**
 * @route   POST /api/upload/images
 * @desc    Upload plusieurs images (PNG, JPG, JPEG, WEBP, SVG)
 * @access  Private/Admin
 */
router.post('/images', auth, isAdmin, upload.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier fourni'
      });
    }

    // Retourner les URLs des images
    const images = req.files.map(file => ({
      filename: file.filename,
      url: `/uploads/${file.filename}`,
      size: file.size,
      mimetype: file.mimetype
    }));

    res.status(200).json({
      success: true,
      message: `${images.length} image(s) uploadée(s) avec succès`,
      data: {
        images: images
      }
    });
  } catch (error) {
    console.error('Erreur upload images:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'upload des images'
    });
  }
});

/**
 * @route   DELETE /api/upload/:filename
 * @desc    Supprimer une image
 * @access  Private/Admin
 */
router.delete('/:filename', auth, isAdmin, (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(uploadDir, filename);

    // Vérifier que le fichier existe
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Fichier non trouvé'
      });
    }

    // Vérifier que c'est bien un fichier image
    const ext = path.extname(filename).toLowerCase();
    if (!['.svg', '.png', '.jpg', '.jpeg', '.webp'].includes(ext)) {
      return res.status(400).json({
        success: false,
        message: 'Seuls les fichiers image peuvent être supprimés'
      });
    }

    // Supprimer le fichier
    fs.unlinkSync(filePath);

    res.status(200).json({
      success: true,
      message: 'Image supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur suppression image:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'image'
    });
  }
});

/**
 * @route   GET /api/upload/list
 * @desc    Lister toutes les images uploadées
 * @access  Private/Admin
 */
router.get('/list', auth, isAdmin, (req, res) => {
  try {
    // Lire le contenu du dossier uploads
    const files = fs.readdirSync(uploadDir);

    // Filtrer uniquement les images
    const images = files
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.svg', '.png', '.jpg', '.jpeg', '.webp'].includes(ext);
      })
      .map(file => {
        const filePath = path.join(uploadDir, file);
        const stats = fs.statSync(filePath);

        return {
          filename: file,
          url: `/uploads/${file}`,
          size: stats.size,
          createdAt: stats.birthtime,
          modifiedAt: stats.mtime
        };
      })
      .sort((a, b) => b.createdAt - a.createdAt); // Trier par date de création (plus récent en premier)

    res.status(200).json({
      success: true,
      data: {
        images: images,
        count: images.length
      }
    });
  } catch (error) {
    console.error('Erreur liste images:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la liste des images'
    });
  }
});

// Gestion des erreurs multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'Le fichier est trop volumineux (max 10 MB)'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Trop de fichiers envoyés'
      });
    }
  }

  if (error.message === 'Seuls les fichiers PNG, JPG, JPEG, WEBP et SVG sont acceptés') {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  next(error);
});

module.exports = router;
