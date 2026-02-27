"use client"

import { useState, useRef, useEffect } from "react"
import { listings } from "@/lib/mock-data"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Heart,
    MessageCircle,
    Share2,
    ShoppingBag,
    Play,
    Pause,
    Volume2,
    VolumeX,
    User,
    ChevronDown,
    ChevronUp
} from "lucide-react"
import Link from "next/link"
import NextImage from "next/image"
import { useRouter } from "next/navigation"

export default function VideoFeedPage() {
    const router = useRouter()
    // We'll use listings that have images and simulate them as videos
    const videoListings = listings.slice(0, 5)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(true)
    const [isMuted, setIsMuted] = useState(true)

    const handleNext = () => {
        if (currentIndex < videoListings.length - 1) {
            setCurrentIndex(currentIndex + 1)
        }
    }

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1)
        }
    }

    const currentItem = videoListings[currentIndex]

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
            {/* Header / Nav */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20 bg-gradient-to-b from-black/60 to-transparent">
                <Link href="/" className="text-white font-bold text-xl font-heading">AfricaMarket <span className="text-teal-400">Labs</span></Link>
                <div className="flex gap-4">
                    <button className="text-white font-bold border-b-2 border-white pb-1">Pour vous</button>
                    <button className="text-white/60 font-bold hover:text-white transition-colors">Abonnements</button>
                </div>
                <button className="text-white bg-white/20 p-2 rounded-full backdrop-blur-md">
                    <Share2 className="w-5 h-5" />
                </button>
            </div>

            {/* Video Container */}
            <div className="relative w-full max-w-[450px] aspect-[9/16] bg-zinc-900 shadow-2xl overflow-hidden md:rounded-3xl border border-white/10">
                {/* Simulated Video (Image with Ken Burns effect) */}
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                    <NextImage
                        src={currentItem.images[0]}
                        alt={currentItem.title}
                        fill
                        className={`object-cover transition-transform duration-[10000ms] ease-linear ${isPlaying ? 'scale-125' : 'scale-100'}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60"></div>
                </div>

                {/* Interactions overlay */}
                <div className="absolute right-4 bottom-32 flex flex-col gap-6 items-center z-10">
                    <div className="flex flex-col items-center gap-1">
                        <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden bg-white mb-1 shadow-lg">
                            <NextImage src={currentItem.seller.avatar} alt={currentItem.seller.name} width={48} height={48} />
                        </div>
                        <div className="bg-red-500 text-white rounded-full p-0.5 -mt-4 shadow-md">
                            <span className="text-[10px] font-bold px-1">+</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                        <button className="bg-black/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-black/40 transition-all active:scale-90">
                            <Heart className="w-6 h-6 fill-white" />
                        </button>
                        <span className="text-white text-xs font-bold shadow-sm">1.2k</span>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                        <button className="bg-black/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-black/40 transition-all">
                            <MessageCircle className="w-6 h-6" />
                        </button>
                        <span className="text-white text-xs font-bold">48</span>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                        <button className="bg-black/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-black/40 transition-all">
                            <ShoppingBag className="w-6 h-6" />
                        </button>
                        <span className="text-white text-xs font-bold">Acheter</span>
                    </div>
                </div>

                {/* Content Overlay */}
                <div className="absolute left-0 right-16 bottom-0 p-6 z-10">
                    <h3 className="text-white font-bold text-lg mb-2 truncate">@{currentItem.seller.shopName || currentItem.seller.name.replace(/\s/g, '').toLowerCase()}</h3>
                    <p className="text-white/90 text-sm line-clamp-3 mb-4 leading-relaxed">
                        {currentItem.description}
                    </p>
                    <div className="flex items-center gap-2">
                        <div className="bg-white/20 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-2">
                            <ShoppingBag className="w-3 h-3 text-teal-400" />
                            <span className="text-white text-xs font-bold">{currentItem.price.toLocaleString()} FCFA</span>
                        </div>
                        <Link href={`/listings/${currentItem.id}`} className="bg-teal-600 text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-teal-500 transition-colors">
                            Voir le produit
                        </Link>
                    </div>
                </div>

                {/* Center Play/Pause indication */}
                {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10 pointer-events-none">
                        <Play className="w-20 h-20 text-white opacity-60 fill-white" />
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-20">
                    <button
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                        className={`p-2 rounded-full bg-white/10 backdrop-blur-md text-white transition-all ${currentIndex === 0 ? 'opacity-20' : 'hover:bg-white/30 active:scale-95'}`}
                    >
                        <ChevronUp className="w-6 h-6" />
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={currentIndex === videoListings.length - 1}
                        className={`p-2 rounded-full bg-white/10 backdrop-blur-md text-white transition-all ${currentIndex === videoListings.length - 1 ? 'opacity-20' : 'hover:bg-white/30 active:scale-95'}`}
                    >
                        <ChevronDown className="w-6 h-6" />
                    </button>
                </div>

                {/* Main click area for play/pause */}
                <div className="absolute inset-0 z-0" onClick={() => setIsPlaying(!isPlaying)}></div>
            </div>

            {/* Bottom Controls */}
            <div className="mt-8 flex gap-6 text-white/40">
                <button onClick={() => setIsMuted(!isMuted)}>
                    {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6 text-white" />}
                </button>
                <div className="w-px h-6 bg-white/10"></div>
                <button onClick={() => router.push("/")} className="hover:text-white transition-colors">Quitter</button>
            </div>

            <p className="absolute bottom-6 text-white/20 text-[10px] uppercase tracking-[0.2em]">Expérience immersive AfricaMarket</p>
        </div>
    )
}
