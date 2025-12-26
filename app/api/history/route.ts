import { NextRequest, NextResponse } from 'next/server'

// Redirect to meals endpoint
export async function GET(request: NextRequest) {
  const response = await fetch(`${request.nextUrl.origin}/api/meals${request.nextUrl.search}`)
  const data = await response.json()
  return NextResponse.json(data, { status: response.status })
}