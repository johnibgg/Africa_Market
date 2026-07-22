// AfricaMarket — IA (Groq). Un seul endpoint, plusieurs usages :
//   task="chat"     → assistant d'achat + support (répond, recommande de VRAIS produits)
//   task="listing"  → assistant vendeur (génère titre + description + prix conseillé)
//   task="moderate" → modération / anti-arnaque (analyse une annonce, renvoie un risque)
// La clé Groq reste côté serveur (GROQ_API_KEY). Jamais dans le client.
import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export const runtime = "nodejs"

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
const MODEL = "llama-3.3-70b-versatile"

async function groq(messages: any[], jsonMode = false) {
  const key = process.env.GROQ_API_KEY
  if (!key) throw new Error("config")
  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.3,
      ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
      messages,
    }),
  })
  if (!res.ok) throw new Error("groq " + res.status)
  const data = await res.json()
  return data?.choices?.[0]?.message?.content ?? ""
}

// Extrait quelques mots-clés utiles de la question pour chercher en base.
function keywords(q: string): string[] {
  const stop = new Set([
    "le","la","les","un","une","des","de","du","je","tu","il","on","cherche","besoin",
    "veux","voudrais","trouver","acheter","pour","avec","sur","dans","et","ou","à","a",
    "au","aux","mon","ma","mes","est","que","qui","quoi","comment","bonjour","salut","svp",
  ])
  return Array.from(
    new Set(
      (q.toLowerCase().match(/[a-zàâäéèêëïîôöùûüç0-9]{3,}/gi) || [])
        .filter((w) => !stop.has(w))
    )
  ).slice(0, 6)
}

// Recherche de vraies annonces correspondant à la demande (pour l'assistant d'achat).
async function findListings(query: string) {
  const kw = keywords(query)
  if (!kw.length) return []
  try {
    const rows = await prisma.listing.findMany({
      where: {
        status: "active",
        OR: kw.flatMap((k) => [
          { title: { contains: k, mode: "insensitive" as const } },
          { description: { contains: k, mode: "insensitive" as const } },
          { location: { contains: k, mode: "insensitive" as const } },
          { category: { nameFr: { contains: k, mode: "insensitive" as const } } },
        ]),
      },
      select: {
        id: true,
        title: true,
        price: true,
        currency: true,
        location: true,
        rating: true,
        category: { select: { nameFr: true } },
      },
      orderBy: [{ isPromoted: "desc" }, { rating: "desc" }, { views: "desc" }],
      take: 8,
    })
    return rows
  } catch {
    return []
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const task = String(body.task || "chat")

    // ---------- Assistant d'achat + support ----------
    if (task === "chat") {
      const messages = Array.isArray(body.messages) ? body.messages.slice(-8) : []
      const lastUser =
        [...messages].reverse().find((m: any) => m.role === "user")?.content || ""
      const listings = await findListings(String(lastUser))

      const catalogue = listings.length
        ? "Produits AfricaMarket correspondants (recommande ceux-ci en priorité, avec leur lien /listings/ID) :\n" +
          listings
            .map(
              (l) =>
                `- [${l.title}] ${Math.round(l.price)} ${l.currency} · ${
                  l.category?.nameFr || ""
                } · ${l.location} · note ${l.rating}/5 · lien: /listings/${l.id}`
            )
            .join("\n")
        : "Aucun produit exact trouvé en base pour cette demande."

      const sys =
        "Tu es l'assistant d'AfricaMarket, une marketplace au Bénin (produits, services, " +
        "artisanat, livraison locale). Tu aides les ACHETEURS à trouver des produits et tu " +
        "réponds au SUPPORT (commande, livraison, paiement, vérification vendeur, litiges). " +
        "Sois chaleureux, bref et concret, en français. Quand tu recommandes un produit de la " +
        "liste fournie, cite son titre et donne son lien /listings/ID. Ne promets rien de faux ; " +
        "si tu ne sais pas, propose de contacter le vendeur via la messagerie du site. " +
        "Monnaie : FCFA.\n\n" +
        catalogue

      const text = await groq([{ role: "system", content: sys }, ...messages])
      return NextResponse.json({ reply: text, listings })
    }

    // ---------- Assistant vendeur : génère une annonce ----------
    if (task === "listing") {
      const brief = String(body.brief || "").slice(0, 800)
      const category = String(body.category || "")
      if (!brief) return NextResponse.json({ error: "brief requis" }, { status: 400 })
      const sys =
        "Tu es l'assistant VENDEUR d'AfricaMarket (Bénin). À partir d'une description courte, " +
        "génère une annonce vendeuse et honnête. Prix en FCFA, réaliste pour le marché béninois. " +
        'Réponds STRICTEMENT en JSON : {"title": string (max 70 car.), "description": string ' +
        '(3-5 phrases, avantages concrets), "suggested_price_fcfa": number, "tips": string ' +
        "(1 conseil court pour mieux vendre)}."
      const user = `Catégorie : ${category || "non précisée"}. Produit/service : ${brief}`
      const raw = await groq(
        [
          { role: "system", content: sys },
          { role: "user", content: user },
        ],
        true
      )
      let p: any = {}
      try {
        p = JSON.parse(raw)
      } catch {
        p = {}
      }
      return NextResponse.json({
        title: String(p.title || "").slice(0, 90),
        description: String(p.description || ""),
        suggestedPrice: Number(p.suggested_price_fcfa) || null,
        tips: String(p.tips || ""),
      })
    }

    // ---------- Modération / anti-arnaque ----------
    if (task === "moderate") {
      const title = String(body.title || "")
      const description = String(body.description || "")
      const price = Number(body.price) || 0
      const sys =
        "Tu es le MODÉRATEUR d'AfricaMarket. Analyse une annonce et détecte : contenu interdit " +
        "(armes, drogue, contrefaçon, arnaque, contenu adulte), prix aberrant, ou signaux " +
        "d'escroquerie (paiement à l'avance hors plateforme, urgence suspecte, coordonnées " +
        'douteuses). Réponds STRICTEMENT en JSON : {"risk": "low"|"medium"|"high", ' +
        '"allowed": boolean, "reasons": string[] (courtes, en français), ' +
        '"suggestion": string (conseil au vendeur si à corriger)}.'
      const user = `Titre: ${title}\nPrix: ${price} FCFA\nDescription: ${description}`
      const raw = await groq(
        [
          { role: "system", content: sys },
          { role: "user", content: user },
        ],
        true
      )
      let p: any = {}
      try {
        p = JSON.parse(raw)
      } catch {
        p = { risk: "low", allowed: true, reasons: [], suggestion: "" }
      }
      return NextResponse.json({
        risk: p.risk || "low",
        allowed: p.allowed !== false,
        reasons: Array.isArray(p.reasons) ? p.reasons : [],
        suggestion: String(p.suggestion || ""),
      })
    }

    return NextResponse.json({ error: "task inconnue" }, { status: 400 })
  } catch (e: any) {
    const msg = e?.message === "config" ? "IA non configurée (GROQ_API_KEY manquante)." : "Erreur IA."
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
