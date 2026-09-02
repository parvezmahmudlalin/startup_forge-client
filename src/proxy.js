import { NextResponse } from "next/server";
import { auth } from "./lib/auth";
import { cookies, headers } from "next/headers"; 

export async function proxy(request) {
   const session = await auth.api.getSession({
    headers: await headers()
   });

   if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
   }
}

export const config = {
  matcher: [
    '/profile', 
    '/dashboard',
    '/dashboard/:path*',
    '/admin/:path*',
    '/founder/:path*',
    
    '/collaborator/:path*',
    '/founder/opportunities/:path*', 
    '/founder/startups/:path*', 
    

  ],
};