"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { MessageCircle, X, Send, Sparkles, Loader2 } from "lucide-react"

type Msg = { role: "user" | "assistant"; content: string }
type Listing = {
  id: string
  title: string
  price: number
  currency: string
  location: string
  category?: { nameFr?: string }
}

const WELCOME: Msg = {
  role: "assistant",
  content:
    "Bonjour 👋 Je suis l'assistant AfricaMarket. Dis-moi ce que tu cherches (ex. « une table en bois à Cotonou »), ou pose-moi une question sur la commande, la livraison ou le paiement.",
}

export function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([WELCOME])
  const [listings, setListings] = useState<Listing[]>([])
  const [input, setInput] = useState("")
  const [busy, setBusy] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, listings, busy])

  async function send() {
    const text = input.trim()
    if (!text || busy) return
    const next = [...messages, { role: "user" as const, content: text }]
    setMessages(next)
    setInput("")
    setBusy(true)
    setListings([])
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: "chat", messages: next }),
      })
      const data = await res.json()
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: data.reply || data.error || "Désolé, je n'ai pas pu répondre.",
        },
      ])
      if (Array.isArray(data.listings)) setListings(data.listings)
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Connexion impossible. Réessaie dans un instant." },
      ])
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      {/* Bouton flottant */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Assistant IA"
          className="fixed bottom-20 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-teal-600 text-white shadow-lg shadow-teal-600/40 transition hover:bg-teal-700 md:bottom-6"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400">
            <Sparkles className="h-2.5 w-2.5 text-white" />
          </span>
        </button>
      )}

      {/* Panneau */}
      {open && (
        <div className="fixed bottom-20 right-4 z-50 flex h-[70vh] max-h-[560px] w-[92vw] max-w-[380px] flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl md:bottom-6">
          <div className="flex items-center justify-between bg-teal-600 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <div className="leading-tight">
                <div className="text-sm font-semibold">Assistant AfricaMarket</div>
                <div className="text-[11px] text-teal-100">Achat · Support · 24/7</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Fermer">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-gray-50 p-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${
                    m.role === "user"
                      ? "bg-teal-600 text-white"
                      : "bg-white text-gray-800 shadow-sm"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {/* Produits suggérés */}
            {listings.length > 0 && (
              <div className="space-y-2">
                {listings.slice(0, 4).map((l) => (
                  <Link
                    key={l.id}
                    href={`/listings/${l.id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-xl border border-teal-100 bg-white px-3 py-2 text-sm shadow-sm transition hover:border-teal-300"
                  >
                    <div className="min-w-0">
                      <div className="truncate font-medium text-gray-800">{l.title}</div>
                      <div className="text-[11px] text-gray-500">
                        {l.category?.nameFr || ""} · {l.location}
                      </div>
                    </div>
                    <div className="ml-2 shrink-0 font-semibold text-teal-700">
                      {Math.round(l.price)} {l.currency}
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {busy && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 text-sm text-gray-500 shadow-sm">
                  <Loader2 className="h-4 w-4 animate-spin" /> L'assistant réfléchit…
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 border-t border-black/10 bg-white p-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Écris ton message…"
              className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm outline-none focus:border-teal-500"
            />
            <button
              onClick={send}
              disabled={busy || !input.trim()}
              aria-label="Envoyer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-600 text-white transition hover:bg-teal-700 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
