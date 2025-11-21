# Configuration Stripe pour S.phone

Ce guide vous explique comment configurer Stripe pour le paiement sur S.phone.

## 1. Créer un compte Stripe

1. Rendez-vous sur [https://stripe.com](https://stripe.com)
2. Créez un compte gratuit
3. Vérifiez votre email

## 2. Obtenir les clés API

### Mode Test (développement)

1. Connectez-vous au [Dashboard Stripe](https://dashboard.stripe.com)
2. Cliquez sur **Développeurs** > **Clés API**
3. Copiez la **Clé secrète** (commence par `sk_test_`)
4. Collez-la dans `/backend/.env` :
   ```
   STRIPE_SECRET_KEY=sk_test_votre_clé_secrète_ici
   ```

### Mode Live (production)

⚠️ **Ne pas utiliser les clés de production en développement !**

1. Activez votre compte en remplissant les informations requises
2. Basculez en mode "Live" dans le Dashboard
3. Copiez la **Clé secrète Live** (commence par `sk_live_`)
4. Mettez à jour `.env` avec la clé Live

## 3. Configurer les Webhooks

Les webhooks permettent à Stripe de notifier automatiquement votre backend lors d'un paiement réussi.

### En développement (avec Stripe CLI)

1. Installez Stripe CLI : [https://stripe.com/docs/stripe-cli](https://stripe.com/docs/stripe-cli)
   ```bash
   brew install stripe/stripe-cli/stripe
   ```

2. Connectez-vous :
   ```bash
   stripe login
   ```

3. Lancez le webhook en local :
   ```bash
   stripe listen --forward-to http://localhost:5001/api/payment/webhook
   ```

4. Copiez le **webhook secret** affiché (commence par `whsec_`)
5. Ajoutez-le dans `/backend/.env` :
   ```
   STRIPE_WEBHOOK_SECRET=whsec_votre_webhook_secret_ici
   ```

### En production

1. Allez dans **Développeurs** > **Webhooks**
2. Cliquez sur **+ Ajouter un endpoint**
3. URL de l'endpoint : `https://votre-domaine.com/api/payment/webhook`
4. Sélectionnez l'événement : `checkout.session.completed`
5. Copiez le **Signing secret** affiché
6. Ajoutez-le dans votre `.env` de production

## 4. Tester les paiements

### Cartes bancaires de test

En mode test, utilisez ces numéros de carte :

| Carte                | Numéro              | CVC | Date      | Résultat  |
|---------------------|---------------------|-----|-----------|-----------|
| Visa réussie        | 4242 4242 4242 4242 | Any | Futur     | ✅ Succès |
| Visa refusée        | 4000 0000 0000 0002 | Any | Futur     | ❌ Refusé |
| 3D Secure requis    | 4000 0027 6000 3184 | Any | Futur     | 🔐 Auth   |

Plus de cartes de test : [https://stripe.com/docs/testing](https://stripe.com/docs/testing)

### Processus de test

1. Ajoutez des produits au panier
2. Cliquez sur **Passer la commande**
3. Vous serez redirigé vers Stripe Checkout
4. Entrez une carte de test
5. Validez le paiement
6. Vous serez redirigé vers `/success` avec les détails de la commande

## 5. Variables d'environnement

### Backend (`/backend/.env`)

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret_here
FRONTEND_URL=http://localhost:3001
```

### Frontend (`/frontend/.env.local`)

```env
# Pas de configuration Stripe nécessaire côté frontend
# Tout se passe côté serveur via Stripe Checkout
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

## 6. Fonctionnalités implémentées

✅ **Création de session de paiement**
- Vérification du panier
- Validation des prix et du stock
- Création d'une commande en base de données
- Redirection vers Stripe Checkout

✅ **Gestion des paiements réussis**
- Récupération de la session Stripe
- Mise à jour du statut de commande
- Mise à jour du stock produits
- Affichage de la confirmation

✅ **Gestion des paiements annulés**
- Maintien des articles dans le panier
- Message informatif
- Options de retour

✅ **Webhooks automatiques**
- Mise à jour automatique après paiement
- Gestion sécurisée avec signature
- Mise à jour du stock

## 7. Sécurité

- ✅ Vérification JWT pour toutes les routes de paiement
- ✅ Validation des prix côté serveur (évite les manipulations)
- ✅ Vérification du stock avant paiement
- ✅ Webhook signature verification
- ✅ Aucune clé Stripe côté frontend

## 8. En cas de problème

### Le paiement ne fonctionne pas

1. Vérifiez que `STRIPE_SECRET_KEY` est bien configurée
2. Vérifiez que le backend est démarré
3. Consultez les logs du terminal backend
4. Vérifiez les logs Stripe Dashboard > Développeurs > Logs

### Le webhook ne fonctionne pas

1. En dev : vérifiez que `stripe listen` est actif
2. Vérifiez que `STRIPE_WEBHOOK_SECRET` est correct
3. Consultez les logs du terminal
4. Dashboard > Développeurs > Webhooks > Voir les tentatives

### La commande n'est pas mise à jour après paiement

1. Vérifiez les logs du webhook
2. Vérifiez que l'événement `checkout.session.completed` est bien configuré
3. Vérifiez que MongoDB est accessible

## 9. Passage en production

1. Activez votre compte Stripe
2. Remplacez `STRIPE_SECRET_KEY` par la clé Live
3. Configurez le webhook en production (voir étape 3)
4. Mettez à jour `FRONTEND_URL` avec votre domaine
5. Testez avec une vraie carte
6. Surveillez le Dashboard Stripe pour les paiements

## Support

- Documentation Stripe : [https://stripe.com/docs](https://stripe.com/docs)
- Stripe Checkout : [https://stripe.com/docs/payments/checkout](https://stripe.com/docs/payments/checkout)
- Webhooks : [https://stripe.com/docs/webhooks](https://stripe.com/docs/webhooks)
