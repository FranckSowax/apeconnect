import { createBrowserClient } from "@supabase/ssr";

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null;

// Create a chainable mock that returns itself for any method call
function createChainableMock(): Record<string, unknown> {
  const mockResult = { data: [], error: null };
  const mockSingleResult = { data: null, error: null };

  const chainable: Record<string, unknown> = {};

  const methods = [
    'select', 'insert', 'update', 'delete', 'upsert',
    'eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'like', 'ilike',
    'is', 'in', 'contains', 'containedBy', 'range', 'overlaps',
    'textSearch', 'match', 'not', 'or', 'filter',
    'order', 'limit', 'offset', 'range', 'single', 'maybeSingle',
    'csv', 'geojson', 'explain', 'rollback', 'returns'
  ];

  methods.forEach(method => {
    if (method === 'single' || method === 'maybeSingle') {
      chainable[method] = () => Promise.resolve(mockSingleResult);
    } else {
      chainable[method] = () => chainable;
    }
  });

  // Make it thenable so await works on it
  chainable.then = (resolve: (value: { data: unknown[]; error: null }) => unknown) => resolve(mockResult);

  return chainable;
}

export function createClient() {
  if (supabaseClient) {
    return supabaseClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock client for build time / SSR prerendering
    if (typeof window === "undefined") {
      return {
        auth: {
          getSession: async () => ({ data: { session: null }, error: null }),
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
          signInWithPassword: async () => ({ error: null }),
          signUp: async () => ({ error: null }),
          signOut: async () => ({ error: null }),
          signInWithOAuth: async () => ({ error: null }),
          resetPasswordForEmail: async () => ({ error: null }),
          updateUser: async () => ({ error: null }),
        },
        from: () => createChainableMock(),
        storage: {
          from: () => ({
            upload: async () => ({ error: null }),
            getPublicUrl: () => ({ data: { publicUrl: "" } }),
            remove: async () => ({ error: null }),
            list: async () => ({ data: [], error: null }),
          }),
        },
        rpc: async () => ({ data: null, error: null }),
        channel: () => ({
          on: () => ({ subscribe: () => ({ unsubscribe: () => {} }) }),
          subscribe: () => ({ unsubscribe: () => {} }),
        }),
      } as unknown as ReturnType<typeof createBrowserClient>;
    }
    throw new Error("Missing Supabase environment variables");
  }

  supabaseClient = createBrowserClient(supabaseUrl, supabaseAnonKey);
  return supabaseClient;
}
