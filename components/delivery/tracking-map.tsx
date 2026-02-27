"use client"

import { useEffect, useState } from "react"
import { MapPin, Navigation, Truck, User } from "lucide-react"

interface Point {
    lat: number
    lng: number
}

interface TrackingMapProps {
    delivererPosition: Point
    trajectory: Point[]
    pickupPoint: Point
    deliveryPoint: Point
    isAnimating?: boolean
}

export default function TrackingMap({
    delivererPosition,
    trajectory,
    pickupPoint,
    deliveryPoint,
    isAnimating = true
}: TrackingMapProps) {
    const [animatedPos, setAnimatedPos] = useState(delivererPosition)
    const [progress, setProgress] = useState(0)

    // Simulate real-time movement if animating
    useEffect(() => {
        if (!isAnimating || trajectory.length === 0) return

        const interval = setInterval(() => {
            setProgress((prev) => {
                const next = (prev + 1) % trajectory.length
                setAnimatedPos(trajectory[next])
                return next
            })
        }, 2000)

        return () => clearInterval(interval)
    }, [isAnimating, trajectory])

    // Visualization factors (simulated map scale)
    const scale = 100
    const offsetX = 50
    const offsetY = 50

    const toCoord = (p: Point) => ({
        x: (p.lng - delivererPosition.lng) * scale + offsetX,
        y: (delivererPosition.lat - p.lat) * scale + offsetY
    })

    const pickup = toCoord(pickupPoint)
    const delivery = toCoord(deliveryPoint)
    const deliverer = toCoord(animatedPos)

    return (
        <div className="relative w-full aspect-video bg-slate-100 rounded-2xl overflow-hidden border-2 border-slate-200">
            {/* Grid Background */}
            <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)',
                backgroundSize: '20px 20px'
            }}></div>

            {/* Simulated Road Path */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <polyline
                    points={trajectory.map(p => `${toCoord(p).x}%,${toCoord(p).y}%`).join(' ')}
                    fill="none"
                    stroke="#cbd5e1"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-50"
                />
                <polyline
                    points={trajectory.slice(0, progress + 1).map(p => `${toCoord(p).x}%,${toCoord(p).y}%`).join(' ')}
                    fill="none"
                    stroke="#0d9488"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>

            {/* Pickup Point */}
            <div
                className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-500"
                style={{ left: `${pickup.x}%`, top: `${pickup.y}%` }}
            >
                <div className="bg-orange-500 p-1.5 rounded-full shadow-lg border-2 border-white">
                    <User className="w-3 h-3 text-white" />
                </div>
                <div className="absolute top-10 whitespace-nowrap bg-white px-2 py-0.5 rounded text-[10px] font-bold shadow shadow-orange-200">BOUTIQUE</div>
            </div>

            {/* Delivery Point */}
            <div
                className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-500"
                style={{ left: `${delivery.x}%`, top: `${delivery.y}%` }}
            >
                <div className="bg-teal-600 p-1.5 rounded-full shadow-lg border-2 border-white animate-pulse">
                    <MapPin className="w-3 h-3 text-white" />
                </div>
                <div className="absolute top-10 whitespace-nowrap bg-white px-2 py-0.5 rounded text-[10px] font-bold shadow shadow-teal-200">VOUS</div>
            </div>

            {/* Deliverer (Moving) */}
            <div
                className="absolute w-10 h-10 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-500 ease-linear"
                style={{ left: `${deliverer.x}%`, top: `${deliverer.y}%` }}
            >
                <div className="relative">
                    <div className="bg-teal-500 p-2 rounded-full shadow-xl shadow-teal-500/40 border-2 border-white">
                        <Truck className="w-4 h-4 text-white" />
                    </div>
                    {/* Direction arrow */}
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 bg-white rounded-full p-0.5 shadow">
                        <Navigation className="w-2 h-2 text-teal-600 rotate-45" />
                    </div>
                </div>
            </div>

            {/* Deliverer Stats overlay */}
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-xl border border-white shadow-xl flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                        <Truck className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-teal-900 leading-none">Serge Adandedjan</p>
                        <p className="text-[10px] text-teal-600 mt-1 uppercase tracking-wider font-bold">En transit</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xs font-bold text-slate-900 leading-none">~12 min</p>
                    <p className="text-[10px] text-slate-500 mt-1">À 3.2 km de vous</p>
                </div>
            </div>
        </div>
    )
}
