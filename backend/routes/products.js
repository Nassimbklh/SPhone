const express = require('express');
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getBestSellers,
  addBestSeller,
  removeBestSeller,
  updateBestSellerOrder
} = require('../controllers/productController');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const upload = require('../middleware/upload');
const fs = require('fs');
const path = require('path');

// @route   GET /api/products
// @desc    Get all products with filters and pagination
// @access  Public
router.get('/', getAllProducts);

// @route   GET /api/products/best-sellers/list
// @desc    Get best sellers (manual or automatic)
// @access  Public
router.get('/best-sellers/list', getBestSellers);

// @route   PUT /api/products/best-sellers/add/:id
// @desc    Add product to best sellers
// @access  Private/Admin
router.put('/best-sellers/add/:id', auth, admin, addBestSeller);

// @route   PUT /api/products/best-sellers/remove/:id
// @desc    Remove product from best sellers
// @access  Private/Admin
router.put('/best-sellers/remove/:id', auth, admin, removeBestSeller);

// @route   PUT /api/products/best-sellers/order/:id
// @desc    Update best seller order
// @access  Private/Admin
router.put('/best-sellers/order/:id', auth, admin, updateBestSellerOrder);

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get('/:id', getProductById);

// @route   POST /api/products
// @desc    Create a new product
// @access  Private/Admin
router.post('/', auth, admin, createProduct);

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private/Admin
router.put('/:id', auth, admin, updateProduct);

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private/Admin
router.delete('/:id', auth, admin, deleteProduct);

// @route   POST /api/products/upload
// @desc    Upload product image
// @access  Private/Admin
router.post('/upload', auth, admin, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucune image fournie'
      });
    }

    // Retourner l'URL de l'image uploadée
    const imageUrl = `/uploads/products/${req.file.filename}`;

    res.json({
      success: true,
      message: 'Image uploadée avec succès',
      url: imageUrl
    });
  } catch (error) {
    console.error('Erreur upload:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'upload de l\'image',
      error: error.message
    });
  }
});

// @route   DELETE /api/products/image
// @desc    Delete product image
// @access  Private/Admin
router.delete('/image', auth, admin, (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'URL de l\'image requise'
      });
    }

    // Vérifier que c'est une image uploadée (pas une URL externe)
    if (!url.startsWith('/uploads/')) {
      return res.json({
        success: true,
        message: 'Image externe, pas de suppression nécessaire'
      });
    }

    // Construire le chemin complet du fichier
    const filePath = path.join(__dirname, '..', url);

    // Vérifier si le fichier existe
    if (fs.existsSync(filePath)) {
      // Supprimer le fichier
      fs.unlinkSync(filePath);

      res.json({
        success: true,
        message: 'Image supprimée avec succès'
      });
    } else {
      res.json({
        success: true,
        message: 'Fichier déjà supprimé ou inexistant'
      });
    }
  } catch (error) {
    console.error('Erreur suppression:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'image',
      error: error.message
    });
  }
});

module.exports = router;
