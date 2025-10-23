import { Perplexity } from 'perplexityai';

export class PerplexityClient {
  private client: Perplexity;
  
  constructor(apiKey?: string) {
    this.client = new Perplexity({
      apiKey: apiKey || process.env.PERPLEXITY_API_KEY
    });
  }
  
  async chat(messages: Array<{ role: string; content: string }>, model: string = 'sonar-pro') {
    try {
      const completion = await this.client.chat.completions.create({
        model,
        messages
      });
      
      return {
        content: completion.choices[0].message.content,
        citations: completion.citations || [],
        usage: completion.usage
      };
    } catch (error) {
      console.error('Perplexity API Error:', error);
      throw error;
    }
  }
  
  async search(query: string) {
    try {
      const completion = await this.client.chat.completions.create({
        model: 'sonar-pro',
        messages: [
          {
            role: 'user',
            content: query
          }
        ]
      });
      
      return {
        content: completion.choices[0].message.content,
        citations: completion.citations || [],
        search_results: completion.search_results || []
      };
    } catch (error) {
      console.error('Perplexity Search Error:', error);
      throw error;
    }
  }
}
