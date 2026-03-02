"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ImagePlus, Video, X, FileVideo } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface MediaUploadProps {
    onChange: (files: { images: File[], videos: File[] }) => void
    maxImages?: number
    maxVideos?: number
}

export function MediaUpload({ onChange, maxImages = 5, maxVideos = 2 }: MediaUploadProps) {
    const [images, setImages] = useState<{ file: File, preview: string }[]>([])
    const [videos, setVideos] = useState<{ file: File, preview: string }[]>([])
    const imageInputRef = useRef<HTMLInputElement>(null)
    const videoInputRef = useRef<HTMLInputElement>(null)

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (images.length + files.length > maxImages) {
            alert(`Vous ne pouvez pas ajouter plus de ${maxImages} images.`)
            return
        }

        const newImages = files.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }))

        const updatedImages = [...images, ...newImages]
        setImages(updatedImages)
        onChange({ images: updatedImages.map(i => i.file), videos: videos.map(v => v.file) })
    }

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (videos.length + files.length > maxVideos) {
            alert(`Vous ne pouvez pas ajouter plus de ${maxVideos} vidéos.`)
            return
        }

        const newVideos = files.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }))

        const updatedVideos = [...videos, ...newVideos]
        setVideos(updatedVideos)
        onChange({ images: images.map(i => i.file), videos: updatedVideos.map(v => v.file) })
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
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Image Upload Area */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Photos ({images.length}/{maxImages})</label>
                    <div className="grid grid-cols-3 gap-2">
                        {images.map((img, index) => (
                            <div key={index} className="relative aspect-square rounded-lg overflow-hidden border bg-muted">
                                <Image
                                    src={img.preview}
                                    alt={`Preview ${index}`}
                                    fill
                                    className="object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                        {images.length < maxImages && (
                            <button
                                type="button"
                                onClick={() => imageInputRef.current?.click()}
                                className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center gap-1 hover:border-teal-500 hover:bg-teal-50/50 transition-all text-muted-foreground hover:text-teal-600"
                            >
                                <ImagePlus className="w-6 h-6" />
                                <span className="text-[10px] font-medium">Ajouter</span>
                            </button>
                        )}
                    </div>
                    <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageChange}
                    />
                </div>

                {/* Video Upload Area */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Vidéos ({videos.length}/{maxVideos})</label>
                    <div className="grid grid-cols-2 gap-2">
                        {videos.map((vid, index) => (
                            <div key={index} className="relative aspect-video rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
                                <FileVideo className="w-8 h-8 text-muted-foreground" />
                                <span className="absolute bottom-2 left-2 text-[10px] bg-black/50 text-white px-1.5 py-0.5 rounded truncate max-w-[80%]">
                                    {vid.file.name}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => removeVideo(index)}
                                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                        {videos.length < maxVideos && (
                            <button
                                type="button"
                                onClick={() => videoInputRef.current?.click()}
                                className="aspect-video rounded-lg border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center gap-1 hover:border-teal-500 hover:bg-teal-50/50 transition-all text-muted-foreground hover:text-teal-600"
                            >
                                <Video className="w-6 h-6" />
                                <span className="text-[10px] font-medium">Ajouter une vidéo</span>
                            </button>
                        )}
                    </div>
                    <input
                        ref={videoInputRef}
                        type="file"
                        accept="video/*"
                        multiple
                        className="hidden"
                        onChange={handleVideoChange}
                    />
                    <p className="text-[10px] text-muted-foreground">Vidéos courtes (max 30s) recommandées pour un affichage TikTok-style.</p>
                </div>
            </div>
        </div>
    )
}
