/**
 * Configuration de sécurité pour l'application
 * À intégrer dans server.js
 */

const rateLimit = require('express-rate-limit')

// Rate limiting pour les endpoints d'authentification
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Maximum 5 tentatives
  message: {
    success: false,
    message: 'Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// Rate limiting global pour l'API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Maximum 100 requêtes par IP
  message: {
    success: false,
    message: 'Trop de requêtes. Veuillez réessayer plus tard.'
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// Rate limiting pour les uploads
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 20, // Maximum 20 uploads par heure
  message: {
    success: false,
    message: 'Limite d\'uploads atteinte. Veuillez réessayer dans une heure.'
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// Configuration Helmet pour sécuriser les headers HTTP
const helmetConfig = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", process.env.FRONTEND_URL || "http://localhost:3001"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false, // Désactivé pour permettre les images externes
  crossOriginResourcePolicy: { policy: "cross-origin" },
}

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:3001',
      'http://localhost:3000', // Backup pendant le développement
    ]

    // Autoriser les requêtes sans origin (Postman, apps mobiles)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Non autorisé par CORS'))
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
}

module.exports = {
  authLimiter,
  apiLimiter,
  uploadLimiter,
  helmetConfig,
  corsOptions
}
