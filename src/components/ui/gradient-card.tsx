import React from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"

interface GradientCardProps {
  children: React.ReactNode
  className?: string
  gradient?: "blue" | "purple" | "green" | "orange" | "pink"
  hover?: boolean
}

export function GradientCard({ children, className, gradient = "blue", hover = true }: GradientCardProps) {
  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-xl border border-gray-800 bg-primary-foreground",
        hover && "transition-all duration-300 hover:shadow-lg hover:border-gray-700",
        className,
      )}
      whileHover={hover ? { y: -1 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 to-transparent" />
      <div className="relative">{children}</div>
    </motion.div>
  )
}
