import { NextRequest, NextResponse } from "next/server";
import { betterFetch } from "@better-fetch/fetch";
import { Session } from "./lib/types/better-auth.types";

export async function middleware(request: NextRequest) {
  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get("cookie") || "", // Forward the cookies from the request
      },
    }
  );

  if (!session) {
    return NextResponse.redirect(
      new URL(`/auth/login/?redirect=${request.nextUrl.pathname}`, request.url)
    );
  }
  if (session.user.role !== "VENDOR") {
    if ((
      request.nextUrl.pathname === "/api/vendors/store" &&
      request.method === "POST"
    )|| request.nextUrl.pathname==="/store/create" || request.nextUrl.pathname==="/checkout") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/discover", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?:vendor|api\\/vendors|store|api\\/stores).*)"],
};
