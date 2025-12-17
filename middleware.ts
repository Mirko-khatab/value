import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

export const { auth: middleware } = NextAuth(authConfig);

export default middleware;

// Optionally wrap with custom logic
export async function customMiddleware(request: any) {
  // Force HTTPS redirect in production
  if (
    process.env.NODE_ENV === "production" &&
    request.headers.get("x-forwarded-proto") !== "https"
  ) {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    return NextResponse.redirect(url);
  }

  // Run NextAuth middleware
  return middleware(request);
}

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
  //   runtime: "nodejs",
};
