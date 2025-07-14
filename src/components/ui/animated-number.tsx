"use client"

import { motion, useSpring, useTransform } from "motion/react"
import { useEffect } from "react"

interface AnimatedNumberProps {
  value: number
  className?: string
  suffix?: string
}

export function AnimatedNumber({ value, className, suffix = "" }: AnimatedNumberProps) {
  const spring = useSpring(0, { stiffness: 100, damping: 30 })
  const display = useTransform(spring, (current) => Math.round(current * 10) / 10)

  useEffect(() => {
    spring.set(value)
  }, [spring, value])

  return (
    <motion.span className={className}>
      <motion.span>{display}</motion.span>
      {suffix}
    </motion.span>
  )
}
