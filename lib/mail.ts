import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || "missing_key");

const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `${domain}/auth/verify-email?token=${token}`;

    await resend.emails.send({
        from: "AfricaMarket <onboarding@resend.dev>",
        to: email,
        subject: "Vérifiez votre adresse email - AfricaMarket",
        html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h1 style="color: #0d9488; text-align: center;">Bienvenue sur AfricaMarket !</h1>
        <p style="font-size: 16px; color: #374151;">Merci de vous être inscrit. Pour activer votre compte et commencer à utiliser la plateforme, veuillez confirmer votre adresse email en cliquant sur le bouton ci-dessous :</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${confirmLink}" style="background-color: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Vérifier mon compte</a>
        </div>
        <p style="font-size: 14px; color: #6b7280;">Si le bouton ne fonctionne pas, vous pouvez copier et coller ce lien dans votre navigateur :</p>
        <p style="font-size: 14px; color: #0d9488; word-break: break-all;">${confirmLink}</p>
        <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #9ca3af; text-align: center;">Cet email a été envoyé automatiquement. Si vous n'avez pas créé de compte sur AfricaMarket, vous pouvez ignorer cet email.</p>
      </div>
    `,
    });
};
