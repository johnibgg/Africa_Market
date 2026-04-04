"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { ImagePlus, Video, X, FileVideo, Upload, CheckCircle2, Loader2 } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"

interface MediaUploadProps {
    onChange: (files: { images: File[], videos: File[] }) => void
    maxImages?: number
    maxVideos?: number
}

export function MediaUpload({ onChange, maxImages = 5, maxVideos = 2 }: MediaUploadProps) {
    const [images, setImages] = useState<{ file: File, preview: string, progress: number, status: 'idle' | 'uploading' | 'success' }[]>([])
    const [videos, setVideos] = useState<{ file: File, preview: string, progress: number, status: 'idle' | 'uploading' | 'success' }[]>([])
    const [isDragging, setIsDragging] = useState(false)
    
    const imageInputRef = useRef<HTMLInputElement>(null)
    const videoInputRef = useRef<HTMLInputElement>(null)

    const simulateUpload = (type: 'image' | 'video', index: number) => {
        let progress = 0
        const interval = setInterval(() => {
            progress += Math.random() * 30
            if (progress >= 100) {
                progress = 100
                clearInterval(interval)
                if (type === 'image') {
                    setImages(prev => prev.map((img, i) => i === index ? { ...img, progress: 100, status: 'success' } : img))
                } else {
                    setVideos(prev => prev.map((vid, i) => i === index ? { ...vid, progress: 100, status: 'success' } : vid))
                }
            } else {
                if (type === 'image') {
                    setImages(prev => prev.map((img, i) => i === index ? { ...img, progress } : img))
                } else {
                    setVideos(prev => prev.map((vid, i) => i === index ? { ...vid, progress } : vid))
                }
            }
        }, 300)
    }

    const handleFiles = useCallback((files: File[]) => {
        const imageFiles = files.filter(f => f.type.startsWith('image/'))
        const videoFiles = files.filter(f => f.type.startsWith('video/'))

        if (images.length + imageFiles.length > maxImages) {
            alert(`Maximum ${maxImages} images autorisées.`)
            return
        }
        if (videos.length + videoFiles.length > maxVideos) {
            alert(`Maximum ${maxVideos} vidéos autorisées.`)
            return
        }

        const newImages = imageFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file),
            progress: 0,
            status: 'uploading' as const
        }))

        const newVideos = videoFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file),
            progress: 0,
            status: 'uploading' as const
        }))

        const updatedImages = [...images, ...newImages]
        const updatedVideos = [...videos, ...newVideos]

        setImages(updatedImages)
        setVideos(updatedVideos)
        
        onChange({ 
            images: updatedImages.map(i => i.file), 
            videos: updatedVideos.map(v => v.file) 
        })

        // Simulate upload for each new file
        newImages.forEach((_, i) => simulateUpload('image', images.length + i))
        newVideos.forEach((_, i) => simulateUpload('video', videos.length + i))
    }, [images, videos, maxImages, maxVideos, onChange])

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const onDragLeave = () => {
        setIsDragging(false)
    }

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const files = Array.from(e.dataTransfer.files)
        handleFiles(files)
    }

    const removeImage = (index: number) => {
        const updatedImages = images.filter((_, i) => i !== index)
        setImages(updatedImages)
        onChange({ images: updatedImages.map(i => i.file), videos: videos.map(v => v.file) })
    }

    const removeVideo = (index: number) => {
        const updatedVideos = videos.filter((_, i) => i !== index)
        setVideos(updatedVideos)
        onChange({ images: images.map(i => i.file), videos: updatedVideos.map(v => v.file) })
    }

    return (
        <div className="space-y-6">
            {/* Drag & Drop Zone */}
            <div
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                className={cn(
                    "relative border-2 border-dashed rounded-3xl p-10 transition-all flex flex-col items-center justify-center gap-4 text-center cursor-pointer",
                    isDragging ? "border-teal-500 bg-teal-50/50 scale-[0.99]" : "border-slate-200 bg-slate-50/30 hover:bg-slate-50 hover:border-teal-300",
                    (images.length >= maxImages && videos.length >= maxVideos) && "opacity-50 pointer-events-none"
                )}
                onClick={() => imageInputRef.current?.click()}
            >
                <div className="w-16 h-16 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center shadow-inner">
                    <Upload className="w-8 h-8" />
                </div>
                <div>
                    <p className="text-lg font-bold text-slate-900">Glissez-déposez vos fichiers</p>
                    <p className="text-sm text-slate-500">Ou cliquez pour parcourir vos dossiers</p>
                </div>
                <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span>{maxImages} PHOTOS MAX</span>
                    <span className="w-1 h-1 rounded-full bg-slate-200 mt-1.5" />
                    <span>{maxVideos} VIDÉOS MAX</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Images Preview Area */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-bold text-slate-700">Photos ({images.length}/{maxImages})</label>
                        {images.length < maxImages && (
                            <button 
                                type="button" 
                                onClick={() => imageInputRef.current?.click()}
                                className="text-xs font-bold text-teal-600 hover:underline"
                            >
                                Ajouter plus
                            </button>
                        )}
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        {images.map((img, index) => (
                            <div key={index} className="relative aspect-square rounded-2xl overflow-hidden border bg-white shadow-sm group">
                                <Image
                                    src={img.preview}
                                    alt={`Preview ${index}`}
                                    fill
                                    className="object-cover"
                                />
                                
                                {img.status === 'uploading' && (
                                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center p-2">
                                        <Loader2 className="w-5 h-5 text-white animate-spin mb-2" />
                                        <Progress value={img.progress} className="h-1 bg-white/20" />
                                    </div>
                                )}

                                {img.status === 'success' && (
                                    <div className="absolute top-1 left-1 bg-teal-500 text-white rounded-full p-0.5 shadow-lg">
                                        <CheckCircle2 className="w-3 h-3" />
                                    </div>
                                )}

                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                                    className="absolute top-1 right-1 bg-white/90 text-slate-900 rounded-full p-1 hover:bg-red-500 hover:text-white transition-all shadow-md"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Videos Preview Area */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-bold text-slate-700">Vidéos ({videos.length}/{maxVideos})</label>
                        {videos.length < maxVideos && (
                            <button 
                                type="button" 
                                onClick={() => videoInputRef.current?.click()}
                                className="text-xs font-bold text-teal-600 hover:underline"
                            >
                                Ajouter une vidéo
                            </button>
                        )}
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                        {videos.map((vid, index) => (
                            <div key={index} className="relative p-3 rounded-2xl border bg-white shadow-sm flex items-center gap-4 group">
                                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                                    <FileVideo className="w-6 h-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold truncate">{vid.file.name}</p>
                                    {vid.status === 'uploading' ? (
                                        <div className="mt-1 space-y-1">
                                            <Progress value={vid.progress} className="h-1" />
                                            <p className="text-[10px] text-slate-400 font-medium">Téléchargement... {Math.round(vid.progress)}%</p>
                                        </div>
                                    ) : (
                                        <p className="text-[10px] text-teal-600 font-bold flex items-center gap-1">
                                            <CheckCircle2 className="w-3 h-3" /> Prêt à être publié
                                        </p>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); removeVideo(index); }}
                                    className="bg-slate-50 text-slate-400 rounded-full p-1.5 hover:bg-red-50 hover:text-red-500 transition-all"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(Array.from(e.target.files || []))}
            />
            <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(Array.from(e.target.files || []))}
            />
        </div>
    )
}
