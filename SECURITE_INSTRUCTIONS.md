# 🔐 Instructions de Sécurisation - S.phone

## ⚠️ ACTIONS URGENTES À EFFECTUER

### 1. Installer les dépendances de sécurité

```bash
cd /Users/nassim/Documents/Sphone/CryptoPhone/backend
npm install helmet express-rate-limit joi
```

### 2. Modifier `server.js` pour activer les protections

Ajouter au début du fichier (après les imports existants) :

```javascript
const helmet = require('helmet')
const { authLimiter, apiLimiter, helmetConfig, corsOptions } = require('./config/security')

// Sécuriser les headers HTTP
app.use(helmet(helmetConfig))

// Rate limiting global
app.use('/api/', apiLimiter)

// Appliquer CORS sécurisé
app.use(cors(corsOptions))
```

Puis ajouter avant les routes d'authentification :

```javascript
// Rate limiting pour l'authentification
app.use('/api/auth/login', authLimiter)
app.use('/api/auth/register', authLimiter)
```

### 3. Initialiser Git avec le .gitignore

```bash
cd /Users/nassim/Documents/Sphone/CryptoPhone
git init
git add .gitignore
git commit -m "Add .gitignore for security"
```

**⚠️ IMPORTANT :** Ne JAMAIS commiter les fichiers `.env` !

### 4. Remplacer les URLs hardcodées dans le frontend

**Fichiers à modifier :**

1. `/app/success/page.tsx` - Ligne 58
2. `/app/admin/products/page.tsx` - Lignes 74, 89
3. `/app/admin/orders/[id]/page.tsx` - Lignes 22, 42, 74
4. `/app/admin/orders/page.tsx` - Ligne 19
5. `/app/admin/page.tsx` - Lignes 22, 26
6. `/app/cart/page.tsx` - Ligne 45

**Exemple de correction :**

```typescript
// ❌ AVANT
const response = await fetch('http://localhost:5001/api/products')

// ✅ APRÈS
import { API_BASE_URL } from '@/lib/api'
const response = await fetch(`${API_BASE_URL}/products`)
```

Ou utiliser les helpers :

```typescript
import { apiGet } from '@/lib/api'
const response = await apiGet('/products')
```

---

## 🔒 CONFIGURATION POUR LA PRODUCTION

### 1. Générer des secrets sécurisés

```bash
# Générer un nouveau JWT_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Remplacer dans `/backend/.env` :

```env
JWT_SECRET=<nouveau_secret_généré>
STRIPE_SECRET_KEY=<votre_vraie_clé_stripe>
STRIPE_WEBHOOK_SECRET=<votre_webhook_secret>
```

### 2. Configurer HTTPS

Ajouter un reverse proxy (Nginx) avec certificat SSL/TLS :

```nginx
server {
    listen 443 ssl http2;
    server_name votredomaine.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:5001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 3. Variables d'environnement en production

Créer `/backend/.env.production` :

```env
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/sphone
JWT_SECRET=<NOUVEAU_SECRET_FORT>
STRIPE_SECRET_KEY=<CLE_PRODUCTION>
STRIPE_WEBHOOK_SECRET=<WEBHOOK_PRODUCTION>
FRONTEND_URL=https://votredomaine.com
```

---

## ✅ CHECKLIST DE MISE EN PRODUCTION

### Sécurité de base
- [ ] `.gitignore` créé et vérifié
- [ ] Secrets en variables d'environnement
- [ ] helmet installé et configuré
- [ ] Rate limiting actif
- [ ] HTTPS configuré
- [ ] CORS restreint au domaine de production

### Code
- [ ] Toutes les URLs hardcodées remplacées
- [ ] Variables d'environnement utilisées partout
- [ ] Validation backend robuste
- [ ] Gestion d'erreurs appropriée

### Base de données
- [ ] MongoDB en production (MongoDB Atlas recommandé)
- [ ] Backup automatique configuré
- [ ] Indices créés pour les performances
- [ ] Connexion sécurisée (SSL/TLS)

### Monitoring
- [ ] Logs configurés (Winston ou Bunyan)
- [ ] Monitoring d'erreurs (Sentry)
- [ ] Monitoring de performances (New Relic ou Datadog)
- [ ] Alertes configurées

### Tests
- [ ] Tests de sécurité effectués
- [ ] Scan de vulnérabilités (npm audit)
- [ ] Penetration testing
- [ ] Load testing

---

## 🚨 COMMANDES DE VÉRIFICATION

### Vérifier les vulnérabilités npm

```bash
cd backend
npm audit
npm audit fix
```

### Vérifier que les .env ne sont pas commités

```bash
git status
# Les fichiers .env ne doivent PAS apparaître !
```

### Tester le rate limiting

```bash
# Faire 6 requêtes de connexion rapides
for i in {1..6}; do
  curl -X POST http://localhost:5001/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}';
done
# La 6ème devrait être bloquée
```

---

## 📞 EN CAS DE PROBLÈME

### Si les secrets sont exposés dans Git :

```bash
# 1. Changer IMMÉDIATEMENT tous les secrets
# 2. Révoquer les clés API (Stripe, etc.)
# 3. Nettoyer l'historique Git (avancé) :
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch .env' \
  --prune-empty --tag-name-filter cat -- --all
```

### Si vous suspectez une intrusion :

1. **Déconnecter immédiatement** le serveur d'Internet
2. **Analyser les logs** pour identifier l'intrusion
3. **Changer tous les secrets** et mots de passe
4. **Analyser le code** à la recherche de backdoors
5. **Contacter un expert** en sécurité

---

## 📚 RESSOURCES

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Checklist](https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

---

**Dernière mise à jour :** 2025-11-21
