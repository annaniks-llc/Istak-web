import { NextResponse } from 'next/server';
import cocktailsData from '@/app/data/cocktails.json';

export async function GET() {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return cocktails data
    return NextResponse.json(cocktailsData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch cocktails' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Simulate creating a new cocktail
    const newCocktail = {
      id: Date.now(),
      ...body,
      createdAt: new Date().toISOString()
    };
    
    return NextResponse.json(newCocktail, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create cocktail' },
      { status: 500 }
    );
  }
} 