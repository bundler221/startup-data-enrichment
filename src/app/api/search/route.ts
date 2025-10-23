import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter required' },
        { status: 400 }
      );
    }
    
    const startups = await prisma.startup.findMany({
      where: {
        OR: [
          {
            startup_name: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            sector: {
              contains: query,
              mode: 'insensitive'
            }
          }
        ]
      },
      include: {
        founders: true,
        funding_stages: true
      },
      take: 10
    });
    
    return NextResponse.json({
      results: startups,
      count: startups.length
    });
    
  } catch (error: any) {
    console.error('Search API Error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}
