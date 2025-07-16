import { Mountain, Thermometer, Cloud } from "lucide-react"
import alpineHero from "@/assets/alpine-hero.jpg"

export function Header() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${alpineHero})` }}
      >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Mountain className="text-primary w-8 h-8" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-alpine bg-clip-text text-transparent">
              Saas-Fee Valley
            </h1>
          </div>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real-time status of cable cars, lifts, restaurants, and recreational facilities in the beautiful Saas Valley.
          </p>
          
          {/* Weather Info */}
          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4" />
              <span>-3°C</span>
            </div>
            <div className="flex items-center gap-2">
              <Cloud className="w-4 h-4" />
              <span>Partly Cloudy</span>
            </div>
            <div className="text-primary font-medium">
              Perfect Skiing Conditions
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}