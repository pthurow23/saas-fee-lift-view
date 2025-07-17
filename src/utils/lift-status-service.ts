import { FirecrawlService } from './FirecrawlService';

export interface LiftStatus {
  name: string;
  isOpen: boolean;
  status: 'open' | 'closed' | 'maintenance' | 'unknown';
  lastUpdated: string;
}

export interface GlacierAccessData {
  lifts: LiftStatus[];
  glacierSkiingOpen: boolean;
  lastCheck: string;
  weatherConditions?: {
    temperature: string;
    conditions: string;
  };
}

export class LiftStatusService {
  private static readonly SAAS_FEE_LIFTS_URL = 'https://www.saas-fee.ch/en/open-lifts/all';
  
  static async getGlacierAccessStatus(): Promise<GlacierAccessData> {
    try {
      console.log('LiftStatusService: Starting glacier access status fetch...');
      console.log('LiftStatusService: Target URL:', this.SAAS_FEE_LIFTS_URL);
      
      const scrapeResult = await FirecrawlService.scrapeWebsite(this.SAAS_FEE_LIFTS_URL);
      console.log('LiftStatusService: Scrape result:', scrapeResult);
      
      if (!scrapeResult.success) {
        console.error('LiftStatusService: Scrape failed:', scrapeResult.error);
        throw new Error(scrapeResult.error || 'Failed to fetch lift data');
      }

      console.log('LiftStatusService: Parsing lift data...');
      const lifts = this.parseLiftData(scrapeResult.data);
      console.log('LiftStatusService: Parsed lifts:', lifts);
      
      const glacierSkiingOpen = this.determineGlacierAccess(lifts);
      console.log('LiftStatusService: Glacier skiing open:', glacierSkiingOpen);
      
      const result = {
        lifts,
        glacierSkiingOpen,
        lastCheck: new Date().toISOString(),
        weatherConditions: this.extractWeatherInfo(scrapeResult.data)
      };
      
      console.log('LiftStatusService: Final result:', result);
      return result;
      
    } catch (error) {
      console.error('LiftStatusService: Error in getGlacierAccessStatus:', error);
      
      // Return fallback data with error info
      return {
        lifts: [
          { name: 'Alpin Express I', isOpen: false, status: 'unknown', lastUpdated: new Date().toISOString() },
          { name: 'Alpin Express II', isOpen: false, status: 'unknown', lastUpdated: new Date().toISOString() },
          { name: 'Metro Alpin', isOpen: false, status: 'unknown', lastUpdated: new Date().toISOString() }
        ],
        glacierSkiingOpen: false,
        lastCheck: new Date().toISOString()
      };
    }
  }

  private static parseLiftData(scrapedData: any): LiftStatus[] {
    const content = scrapedData?.markdown || scrapedData?.html || '';
    const lifts: LiftStatus[] = [];
    
    // Key lifts we care about for glacier access
    const targetLifts = [
      { name: 'Alpin Express I', searchTerms: ['alpin express i', 'alpin express 1'] },
      { name: 'Alpin Express II', searchTerms: ['alpin express ii', 'alpin express 2'] }, 
      { name: 'Metro Alpin', searchTerms: ['metro alpin', 'metro-alpin'] }
    ];

    for (const lift of targetLifts) {
      const status = this.findLiftStatus(content, lift.searchTerms);
      lifts.push({
        name: lift.name,
        isOpen: status.isOpen,
        status: status.status,
        lastUpdated: new Date().toISOString()
      });
    }

    return lifts;
  }

  private static findLiftStatus(content: string, searchTerms: string[]): { isOpen: boolean; status: 'open' | 'closed' | 'maintenance' | 'unknown' } {
    const lowerContent = content.toLowerCase();
    
    for (const term of searchTerms) {
      const termIndex = lowerContent.indexOf(term.toLowerCase());
      if (termIndex !== -1) {
        // Look for status indicators around the lift name
        const contextStart = Math.max(0, termIndex - 100);
        const contextEnd = Math.min(content.length, termIndex + 200);
        const context = lowerContent.slice(contextStart, contextEnd);
        
        // Check for open/closed indicators
        if (context.includes('open') || context.includes('operating') || context.includes('running')) {
          return { isOpen: true, status: 'open' };
        }
        if (context.includes('closed') || context.includes('not operating') || context.includes('shutdown')) {
          return { isOpen: false, status: 'closed' };
        }
        if (context.includes('maintenance') || context.includes('service')) {
          return { isOpen: false, status: 'maintenance' };
        }
      }
    }
    
    return { isOpen: false, status: 'unknown' };
  }

  private static determineGlacierAccess(lifts: LiftStatus[]): boolean {
    // Glacier skiing is accessible if either:
    // 1. Metro Alpin is open (direct glacier access)
    // 2. OR both Alpin Express lifts are open (can reach glacier via connection)
    
    const metroAlpin = lifts.find(l => l.name === 'Metro Alpin');
    const alpinExpress1 = lifts.find(l => l.name === 'Alpin Express I');
    const alpinExpress2 = lifts.find(l => l.name === 'Alpin Express II');
    
    if (metroAlpin?.isOpen) {
      return true;
    }
    
    if (alpinExpress1?.isOpen && alpinExpress2?.isOpen) {
      return true;
    }
    
    return false;
  }

  private static extractWeatherInfo(scrapedData: any): { temperature: string; conditions: string } | undefined {
    const content = scrapedData?.markdown || '';
    
    // Try to extract temperature and weather conditions
    const tempMatch = content.match(/(-?\d+)°[CF]?/);
    const temperature = tempMatch ? `${tempMatch[1]}°C` : 'N/A';
    
    // Look for weather condition keywords
    let conditions = 'N/A';
    const weatherKeywords = ['sunny', 'cloudy', 'snow', 'rain', 'fog', 'clear', 'overcast'];
    for (const keyword of weatherKeywords) {
      if (content.toLowerCase().includes(keyword)) {
        conditions = keyword.charAt(0).toUpperCase() + keyword.slice(1);
        break;
      }
    }
    
    return { temperature, conditions };
  }
}