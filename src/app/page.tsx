import { SearchForm } from '@/components/search-form';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Indian Startup Data Enrichment
          </h1>
          <p className="text-lg text-gray-600">
            Powered by llama - Get comprehensive startup information instantly
          </p>
        </div>
        
        <SearchForm />
      </div>
    </main>
  );
}
