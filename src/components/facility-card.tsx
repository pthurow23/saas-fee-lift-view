import { Card, CardContent } from "@/components/ui/card"
import { ProgressRing } from "@/components/ui/progress-ring"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface FacilityCardProps {
  title: string
  open: number
  total: number
  icon: React.ReactNode
  description?: string
  className?: string
}

export function FacilityCard({ 
  title, 
  open, 
  total, 
  icon, 
  description,
  className 
}: FacilityCardProps) {
  const percentage = (open / total) * 100
  
  const getStatusBadge = () => {
    if (percentage >= 80) {
      return <Badge className="bg-success text-success-foreground">Excellent</Badge>
    }
    if (percentage >= 50) {
      return <Badge className="bg-warning text-warning-foreground">Good</Badge>
    }
    return <Badge variant="destructive">Limited</Badge>
  }

  return (
    <Card className={cn(
      "relative overflow-hidden transition-smooth hover:shadow-alpine hover:-translate-y-1",
      "bg-gradient-snow border-border/50",
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-primary text-2xl">
              {icon}
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground">{title}</h3>
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>
          </div>
          {getStatusBadge()}
        </div>
        
        <div className="flex items-center justify-between">
          <ProgressRing value={open} max={total} size={80} strokeWidth={6}>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {open}<span className="text-lg text-muted-foreground">/{total}</span>
              </div>
            </div>
          </ProgressRing>
          
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">
              {Math.round(percentage)}%
            </div>
            <div className="text-sm text-muted-foreground">
              Open
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}