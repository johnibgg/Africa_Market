"use client"

import { useState, useRef, useEffect } from "react"
import {
    Heart,
    MessageCircle,
    Share2,
    ShoppingBag,
    Play,
    Pause,
    Volume2,
    VolumeX,
    ChevronLeft,
    Loader2,
    ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import NextImage from "next/image"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface VideoCardProps {
    listing: any
    isActive: boolean
}

function VideoCard({ listing, isActive }: VideoCardProps) {
    const [isPlaying, setIsPlaying] = useState(true)
    const [isMuted, setIsMuted] = useState(true)
    const [liked, setLiked] = useState(false)
    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        if (isActive) {
            setIsPlaying(true)
        } else {
            setIsPlaying(false)
        }
    }, [isActive])

    const togglePlay = () => setIsPlaying(!isPlaying)

    return (
        <div className="relative h-screen w-full snap-start bg-black flex items-center justify-center overflow-hidden">
            {/* Background / Video Layer */}
            <div className="absolute inset-0 z-0" onClick={togglePlay}>
                {listing.videoUrls && listing.videoUrls[0] ? (
                    <video
                        ref={videoRef}
                        src={listing.videoUrls[0]}
                        className="h-full w-full object-cover"
                        loop
                        muted={isMuted}
                        playsInline
                    />
                ) : (
                    <NextImage
                        src={listing.images[0]}
                        alt={listing.title}
                        fill
                        className={cn(
                            "object-cover transition-transform duration-[15000ms] ease-linear",
                            isPlaying && isActive ? "scale-125" : "scale-100"
                        )}
                    />
                )}
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80"></div>
            </div>

            {/* Interaction Sidebar */}
            <div className="absolute right-4 bottom-32 flex flex-col gap-6 items-center z-20">
                <Link href={`/boutique/${listing.seller.shopSlug || listing.seller.id}`} className="flex flex-col items-center gap-1">
                    <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden bg-white shadow-lg relative">
                        <NextImage src={listing.seller.image || "/logo.png"} alt={listing.seller.name} fill className="object-cover" />
                    </div>
                    <div className="bg-teal-500 text-white rounded-full w-5 h-5 flex items-center justify-center -mt-4 z-10 shadow-md">
                        <span className="text-xs font-bold">+</span>
                    </div>
                </Link>

                <div className="flex flex-col items-center gap-1">
                    <button 
                        onClick={() => setLiked(!liked)}
                        className={cn(
                            "bg-white/10 backdrop-blur-md p-3 rounded-full text-white transition-all active:scale-90",
                            liked && "text-red-500"
                        )}
                    >
                        <Heart className={cn("w-6 h-6", liked && "fill-current")} />
                    </button>
                    <span className="text-white text-xs font-bold shadow-sm">{listing.views + (liked ? 1 : 0)}</span>
                </div>

                <div className="flex flex-col items-center gap-1">
                    <button className="bg-white/10 backdrop-blur-md p-3 rounded-full text-white transition-all hover:bg-white/20">
                        <MessageCircle className="w-6 h-6" />
                    </button>
                    <span className="text-white text-xs font-bold">{listing.reviewCount || 0}</span>
                </div>

                <div className="flex flex-col items-center gap-1">
                    <button className="bg-white/10 backdrop-blur-md p-3 rounded-full text-white transition-all hover:bg-white/20">
                        <Share2 className="w-6 h-6" />
                    </button>
                    <span className="text-white text-xs font-bold">Partager</span>
                </div>
            </div>

            {/* Bottom Content Info */}
            <div className="absolute left-0 right-20 bottom-0 p-6 z-20 space-y-4">
                <div className="space-y-1">
                    <h3 className="text-white font-black text-xl flex items-center gap-2">
                        @{listing.seller.shopName || listing.seller.name.replace(/\s/g, '').toLowerCase()}
                        {listing.seller.isVerified && <div className="w-4 h-4 bg-teal-500 rounded-full flex items-center justify-center"><span className="text-[8px]">✓</span></div>}
                    </h3>
                    <p className="text-white/90 text-sm line-clamp-2 leading-relaxed max-w-md">
                        <span className="font-bold text-teal-400 mr-2">#{listing.category.nameFr}</span>
                        {listing.description}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-2 flex items-center gap-3">
                        <ShoppingBag className="w-4 h-4 text-teal-400" />
                        <span className="text-white font-black">{listing.price.toLocaleString()} FCFA</span>
                    </div>
                    <Link href={`/listings/${listing.id}`} className="bg-teal-600 hover:bg-teal-500 text-white px-6 py-2.5 rounded-2xl font-black text-sm flex items-center gap-2 transition-all shadow-lg shadow-teal-900/40">
                        Acheter maintenant <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            {/* Play/Pause Large Overlay */}
            {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10 pointer-events-none">
                    <div className="bg-white/20 backdrop-blur-md rounded-full p-8">
                        <Play className="w-16 h-16 text-white fill-white opacity-80" />
                    </div>
                </div>
            )}

            {/* Mute toggle button */}
            <button 
                onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
                className="absolute top-24 right-4 z-30 p-2 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/10"
            >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
        </div>
    )
}

