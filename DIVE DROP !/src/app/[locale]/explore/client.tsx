'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardBody } from '@/components/Card';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import type { Database } from '@/types/supabase';

type DiveSite = Database['public']['Tables']['dive_sites']['Row'];
type Difficulty = 'easy' | 'intermediate' | 'hard';

interface ExploreClientProps {
  initialDiveSites: DiveSite[];
  initialError?: string;
  locale: string;
}

export default function ExploreClient({
  initialDiveSites,
  initialError,
  locale,
}: ExploreClientProps) {
  const t = useTranslations();
  const isRTL = locale === 'he';

  // State management
  const [diveSites] = useState<DiveSite[]>(initialDiveSites);
  const [filteredSites, setFilteredSites] = useState<DiveSite[]>(initialDiveSites);
  const [error] = useState<string | null>(initialError || null);

  // Filter and search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all');

  // Filter and search logic
  useEffect(() => {
    let filtered = diveSites;

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter((site) => site.difficulty === selectedDifficulty);
    }

    // Search by name or location
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (site) =>
          site.name.toLowerCase().includes(query) ||
          site.location.toLowerCase().includes(query)
      );
    }

    setFilteredSites(filtered);
  }, [diveSites, searchQuery, selectedDifficulty]);

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedDifficulty('all');
  };

  return (
    <div className={`min-h-screen bg-bg-primary transition-colors duration-200 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Safe area padding */}
      <style>{`
        :root {
          --safe-area-inset-top: env(safe-area-inset-top);
          --safe-area-inset-bottom: env(safe-area-inset-bottom);
        }
      `}</style>

      {/* Header Section */}
      <header className="sticky top-0 z-50 bg-gradient-to-b from-bg-primary to-bg-secondary border-b border-border-secondary shadow-1">
        <div className="container-safe max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Title */}
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-2">
              {t('navigation.explore')}
            </h1>
            <p className="text-text-secondary text-sm sm:text-base">
              {t('explore.subtitle')}
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <Input
                id="search-sites"
                type="text"
                placeholder={t('explore.search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
                aria-label={t('explore.search_label')}
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 text-text-tertiary hover:text-text-primary transition-colors touch-target"
                  aria-label={t('common.cancel')}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <div className="flex-1 sm:flex-none">
              <label
                htmlFor="difficulty-filter"
                className="block text-sm font-medium text-text-primary mb-2 sm:mb-0 sm:mr-3"
              >
                {t('explore.filter_difficulty')}:
              </label>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedDifficulty('all')}
                className={`px-4 py-2.5 rounded-md text-sm font-medium transition-all touch-target ${
                  selectedDifficulty === 'all'
                    ? 'bg-primary text-white shadow-2'
                    : 'bg-bg-secondary border border-border-primary text-text-primary hover:border-primary'
                }`}
              >
                {t('explore.all')}
              </button>

              {(['easy', 'intermediate', 'hard'] as const).map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className={`px-4 py-2.5 rounded-md text-sm font-medium transition-all touch-target whitespace-nowrap ${
                    selectedDifficulty === difficulty
                      ? getDifficultyBadgeClass(difficulty) + ' ring-2 ring-offset-2'
                      : 'bg-bg-secondary border border-border-primary text-text-primary hover:border-primary'
                  }`}
                >
                  {getDifficultyIcon(difficulty)} {t(`explore.difficulty_${difficulty}`)}
                </button>
              ))}
            </div>

            {/* Clear filters button */}
            {(searchQuery || selectedDifficulty !== 'all') && (
              <button
                onClick={handleClearFilters}
                className="px-4 py-2.5 text-sm font-medium text-accent hover:text-accent-light transition-colors"
                aria-label={t('explore.clear_filters')}
              >
                {t('explore.clear')}
              </button>
            )}
          </div>

          {/* Result count */}
          <div className="mt-4 text-sm text-text-secondary">
            {t('explore.showing_results', {
              count: filteredSites.length,
              total: diveSites.length,
            })}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-safe max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
        {/* Error State */}
        {error && (
          <div className="bg-error/10 border border-error rounded-lg p-6 mb-6">
            <p className="text-error font-semibold mb-2">{t('common.error')}</p>
            <p className="text-error/80 text-sm">{error}</p>
            <Button onClick={() => window.location.reload()} variant="danger" className="mt-4">
              {t('common.tryAgain')}
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!error && filteredSites.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-text-primary mb-2 text-center">
              {t('explore.no_sites_found')}
            </h2>
            <p className="text-text-secondary text-center max-w-md mb-6">
              {searchQuery || selectedDifficulty !== 'all'
                ? t('explore.no_results_try')
                : t('explore.no_sites_yet')}
            </p>
            {(searchQuery || selectedDifficulty !== 'all') && (
              <Button onClick={handleClearFilters} variant="primary">
                {t('explore.reset_filters')}
              </Button>
            )}
          </div>
        )}

        {/* Grid Layout - Responsive */}
        {!error && filteredSites.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
            {filteredSites.map((site) => (
              <DiveSiteCard key={site.id} site={site} locale={locale} isRTL={isRTL} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

/**
 * Utility functions
 */
function getDifficultyBadgeClass(difficulty: Difficulty): string {
  const baseClass =
    'inline-block px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap touch-target';

  switch (difficulty) {
    case 'easy':
      return `${baseClass} bg-success/20 text-success`;
    case 'intermediate':
      return `${baseClass} bg-warning/20 text-warning`;
    case 'hard':
      return `${baseClass} bg-error/20 text-error`;
    default:
      return baseClass;
  }
}

function getDifficultyIcon(difficulty: Difficulty): string {
  switch (difficulty) {
    case 'easy':
      return '🟢';
    case 'intermediate':
      return '🟡';
    case 'hard':
      return '🔴';
    default:
      return '🔵';
  }
}

/**
 * DiveSiteCard Component
 * Displays individual dive site information in a grid card
 */
interface DiveSiteCardProps {
  site: DiveSite;
  locale: string;
  isRTL: boolean;
}

function DiveSiteCard({ site, locale, isRTL }: DiveSiteCardProps) {
  const t = useTranslations();

  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-success/20 text-success';
      case 'intermediate':
        return 'bg-warning/20 text-warning';
      case 'hard':
        return 'bg-error/20 text-error';
      default:
        return 'bg-primary/20 text-primary';
    }
  };

  const getDifficultyIconCard = (difficulty: Difficulty): string => {
    switch (difficulty) {
      case 'easy':
        return '🟢';
      case 'intermediate':
        return '🟡';
      case 'hard':
        return '🔴';
      default:
        return '🔵';
    }
  };

  return (
    <Card
      variant="elevated"
      className={`h-full flex flex-col overflow-hidden hover:shadow-3 transition-all duration-200 ${
        isRTL ? 'rtl' : 'ltr'
      }`}
    >
      {/* Image Section */}
      {site.image_url && (
        <div className="w-full h-48 bg-gradient-to-br from-accent/30 to-primary/30 overflow-hidden relative">
          <img
            src={site.image_url}
            alt={site.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute top-3 right-3 sm:right-3 md:left-3 md:right-auto">
            <span
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold ${getDifficultyColor(
                site.difficulty as Difficulty
              )} bg-white shadow-1`}
            >
              <span>{getDifficultyIconCard(site.difficulty as Difficulty)}</span>
              <span>{t(`explore.difficulty_${site.difficulty}`)}</span>
            </span>
          </div>
        </div>
      )}

      {/* Content Section */}
      <CardBody className="flex-1 flex flex-col gap-3">
        {/* Site Name */}
        <h3 className="text-lg font-bold text-text-primary line-clamp-2 leading-tight">
          {site.name}
        </h3>

        {/* Location with icon */}
        <div className="flex items-start gap-2">
          <span className="text-lg mt-0.5 flex-shrink-0">📍</span>
          <p className="text-sm text-text-secondary break-words">{site.location}</p>
        </div>

        {/* Depth info */}
        <div className="flex items-center gap-2 py-2 px-3 bg-bg-tertiary rounded-md">
          <span className="text-base">🌊</span>
          <div className="flex-1">
            <p className="text-xs text-text-tertiary">{t('explore.max_depth')}</p>
            <p className="text-sm font-semibold text-text-primary">{site.depth}m</p>
          </div>
        </div>

        {/* Description */}
        {site.description && (
          <p className="text-sm text-text-secondary line-clamp-3 leading-relaxed">
            {site.description}
          </p>
        )}
      </CardBody>

      {/* Footer / Action */}
      <div className="px-6 py-4 border-t border-border-secondary bg-bg-secondary flex gap-2">
        <Button
          variant="primary"
          size="sm"
          fullWidth
          onClick={() => {
            // TODO: Navigate to site details or add to dive plan
            console.log('View site details:', site.id);
          }}
        >
          {t('explore.view_details')}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          fullWidth
          onClick={() => {
            // TODO: Add to favorites or start dive plan
            console.log('Add to favorites:', site.id);
          }}
        >
          {t('explore.add_favorite')}
        </Button>
      </div>
    </Card>
  );
}
