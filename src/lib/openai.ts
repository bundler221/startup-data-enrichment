import OpenAI from 'openai';

export class OpenAIClient {
  private client: OpenAI;
  private model: string;
  
  constructor(model: string = 'llama-3.3-70b-versatile') {
    console.log('🔑 Initializing OpenAI Client with model:', model);
    console.log('🔑 API Key present:', !!process.env.GROQ_API_KEY);
    console.log('🔑 API Key length:', process.env.GROQ_API_KEY?.length);
    
    this.client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1'
    });
    this.model = model;
  }
  
  async chat(messages: Array<{ role: string; content: string }>) {
    try {
      console.log('💬 Chat Request:', {
        model: this.model,
        messageCount: messages.length,
        firstMessage: messages[0]?.content?.substring(0, 100)
      });
      
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages,
        temperature: 0.7
      });
      
      console.log('✅ Chat Response:', {
        content: response.choices[0].message.content?.substring(0, 200),
        usage: response.usage
      });
      
      return {
        content: response.choices[0].message.content || '',
        usage: response.usage
      };
    } catch (error: any) {
      console.error('❌ Groq API Error:', {
        message: error.message,
        status: error.status,
        code: error.code
      });
      throw error;
    }
  }
  
  async generate(prompt: string) {
    console.log('🔄 Generate called with prompt:', prompt.substring(0, 100));
    return this.chat([{ role: 'user', content: prompt }]);
  }
  
  async generateStructured(prompt: string, schema: any) {
    try {
      console.log('📋 Structured Generation Request:', {
        promptLength: prompt.length,
        schema: JSON.stringify(schema, null, 2)
      });
      
      const fullPrompt = `${prompt}\n\nRespond ONLY with valid JSON matching this schema:\n${JSON.stringify(schema, null, 2)}`;
      
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that responds only with valid JSON. Never include explanations, only return the JSON object.'
          },
          {
            role: 'user',
            content: fullPrompt
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3
      });
      
      const content = response.choices[0].message.content || '{}';
      console.log('📦 Raw API Response:', content);
      
      const parsed = JSON.parse(content);
      console.log('✅ Parsed JSON:', parsed);
      
      return parsed;
    } catch (error: any) {
      console.error('❌ Groq Structured Error:', {
        message: error.message,
        status: error.status,
        code: error.code,
        response: error.response?.data
      });
      return {};
    }
  }
}
