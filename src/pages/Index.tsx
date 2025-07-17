import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { GlacierLiftCard } from "@/components/glacier-lift-card"
import { ApiKeyManager } from "@/components/api-key-manager"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { 
  Mountain, 
  RefreshCw,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle
} from "lucide-react"
import { LiftStatusService, GlacierAccessData } from "@/utils/lift-status-service"
import { FirecrawlService } from "@/utils/FirecrawlService"
import { cn } from "@/lib/utils"

const Index = () => {
  const { toast } = useToast()
  const [glacierData, setGlacierData] = useState<GlacierAccessData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasApiKey, setHasApiKey] = useState(false)

  useEffect(() => {
    const apiKey = FirecrawlService.getApiKey()
    setHasApiKey(!!apiKey)
    
    if (apiKey) {
      fetchLiftStatus()
    }
  }, [])

  const fetchLiftStatus = async () => {
    const currentApiKey = FirecrawlService.getApiKey();
    console.log('Fetching lift status. API key present:', !!currentApiKey);
    
    if (!currentApiKey) {
      console.error('No API key found');
      toast({
        title: "API Key Required",
        description: "Please configure your Firecrawl API key first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log('Starting lift status fetch...');
    
    try {
      const data = await LiftStatusService.getGlacierAccessStatus();
      console.log('Lift status data received:', data);
      setGlacierData(data);
      
      toast({
        title: "Status Updated",
        description: `Last checked: ${new Date(data.lastCheck).toLocaleTimeString()}`,
      });
    } catch (error) {
      console.error('Error fetching lift status:', error);
      toast({
        title: "Error",
        description: "Failed to fetch lift status: " + (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      console.log('Lift status fetch completed');
    }
  }

  const getGlacierAccessStatus = () => {
    if (!glacierData) return { status: 'unknown', message: 'No data available' }
    
    if (glacierData.glacierSkiingOpen) {
      return { 
        status: 'open', 
        message: 'Glacier skiing accessible' 
      }
    } else {
      return { 
        status: 'closed', 
        message: 'Glacier skiing not accessible' 
      }
    }
  }

  const accessStatus = getGlacierAccessStatus()

  return (
    <div className="min-h-screen bg-gradient-snow">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* API Key Setup */}
        {!hasApiKey && (
          <div className="mb-8">
            <ApiKeyManager />
          </div>
        )}

        {/* Glacier Access Overview */}
        <div className="mb-8">
          <Card className={cn(
            "border-0 shadow-alpine",
            accessStatus.status === 'open' ? "bg-gradient-mountain text-white" :
            accessStatus.status === 'closed' ? "bg-gradient-to-r from-destructive to-destructive/80 text-white" :
            "bg-gradient-alpine text-white"
          )}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Mountain className="w-5 h-5" />
                Glacier Skiing Access Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold mb-2 flex items-center gap-3">
                    {accessStatus.status === 'open' ? (
                      <>
                        <CheckCircle className="w-8 h-8" />
                        Glacier Open
                      </>
                    ) : accessStatus.status === 'closed' ? (
                      <>
                        <AlertTriangle className="w-8 h-8" />
                        Glacier Closed
                      </>
                    ) : (
                      <>
                        <Clock className="w-8 h-8" />
                        Status Unknown
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className="bg-white/20 text-white border-white/30">
                      {accessStatus.message}
                    </Badge>
                    {glacierData && (
                      <div className="flex items-center gap-2 text-white/80">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">
                          Updated: {new Date(glacierData.lastCheck).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <Button 
                    onClick={fetchLiftStatus}
                    disabled={isLoading || !hasApiKey}
                    variant="outline"
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                  >
                    <RefreshCw className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")} />
                    {isLoading ? "Checking..." : "Refresh Status"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Glacier Access Lifts */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-primary" />
            Glacier Access Lifts
          </h2>
          <p className="text-muted-foreground mb-6">
            These three lifts provide the only access to the glacier for ski training. 
            You need either the Metro Alpin running, or both Alpin Express lifts operational.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {glacierData?.lifts.map((lift, index) => (
              <GlacierLiftCard
                key={index}
                lift={lift}
              />
            )) || (
              // Placeholder cards when no data
              ['Alpin Express I', 'Alpin Express II', 'Metro Alpin'].map((name) => (
                <GlacierLiftCard
                  key={name}
                  lift={{
                    name,
                    isOpen: false,
                    status: 'unknown',
                    lastUpdated: new Date().toISOString()
                  }}
                />
              ))
            )}
          </div>
        </div>

        {/* Access Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gradient-snow border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Direct Glacier Access</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Metro Alpin</Badge>
                  <span className="text-sm text-muted-foreground">
                    Underground funicular direct to 3,500m
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  The world's highest underground funicular railway. When operational, 
                  provides direct access to the glacier skiing area.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-snow border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Alternative Route</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Alpin Express I + II</Badge>
                  <span className="text-sm text-muted-foreground">
                    Two-stage cable car system
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  When both sections are running, you can reach the mid-station 
                  and connect to other lifts for glacier access.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Info */}
        <div className="text-center">
          <Card className="bg-muted/30 border-border/50">
            <CardContent className="p-6">
              <p className="text-muted-foreground">
                Real-time data sourced from{" "}
                <a 
                  href="https://www.saas-fee.ch/en/open-lifts/all" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  saas-fee.ch
                </a>
                {glacierData && (
                  <>
                    {" "}• Last updated: {new Date(glacierData.lastCheck).toLocaleString()}
                    {glacierData.weatherConditions && (
                      <>
                        {" "}• {glacierData.weatherConditions.temperature}, {glacierData.weatherConditions.conditions}
                      </>
                    )}
                  </>
                )}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Index
