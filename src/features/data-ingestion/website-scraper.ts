import axios from 'axios';
import * as cheerio from 'cheerio';

export class WebsiteScraper {
  async scrapeBasicInfo(url: string) {
    try {
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      const $ = cheerio.load(response.data);
      
      // Extract logo
      const logo = 
        $('img[class*="logo" i]').first().attr('src') ||
        $('img[id*="logo" i]').first().attr('src') ||
        $('meta[property="og:image"]').attr('content') ||
        $('link[rel="icon"]').attr('href');
      
      // Extract description
      const description = 
        $('meta[name="description"]').attr('content') ||
        $('meta[property="og:description"]').attr('content');
      
      // Extract title
      const title = 
        $('meta[property="og:title"]').attr('content') ||
        $('title').text();
      
      return {
        logo: logo ? this.normalizeUrl(logo, url) : null,
        description,
        title
      };
    } catch (error) {
      console.error('Scraping error:', error);
      return { logo: null, description: null, title: null };
    }
  }
  
  private normalizeUrl(path: string, baseUrl: string): string {
    if (path.startsWith('http')) return path;
    if (path.startsWith('//')) return 'https:' + path;
    
    const base = new URL(baseUrl);
    if (path.startsWith('/')) {
      return base.origin + path;
    }
    return base.origin + '/' + path;
  }
}
