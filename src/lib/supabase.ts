import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function createClient() {
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes("your-project-id")) {
    // Return a mock/dummy Supabase client for preview/development when keys are missing
    console.warn("Supabase keys are missing or placeholders. Using mock client.");
    return {
      auth: {
        async getSession() {
          if (typeof window !== "undefined") {
            const user = localStorage.getItem("dionova_mock_user");
            if (user) return { data: { session: { user: JSON.parse(user) } }, error: null };
          }
          return { data: { session: null }, error: null };
        },
        async getUser() {
          if (typeof window !== "undefined") {
            const user = localStorage.getItem("dionova_mock_user");
            if (user) return { data: { user: JSON.parse(user) }, error: null };
          }
          return { data: { user: null }, error: null };
        },
        async signUp({ email, password, options }: any) {
          const user = { id: "mock-user-id", email, user_metadata: options?.data || {} };
          if (typeof window !== "undefined") {
            localStorage.setItem("dionova_mock_user", JSON.stringify(user));
          }
          return { data: { user, session: { user } }, error: null };
        },
        async signInWithPassword({ email }: any) {
          const user = { id: "mock-user-id", email, user_metadata: { name: email.split("@")[0] } };
          if (typeof window !== "undefined") {
            localStorage.setItem("dionova_mock_user", JSON.stringify(user));
          }
          return { data: { user, session: { user } }, error: null };
        },
        async signOut() {
          if (typeof window !== "undefined") {
            localStorage.removeItem("dionova_mock_user");
          }
          return { error: null };
        },
        onAuthStateChange(callback: any) {
          // Send initial state
          if (typeof window !== "undefined") {
            const user = localStorage.getItem("dionova_mock_user");
            const session = user ? { user: JSON.parse(user) } : null;
            callback(user ? "SIGNED_IN" : "SIGNED_OUT", session);
          }
          return { data: { subscription: { unsubscribe() {} } } };
        }
      }
    } as any;
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
