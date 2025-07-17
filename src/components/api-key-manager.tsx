import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Key, CheckCircle, XCircle, Eye, EyeOff } from "lucide-react";
import { FirecrawlService } from '@/utils/FirecrawlService';

export function ApiKeyManager() {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [isStored, setIsStored] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    const storedKey = FirecrawlService.getApiKey();
    setIsStored(!!storedKey);
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const handleSaveKey = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter an API key",
        variant: "destructive",
      });
      return;
    }

    setIsTesting(true);
    
    try {
      const isValid = await FirecrawlService.testApiKey(apiKey);
      
      if (isValid) {
        FirecrawlService.saveApiKey(apiKey);
        setIsStored(true);
        toast({
          title: "Success",
          description: "API key saved and verified successfully",
        });
      } else {
        toast({
          title: "Error", 
          description: "Invalid API key. Please check and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify API key",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleClearKey = () => {
    localStorage.removeItem('firecrawl_api_key');
    setApiKey('');
    setIsStored(false);
    toast({
      title: "Success",
      description: "API key cleared",
    });
  };

  return (
    <Card className="bg-gradient-snow border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="w-5 h-5 text-primary" />
          Firecrawl API Setup
          {isStored && <Badge className="bg-success text-success-foreground">Connected</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <p>To get real-time lift status, we need a Firecrawl API key to scrape the Saas-Fee website.</p>
          <p className="mt-2">
            Get your free API key at:{" "}
            <a 
              href="https://firecrawl.dev" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              firecrawl.dev
            </a>
          </p>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              type={isVisible ? "text" : "password"}
              placeholder="Enter your Firecrawl API key..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
              onClick={() => setIsVisible(!isVisible)}
            >
              {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
          
          <Button 
            onClick={handleSaveKey}
            disabled={isTesting}
            className="bg-primary hover:bg-primary/90"
          >
            {isTesting ? "Testing..." : isStored ? "Update" : "Save"}
          </Button>
          
          {isStored && (
            <Button 
              onClick={handleClearKey}
              variant="outline"
            >
              Clear
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm">
          {isStored ? (
            <>
              <CheckCircle className="w-4 h-4 text-success" />
              <span className="text-success">API key configured</span>
            </>
          ) : (
            <>
              <XCircle className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">No API key configured</span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}