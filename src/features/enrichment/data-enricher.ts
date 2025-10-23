import { EntityExtractor } from '../ai-processing/entity-extraction';
import { Summarizer } from '../ai-processing/summarization';
import { WebsiteScraper } from '../data-ingestion/website-scraper';
import { generateSlug } from '@/lib/utils';
import { StartupData } from '@/types/startup';

export class DataEnricher {
  private entityExtractor: EntityExtractor;
  private summarizer: Summarizer;
  private websiteScraper: WebsiteScraper;
  
  constructor() {
    this.entityExtractor = new EntityExtractor();
    this.summarizer = new Summarizer();
    this.websiteScraper = new WebsiteScraper();
  }
  
  async enrichStartupData(startupName: string, website?: string): Promise<StartupData> {
    console.log(`Starting enrichment for: ${startupName}`);
    
    const enrichedData: StartupData = {
      startup_name: startupName,
      url_slug: generateSlug(startupName)
    };
    
    try {
      // Step 1: Get company details using Perplexity
      console.log('Extracting company details...');
      const companyDetails = await this.entityExtractor.extractCompanyDetails(startupName);
      Object.assign(enrichedData, companyDetails);
      
      // Step 2: Get comprehensive description
      console.log('Generating description...');
      const fullDescription = await this.summarizer.summarizeCompany(startupName);
      enrichedData.full_description = fullDescription;
      
      // Step 3: Generate short description
      if (fullDescription) {
        const shortDesc = await this.entityExtractor.generateShortDescription(
          startupName,
          fullDescription
        );
        enrichedData.short_description = shortDesc;
      }
      
      // Step 4: Extract founders
      console.log('Extracting founders...');
      const founders = await this.entityExtractor.extractFounders(
        startupName,
        fullDescription
      );
      enrichedData.founders = founders;
      
      // Step 5: Extract funding information
      console.log('Extracting funding info...');
      const fundingRounds = await this.entityExtractor.extractFundingInfo(startupName);
      enrichedData.funding_stages = fundingRounds;
      
      // Calculate total funding
      if (fundingRounds && fundingRounds.length > 0) {
        const total = fundingRounds.reduce((sum: number, round: any) => sum + (round.amount || 0), 0);
        enrichedData.total_funding_amount = total;
      }
      
      // Step 6: Scrape website if provided
      if (website) {
        console.log('Scraping website...');
        enrichedData.website = website;
        const websiteData = await this.websiteScraper.scrapeBasicInfo(website);
        
        if (websiteData.logo) {
          enrichedData.startup_logo = websiteData.logo;
        }
        
        if (!enrichedData.short_description && websiteData.description) {
          enrichedData.short_description = websiteData.description.substring(0, 200);
        }
      }
      
      // Step 7: Get social media links
      console.log('Extracting social media links...');
      const socialLinks = await this.summarizer.getSocialMediaLinks(startupName, website);
      if (socialLinks) {
        enrichedData.linkedin = socialLinks.linkedin;
        enrichedData.twitter = socialLinks.twitter;
        enrichedData.facebook = socialLinks.facebook;
        enrichedData.instagram = socialLinks.instagram;
        enrichedData.youtube = socialLinks.youtube;
        enrichedData.github = socialLinks.github;
      }
      
      console.log('Enrichment completed successfully');
      return enrichedData;
      
    } catch (error) {
      console.error('Enrichment error:', error);
      return enrichedData;
    }
  }
}
