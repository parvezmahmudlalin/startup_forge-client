import { NextResponse } from "next/server";
import { auth } from "./lib/auth";
import { cookies, headers } from "next/headers"; 

export async function proxy(request) {
   const session = await auth.api.getSession({
    headers: await headers()
   }) 

//    if(session?.user?.plan === "free") {
//     return NextResponse.redirect(new URL('/pricing', request.url))
   
   if(!session){
    return NextResponse.redirect(new URL('/login', request.url))
   }
}



export const config = {
    matcher: ['/profile', '/dashboard']
}
