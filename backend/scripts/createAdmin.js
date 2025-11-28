const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

/**
 * Script pour créer un utilisateur admin ou promouvoir un utilisateur existant
 *
 * Usage:
 * 1. Créer un nouvel admin:
 *    node scripts/createAdmin.js create
 *
 * 2. Promouvoir un utilisateur existant:
 *    node scripts/createAdmin.js promote <email>
 *
 * 3. Lister tous les admins:
 *    node scripts/createAdmin.js list
 */

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cryptophone');
    console.log('✅ Connecté à MongoDB');
  } catch (error) {
    console.error('❌ Erreur de connexion à MongoDB:', error.message);
    process.exit(1);
  }
};

const createNewAdmin = async () => {
  try {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const question = (query) => new Promise((resolve) => readline.question(query, resolve));

    console.log('\n📝 Création d\'un nouvel administrateur\n');

    const firstname = await question('Prénom: ');
    const lastname = await question('Nom: ');
    const email = await question('Email: ');
    const phone = await question('Téléphone: ');
    const password = await question('Mot de passe (min 6 caractères): ');

    readline.close();

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('❌ Un utilisateur avec cet email existe déjà');
      console.log('💡 Utilisez: node scripts/createAdmin.js promote ' + email);
      process.exit(1);
    }

    // Créer l'admin
    const admin = await User.create({
      firstname,
      lastname,
      email,
      phone,
      password,
      role: 'admin'
    });

    console.log('\n✅ Admin créé avec succès!');
    console.log('📧 Email:', admin.email);
    console.log('👤 Nom:', admin.firstname, admin.lastname);
    console.log('🔑 Rôle:', admin.role);

  } catch (error) {
    console.error('❌ Erreur lors de la création:', error.message);
  }
};

const promoteUserToAdmin = async (email) => {
  try {
    if (!email) {
      console.log('❌ Veuillez fournir un email');
      console.log('💡 Usage: node scripts/createAdmin.js promote <email>');
      process.exit(1);
    }

    const user = await User.findOne({ email });

    if (!user) {
      console.log('❌ Aucun utilisateur trouvé avec cet email:', email);
      process.exit(1);
    }

    if (user.role === 'admin') {
      console.log('ℹ️  Cet utilisateur est déjà administrateur');
      process.exit(0);
    }

    user.role = 'admin';
    await user.save();

    console.log('\n✅ Utilisateur promu en admin avec succès!');
    console.log('📧 Email:', user.email);
    console.log('👤 Nom:', user.firstname, user.lastname);
    console.log('🔑 Rôle:', user.role);

  } catch (error) {
    console.error('❌ Erreur lors de la promotion:', error.message);
  }
};

const listAdmins = async () => {
  try {
    const admins = await User.find({ role: 'admin' });

    if (admins.length === 0) {
      console.log('ℹ️  Aucun administrateur trouvé');
      console.log('💡 Créez un admin avec: node scripts/createAdmin.js create');
      process.exit(0);
    }

    console.log(`\n📋 Liste des administrateurs (${admins.length}):\n`);
    admins.forEach((admin, index) => {
      console.log(`${index + 1}. ${admin.firstname} ${admin.lastname}`);
      console.log(`   📧 ${admin.email}`);
      console.log(`   📅 Créé le: ${admin.createdAt.toLocaleDateString('fr-FR')}\n`);
    });

  } catch (error) {
    console.error('❌ Erreur lors de la liste:', error.message);
  }
};

const main = async () => {
  await connectDB();

  const command = process.argv[2];
  const arg = process.argv[3];

  switch (command) {
    case 'create':
      await createNewAdmin();
      break;

    case 'promote':
      await promoteUserToAdmin(arg);
      break;

    case 'list':
      await listAdmins();
      break;

    default:
      console.log('❌ Commande inconnue');
      console.log('\n📖 Usage:');
      console.log('  node scripts/createAdmin.js create           - Créer un nouvel admin');
      console.log('  node scripts/createAdmin.js promote <email>  - Promouvoir un utilisateur');
      console.log('  node scripts/createAdmin.js list             - Lister les admins');
      break;
  }

  mongoose.connection.close();
  process.exit(0);
};

main();
