import { NextRequest, NextResponse } from 'next/server';

interface RecipeRequest {
  name: string;
  description?: string;
  ingredients: Array<{
    name: string;
    quantity: number;
    unit: string;
  }>;
  servings?: number;
  isPublic?: boolean;
}

// GET - Retrieve user's recipes
export async function GET(req: NextRequest) {
  try {
    // TODO: Authenticate user
    // TODO: Fetch recipes from database where user_id = authenticated user
    // TODO: Return list with macros pre-calculated

    return NextResponse.json({
      success: true,
      recipes: [],
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch recipes' },
      { status: 500 }
    );
  }
}

// POST - Create new recipe
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RecipeRequest;

    // TODO: Validate input
    const { name, description, ingredients, servings = 1, isPublic = false } = body;

    // TODO: Authenticate user
    // TODO: For each ingredient, lookup nutrition from database
    // TODO: Calculate total macros
    // TODO: Save recipe to database

    const totalMacros = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    };

    // TODO: ingredients.forEach(ing => {
    //   fetch nutrition data for ingredient
    //   multiply by quantity
    //   add to totals
    // })

    return NextResponse.json(
      {
        success: true,
        recipe: {
          id: 0,
          name,
          description,
          ingredients,
          servings,
          totalCalories: totalMacros.calories,
          totalProtein: totalMacros.protein,
          totalCarbs: totalMacros.carbs,
          totalFat: totalMacros.fat,
          perServing: {
            calories: totalMacros.calories / servings,
            protein: totalMacros.protein / servings,
            carbs: totalMacros.carbs / servings,
            fat: totalMacros.fat / servings,
          },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create recipe' },
      { status: 500 }
    );
  }
}

// PUT - Update recipe
export async function PUT(req: NextRequest) {
  try {
    // TODO: Get recipe ID from query params
    // TODO: Validate ownership (user can only update own recipes)
    // TODO: Update recipe in database
    // TODO: Recalculate macros

    return NextResponse.json({
      success: true,
      message: 'Recipe updated',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update recipe' },
      { status: 500 }
    );
  }
}

// DELETE - Delete recipe
export async function DELETE(req: NextRequest) {
  try {
    // TODO: Get recipe ID from query params
    // TODO: Validate ownership
    // TODO: Delete from database

    return NextResponse.json({
      success: true,
      message: 'Recipe deleted',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete recipe' },
      { status: 500 }
    );
  }
}
