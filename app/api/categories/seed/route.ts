import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

const BASE_CATEGORIES = [
    { name: "Electronics", nameFr: "Électronique", slug: "electronique", icon: "Smartphone" },
    { name: "Clothing", nameFr: "Vêtements & Mode", slug: "vetements", icon: "Shirt" },
    { name: "Home & Living", nameFr: "Maison & Décor", slug: "maison", icon: "Home" },
    { name: "Food & Drinks", nameFr: "Alimentation", slug: "alimentation", icon: "UtensilsCrossed" },
    { name: "Beauty", nameFr: "Beauté & Soins", slug: "beaute", icon: "Sparkles" },
    { name: "Services", nameFr: "Services", slug: "services", icon: "Wrench" },
    { name: "Automotive", nameFr: "Automobile", slug: "automobile", icon: "Car" },
    { name: "Agriculture", nameFr: "Agriculture", slug: "agriculture", icon: "Leaf" },
    { name: "Education", nameFr: "Éducation", slug: "education", icon: "GraduationCap" },
    { name: "Real Estate", nameFr: "Immobilier", slug: "immobilier", icon: "Building2" },
    { name: "Health", nameFr: "Santé & Bien-être", slug: "sante", icon: "Heart" },
    { name: "Construction", nameFr: "Construction & BTP", slug: "construction", icon: "Hammer" },
]

export async function POST() {
    try {
        const results = await Promise.all(
            BASE_CATEGORIES.map((cat) =>
                prisma.category.upsert({
                    where: { slug: cat.slug },
                    update: { nameFr: cat.nameFr, icon: cat.icon, isApproved: true },
                    create: { ...cat, isApproved: true },
                })
            )
        )
        return NextResponse.json({ message: `${results.length} catégories créées/mises à jour.`, categories: results })
    } catch (error) {
        console.error("SEED_CATEGORIES_ERROR", error)
        return NextResponse.json({ message: "Erreur lors du seeding" }, { status: 500 })
    }
}

export async function GET() {
    // Allow GET too for easy browser testing
    return POST()
}
