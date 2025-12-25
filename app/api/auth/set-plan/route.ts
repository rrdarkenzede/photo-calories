import { NextRequest, NextResponse } from 'next/server';

interface SetPlanRequest {
  plan: 'free' | 'pro' | 'fitness';
}

export async function POST(req: NextRequest) {
  try {
    const { plan } = (await req.json()) as SetPlanRequest;

    if (!['free', 'pro', 'fitness'].includes(plan)) {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      );
    }

    // TODO: For now, just return plan info without database
    // Users can switch plans freely to test
    // Later: Add authentication & database persistence

    const planLimits: Record<string, any> = {
      free: {
        scansPerDay: 2,
        features: ['photo_scan', 'barcode_scan'],
        price: '0€',
      },
      pro: {
        scansPerDay: 10,
        features: ['photo_scan', 'barcode_scan', 'recipes', 'history', 'stats'],
        price: '4.99€/mois',
      },
      fitness: {
        scansPerDay: 40,
        features: ['photo_scan', 'barcode_scan', 'recipes', 'history', 'stats', 'coach_ai'],
        price: '9.99€/mois',
      },
    };

    return NextResponse.json({
      success: true,
      plan,
      details: planLimits[plan],
      message: `Plan switched to ${plan.toUpperCase()} for testing`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to set plan' },
      { status: 500 }
    );
  }
}
