import { OpenAIClient } from '@/lib/openai';

export class EntityExtractor {
  private openai: OpenAIClient;
  
  constructor() {
    this.openai = new OpenAIClient('llama-3.3-70b-versatile');
  }
  
  async extractFounders(companyName: string, text?: string): Promise<any[]> {
    try {
      console.log(`🔍 Extracting founders for: ${companyName}`);
      
      const schema = {
        founders: [
          {
            name: "string",
            role: "string",
            linkedin_url: "string or null"
          }
        ]
      };
      
      const prompt = `List all founders of ${companyName} company. Include their full names, current roles (CEO, CTO, Co-founder, etc.), and LinkedIn profile URLs if known.`;
      
      const result = await this.openai.generateStructured(prompt, schema);
      console.log('👥 Founders result:', JSON.stringify(result, null, 2));
      
      if (result.founders && Array.isArray(result.founders)) {
        console.log(`✅ Found ${result.founders.length} founders`);
        return result.founders;
      }
      
      console.log('⚠️ No founders array found in result');
      return [];
    } catch (error) {
      console.error('❌ Founder extraction error:', error);
      return [];
    }
  }
  
  async extractFundingInfo(companyName: string): Promise<any[]> {
    try {
      console.log(`💰 Extracting funding for: ${companyName}`);
      
      const schema = {
        funding_rounds: [
          {
            round_name: "string",
            amount: 0,
            date: "string",
            investors: ["string"]
          }
        ]
      };
      
      const prompt = `List all funding rounds for ${companyName} company. Include round name (Seed, Series A, B, C, etc.), amount in USD, date (YYYY-MM-DD), and list of investors.`;
      
      const result = await this.openai.generateStructured(prompt, schema);
      console.log('💰 Funding result:', JSON.stringify(result, null, 2));
      
      if (result.funding_rounds && Array.isArray(result.funding_rounds)) {
        console.log(`✅ Found ${result.funding_rounds.length} funding rounds`);
        return result.funding_rounds;
      }
      
      console.log('⚠️ No funding_rounds array found in result');
      return [];
    } catch (error) {
      console.error('❌ Funding extraction error:', error);
      return [];
    }
  }
  
  async generateShortDescription(companyName: string, fullText?: string): Promise<string> {
    try {
      console.log(`📝 Generating short description for: ${companyName}`);
      
      const prompt = fullText
        ? `Summarize this company in one clear sentence (max 150 characters): "${fullText}"`
        : `Describe what ${companyName} company does in one clear, concise sentence (max 150 characters).`;
      
      const response = await this.openai.generate(prompt);
      console.log('📝 Short description:', response.content);
      
      return response.content.substring(0, 200).trim().replace(/^["']|["']$/g, '');
    } catch (error) {
      console.error('❌ Description generation error:', error);
      return '';
    }
  }
  
  async extractCompanyDetails(companyName: string) {
    try {
      console.log(`🏢 Extracting company details for: ${companyName}`);
      
      const schema = {
        headquarters: "string",
        founding_year: 0,
        sector: "string",
        company_status: "string",
        company_size: "string",
        employees: 0,
        revenue: "string",
        valuation: "string"
      };
      
      const prompt = `Provide detailed information about ${companyName} company:
- Headquarters location (city, state/country)
- Founding year (as a number)
- Primary sector/industry
- Company status (Active, Public, Private, etc.)
- Company size range (e.g., "1000-5000")
- Approximate number of employees (as a number)
- Annual revenue (e.g., "$1B" or "undisclosed")
- Current valuation (e.g., "$5B" or "undisclosed")

Be accurate and factual. Use real data for ${companyName}.`;
      
      const result = await this.openai.generateStructured(prompt, schema);
      console.log('🏢 Company details result:', JSON.stringify(result, null, 2));
      
      return result || {};
    } catch (error) {
      console.error('❌ Company details extraction error:', error);
      return {};
    }
  }
}
