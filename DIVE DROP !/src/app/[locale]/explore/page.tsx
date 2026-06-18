import { getLocale } from 'next-intl/server';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';
import ExploreClient from './client';

type DiveSite = Database['public']['Tables']['dive_sites']['Row'];

export const dynamic = 'force-dynamic';

// Server function to fetch dive sites
async function getDiveSites(): Promise<{ sites: DiveSite[]; error?: string }> {
  try {
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase
      .from('dive_sites')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return { sites: [], error: error.message };
    }

    return { sites: data || [] };
  } catch (err) {
    console.error('Error fetching dive sites:', err);
    return {
      sites: [],
      error: err instanceof Error ? err.message : 'Failed to fetch dive sites',
    };
  }
}

export default async function ExplorePage() {
  const locale = await getLocale();
  const { sites: diveSites, error: fetchError } = await getDiveSites();

  return (
    <ExploreClient
      initialDiveSites={diveSites}
      initialError={fetchError}
      locale={locale}
    />
  );
}
