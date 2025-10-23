export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function parseJSON(text: string, fallback: any = null) {
  try {
    // Extract JSON from markdown code blocks if present
    const jsonMatch = text.match(/``````/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1]);
    }
    
    // Try parsing the entire text
    return JSON.parse(text);
  } catch (error) {
    console.error('JSON Parse Error:', error);
    return fallback;
  }
}

export function extractJSON(text: string): any {
  try {
    // Try to find JSON in the text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return null;
  } catch (error) {
    return null;
  }
}
