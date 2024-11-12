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


// bhoju code

// import { NextResponse, type NextRequest } from 'next/server'

// async function verifyToken(token: string) {
//   try {
//     const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/speck/v1/auth/verify-token`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ token }),
//     });
//     const data = await response.json();
//     return data.valid;
//   } catch (error) {
//     console.error('Token verification error:', error);
//     return false;
//   }
// }


// // REDIRECT_URL_APP="https://app.speck.ing"
// // NEXT_PUBLIC_API="https://api.speck.ing"
// // NEXT_PUBLIC_SERVER_API="https://api.speck.ing"
// // AUTH_REDIRECT="https://speck.ing/auth"


// // URL_FRONTEND="https://speck.ing"

// export async function middleware(request: NextRequest) {
//   const token = request.cookies.get('jwtToken')?.value;
//   const currentPath = request.nextUrl.pathname;
//   const hostname = request.nextUrl.hostname;

//   const mainDomain = new URL(process.env.REDIRECT_URL_FRONTEND!).hostname; // speck.ing
//   const appDomain = new URL(process.env.REDIRECT_URL_APP!).hostname;       // app.speck.ing

//   // Redirect to main domain if user is on app.speck.ing without a token
//   if (hostname === appDomain && !token) {
//     return NextResponse.redirect(new URL(process.env.REDIRECT_URL_FRONTEND!, request.url));
//   }

//   // Token verification for users with a token
//   if (token) {
//     try {
//       const isValid = await verifyToken(token);

//       if (isValid) {
//         // Redirect to /home if accessing speck.ing with a valid token
//         if (hostname === mainDomain) {
//           return NextResponse.redirect(new URL(`${process.env.REDIRECT_URL_APP}/home`, request.url));
//         }
//         // Allow access if on app.speck.ing and token is valid
//         return NextResponse.next();
//       } else {
//         // If token is invalid, delete cookie and redirect to auth
//         const response = NextResponse.redirect(new URL(process.env.AUTH_REDIRECT!, request.url));
//         response.cookies.delete('jwtToken');
//         return response;
//       }
//     } catch (error) {
//       console.error('Token verification error:', error);
//       const response = NextResponse.redirect(new URL(process.env.AUTH_REDIRECT!, request.url));
//       response.cookies.delete('jwtToken');
//       return response;
//     }
//   } else if (hostname === appDomain) {
//     // If no token and accessing any route under app.speck.ing, redirect to login
//     const loginUrl = new URL(process.env.AUTH_REDIRECT!, request.url);
//     loginUrl.searchParams.set('callbackUrl', request.url);
//     return NextResponse.redirect(loginUrl);
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|.\.png$).*)'],
// };


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
    const token = request.cookies.get('jwtToken')?.value
    const currentPath = request.nextUrl.pathname
    const currentHost = request.nextUrl.host

    const publicRoutes = ['/auth']
    const privateRoutes = ['/home', '/profile', '/library', '/create', '/templates']
    const publicHost = new URL(process.env.REDIRECT_URL_FRONTEND!).hostname; // speck.ing
    const appHost = new URL(process.env.REDIRECT_URL_APP!).hostname;       // app.speck.ing
    // const appHost = 'app.speck.ing'
    // const publicHost = 'speck.ing'

    // Middleware checks if token is there, and if yes, check if it's valid or not
    if (token) {
        try {
            const isValid = await verifyToken(token);

            if (isValid) {
                // Token is valid
                if (currentHost === publicHost) {
                    // Redirect authenticated user from public host to private host
                    return NextResponse.redirect(new URL('/', `https://${appHost}`))
                } else if (privateRoutes.some(route => currentPath.startsWith(route))) {
                    // Requested route is protected, allow access
                    return NextResponse.next()
                }
            } else {
                // Token is invalid
                // Remove the old invalid token (cookies)
                const response = NextResponse.redirect(new URL('/auth', `https://${currentHost}`))
                response.cookies.delete('jwtToken')
                return response
            }
        } catch (error) {
            console.error('Token verification error:', error);
            // Treat as invalid token
            const response = NextResponse.redirect(new URL('/auth', `https://${currentHost}`))
            response.cookies.delete('jwtToken')
            return response
        }
    } else {
        // Token is not there
        if (currentHost === appHost) {
            // Redirect unauthenticated user from private host to public host
            return NextResponse.redirect(new URL('/auth', `https://${publicHost}`))
        } else if (privateRoutes.some(route => currentPath.startsWith(route))) {
            // Requested route is protected, redirect to /auth
            const url = new URL('/auth', `https://${currentHost}`)
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

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}