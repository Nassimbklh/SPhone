# 📧 Configuration du service d'envoi d'emails

Ce guide explique comment configurer l'envoi d'emails pour le système de récupération de mot de passe.

## 🎯 Prérequis

- Un compte Gmail (ou autre fournisseur SMTP)
- Accès aux paramètres de sécurité du compte

## 🔧 Configuration avec Gmail

### Étape 1 : Activer la validation en 2 étapes

1. Allez sur [https://myaccount.google.com/security](https://myaccount.google.com/security)
2. Dans la section **"Connexion à Google"**, cliquez sur **"Validation en deux étapes"**
3. Suivez les instructions pour l'activer (si ce n'est pas déjà fait)

### Étape 2 : Créer un mot de passe d'application

1. Retournez sur [https://myaccount.google.com/security](https://myaccount.google.com/security)
2. Cliquez sur **"Mots de passe d'application"** (dans "Validation en deux étapes")
3. Sélectionnez :
   - **Application** : "Autre (nom personnalisé)"
   - **Nom** : "S.phone Backend"
4. Cliquez sur **"Générer"**
5. **Copiez le mot de passe généré** (16 caractères sans espaces)

### Étape 3 : Configurer les variables d'environnement

Ouvrez le fichier `/backend/.env` et ajoutez :

```env
EMAIL_USER=votre.email@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

⚠️ **Important** :
- Utilisez le **mot de passe d'application** (pas votre mot de passe Gmail habituel)
- Remplacez `votre.email@gmail.com` par votre vraie adresse
- Retirez les espaces du mot de passe d'application

**Exemple :**
```env
EMAIL_USER=contact.sphone@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
```

### Étape 4 : Redémarrer le backend

```bash
cd backend
npm start
```

## 🧪 Tester le système

### 1. Demander un code de réinitialisation

```bash
curl -X POST http://localhost:5001/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"utilisateur@example.com"}'
```

**Réponse attendue :**
```json
{
  "success": true,
  "message": "Un code de réinitialisation a été envoyé à votre adresse email"
}
```

### 2. Vérifier l'email reçu

Vous devriez recevoir un email avec :
- Un code à 6 chiffres
- Une durée de validité de 15 minutes
- Un design professionnel

### 3. Réinitialiser le mot de passe

```bash
curl -X POST http://localhost:5001/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email":"utilisateur@example.com",
    "code":"123456",
    "newPassword":"nouveaumotdepasse"
  }'
```

**Réponse attendue :**
```json
{
  "success": true,
  "message": "Mot de passe réinitialisé avec succès"
}
```

## 🌐 Tester via le frontend

1. Ouvrez [http://localhost:3002/auth/forgot-password](http://localhost:3002/auth/forgot-password)
2. Entrez votre email
3. Cliquez sur "Envoyer le code"
4. Vérifiez votre boîte mail (et les spams)
5. Entrez le code sur [http://localhost:3002/auth/reset-password](http://localhost:3002/auth/reset-password)
6. Définissez un nouveau mot de passe
7. Connectez-vous avec le nouveau mot de passe

## 🔐 Sécurité

### Code de vérification
- **Format** : 6 chiffres aléatoires (100000 - 999999)
- **Durée de validité** : 15 minutes
- **Stockage** : Hashé dans MongoDB avec date d'expiration
- **Utilisation unique** : Le code est supprimé après utilisation

### Email
- Le mot de passe d'application est moins sensible qu'un mot de passe principal
- N'utilisez jamais votre mot de passe Gmail principal dans le code
- Le fichier `.env` est dans `.gitignore` (ne sera pas commité)

## 🐛 Résolution de problèmes

### Erreur: "Impossible d'envoyer l'email"

**Causes possibles :**
1. Mauvais EMAIL_USER ou EMAIL_PASSWORD
2. Validation en 2 étapes non activée
3. Mot de passe d'application incorrect
4. Connexions moins sécurisées bloquées

**Solutions :**
- Vérifiez que EMAIL_USER et EMAIL_PASSWORD sont corrects
- Recréez un nouveau mot de passe d'application
- Vérifiez les logs du backend : `npm start` dans `/backend`

### L'email n'arrive pas

**Vérifiez :**
1. Le dossier spam/courrier indésirable
2. Les logs du backend pour voir si l'email a été envoyé
3. Que l'adresse email du destinataire est correcte

### Code "invalide ou expiré"

**Raisons :**
- Le code a expiré (> 15 minutes)
- Le code a déjà été utilisé
- Faute de frappe dans le code
- Email incorrect

**Solution :** Redemandez un nouveau code

## 📚 Autres fournisseurs SMTP

### Outlook/Hotmail

```env
EMAIL_USER=votre@outlook.com
EMAIL_PASSWORD=votre_mot_de_passe
```

Modifiez `/backend/services/emailService.js` :
```javascript
const transporter = nodemailer.createTransport({
  service: 'outlook',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
```

### SMTP personnalisé

```javascript
const transporter = nodemailer.createTransport({
  host: 'smtp.example.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
```

## 📝 Variables d'environnement requises

| Variable | Description | Exemple |
|----------|-------------|---------|
| `EMAIL_USER` | Adresse email d'envoi | `contact@sphone.com` |
| `EMAIL_PASSWORD` | Mot de passe d'application | `abcdefghijklmnop` |

## ✅ Checklist finale

- [ ] Validation en 2 étapes activée sur Gmail
- [ ] Mot de passe d'application créé
- [ ] Variables EMAIL_USER et EMAIL_PASSWORD ajoutées dans `/backend/.env`
- [ ] Backend redémarré
- [ ] Test d'envoi d'email réussi
- [ ] Code de 6 chiffres reçu par email
- [ ] Réinitialisation de mot de passe fonctionnelle

## 🚀 Production

Pour la production, utilisez :
- Un service email professionnel (SendGrid, Mailgun, AWS SES)
- Des emails transactionnels optimisés
- Un monitoring des emails envoyés
- Une limitation du nombre d'emails par utilisateur

---

**Support** : Si vous rencontrez des problèmes, vérifiez les logs du backend ou créez une issue sur GitHub.
