// Middleware to check if user is admin
const admin = (req, res, next) => {
  try {
    // Check if user exists (should be set by auth middleware)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Non autorisé. Authentification requise.'
      });
    }

    // Check if user has admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé. Droits administrateur requis.'
      });
    }

    // User is admin, proceed to next middleware
    next();
  } catch (error) {
    console.error('Error in admin middleware:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la vérification des droits'
    });
  }
};

module.exports = admin;
