// import { NextResponse, type NextRequest } from 'next/server'
// import jwt from 'jsonwebtoken';
// import { verify } from './services/jwt_sign_verify';

// export async function middleware(request: NextRequest) {
//     const jwtToken = request.cookies.get('jwtToken')?.value
//     const currentPath = request.nextUrl.pathname

//     // Define your secret key for JWT validation
//     const secretKey = 'fwoajf9w0ajhinwg[fj0w9apogjiwago]'

//     // Public and protected routes
//     const publicRoutes = ['/auth', '/']
//     const protectedRoutes = ['/home', '/profile', '/library', '/create', '/templates']

//     if (jwtToken) {
//         try {
//             // Verify the JWT token
//             await verify(jwtToken, secretKey);

//             // Token is valid, redirect away from public routes
//             if (publicRoutes.some(route => currentPath === route)) {
//                 return NextResponse.redirect(new URL('/home', request.url))
//             }
//         } catch (err) {
//             // Token is invalid, remove the cookies and redirect to /auth
//             const response = NextResponse.redirect(new URL('/auth', request.url))
//             response.cookies.delete('jwtToken')
//             response.cookies.delete('anotherCookie') // Add other cookies as needed
//             return response
//         }
//     } else {
//         // No token, check if the route is protected
//         if (protectedRoutes.some(route => currentPath.startsWith(route))) {
//             // Redirect unauthenticated users to /auth
//             return NextResponse.redirect(new URL('/auth', request.url))
//         }
//     }

//     // Allow the request to continue for other routes
//     return NextResponse.next()
// }

// export const config = {
//     matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
// }

// ------------------------------

// import { NextResponse, type NextRequest } from 'next/server'

// async function verifyToken(token: string) {
//     try {
//         const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/speck/v1/auth/verify-token`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ token }),
//         });
//         const data = await response.json();
//         return data.valid;
//     } catch (error) {
//         console.error('Token verification error:', error);
//         return false;
//     }
// }

// export async function middleware(request: NextRequest) {
//     const token = request.cookies.get('jwtToken')?.value
//     const currentPath = request.nextUrl.pathname

//     const publicRoutes = ['/auth', '/']
//     const protectedRoutes = ['/home', '/profile', '/library', '/create', '/templates']

//     // Avoid redirecting if we're already on the auth page
//     if (currentPath === '/auth') {
//         return NextResponse.next()
//     }

//     if (token) {
//         try {
//             debugger;
//             const isValid = await verifyToken(`Bearer ${token}`);
//             console.log("isvalid", isValid);

//             if (isValid) {
//                 if (publicRoutes.includes(currentPath)) {
//                     return NextResponse.redirect(new URL('/home', request.url))
//                 }
//                 // For protected routes, allow access
//                 return NextResponse.next()
//             }
//         } catch (error) {
//             console.error('Token verification error:', error);
//         }
//     }

//     // Token is missing, invalid, or verification failed
//     if (protectedRoutes.some(route => currentPath.startsWith(route))) {
//         // Store the original URL to redirect back after login
//         console.log("hehe");

//         const test = request.cookies.get('jwtToken');
//         console.log("hehe", test);
//         request.cookies.delete('jwtToken')

//         const url = new URL('/auth', request.url)
//         url.searchParams.set('callbackUrl', request.url)

//         const response = NextResponse.redirect(url);
//         response.cookies.delete('jwtToken')
//         return response;
//     }

//     // For public routes or any other route, allow access
//     return NextResponse.next()
// }

// export const config = {
//     matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
// }



import { NextResponse, type NextRequest } from 'next/server'

async function verifyToken(token: string) {
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
  const token = request.cookies.get('jwtToken')?.value;
  const currentPath = request.nextUrl.pathname;
  const hostname = request.nextUrl.hostname;

  const publicRoutes = ['/auth', '/'];
  const protectedRoutes = ['/home', '/profile', '/library', '/create', '/templates'];

  // Redirect to main domain if user is on app.speck.ing without a token
  if (hostname === new URL(process.env.REDIRECT_URL_APP!).hostname && !token) {
    return NextResponse.redirect(new URL(process.env.REDIRECT_URL_FRONTEND!, request.url));
  }

  // Token verification for other cases
  if (token) {
    try {
      const isValid = await verifyToken(token);

      if (isValid) {
        // Token is valid
        if (protectedRoutes.some(route => currentPath.startsWith(route))) {
          return NextResponse.next();
        } else if (publicRoutes.includes(currentPath) && hostname === new URL(process.env.REDIRECT_URL_FRONTEND!).hostname) {
          return NextResponse.redirect(new URL(`${process.env.REDIRECT_URL_APP}/home`, request.url));
        }
      } else {
        // Redirect to login if token is invalid
        const response = NextResponse.redirect(new URL(process.env.AUTH_REDIRECT!, request.url));
        response.cookies.delete('jwtToken');
        return response;
      }
    } catch (error) {
      console.error('Token verification error:', error);
      const response = NextResponse.redirect(new URL(process.env.AUTH_REDIRECT!, request.url));
      response.cookies.delete('jwtToken');
      return response;
    }
  } else if (protectedRoutes.some(route => currentPath.startsWith(route))) {
    // Redirect to login if no token and accessing protected route
    const loginUrl = new URL(process.env.AUTH_REDIRECT!, request.url);
    loginUrl.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.\.png$).*)'],
};
