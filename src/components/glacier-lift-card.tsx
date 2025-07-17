import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Cable, CheckCircle, XCircle, AlertCircle, Clock } from "lucide-react"
import { LiftStatus } from "@/utils/lift-status-service"

interface GlacierLiftCardProps {
  lift: LiftStatus
  className?: string
}

export function GlacierLiftCard({ lift, className }: GlacierLiftCardProps) {
  const getStatusIcon = () => {
    switch (lift.status) {
      case 'open':
        return <CheckCircle className="w-5 h-5 text-success" />
      case 'closed':
        return <XCircle className="w-5 h-5 text-destructive" />
      case 'maintenance':
        return <AlertCircle className="w-5 h-5 text-warning" />
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />
    }
  }

  const getStatusBadge = () => {
    switch (lift.status) {
      case 'open':
        return <Badge className="bg-success text-success-foreground">Operational</Badge>
      case 'closed':
        return <Badge variant="destructive">Closed</Badge>
      case 'maintenance':
        return <Badge className="bg-warning text-warning-foreground">Maintenance</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getCardStyle = () => {
    switch (lift.status) {
      case 'open':
        return "border-success/30 bg-gradient-to-br from-success/5 to-transparent"
      case 'closed':
        return "border-destructive/30 bg-gradient-to-br from-destructive/5 to-transparent"
      case 'maintenance':
        return "border-warning/30 bg-gradient-to-br from-warning/5 to-transparent"
      default:
        return "border-border/50 bg-gradient-snow"
    }
  }

  return (
    <Card className={cn(
      "relative overflow-hidden transition-smooth hover:shadow-alpine hover:-translate-y-1",
      getCardStyle(),
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-primary text-2xl">
              <Cable />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground">{lift.name}</h3>
              <p className="text-sm text-muted-foreground">
                {lift.name === 'Metro Alpin' && 'Underground funicular to glacier'}
                {lift.name.includes('Alpin Express') && 'Cable car to mid-station'}
              </p>
            </div>
          </div>
          {getStatusBadge()}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <div>
              <div className="font-medium text-foreground capitalize">
                {lift.status === 'unknown' ? 'Status Unknown' : lift.status}
              </div>
              <div className="text-sm text-muted-foreground">
                Updated: {new Date(lift.lastUpdated).toLocaleTimeString()}
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">
              {lift.isOpen ? '✓' : '✗'}
            </div>
            <div className="text-sm text-muted-foreground">
              {lift.isOpen ? 'Running' : 'Stopped'}
            </div>
          </div>
        </div>

        {/* Special indicator for glacier access */}
        {lift.name === 'Metro Alpin' && lift.isOpen && (
          <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-center gap-2 text-primary font-medium text-sm">
              <CheckCircle className="w-4 h-4" />
              Direct glacier access available
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}