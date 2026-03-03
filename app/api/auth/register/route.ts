import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const { name, email, password, role } = await req.json()

        if (!email || !password || !role) {
            return NextResponse.json(
                { message: "Champs manquants" },
                { status: 400 }
            )
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return NextResponse.json(
                { message: "Un utilisateur avec cet email existe déjà" },
                { status: 400 }
            )
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
                isVerified: false,
                verificationStatus: "NONE",
            }
        })

        // Generate and send verification email
        const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const expires = new Date(Date.now() + 3600 * 1000); // 1 hour

        await prisma.verificationToken.create({
            data: {
                email,
                token,
                expires
            }
        });

        try {
            const { sendVerificationEmail } = await import("@/lib/mail");
            await sendVerificationEmail(email, token);
        } catch (mailError) {
            console.error("FAILED_TO_SEND_VERIFICATION_EMAIL", mailError);
            // We don't fail the registration if email fails, but we log it
        }

        return NextResponse.json(
            { message: "Un email de vérification a été envoyé pour activer votre compte.", userId: user.id },
            { status: 201 }
        )
    } catch (error) {
        console.error("REGISTRATION_ERROR", error)
        return NextResponse.json(
            { message: "Une erreur est survenue lors de l'inscription" },
            { status: 500 }
        )
    }
}
