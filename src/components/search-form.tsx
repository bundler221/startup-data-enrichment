'use client';

import { useState } from 'react';

export function SearchForm() {
  const [startupName, setStartupName] = useState('');
  const [website, setWebsite] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await fetch('/api/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          startup_name: startupName, 
          website: website || undefined 
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to enrich data');
      }
      
      setResult(data.startup);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Enrich Startup Data</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Startup Name *
            </label>
            <input
              type="text"
              value={startupName}
              onChange={(e) => setStartupName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Zerodha"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Website (Optional)
            </label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Enriching Data...
              </span>
            ) : (
              'Enrich Startup Data'
            )}
          </button>
        </form>
        
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}
        
        {result && (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold">{result.startup_name}</h3>
                {result.short_description && (
                  <p className="text-gray-600 mt-1">{result.short_description}</p>
                )}
              </div>
              {result.startup_logo && (
                <img src={result.startup_logo} alt="Logo" className="w-16 h-16 object-contain" />
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              {result.headquarters && (
                <div>
                  <span className="font-medium">Headquarters:</span>
                  <p>{result.headquarters}</p>
                </div>
              )}
              {result.founding_year && (
                <div>
                  <span className="font-medium">Founded:</span>
                  <p>{result.founding_year}</p>
                </div>
              )}
              {result.sector && (
                <div>
                  <span className="font-medium">Sector:</span>
                  <p>{result.sector}</p>
                </div>
              )}
              {result.company_size && (
                <div>
                  <span className="font-medium">Company Size:</span>
                  <p>{result.company_size}</p>
                </div>
              )}
            </div>
            
            {result.founders && result.founders.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Founders:</h4>
                <ul className="list-disc list-inside">
                  {result.founders.map((founder: any, idx: number) => (
                    <li key={idx}>
                      {founder.name} {founder.role && `- ${founder.role}`}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <details className="mt-4">
              <summary className="cursor-pointer font-medium">View Full JSON</summary>
              <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}
