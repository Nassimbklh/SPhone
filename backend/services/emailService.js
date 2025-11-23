const nodemailer = require('nodemailer');

// Configuration du transporteur email
const transporter = nodemailer.createTransport({
  service: 'gmail', // Vous pouvez utiliser gmail, outlook, etc.
  auth: {
    user: process.env.EMAIL_USER, // Votre email
    pass: process.env.EMAIL_PASSWORD // Mot de passe d'application
  }
});

/**
 * Envoie un email avec le code de réinitialisation
 * @param {string} to - Email du destinataire
 * @param {string} code - Code de réinitialisation à 6 chiffres
 * @param {string} userName - Nom de l'utilisateur
 */
const sendResetPasswordEmail = async (to, code, userName) => {
  try {
    const mailOptions = {
      from: `"S.phone" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: 'Réinitialisation de votre mot de passe - S.phone',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9fafb;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: white;
              padding: 40px 30px;
              border-radius: 0 0 10px 10px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .code-box {
              background: #f3f4f6;
              border: 2px dashed #667eea;
              padding: 20px;
              text-align: center;
              margin: 30px 0;
              border-radius: 8px;
            }
            .code {
              font-size: 32px;
              font-weight: bold;
              color: #667eea;
              letter-spacing: 8px;
              font-family: 'Courier New', monospace;
            }
            .warning {
              background: #fef3c7;
              border-left: 4px solid #f59e0b;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              color: #6b7280;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">🔒 Réinitialisation de mot de passe</h1>
            </div>
            <div class="content">
              <p>Bonjour <strong>${userName}</strong>,</p>

              <p>Vous avez demandé à réinitialiser votre mot de passe sur <strong>S.phone</strong>.</p>

              <p>Voici votre code de vérification :</p>

              <div class="code-box">
                <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">CODE DE VÉRIFICATION</p>
                <div class="code">${code}</div>
              </div>

              <div class="warning">
                <p style="margin: 0;"><strong>⏰ Important :</strong> Ce code est valable pendant <strong>15 minutes</strong> seulement.</p>
              </div>

              <p>Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email en toute sécurité.</p>

              <p style="margin-top: 30px;">Cordialement,<br><strong>L'équipe S.phone</strong></p>
            </div>
            <div class="footer">
              <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
              <p>© 2025 S.phone - Tous droits réservés</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email envoyé:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Erreur envoi email:', error);
    throw new Error('Impossible d\'envoyer l\'email');
  }
};

module.exports = {
  sendResetPasswordEmail
};
