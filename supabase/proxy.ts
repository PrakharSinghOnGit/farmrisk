import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";
import { AUTH_CONFIG } from "@/lib/auth/config";
import { DEV_SESSION_COOKIE, isDevAuthEnabled } from "@/lib/auth/dev";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    return response;
  }

  const supabase = createServerClient<Database>(url, publishableKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isDevSession =
    isDevAuthEnabled() && request.cookies.get(DEV_SESSION_COOKIE)?.value === "1";

  const isDashboardRoute = request.nextUrl.pathname.startsWith("/dashboard");
  const isChoiceRoute = request.nextUrl.pathname === "/dashboard/choice";
  const isRootDashboard = request.nextUrl.pathname === "/dashboard";
  const isLoginRoute = request.nextUrl.pathname === AUTH_CONFIG.loginPath;

  if (!user && !isDevSession && isDashboardRoute && !isRootDashboard && !isChoiceRoute) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = AUTH_CONFIG.loginPath;
    loginUrl.searchParams.set(
      "next",
      `${request.nextUrl.pathname}${request.nextUrl.search}`,
    );
    return NextResponse.redirect(loginUrl);
  }

  if ((user || isDevSession) && isLoginRoute) {
    return NextResponse.redirect(
      new URL(AUTH_CONFIG.authenticatedPath, request.url),
    );
  }

  return response;
}
