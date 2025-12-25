import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';

interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export async function POST(req: NextRequest) {
  try {
    const { email, username, password } = (await req.json()) as RegisterRequest;

    // Validation
    if (!email || !username || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // TODO: Check if user exists in database
    // TODO: Hash password with bcrypt
    // TODO: Create user in database
    // TODO: Create user_profile with defaults
    // TODO: Create scan_limits entry (2 scans for free plan)
    // TODO: Return JWT token

    return NextResponse.json(
      {
        success: true,
        message: 'User registered successfully',
        // user: { id, email, username, plan: 'free' }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
}
