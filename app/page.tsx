"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/home/hero-section"
import { CategoriesSection } from "@/components/home/categories-section"
import { FeaturedListings } from "@/components/home/featured-listings"
import { HowItWorks } from "@/components/home/how-it-works"
import { TestimonialsSection } from "@/components/home/testimonials-section"
import { SellCTA } from "@/components/home/sell-cta"
import { StatsSection } from "@/components/home/stats-section"
import { AdBanner } from "@/components/ads/ad-banner"
import {
  Play,
  Truck,
  ArrowRight,
  Smartphone,
  MapPin,
  ShieldCheck
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

function VideoDiscoverSection() {
  return (
    <section className="py-20 bg-teal-900 overflow-hidden relative">
      <div className="absolute top-0 right-0 -m-20 w-80 h-80 bg-teal-800 rounded-full blur-3xl opacity-50"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-white space-y-6">
            <Badge className="bg-teal-500 hover:bg-teal-400 text-white border-none py-1 px-4 text-sm">NOUVEAU</Badge>
            <h2 className="text-4xl md:text-5xl font-bold font-heading leading-tight">
              Découvrez vos produits en <span className="text-teal-400">vidéo immersive</span>
            </h2>
            <p className="text-teal-100 text-lg max-w-lg">
              Fini les photos ennuyeuses. Plongez dans notre flux vidéo interactif pour voir les articles en action, présentés par des vendeurs vérifiés.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button size="lg" className="bg-teal-500 hover:bg-teal-400 text-white border-none px-8 h-14 text-lg font-bold" asChild>
                <Link href="/videos">
                  <Play className="mr-3 h-6 w-6 fill-white" /> Lancer le Feed
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-teal-400 text-teal-400 hover:bg-teal-800 h-14" asChild>
                <Link href="/auth/verify">Devenir Créateur</Link>
              </Button>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-teal-500 rounded-3xl rotate-3 scale-95 opacity-20 blur-xl group-hover:rotate-6 transition-transform"></div>
            <div className="relative aspect-[9/16] max-w-[320px] mx-auto bg-zinc-900 rounded-[2.5rem] border-8 border-zinc-800 shadow-2xl overflow-hidden">
              <Image
                src="/placeholder.svg?height=1000&width=600"
                alt="Video Feed Preview"
                fill
                className="object-cover opacity-80"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                  <Play className="w-8 h-8 text-white fill-white translate-x-1" />
                </div>
              </div>
              <div className="absolute bottom-6 left-6 right-6 space-y-2">
                <div className="h-4 bg-white/20 rounded w-3/4"></div>
                <div className="h-4 bg-white/10 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

import { Badge } from "@/components/ui/badge"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <div className="container mx-auto px-4 mt-8">
          <AdBanner slot="home-top" />
        </div>

        <CategoriesSection />

        <VideoDiscoverSection />

        <FeaturedListings />
        <HowItWorks />
        <StatsSection />
        <TestimonialsSection />
        <SellCTA />
      </main>
      <Footer />
    </div>
  )
}
