import { NextRequest, NextResponse } from 'next/server'

interface AuthResponse {
  success: boolean
  token?: string
  user?: {
    id: string
    email: string
    name: string
  }
  error?: string
}

export async function POST(request: NextRequest): Promise<NextResponse<AuthResponse>> {
  try {
    const { email, password } = await request.json() as { email?: string; password?: string }

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email et mot de passe requis' },
        { status: 400 }
      )
    }

    // TODO: Implémenter l'authentification avec Supabase
    const user = {
      id: '1',
      email,
      name: email.split('@')[0],
    }

    return NextResponse.json({
      success: true,
      user,
      token: 'demo-token',
    })
  } catch (error) {
    console.error('Erreur auth:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur authentification' },
      { status: 500 }
    )
  }
}