import { Ollama } from 'ollama';

export class OllamaClient {
  private client: Ollama;
  private model: string;
  
  constructor(model: string = 'qwen2.5:3b') {
    this.client = new Ollama({
      host: 'http://localhost:11434'
    });
    this.model = model;
  }
  
  async chat(messages: Array<{ role: string; content: string }>, format?: 'json') {
    try {
      const response = await this.client.chat({
        model: this.model,
        messages,
        format: format as any,
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: 2000
        }
      });
      
      return {
        content: response.message.content,
        usage: {
          prompt_tokens: response.prompt_eval_count || 0,
          completion_tokens: response.eval_count || 0,
          total_tokens: (response.prompt_eval_count || 0) + (response.eval_count || 0)
        }
      };
    } catch (error) {
      console.error('Ollama API Error:', error);
      throw error;
    }
  }
  
  async generate(prompt: string, format?: 'json') {
    try {
      const response = await this.client.generate({
        model: this.model,
        prompt,
        format: format as any,
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: 2000
        }
      });
      
      console.log('Ollama response:', response.response.substring(0, 200));
      
      return {
        content: response.response,
        usage: {
          prompt_tokens: response.prompt_eval_count || 0,
          completion_tokens: response.eval_count || 0
        }
      };
    } catch (error) {
      console.error('Ollama Generate Error:', error);
      throw error;
    }
  }
  
  async generateStructured(prompt: string, schema: any) {
    try {
      const fullPrompt = `${prompt}\n\nYou must respond with valid JSON only. Here is the schema:\n${JSON.stringify(schema, null, 2)}\n\nResponse (JSON only):`;
      
      const response = await this.client.generate({
        model: this.model,
        prompt: fullPrompt,
        format: 'json',
        stream: false,
        options: {
          temperature: 0.3,
          num_predict: 2000
        }
      });
      
      console.log('Raw Ollama response:', response.response);
      
      // Try to parse JSON
      try {
        const parsed = JSON.parse(response.response);
        return parsed;
      } catch (parseError) {
        console.error('JSON Parse Error. Raw response:', response.response);
        // Return empty structure matching schema
        return {};
      }
    } catch (error) {
      console.error('Ollama Structured Error:', error);
      return {};
    }
  }
}
