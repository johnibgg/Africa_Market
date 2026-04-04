import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `${domain}/auth/verify-email?token=${token}`;

    if (!resend) {
        console.error("ERREUR_MAIL: RESEND_API_KEY est manquante.");
        return { error: "Configuration email manquante" };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: "AfricaMarket <onboarding@resend.dev>",
            to: email,
            subject: "Vérifiez votre adresse email - AfricaMarket",
            html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
            <h1 style="color: #0d9488; text-align: center;">Bienvenue sur AfricaMarket !</h1>
            <p style="font-size: 16px; color: #374151;">Merci de vous être inscrit. Pour activer votre compte, veuillez confirmer votre adresse email :</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${confirmLink}" style="background-color: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Vérifier mon compte</a>
            </div>
            <p style="font-size: 14px; color: #6b7280;">Si le bouton ne fonctionne pas, vous pouvez copier et coller ce lien dans votre navigateur :</p>
            <p style="font-size: 14px; color: #0d9488; word-break: break-all;">${confirmLink}</p>
            <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
            <p style="font-size: 12px; color: #9ca3af; text-align: center;">Cet email a été envoyé automatiquement.</p>
          </div>
        `,
        });

        if (error) {
            console.error("ERREUR_RESEND:", error);
            return { error };
        }

        return { data };
    } catch (err) {
        console.error("ERREUR_ENVOI_EMAIL:", err);
        return { error: err };
    }
};

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
    if (!resend) {
        console.error("ERREUR_MAIL: RESEND_API_KEY est manquante.");
        return { error: "Configuration email manquante" };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: "AfricaMarket <onboarding@resend.dev>",
            to: email,
            subject: "Code de vérification 2FA - AfricaMarket",
            html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; text-align: center;">
            <h1 style="color: #0d9488;">Sécurisez votre compte</h1>
            <p style="font-size: 16px; color: #374151;">Voici votre code de confirmation à usage unique :</p>
            <div style="margin: 30px 0;">
              <span style="background-color: #f3f4f6; color: #0d9488; padding: 15px 30px; border-radius: 10px; font-weight: 900; font-size: 32px; letter-spacing: 5px; border: 2px dashed #0d9488;">${token}</span>
            </div>
            <p style="font-size: 14px; color: #6b7280;">Ce code expirera dans 10 minutes. Ne le partagez jamais avec personne.</p>
            <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
            <p style="font-size: 12px; color: #9ca3af;">Si vous n'avez pas tenté de vous connecter, veuillez ignorer cet email.</p>
          </div>
        `,
        });

        if (error) {
            console.error("ERREUR_RESEND:", error);
            return { error };
        }

        return { data };
    } catch (err) {
        console.error("ERREUR_ENVOI_EMAIL:", err);
        return { error: err };
    }
};
