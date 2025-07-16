import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressRingProps {
  value: number
  max: number
  size?: number
  strokeWidth?: number
  className?: string
  children?: React.ReactNode
}

export function ProgressRing({ 
  value, 
  max, 
  size = 120, 
  strokeWidth = 8,
  className,
  children 
}: ProgressRingProps) {
  const percentage = (value / max) * 100
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  // Determine color based on percentage
  const getStatusColor = () => {
    if (percentage >= 80) return "stroke-success"
    if (percentage >= 50) return "stroke-warning" 
    return "stroke-destructive"
  }

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-muted opacity-20"
        />
        
        {/* Progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={cn(
            "transition-all duration-1000 ease-out",
            getStatusColor()
          )}
        />
      </svg>
      
      {/* Content in center */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  )
}