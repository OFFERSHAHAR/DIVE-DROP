import Link from 'next/link';
import { getLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/Button';
import { Card, CardBody } from '@/components/Card';
import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/types/supabase';

type DiveSite = Database['public']['Tables']['dive_sites']['Row'];

async function getFeaturedDiveSites(): Promise<DiveSite[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('dive_sites')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(6);
    return data || [];
  } catch (err) {
    console.error('Error fetching featured dive sites:', err);
    return [];
  }
}

export default async function HomePage() {
  const locale = await getLocale();
  const t = await getTranslations('home');
  const tExplore = await getTranslations('explore');
  const diveSites = await getFeaturedDiveSites();
  const isRTL = locale === 'he';

  return (
    <div className={`min-h-screen w-full bg-gradient-to-b from-light-bg via-blue-50 to-light-surface dark:from-dark-bg dark:via-dark-surface dark:to-dark-surface-elevated ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Hero Banner Section */}
      <section className="relative w-full h-screen sm:h-[600px] md:h-[700px] bg-gradient-to-r from-primary via-primary-dark to-primary-light overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10 dark:opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-accent/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        </div>

        {/* Hero Content */}
        <div className="relative h-full flex items-center justify-center px-4 sm:px-6">
          <div className="max-w-3xl text-center space-y-6 sm:space-y-8">
            {/* Icon */}
            <div className="inline-block mb-2 sm:mb-4">
              <div className="w-16 sm:w-20 h-16 sm:h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-5xl sm:text-6xl animate-bounce shadow-elevation-3">
                🤿
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
              {t('title')}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-blue-50 max-w-2xl mx-auto leading-relaxed px-2">
              {t('subtitle')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-6 sm:pt-8">
              <Link href={`/${locale}/auth/register`} className="w-full sm:w-auto">
                <Button size="lg" variant="primary" fullWidth={true} className="sm:w-auto font-semibold">
                  {t('register')}
                </Button>
              </Link>
              <Link href={`/${locale}/explore`} className="w-full sm:w-auto">
                <Button size="lg" variant="secondary" fullWidth={true} className="sm:w-auto border-white text-white bg-white/10 hover:bg-white/20 font-semibold">
                  {t('login')}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary dark:text-text-light mb-4">
            Why DiveDrop?
          </h2>
          <p className="text-base sm:text-lg text-text-secondary dark:text-text-secondary-light max-w-2xl mx-auto">
            Everything you need to explore, track, and share your diving adventures
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {[
            { icon: '🌍', label: 'Explore', desc: 'Discover dive sites worldwide' },
            { icon: '📊', label: 'Track', desc: 'Log and track your dives' },
            { icon: '👥', label: 'Connect', desc: 'Meet fellow divers' },
          ].map((feature) => (
            <Card key={feature.label} variant="elevated" hover={true} className="hover:translate-y-[-4px]">
              <CardBody className="flex flex-col items-center gap-4 text-center p-6 sm:p-8">
                <div className="text-5xl sm:text-6xl mb-2 group-hover:scale-110 transition-transform duration-base">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg sm:text-xl text-text-primary dark:text-text-light mb-2">
                    {feature.label}
                  </h3>
                  <p className="text-sm sm:text-base text-text-secondary dark:text-text-secondary-light leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Dive Sites Section */}
      {diveSites.length > 0 && (
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 max-w-6xl mx-auto">
          <div className="mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary dark:text-text-light mb-2 sm:mb-4">
              Featured Dive Sites
            </h2>
            <p className="text-base sm:text-lg text-text-secondary dark:text-text-secondary-light max-w-2xl">
              Explore some of our most popular dive destinations
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10 md:mb-12">
            {diveSites.slice(0, 6).map((site) => (
              <DiveSiteCardHome key={site.id} site={site} isRTL={isRTL} />
            ))}
          </div>

          <div className="flex justify-center">
            <Link href={`/${locale}/explore`}>
              <Button size="lg" variant="primary">
                Explore All Dive Sites →
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-accent via-cyan-accent to-accent-light py-12 sm:py-16 md:py-20 px-4 sm:px-6 mt-12 sm:mt-16">
        <div className="max-w-3xl mx-auto text-center text-white space-y-6 sm:space-y-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            Ready to Dive?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/95 max-w-2xl mx-auto leading-relaxed">
            Join thousands of divers and start exploring the underwater world today
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-6 sm:pt-8">
            <Link href={`/${locale}/auth/register`} className="w-full sm:w-auto">
              <Button size="lg" variant="primary" fullWidth={true} className="sm:w-auto bg-white text-primary hover:bg-blue-50 font-semibold">
                Get Started Now
              </Button>
            </Link>
            <Link href={`/${locale}/explore`} className="w-full sm:w-auto">
              <Button size="lg" variant="secondary" fullWidth={true} className="sm:w-auto border-white text-white bg-white/10 hover:bg-white/20 font-semibold">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

interface DiveSiteCardHomeProps {
  site: DiveSite;
  isRTL: boolean;
}

function DiveSiteCardHome({ site, isRTL }: DiveSiteCardHomeProps) {
  const difficultyColors = {
    easy: 'bg-success-easy/15 text-success-easy',
    intermediate: 'bg-warning-intermediate/15 text-warning-intermediate',
    hard: 'bg-error-hard/15 text-error-hard',
  };

  const difficultyBadgeClasses = {
    easy: 'bg-success-easy text-white',
    intermediate: 'bg-warning-intermediate text-black',
    hard: 'bg-error-hard text-white',
  };

  const difficultyIcons = {
    easy: '🟢',
    intermediate: '🟡',
    hard: '🔴',
  };

  return (
    <Card variant="elevated" hover={true} className="h-full overflow-hidden cursor-pointer group">
      {/* Image Container - Aspect Ratio Square */}
      <div className="w-full aspect-square bg-gradient-to-br from-accent/30 to-primary/30 overflow-hidden relative">
        {site.image_url ? (
          <img
            src={site.image_url}
            alt={site.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-primary/20 to-accent/20">
            🌊
          </div>
        )}

        {/* Difficulty Badge - Positioned in Top-Left Corner */}
        <div className={`absolute top-3 sm:top-4 ${isRTL ? 'right-3 sm:right-4' : 'left-3 sm:left-4'}`}>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold ${
              difficultyBadgeClasses[site.difficulty as keyof typeof difficultyBadgeClasses] ||
              difficultyBadgeClasses.easy
            } shadow-elevation-2 backdrop-blur-sm`}
          >
            {difficultyIcons[site.difficulty as keyof typeof difficultyIcons] || '🔵'}
            <span className="hidden sm:inline capitalize">{site.difficulty}</span>
          </span>
        </div>
      </div>

      {/* Content Section */}
      <CardBody className="flex flex-col gap-3 sm:gap-4">
        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold text-text-primary dark:text-text-light line-clamp-2">
          {site.name}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-text-secondary dark:text-text-secondary-light">
          <span className="text-base">📍</span>
          <span className="line-clamp-1">{site.location}</span>
        </div>

        {/* Depth Info */}
        <div className="flex items-center gap-3 py-3 px-3 bg-bg-secondary dark:bg-dark-surface-elevated rounded-md border border-border-primary dark:border-border-dark">
          <span className="text-lg">🌊</span>
          <div>
            <p className="text-xs text-text-tertiary dark:text-text-secondary">Max Depth</p>
            <p className="font-semibold text-text-primary dark:text-text-light">{site.depth}m</p>
          </div>
        </div>

        {/* Description */}
        {site.description && (
          <p className="text-xs sm:text-sm text-text-secondary dark:text-text-secondary-light line-clamp-2 leading-relaxed">
            {site.description}
          </p>
        )}
      </CardBody>
    </Card>
  );
}
