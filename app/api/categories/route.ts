import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { nameFr: "asc" }
        })
        return NextResponse.json(categories)
    } catch (error) {
        console.error("CATEGORIES_GET_ERROR", error)
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
    }
}
