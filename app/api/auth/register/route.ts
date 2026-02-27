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
                // If professional role, set status to pending
                verificationStatus: role === "BUYER" ? "NONE" : "PENDING",
            }
        })

        return NextResponse.json(
            { message: "Utilisateur créé avec succès", userId: user.id },
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
