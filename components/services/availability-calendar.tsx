"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { fr } from "date-fns/locale"
import { format } from "date-fns"
import { Clock, Plus, Trash2 } from "lucide-react"

interface TimeSlot {
    id: string
    start: string
    end: string
}

export function AvailabilityCalendar() {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
    const [slots, setSlots] = useState<Record<string, TimeSlot[]>>({
        [format(new Date(), "yyyy-MM-dd")]: [
            { id: "1", start: "08:00", end: "12:00" },
            { id: "2", start: "14:00", end: "18:00" },
        ],
    })

    const dateKey = selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""
    const currentSlots = slots[dateKey] || []

    const addSlot = () => {
        if (!dateKey) return
        const newSlot: TimeSlot = {
            id: Math.random().toString(36).substr(2, 9),
            start: "09:00",
            end: "17:00",
        }
        setSlots((prev) => ({
            ...prev,
            [dateKey]: [...(prev[dateKey] || []), newSlot],
        }))
    }

    const removeSlot = (id: string) => {
        setSlots((prev) => ({
            ...prev,
            [dateKey]: prev[dateKey].filter((s) => s.id !== id),
        }))
    }

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Calendrier</CardTitle>
                    <CardDescription>Sélectionnez une date pour définir vos disponibilités.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        locale={fr}
                        className="rounded-md border shadow-sm"
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div>
                        <CardTitle>Créneaux horaires</CardTitle>
                        <CardDescription>
                            {selectedDate ? format(selectedDate, "eeee d MMMM", { locale: fr }) : "Sélectionnez une date"}
                        </CardDescription>
                    </div>
                    <Button size="sm" variant="outline" onClick={addSlot} disabled={!selectedDate}>
                        <Plus className="h-4 w-4 mr-1" /> Ajouter
                    </Button>
                </CardHeader>
                <CardContent>
                    {currentSlots.length > 0 ? (
                        <div className="space-y-3">
                            {currentSlots.map((slot) => (
                                <div key={slot.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                                    <div className="flex items-center gap-3">
                                        <Clock className="h-4 w-4 text-teal-600" />
                                        <span className="text-sm font-medium">
                                            {slot.start} - {slot.end}
                                        </span>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeSlot(slot.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed rounded-lg">
                            <Clock className="h-8 w-8 text-muted-foreground/30 mb-2" />
                            <p className="text-sm text-muted-foreground">Aucun créneau défini pour cette date.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
