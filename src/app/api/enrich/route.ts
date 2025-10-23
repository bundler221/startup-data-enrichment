import { NextRequest, NextResponse } from 'next/server';
import { DataEnricher } from '@/features/enrichment/data-enricher';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { startup_name, website } = await request.json();
    
    if (!startup_name) {
      return NextResponse.json(
        { error: 'startup_name is required' },
        { status: 400 }
      );
    }
    
    console.log(`Enriching data for: ${startup_name}`);
    
    // Check if startup already exists
    const existing = await prisma.startup.findFirst({
      where: {
        startup_name: {
          equals: startup_name,
          mode: 'insensitive'
        }
      }
    });
    
    if (existing) {
      return NextResponse.json({
        message: 'Startup already exists',
        startup: existing
      });
    }
    
    // Enrich data using Perplexity AI
    const enricher = new DataEnricher();
    const enrichedData = await enricher.enrichStartupData(startup_name, website);
    
    // Separate founders and funding stages
    const { founders, funding_stages, ...startupData } = enrichedData;
    
    // Save to database
    const startup = await prisma.startup.create({
      data: {
        ...startupData,
        founders: {
          create: founders || []
        },
        funding_stages: {
          create: funding_stages?.map(round => ({
            round_name: round.round_name,
            amount: round.amount,
            date: round.date ? new Date(round.date) : null,
            investors: round.investors || []
          })) || []
        }
      },
      include: {
        founders: true,
        funding_stages: true
      }
    });
    
    return NextResponse.json({
      success: true,
      startup
    });
    
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to enrich data' },
      { status: 500 }
    );
  }
}
