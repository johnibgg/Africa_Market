"use client"

import * as React from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp } from "lucide-react"

export function ChartComponent() {
    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[{ name: 'A', val: 10 }, { name: 'B', val: 20 }]}>
                    <Bar dataKey="val" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
