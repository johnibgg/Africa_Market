"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronRight, ChevronLeft, Sparkles, Rocket, ShieldCheck, ShoppingBag, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const STEPS = [
  {
    title: "Bienvenue sur AfricaMarket",
    description: "La première marketplace panafricaine nouvelle génération. Découvrez comment booster vos ventes ou trouver les meilleures pépites.",
    icon: Sparkles,
    color: "bg-teal-500",
  },
  {
    title: "Immersion Totale",
    description: "Découvrez nos annonces en format vidéo TikTok-style. Une immersion totale pour mieux apprécier les produits avant d'acheter.",
    icon: Rocket,
    color: "bg-purple-500",
  },
  {
    title: "Sécurité Maximale",
    description: "Tous nos vendeurs sont vérifiés manuellement. Achetez en toute confiance avec notre système de protection.",
    icon: ShieldCheck,
    color: "bg-blue-500",
  },
  {
    title: "Vendez en un clic",
    description: "Passez en mode vendeur, publiez vos produits et gérez votre stock depuis un dashboard ultra-complet.",
    icon: Store,
    color: "bg-orange-500",
  },
]

export function InteractiveTutorial() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem("hasSeenTutorial")
    if (!hasSeenTutorial) {
      const timer = setTimeout(() => setIsOpen(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    localStorage.setItem("hasSeenTutorial", "true")
  }

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleClose()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const StepIcon = STEPS[currentStep].icon

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20"
          >
            <button 
              onClick={handleClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-all z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col h-full">
              {/* Top Visual Area */}
              <div className={cn("h-48 flex items-center justify-center transition-colors duration-500", STEPS[currentStep].color)}>
                <motion.div
                  key={currentStep}
                  initial={{ rotate: -20, scale: 0.5, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  className="w-24 h-24 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center shadow-2xl border border-white/30"
                >
                  <StepIcon className="w-12 h-12 text-white" />
                </motion.div>
              </div>

              {/* Content Area */}
              <div className="p-10 space-y-6">
                <div className="space-y-2">
                  <div className="flex gap-1.5 mb-4">
                    {STEPS.map((_, i) => (
                      <div 
                        key={i} 
                        className={cn(
                          "h-1.5 rounded-full transition-all duration-300",
                          i === currentStep ? "w-8 bg-teal-500" : "w-2 bg-slate-200"
                        )} 
                      />
                    ))}
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
                    {STEPS[currentStep].title}
                  </h2>
                  <p className="text-slate-500 text-lg font-medium leading-relaxed">
                    {STEPS[currentStep].description}
                  </p>
                </div>

                <div className="flex gap-4 pt-4">
                  {currentStep > 0 && (
                    <Button 
                      variant="ghost" 
                      onClick={prevStep}
                      className="h-14 rounded-2xl px-6 font-bold text-slate-400 hover:text-slate-600"
                    >
                      <ChevronLeft className="w-5 h-5 mr-1" /> Retour
                    </Button>
                  )}
                  <Button 
                    onClick={nextStep}
                    className="flex-1 h-14 rounded-2xl bg-teal-600 hover:bg-teal-700 font-black text-lg text-white shadow-lg shadow-teal-900/20"
                  >
                    {currentStep === STEPS.length - 1 ? "C'est parti !" : "Suivant"}
                    {currentStep < STEPS.length - 1 && <ChevronRight className="w-5 h-5 ml-2" />}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
