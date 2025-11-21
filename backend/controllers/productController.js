const Product = require('../models/Product');

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      pricePublic,
      images,
      category,
      stock,
      colors,
      brand,
      model,
      specifications,
      variants,
      availableStorages,
      isBestSeller,
      bestSellerOrder,
      soldCount
    } = req.body;

    // Basic validation
    if (!name || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez fournir tous les champs requis (name, description, category)'
      });
    }

    // Validate that we have either price OR variants
    const hasVariants = variants && Object.keys(variants).length > 0;
    const hasSimplePrice = price !== undefined && price !== null;

    if (!hasVariants && !hasSimplePrice) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez fournir soit un prix simple, soit des variantes avec prix'
      });
    }

    // Transform specifications if provided as an array (from SpecificationsManager)
    let transformedSpecs = specifications;
    if (Array.isArray(specifications)) {
      // Transform flat array to categorized object
      transformedSpecs = {
        ecran: [],
        processeur: [],
        ram: [],
        stockage: [],
        camera: [],
        batterie: [],
        systeme: []
      };

      // For now, put all specs in 'systeme' category if not categorized
      // TODO: Improve categorization logic based on labels
      specifications.forEach(spec => {
        if (spec && spec.label && spec.value) {
          transformedSpecs.systeme.push({
            label: spec.label,
            value: spec.value
          });
        }
      });
    }

    // Prepare product data
    const productData = {
      name,
      description,
      images: images || [],
      category,
      brand,
      model,
      specifications: transformedSpecs,
      isBestSeller: isBestSeller || false,
      bestSellerOrder: bestSellerOrder || null,
      soldCount: soldCount || 0
    };

    // Add variants or simple pricing
    if (hasVariants) {
      // Filtrer et valider les variants avant de sauvegarder
      const cleanedVariants = {};

      Object.keys(variants).forEach(storage => {
        const storageData = variants[storage];
        const cleanedStorage = {};

        Object.keys(storageData).forEach(etat => {
          const variant = storageData[etat];

          // Vérifier que l'état a des données valides
          if (variant && variant.prix > 0 && variant.couleurs && Array.isArray(variant.couleurs)) {
            // Filtrer les couleurs pour ne garder que celles avec nom et stock valides
            const validCouleurs = variant.couleurs.filter(c =>
              c && c.nom && c.nom.trim() !== '' && typeof c.stock === 'number' && c.stock >= 0
            );

            // Ne créer l'état QUE s'il a au moins une couleur valide
            if (validCouleurs.length > 0) {
              cleanedStorage[etat] = {
                prix: variant.prix,
                prixPublic: variant.prixPublic,
                couleurs: validCouleurs
              };
            }
          }
        });

        // Ne créer le storage QUE s'il a au moins un état valide
        if (Object.keys(cleanedStorage).length > 0) {
          cleanedVariants[storage] = cleanedStorage;
        }
      });

      productData.variants = cleanedVariants;
      productData.availableStorages = availableStorages || Object.keys(cleanedVariants);
    } else {
      productData.price = price;
      productData.pricePublic = pricePublic || undefined;
      productData.stock = stock || 0;
      productData.colors = colors || [];
    }

    // Create product
    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      message: 'Produit créé avec succès',
      data: { product }
    });
  } catch (error) {
    console.error('Error in createProduct:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du produit',
      error: error.message
    });
  }
};