export default function VideoFeedPage() {
    const router = useRouter()
    const [videoListings, setVideoListings] = useState<any[]>([])
    const [loadingVideos, setLoadingVideos] = useState(true)
    const [activeIndex, setActiveIndex] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        fetch("/api/listings?limit=20")
            .then(r => r.json())
            .then(data => setVideoListings(Array.isArray(data) ? data : []))
            .catch(() => {})
            .finally(() => setLoadingVideos(false))
    }, [])

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const handleScroll = () => {
            const index = Math.round(container.scrollTop / window.innerHeight)
            if (index !== activeIndex) {
                setActiveIndex(index)
            }
        }

        container.addEventListener("scroll", handleScroll)
        return () => container.removeEventListener("scroll", handleScroll)
    }, [activeIndex])

    if (loadingVideos) {
        return (
            <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-teal-400 animate-spin" />
                    <p className="text-teal-400 font-bold tracking-widest animate-pulse">AFRICAMARKET LABS</p>
                </div>
            </div>
        )
    }

    if (videoListings.length === 0) {
        return (
            <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center gap-6 p-6 text-center">
                <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center">
                    <Play className="w-8 h-8 text-teal-400 ml-1" />
                </div>
                <div className="space-y-2">
                    <p className="text-white text-xl font-black">Prêt pour l&apos;immersion ?</p>
                    <p className="text-zinc-500 text-sm max-w-xs">Nos créateurs préparent leurs meilleures vidéos. Revenez dans un instant !</p>
                </div>
                <Button variant="outline" className="border-teal-500 text-teal-500 hover:bg-teal-500/10 rounded-2xl px-8" onClick={() => router.push("/")}>
                    Retour à l&apos;accueil
                </Button>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 bg-black z-[100]">
            {/* Header Overlay */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-[110] bg-gradient-to-b from-black/80 via-black/40 to-transparent">
                <button 
                    onClick={() => router.push("/")}
                    className="text-white hover:text-teal-400 transition-colors flex items-center gap-2 group"
                >
                    <div className="bg-white/10 backdrop-blur-md p-2 rounded-full group-hover:bg-white/20 transition-all">
                        <ChevronLeft className="w-5 h-5" />
                    </div>
                    <span className="font-black text-lg tracking-tight">AfricaMarket <span className="text-teal-400">Labs</span></span>
                </button>
                
                <div className="flex gap-6">
                    <button className="text-white font-black text-sm border-b-2 border-teal-500 pb-1 tracking-wider">POUR VOUS</button>
                    <button className="text-white/40 font-black text-sm hover:text-white transition-colors tracking-wider">TENDANCES</button>
                </div>

                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                    <Volume2 className="w-4 h-4 text-white/60" />
                </div>
            </div>

            {/* Scroll Container */}
            <div 
                ref={containerRef}
                className="h-screen w-full overflow-y-scroll snap-y snap-mandatory hide-scrollbar"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {videoListings.map((listing, index) => (
                    <VideoCard 
                        key={listing.id} 
                        listing={listing} 
                        isActive={activeIndex === index} 
                    />
                ))}
            </div>

            {/* Bottom Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-[110]">
                <div 
                    className="h-full bg-teal-500 transition-all duration-300" 
                    style={{ width: `${((activeIndex + 1) / videoListings.length) * 100}%` }}
                />
            </div>
        </div>
    )
}
