"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MessageSquare, Mail, Phone, HelpCircle, ChevronRight, Send, Search, LifeBuoy, ShieldCheck, Clock, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import Link from "next/link"

const FAQS = [
  {
    q: "Comment devenir vendeur vérifié ?",
    a: "Rendez-vous dans votre dashboard, section 'Vérification'. Téléchargez une pièce d'identité valide. Notre équipe traitera votre demande sous 24h à 48h.",
  },
  {
    q: "Quels sont les frais de vente ?",
    a: "L'inscription et la publication d'annonces sont gratuites. Nous prélevons une commission de 5% uniquement sur les ventes réussies pour assurer le fonctionnement de la plateforme.",
  },
  {
    q: "Comment fonctionne la livraison ?",
    a: "Nous disposons de livreurs partenaires certifiés. Vous pouvez suivre votre colis en temps réel depuis votre dashboard acheteur dès que le vendeur expédie la commande.",
  },
  {
    q: "Mon paiement est-il sécurisé ?",
    a: "Oui, nous utilisons un système de séquestre. L'argent n'est versé au vendeur que lorsque vous confirmez la réception conforme du produit.",
  },
]

export default function SupportPage() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ name: "", email: "", message: "", subject: "Aide générale" })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      toast.success("Votre message a été envoyé ! Notre équipe vous répondra par email sous peu.")
      setFormData({ name: "", email: "", message: "", subject: "Aide générale" })
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* Hero Section */}
      <div className="bg-teal-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-teal-400 text-xs font-black uppercase tracking-widest"
          >
            <LifeBuoy className="w-4 h-4" /> Centre d&apos;assistance
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black tracking-tight leading-none"
          >
            Comment pouvons-nous <br /> <span className="text-teal-400 underline decoration-white/20 decoration-dashed">vous aider ?</span>
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative max-w-2xl mx-auto"
          >
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Rechercher une solution (ex: livraison, paiement...)"
              className="w-full h-16 pl-14 pr-6 rounded-[2rem] bg-white text-slate-900 font-medium shadow-2xl focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all border-none"
            />
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Methods */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="border-none shadow-xl rounded-[2rem] bg-white overflow-hidden group">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-100 flex items-center justify-center text-teal-600 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900">Chat en direct</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Réponse en 5 min</p>
                </div>
              </div>
              <Button className="w-full h-12 rounded-xl bg-teal-600 hover:bg-teal-700 font-bold text-white shadow-lg shadow-teal-900/20">
                Démarrer le chat
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl rounded-[2rem] bg-white overflow-hidden group">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900">Email Support</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Réponse sous 24h</p>
                </div>
              </div>
              <p className="text-sm text-slate-500 font-medium">support@africamarket.com</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl rounded-[2rem] bg-white overflow-hidden group">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900">Appel direct</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Lun-Ven, 8h-18h</p>
                </div>
              </div>
              <p className="text-sm text-slate-500 font-bold">+229 90 00 00 00</p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form & FAQs */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-xl rounded-[2.5rem] bg-white p-8 md:p-12">
            <div className="max-w-xl">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Envoyez-nous un message</h2>
              <p className="text-slate-500 font-medium mb-8">Une question précise ? Nos experts vous répondent directement.</p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-black text-slate-700 uppercase tracking-widest">Nom complet</label>
                    <Input 
                      required
                      placeholder="Jean Dupont"
                      className="h-14 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500/20 font-medium"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black text-slate-700 uppercase tracking-widest">Email</label>
                    <Input 
                      required
                      type="email"
                      placeholder="jean@example.com"
                      className="h-14 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500/20 font-medium"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-700 uppercase tracking-widest">Sujet</label>
                  <select 
                    className="w-full h-14 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500/20 font-medium px-4 appearance-none"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  >
                    <option>Aide générale</option>
                    <option>Problème de paiement</option>
                    <option>Livraison en retard</option>
                    <option>Devenir vendeur</option>
                    <option>Signaler un abus</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-700 uppercase tracking-widest">Message</label>
                  <Textarea 
                    required
                    rows={5}
                    placeholder="Comment pouvons-nous vous aider ?"
                    className="rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500/20 font-medium p-4"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-14 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-lg shadow-xl shadow-teal-900/20 transition-all active:scale-[0.98]"
                >
                  {loading ? "Envoi en cours..." : "Envoyer ma demande"}
                  <Send className="w-5 h-5 ml-2" />
                </Button>
              </form>
            </div>
          </Card>

          <div className="space-y-6">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3 px-4">
              <HelpCircle className="w-6 h-6 text-teal-600" /> Questions fréquentes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
              {FAQS.map((faq, i) => (
                <Card key={i} className="border-none shadow-sm rounded-3xl bg-white hover:shadow-md transition-all cursor-pointer group">
                  <CardContent className="p-6">
                    <h4 className="font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">{faq.q}</h4>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center pt-4">
              <Link href="/faq" className="text-teal-600 font-black text-sm hover:underline flex items-center justify-center gap-1">
                Consulter toute la FAQ <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="max-w-7xl mx-auto px-4 mt-20">
        <div className="bg-slate-900 rounded-[3rem] p-12 flex flex-col md:flex-row items-center justify-around gap-8 text-center md:text-left">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-500/20 flex items-center justify-center text-teal-400">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <p className="text-white font-black">Sécurité totale</p>
              <p className="text-slate-400 text-sm">Protection des données</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400">
              <Clock className="w-8 h-8" />
            </div>
            <div>
              <p className="text-white font-black">Support 24/7</p>
              <p className="text-slate-400 text-sm">Toujours là pour vous</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-500/20 flex items-center justify-center text-orange-400">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div>
              <p className="text-white font-black">Satisfait ou remboursé</p>
              <p className="text-slate-400 text-sm">Garantie AfricaMarket</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
