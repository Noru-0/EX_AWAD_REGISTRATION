import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Middleware to protect the `/home` page: if there's no `token` cookie, redirect to login (/)
export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl

	// Only protect the /home route (and subpaths)
	if (pathname === '/home' || pathname.startsWith('/home/')) {
		const token = request.cookies.get('token')?.value
		if (!token) {
			const url = request.nextUrl.clone()
			url.pathname = '/'
			return NextResponse.redirect(url)
		}
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/home', '/home/:path*'],
}