// @desc    Get all products with filters and pagination
// @route   GET /api/products
// @access  Public
exports.getAllProducts = async (req, res) => {
  try {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 12
    } = req.query;

    // Build query
    let query = {};

    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }

    // Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Build sort
    let sortOption = {};
    if (sort === 'price_asc') {
      sortOption.price = 1;
    } else if (sort === 'price_desc') {
      sortOption.price = -1;
    } else if (sort === 'name_asc') {
      sortOption.name = 1;
    } else if (sort === 'name_desc') {
      sortOption.name = -1;
    } else {
      sortOption.createdAt = -1; // Default: newest first
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const totalProducts = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      total: totalProducts,
      page: pageNum,
      totalPages: Math.ceil(totalProducts / limitNum),
      data: { products }
    });
  } catch (error) {
    console.error('Error in getAllProducts:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la r�cup�ration des produits',
      error: error.message
    });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouv�'
      });
    }

    res.status(200).json({
      success: true,
      data: { product }
    });
  } catch (error) {
    console.error('Error in getProductById:', error);

    // Handle invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouv�'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la r�cup�ration du produit',
      error: error.message
    });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      pricePublic,
      images,
      category,
      stock,
      colors,
      brand,
      model,
      specifications,
      variants,
      availableStorages,
      featured,
      isBestSeller,
      bestSellerOrder,
      soldCount
    } = req.body;

    // Find product
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    // Transform specifications if provided as an array (from SpecificationsManager)
    let transformedSpecs = specifications;
    if (specifications && Array.isArray(specifications)) {
      transformedSpecs = {
        ecran: [],
        processeur: [],
        ram: [],
        stockage: [],
        camera: [],
        batterie: [],
        systeme: []
      };

      specifications.forEach(spec => {
        if (spec && spec.label && spec.value) {
          transformedSpecs.systeme.push({
            label: spec.label,
            value: spec.value
          });
        }
      });
    }

    // Update fields
    if (name) product.name = name;
    if (description) product.description = description;
    if (price !== undefined) product.price = price;
    if (pricePublic !== undefined) product.pricePublic = pricePublic;
    if (images) product.images = images;
    if (category) product.category = category;
    if (stock !== undefined) product.stock = stock;
    if (colors) product.colors = colors;
    if (brand !== undefined) product.brand = brand;
    if (model !== undefined) product.model = model;
    if (transformedSpecs) product.specifications = transformedSpecs;

    // Filtrer et valider les variants avant de sauvegarder
    if (variants !== undefined) {
      const cleanedVariants = {};

      Object.keys(variants).forEach(storage => {
        const storageData = variants[storage];
        const cleanedStorage = {};

        Object.keys(storageData).forEach(etat => {
          const variant = storageData[etat];

          // Vérifier que l'état a des données valides
          if (variant && variant.prix > 0 && variant.couleurs && Array.isArray(variant.couleurs)) {
            // Filtrer les couleurs pour ne garder que celles avec nom et stock valides
            const validCouleurs = variant.couleurs.filter(c =>
              c && c.nom && c.nom.trim() !== '' && typeof c.stock === 'number' && c.stock >= 0
            );

            // Ne créer l'état QUE s'il a au moins une couleur valide
            if (validCouleurs.length > 0) {
              cleanedStorage[etat] = {
                prix: variant.prix,
                prixPublic: variant.prixPublic,
                couleurs: validCouleurs
              };
            }
          }
        });

        // Ne créer le storage QUE s'il a au moins un état valide
        if (Object.keys(cleanedStorage).length > 0) {
          cleanedVariants[storage] = cleanedStorage;
        }
      });

      product.variants = cleanedVariants;
    }

    if (availableStorages !== undefined) product.availableStorages = availableStorages;
    if (featured !== undefined) product.featured = featured;
    if (isBestSeller !== undefined) product.isBestSeller = isBestSeller;
    if (bestSellerOrder !== undefined) product.bestSellerOrder = bestSellerOrder;
    if (soldCount !== undefined) product.soldCount = soldCount;

    // Save updated product
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Produit mis à jour avec succès',
      data: { product }
    });
  } catch (error) {
    console.error('Error in updateProduct:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    // Handle invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du produit',
      error: error.message
    });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouv�'
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Produit supprim� avec succ�s',
      data: {}
    });
  } catch (error) {
    console.error('Error in deleteProduct:', error);

    // Handle invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouv�'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du produit',
      error: error.message
    });
  }
};

