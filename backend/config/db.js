const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('= Connexion � MongoDB en cours...');

    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sphone', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(' MongoDB connect� avec succ�s !');
    console.log(`=� Base de donn�es: ${conn.connection.name}`);
    console.log(`= H�te: ${conn.connection.host}`);
    console.log(`=� Port: ${conn.connection.port}\n`);
  } catch (error) {
    console.error('L Erreur de connexion � MongoDB:');
    console.error(`   Message: ${error.message}`);
    console.error(`   Code: ${error.code || 'N/A'}\n`);

    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
