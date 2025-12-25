import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Vérifier si l'utilisateur a un token
  const token = request.cookies.get('token')

  // Routes protégées
  const protectedRoutes = ['/dashboard', '/history', '/settings']
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  )

  // Si pas de token et route protégée, rediriger vers home
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/history/:path*', '/settings/:path*'],
}