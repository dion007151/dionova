import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Only run this logic for /admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    let isAuthenticated = false;

    // 1. Check real Supabase Auth session if keys are present
    if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes("your-project-id")) {
      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      });

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        isAuthenticated = true;
      }
    }

    // 2. Check fallback mock session cookie
    if (!isAuthenticated) {
      const mockCookie = request.cookies.get("dionova_mock_user")?.value;
      if (mockCookie) {
        try {
          const parsed = JSON.parse(decodeURIComponent(mockCookie));
          if (parsed && parsed.email) {
            isAuthenticated = true;
          }
        } catch (e) {
          console.error("Error parsing mock session cookie:", e);
        }
      }
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