// @desc    Get best sellers (manual selection + top sold products to fill 4 slots)
// @route   GET /api/products/best-sellers/list
// @access  Public
exports.getBestSellers = async (req, res) => {
  try {
    // Step 1: Get manually selected best sellers (sorted by order)
    const manualBestSellers = await Product.find({
      isBestSeller: true,
      bestSellerOrder: { $ne: null }
    })
      .sort({ bestSellerOrder: 1 })
      .limit(4);

    // Get IDs of manual best sellers to exclude them from auto-fill
    const manualIds = manualBestSellers.map(p => p._id.toString());

    // Step 2: If we have less than 4 manual best sellers, fill with top sold products
    let finalProducts = [...manualBestSellers];
    const neededCount = 4 - manualBestSellers.length;

    if (neededCount > 0) {
      // Get top products by soldCount, excluding manual best sellers
      const topSoldProducts = await Product.find({
        _id: { $nin: manualIds }
      })
        .sort({ soldCount: -1 })
        .limit(neededCount);

      // Add them to final list
      finalProducts = [...finalProducts, ...topSoldProducts];
    }

    // Determine mode
    const mode = manualBestSellers.length > 0 ? 'hybrid' : 'automatic';

    res.status(200).json({
      success: true,
      mode: mode,
      count: finalProducts.length,
      data: { products: finalProducts }
    });
  } catch (error) {
    console.error('Error in getBestSellers:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des meilleures ventes',
      error: error.message
    });
  }
};

// @desc    Add product to best sellers
// @route   PUT /api/products/best-sellers/add/:id
// @access  Private/Admin
exports.addBestSeller = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if product exists
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    // Count current best sellers
    const currentBestSellersCount = await Product.countDocuments({
      isBestSeller: true
    });

    if (currentBestSellersCount >= 4) {
      return res.status(400).json({
        success: false,
        message: 'Limite de 4 meilleures ventes atteinte'
      });
    }

    // Find next available order
    const existingOrders = await Product.find({ isBestSeller: true })
      .select('bestSellerOrder')
      .lean();

    const usedOrders = existingOrders
      .map(p => p.bestSellerOrder)
      .filter(o => o !== null);

    let nextOrder = 1;
    for (let i = 1; i <= 4; i++) {
      if (!usedOrders.includes(i)) {
        nextOrder = i;
        break;
      }
    }

    // Update product
    product.isBestSeller = true;
    product.bestSellerOrder = nextOrder;
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Produit ajouté aux meilleures ventes',
      data: { product }
    });
  } catch (error) {
    console.error('Error in addBestSeller:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'ajout du produit',
      error: error.message
    });
  }
};

// @desc    Remove product from best sellers
// @route   PUT /api/products/best-sellers/remove/:id
// @access  Private/Admin
exports.removeBestSeller = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if product exists
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    // Update product
    product.isBestSeller = false;
    product.bestSellerOrder = null;
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Produit retiré des meilleures ventes',
      data: { product }
    });
  } catch (error) {
    console.error('Error in removeBestSeller:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du retrait du produit',
      error: error.message
    });
  }
};

// @desc    Update best seller order
// @route   PUT /api/products/best-sellers/order/:id
// @access  Private/Admin
exports.updateBestSellerOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { order } = req.body;

    // Validate order
    if (!order || order < 1 || order > 4) {
      return res.status(400).json({
        success: false,
        message: 'L\'ordre doit être entre 1 et 4'
      });
    }

    // Check if product exists
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    if (!product.isBestSeller) {
      return res.status(400).json({
        success: false,
        message: 'Ce produit n\'est pas dans les meilleures ventes'
      });
    }

    // Check if order is already used by another product
    const existingProduct = await Product.findOne({
      _id: { $ne: id },
      bestSellerOrder: order,
      isBestSeller: true
    });

    // If order is taken, swap
    if (existingProduct) {
      const currentOrder = product.bestSellerOrder;
      existingProduct.bestSellerOrder = currentOrder;
      await existingProduct.save();
    }

    // Update product order
    product.bestSellerOrder = order;
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Ordre mis à jour',
      data: { product }
    });
  } catch (error) {
    console.error('Error in updateBestSellerOrder:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'ordre',
      error: error.message
    });
  }
};
