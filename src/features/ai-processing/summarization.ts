import { OpenAIClient } from '@/lib/openai';

export class Summarizer {
  private openai: OpenAIClient;
  
  constructor() {
    this.openai = new OpenAIClient('llama-3.3-70b-versatile');
  }
  
  async summarizeCompany(companyName: string): Promise<string> {
    try {
      console.log(`📄 Summarizing company: ${companyName}`);
      
      const prompt = `Provide a comprehensive 2-3 paragraph description of ${companyName} company. Include:
1. What the company does (products/services)
2. Their target market and key customers
3. Notable achievements, market position, or unique aspects

Be informative and factual about the real ${companyName} company.`;
      
      const response = await this.openai.generate(prompt);
      console.log(`📄 Summary generated (${response.content.length} chars)`);
      
      return response.content;
    } catch (error) {
      console.error('❌ Summarization error:', error);
      return '';
    }
  }
  
  async getSocialMediaLinks(companyName: string, website?: string) {
    try {
      console.log(`🔗 Extracting social media for: ${companyName}`);
      
      const schema = {
        linkedin: "string or null",
        twitter: "string or null",
        facebook: "string or null",
        instagram: "string or null",
        youtube: "string or null",
        github: "string or null"
      };
      
      const prompt = website
        ? `Find the official social media profile URLs for ${companyName} company (website: ${website}). Provide full URLs or null if unknown.`
        : `Find the official social media profile URLs for ${companyName} company. Provide full URLs or null if unknown.`;
      
      const result = await this.openai.generateStructured(prompt, schema);
      console.log('🔗 Social media result:', JSON.stringify(result, null, 2));
      
      return result || {};
    } catch (error) {
      console.error('❌ Social media extraction error:', error);
      return {};
    }
  }
}
