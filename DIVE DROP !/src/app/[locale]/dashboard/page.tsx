import { redirect } from 'next/navigation';
import { getLocale } from 'next-intl/server';
import { getCurrentUser } from '@/lib/auth/actions';
import { createClient } from '@/lib/supabase/server';
import { Card, CardBody, CardHeader } from '@/components/Card';
import { Button } from '@/components/Button';
import { BottomNavigation, BottomNavigationPresets } from '@/components/templates/BottomNavigation';
import { LogoutButton } from '@/components/LogoutButton';
import Link from 'next/link';

interface DiveStats {
  totalDives: number;
  uniqueSites: number;
  totalBottomTime: number;
  averageDepth: number;
  latestDiveDate: string | null;
}

interface RecentDive {
  id: string;
  siteName: string;
  date: string;
  depth: number | null;
  bottomTime: number;
}

interface RecommendedSite {
  id: string;
  name: string;
  location: string;
  difficulty: 'easy' | 'intermediate' | 'hard';
  depth: number;
  imageUrl: string | null;
}

async function getDiveStats(userId: string): Promise<DiveStats> {
  const supabase = await createClient();

  // Get total dives
  const { count: diveCount } = await supabase
    .from('dive_logs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  const safeDiveCount = diveCount || 0;

  // Get unique sites
  const { data: siteData } = await supabase
    .from('dive_logs')
    .select('dive_site_id')
    .eq('user_id', userId);

  const safeSiteData = siteData || [];

  // Get total bottom time and average depth
  const { data: statsData } = await supabase
    .from('dive_logs')
    .select('bottom_time_minutes, max_depth_m, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  const safeStatsData = statsData || [];
  const totalBottomTime = safeStatsData.reduce((sum, dive) => sum + (dive.bottom_time_minutes || 0), 0);
  const depths = safeStatsData
    .map((dive) => dive.max_depth_m)
    .filter((depth): depth is number => depth !== null);
  const averageDepth =
    depths.length > 0 ? Math.round((depths.reduce((a, b) => a + b, 0) / depths.length) * 10) / 10 : 0;

  const latestDiveDate = safeStatsData.length > 0 ? safeStatsData[0].created_at : null;

  return {
    totalDives: safeDiveCount,
    uniqueSites: new Set(safeSiteData.map((d) => d.dive_site_id)).size,
    totalBottomTime,
    averageDepth,
    latestDiveDate,
  };
}

async function getRecentDives(userId: string, limit: number = 5): Promise<RecentDive[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('dive_logs')
    .select('id, dive_site_id, created_at, max_depth_m, bottom_time_minutes')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  const safeData = data || [];

  // Fetch dive site names
  const diveIds = safeData.map((d) => d.dive_site_id).filter((id): id is string => id !== null);
  let siteMap: Record<string, string> = {};

  if (diveIds.length > 0) {
    const { data: sites } = await supabase
      .from('dive_sites')
      .select('id, name')
      .in('id', diveIds);

    if (sites) {
      siteMap = Object.fromEntries(sites.map((s) => [s.id, s.name]));
    }
  }

  return safeData.map((dive) => ({
    id: dive.id,
    siteName: dive.dive_site_id ? siteMap[dive.dive_site_id] || 'Unknown Site' : 'Unknown Site',
    date: new Date(dive.created_at).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    depth: dive.max_depth_m,
    bottomTime: dive.bottom_time_minutes,
  }));
}

async function getRecommendedSites(limit: number = 3): Promise<RecommendedSite[]> {
  const supabase = await createClient();

  // Get all sites and shuffle to show random ones
  const { data } = await supabase
    .from('dive_sites')
    .select('id, name, location, difficulty, depth, image_url')
    .limit(100);

  const safeData = data || [];

  // Shuffle and pick random sites
  const shuffled = [...safeData].sort(() => Math.random() - 0.5);

  return shuffled.slice(0, limit).map((site) => ({
    id: site.id,
    name: site.name,
    location: site.location,
    difficulty: site.difficulty as 'easy' | 'intermediate' | 'hard',
    depth: site.depth,
    imageUrl: site.image_url,
  }));
}

const difficultyColors = {
  easy: 'text-green-600 bg-green-50',
  intermediate: 'text-yellow-600 bg-yellow-50',
  hard: 'text-red-600 bg-red-50',
};

const difficultyBadgeClasses = {
  easy: 'bg-green-100 text-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700',
  hard: 'bg-red-100 text-red-700',
};

function StatCard({ icon, label, value, unit }: { icon: string; label: string; value: string | number; unit?: string }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-text-secondary mb-1">{label}</p>
          <p className="text-2xl font-bold text-text-primary">
            {value}
            {unit && <span className="text-sm text-text-secondary ml-1">{unit}</span>}
          </p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </Card>
  );
}

async function DashboardContent({ locale, userId, userName }: { locale: string; userId: string; userName?: string }) {
  const [stats, recentDives, recommendedSites] = await Promise.all([
    getDiveStats(userId),
    getRecentDives(userId),
    getRecommendedSites(3),
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-cyan-50 pb-24 md:pb-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                {userName ? `Welcome back, ${userName.split(' ')[0]}!` : 'Welcome back!'}
              </h1>
              <p className="text-blue-100 mt-1">Track your underwater adventures</p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
          <StatCard icon="🤿" label="Total Dives" value={stats.totalDives} />
          <StatCard icon="🌊" label="Dive Sites" value={stats.uniqueSites} />
          <StatCard icon="⏱️" label="Bottom Time" value={stats.totalBottomTime} unit="min" />
          <StatCard icon="📊" label="Avg Depth" value={stats.averageDepth} unit="m" />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Recent Dives Section */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-text-primary">Recent Dives</h2>
                  <Link href={`/${locale}/my-dives`}>
                    <Button variant="ghost" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardBody className="p-0">
                {recentDives.length > 0 ? (
                  <div className="divide-y divide-border-secondary">
                    {recentDives.map((dive) => (
                      <div key={dive.id} className="px-6 py-4 hover:bg-bg-secondary transition-colors">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-text-primary">{dive.siteName}</p>
                            <p className="text-sm text-text-secondary">{dive.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-text-primary">
                              {dive.depth ? `${dive.depth}m` : 'N/A'} • {dive.bottomTime}min
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-6 py-12 text-center">
                    <p className="text-text-secondary mb-4">No dives logged yet</p>
                    <Link href={`/${locale}/explore`}>
                      <Button variant="primary" size="md">
                        Explore Dive Sites
                      </Button>
                    </Link>
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Latest Dive Info */}
            {stats.latestDiveDate && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-text-secondary">
                  Last dive:{' '}
                  <span className="font-semibold text-primary">
                    {new Date(stats.latestDiveDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* Recommended Sites Section */}
          <div>
            <Card>
              <CardHeader>
                <h2 className="text-xl font-bold text-text-primary">Recommended Sites</h2>
              </CardHeader>
              <CardBody className="p-0 space-y-1">
                {recommendedSites.map((site) => (
                  <div key={site.id} className="border-b border-border-secondary last:border-b-0">
                    <div className="px-6 py-4 hover:bg-bg-secondary transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-text-primary text-sm">{site.name}</p>
                          <p className="text-xs text-text-secondary">{site.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded ${
                            difficultyBadgeClasses[site.difficulty]
                          }`}
                        >
                          {site.difficulty}
                        </span>
                        <span className="text-xs text-text-secondary">{site.depth}m</span>
                      </div>
                      <Link href={`/${locale}/explore`}>
                        <Button variant="outline" size="sm" fullWidth>
                          Explore
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </CardBody>
            </Card>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation
        items={BottomNavigationPresets.diveDropMain('home').map((item) => ({
          ...item,
          href: `/${locale}${item.href}`,
        }))}
        activeId="home"
      />
    </div>
  );
}

export default async function DashboardPage() {
  const locale = await getLocale();
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  // Get user profile info
  const supabase = await createClient();
  const { data: profile } = await supabase.from('users').select('first_name, last_name').eq('id', user.id).single();

  const userName = profile ? `${profile.first_name} ${profile.last_name}` : user.email;

  return <DashboardContent locale={locale} userId={user.id} userName={userName} />;
}
