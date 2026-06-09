import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Gate /admin/* on a valid Supabase session.
 *
 * - /admin/login is always reachable (so signed-out users can authenticate).
 * - Every other /admin/* path redirects to /admin/login when no session.
 * - Re-attaches refreshed Supabase cookies to the response so the session
 *   stays alive across navigations.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  // getUser() makes a network call to Supabase. If the network is flaky the
  // request would otherwise hang for undici's full 10s connect timeout on
  // every /admin/* navigation. Cap it at 3s and fail *closed* (treat as
  // signed-out) so a network blip can never bypass the auth gate.
  let user: Awaited<ReturnType<typeof supabase.auth.getUser>>["data"]["user"] =
    null;
  try {
    const result = await Promise.race([
      supabase.auth.getUser(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("supabase auth timeout")), 3000),
      ),
    ]);
    user = result.data.user;
  } catch {
    // Network/Supabase unreachable — leave user null so the guard below
    // redirects protected routes to /admin/login.
  }

  const isLoginRoute = pathname === "/admin/login";

  if (!user && !isLoginRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (user && isLoginRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
