import { NextResponse, type NextRequest } from "next/server";

async function verifyToken(token: string): Promise<boolean> {

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/speck/v1/auth/verify-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
        });
        const data = await response.json();
        return data.valid;
    } catch (error) {
        console.error('Token verification error:', error);
        return false;
    }
}


export async function middleware(request: NextRequest) {
    if (process.env.NEXT_ENV === "production") {
        // Skip middleware for static files and API routes
        if (
            request.nextUrl.pathname.startsWith('/_next') ||
            request.nextUrl.pathname.startsWith('/api') ||
            request.nextUrl.pathname.match(/\.(png|jpg|jpeg|svg|ico)$/)
        ) {
            return NextResponse.next();
        }

        const token = request.cookies.get('jwtToken')?.value;
        const { pathname, host } = request.nextUrl;

        // Environment variables for hostnames
        const PUBLIC_HOST = process.env.REDIRECT_URL_FRONTEND
            ? new URL(process.env.REDIRECT_URL_FRONTEND).hostname
            : 'speck.ing';
        const APP_HOST = process.env.REDIRECT_URL_APP
            ? new URL(process.env.REDIRECT_URL_APP).hostname
            : 'app.speck.ing';

        // Handle authenticated users
        if (token) {
            const isValid = await verifyToken(token);

            if (isValid) {
                if (host === PUBLIC_HOST) {
                    // If on public domain and authenticated, redirect to app domain home
                    return NextResponse.redirect(new URL('/home', `https://${APP_HOST}`));
                }

                if (host === APP_HOST) {
                    // If on app domain and trying to access root or auth, redirect to home
                    if (pathname === '/' || pathname === '/auth') {
                        return NextResponse.redirect(new URL('/home', `https://${APP_HOST}`));
                    }
                    // Allow access to other private routes on app domain
                    return NextResponse.next();
                }
            } else {
                // Invalid token - clear it and redirect to auth
                const response = NextResponse.redirect(new URL('/auth', `https://${PUBLIC_HOST}`));
                response.cookies.set('jwtToken', '', {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                    expires: new Date(0), // Set cookie expiration to the past
                    path: '/',
                    domain: ".speck.ing",
                });
                return response;
            }
        }

        // Handle unauthenticated users
        // If trying to access app domain without auth, redirect to public domain
        if (host === APP_HOST) {
            return NextResponse.redirect(new URL('/auth', `https://${PUBLIC_HOST}`));
        }

        // On public domain:
        // Allow access to public routes
        if (pathname === '/' || pathname === '/auth') {
            return NextResponse.next();
        }

        // Redirect to auth for any other routes
        const url = new URL('/auth', `https://${PUBLIC_HOST}`);
        url.searchParams.set('callbackUrl', request.url);
        return NextResponse.redirect(url);
    } else {
        const token = request.cookies.get('jwtToken')?.value
        const currentPath = request.nextUrl.pathname

        const publicRoutes = ['/auth', '/']
        const protectedRoutes = ['/home', '/profile', '/library', '/create', '/templates']

        // Middleware checks if token is there, and if yes, check if it's valid or not
        if (token) {
            try {
                const isValid = await verifyToken(token);

                if (isValid) {
                    // Token is valid
                    if (protectedRoutes.some(route => currentPath.startsWith(route))) {
                        // Requested route is protected, allow access
                        return NextResponse.next()
                    } else if (publicRoutes.includes(currentPath)) {
                        // Redirect to /home if trying to access public routes with valid token
                        return NextResponse.redirect(new URL('/home', request.url))
                    }
                } else {
                    // Token is invalid
                    // Remove the old invalid token (cookies)
                    const response = NextResponse.redirect(new URL('/auth', request.url))
                    response.cookies.delete('jwtToken')
                    return response
                }
            } catch (error) {
                console.error('Token verification error:', error);
                // Treat as invalid token
                const response = NextResponse.redirect(new URL('/auth', request.url))
                response.cookies.delete('jwtToken')
                return response
            }
        } else {
            // Token is not there
            if (protectedRoutes.some(route => currentPath.startsWith(route))) {
                // Requested route is protected, redirect to /auth
                const url = new URL('/auth', request.url)
                url.searchParams.set('callbackUrl', request.url)
                return NextResponse.redirect(url)
            } else if (!publicRoutes.includes(currentPath)) {
                // Requested route is not protected and not public, allow access
                return NextResponse.next()
            }
        }

        // For public routes or any other route, allow access
        return NextResponse.next()
    }
}

const matcherProd = [
    // Match all paths except static files
    "/",
    "/(auth|home|profile|library|create|templates)/:path*",
    "/(api|trpc)/:path*",
];

const matcherDev = ["/((?!api|_next/static|_next/image|.\\.png$).)"];

export const config = {
    matcher: process.env.NEXT_ENV === "production" ? matcherProd : matcherDev,
};
