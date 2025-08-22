import { NextResponse } from 'next/server';
import cocktailsData from '@/app/data/cocktails.json';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Find cocktail by ID
    const cocktail = cocktailsData.find(c => c.id === id);
    
    if (!cocktail) {
      return NextResponse.json(
        { error: 'Cocktail not found' },
        { status: 404 }
      );
    }
    
    // Return cocktail data
    return NextResponse.json(cocktail);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch cocktail' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    
    // Simulate updating a cocktail
    const updatedCocktail = {
      id,
      ...body,
      updatedAt: new Date().toISOString()
    };
    
    return NextResponse.json(updatedCocktail);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update cocktail' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    // Simulate deleting a cocktail
    return NextResponse.json(
      { message: `Cocktail ${id} deleted successfully` },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete cocktail' },
      { status: 500 }
    );
  }
} 