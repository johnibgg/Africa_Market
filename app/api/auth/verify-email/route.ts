import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
        return NextResponse.redirect(new URL("/auth/login?error=MissingToken", req.url));
    }

    try {
        const existingToken = await prisma.verificationToken.findUnique({
            where: { token },
        });

        if (!existingToken) {
            return NextResponse.redirect(new URL("/auth/login?error=InvalidToken", req.url));
        }

        const hasExpired = new Date(existingToken.expires) < new Date();

        if (hasExpired) {
            return NextResponse.redirect(new URL("/auth/login?error=TokenExpired", req.url));
        }

        const existingUser = await prisma.user.findUnique({
            where: { email: existingToken.email },
        });

        if (!existingUser) {
            return NextResponse.redirect(new URL("/auth/login?error=EmailNotFound", req.url));
        }

        await prisma.user.update({
            where: { id: existingUser.id },
            data: {
                emailVerified: new Date(),
                isVerified: true, // Mark as verified for basic features
                email: existingToken.email,
            },
        });

        await prisma.verificationToken.delete({
            where: { id: existingToken.id },
        });

        return NextResponse.redirect(new URL("/auth/login?success=EmailVerified", req.url));
    } catch (error) {
        console.error("VERIFY_EMAIL_ERROR", error);
        return NextResponse.redirect(new URL("/auth/login?error=ServerError", req.url));
    }
}
