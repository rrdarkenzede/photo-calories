import { NextRequest, NextResponse } from 'next/server'

// Redirect to new scan/barcode endpoint
export async function POST(request: NextRequest) {
  const body = await request.json()
  
  // Forward to new endpoint
  const response = await fetch(`${request.nextUrl.origin}/api/scan/barcode`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  
  const data = await response.json()
  return NextResponse.json(data, { status: response.status })
}