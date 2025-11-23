const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('= Connexion à MongoDB en cours...');

    // Debug: vérifier si MONGODB_URI est définie
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sphone';
    const uriMasked = mongoUri.replace(/(:\/\/)([^:]+):([^@]+)@/, '$1$2:****@');
    console.log(`DEBUG - URI utilisée: ${uriMasked}`);
    console.log(`DEBUG - MONGODB_URI définie: ${!!process.env.MONGODB_URI}`);

    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB connecté avec succès !');
    console.log(`📊 Base de données: ${conn.connection.name}`);
    console.log(`🌐 Hôte: ${conn.connection.host}`);
    console.log(`🔌 Port: ${conn.connection.port}\n`);
  } catch (error) {
    console.error('❌ Erreur de connexion à MongoDB:');
    console.error(`   Message: ${error.message}`);
    console.error(`   Code: ${error.code || 'N/A'}\n`);

    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
