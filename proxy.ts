// proxy.ts
import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  //   const token = request.cookies.get("token")?.value;
  //   const { pathname } = request.nextUrl;
  //   // Public routes
  //   const publicRoutes = ["/"];
  //   const isPublicRoute = publicRoutes.includes(pathname);
  //   // Block access if not authenticated
  //   if (!token && !isPublicRoute) {
  //     return NextResponse.redirect(new URL("/", request.url));
  //   }
  //   return NextResponse.next();
  // }
  // export const config = {
  //   matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
}
