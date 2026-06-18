import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/supabase';

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          if (typeof document === 'undefined') {
            return [];
          }
          const cookieString = document.cookie;
          return cookieString
            .split(';')
            .map((c) => ({
              name: c.split('=')[0].trim(),
              value: decodeURIComponent(c.split('=')[1]),
            }))
            .filter((c) => c.name && c.value);
        },
        setAll(cookiesToSet) {
          if (typeof document === 'undefined') {
            return;
          }
          cookiesToSet.forEach(({ name, value, options }) => {
            const cookieString = `${name}=${encodeURIComponent(value)}`;
            document.cookie = `${cookieString}; path=/; ${
              options?.maxAge ? `max-age=${options.maxAge}; ` : ''
            }${options?.expires ? `expires=${options.expires.toUTCString()}; ` : ''}`;
          });
        },
        remove(names) {
          if (typeof document === 'undefined') {
            return;
          }
          names.forEach((name) => {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
          });
        },
      },
    }
  );
}
