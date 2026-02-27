"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Send } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { cn } from "@/lib/utils"
import type { Listing } from "@/lib/types"

interface QuoteRequestDialogProps {
    listing: Listing
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function QuoteRequestDialog({ listing, open, onOpenChange }: QuoteRequestDialogProps) {
    const [date, setDate] = useState<Date>()
    const [description, setDescription] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false)
            onOpenChange(false)
            // Reset form
            setDate(undefined)
            setDescription("")
        }, 1500)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Demander un devis</DialogTitle>
                        <DialogDescription>
                            Envoyez une demande détaillée à <strong>{listing.seller.name}</strong> pour <strong>{listing.title}</strong>.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="service-date">Date souhaitée</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, "PPP", { locale: fr }) : <span>Choisir une date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        initialFocus
                                        locale={fr}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Détails de votre besoin</Label>
                            <Textarea
                                id="description"
                                placeholder="Décrivez précisément ce que vous attendez (lieu, durée, contraintes...)"
                                className="min-h-[120px]"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </div>

                        <div className="rounded-lg bg-teal-50 p-3 text-xs text-teal-800 border border-teal-100 italic">
                            Le prestataire vous répondra avec un prix précis et ses disponibilités via la messagerie.
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            className="bg-teal-600 hover:bg-teal-700"
                            disabled={isSubmitting || !description || !date}
                        >
                            {isSubmitting ? (
                                "Envoi en cours..."
                            ) : (
                                <>
                                    <Send className="mr-2 h-4 w-4" />
                                    Envoyer ma demande
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
