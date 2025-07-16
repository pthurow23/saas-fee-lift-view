import { Header } from "@/components/header"
import { FacilityCard } from "@/components/facility-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Cable, 
  Utensils, 
  Footprints, 
  Bike, 
  Mountain, 
  Gamepad2,
  Clock,
  MapPin
} from "lucide-react"

const facilityData = [
  {
    title: "Cable cars and Lifts",
    open: 10,
    total: 19,
    icon: <Cable />,
    description: "Main transportation to the slopes"
  },
  {
    title: "Mountain restaurants", 
    open: 16,
    total: 21,
    icon: <Utensils />,
    description: "Dining options across the mountain"
  },
  {
    title: "Hiking trails",
    open: 54,
    total: 74,
    icon: <Footprints />,
    description: "Walking and hiking paths"
  },
  {
    title: "Bike trails",
    open: 17,
    total: 21,
    icon: <Bike />,
    description: "Mountain biking routes"
  },
  {
    title: "Via ferrata",
    open: 3,
    total: 6,
    icon: <Mountain />,
    description: "Climbing routes with fixed anchors"
  },
  {
    title: "Leisure facilities",
    open: 14,
    total: 17,
    icon: <Gamepad2 />,
    description: "Entertainment and activity centers"
  }
]

const Index = () => {
  const totalOpen = facilityData.reduce((sum, facility) => sum + facility.open, 0)
  const totalFacilities = facilityData.reduce((sum, facility) => sum + facility.total, 0)
  const overallPercentage = Math.round((totalOpen / totalFacilities) * 100)

  return (
    <div className="min-h-screen bg-gradient-snow">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Overview Stats */}
        <div className="mb-8">
          <Card className="bg-gradient-alpine text-white border-0 shadow-alpine">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <MapPin className="w-5 h-5" />
                Overall Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold mb-2">
                    {totalOpen} of {totalFacilities} facilities open
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-white/20 text-white border-white/30">
                      {overallPercentage}% operational
                    </Badge>
                    <div className="flex items-center gap-1 text-white/80">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">Updated: Today 08:30</span>
                    </div>
                  </div>
                </div>
                <div className="text-6xl font-bold opacity-20">
                  {overallPercentage}%
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Facility Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {facilityData.map((facility, index) => (
            <FacilityCard
              key={index}
              title={facility.title}
              open={facility.open}
              total={facility.total}
              icon={facility.icon}
              description={facility.description}
            />
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <Card className="bg-muted/30 border-border/50">
            <CardContent className="p-6">
              <p className="text-muted-foreground">
                Data sourced from{" "}
                <a 
                  href="https://www.saas-fee.ch/en/open-lifts/all" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  saas-fee.ch
                </a>
                {" "}• Last updated today at 08:30
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Index
