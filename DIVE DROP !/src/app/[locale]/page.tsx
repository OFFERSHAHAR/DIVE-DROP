import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/Button';

export default function HomePage() {
  const t = useTranslations('home');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-cyan-50 px-4">
      {/* Hero Section */}
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-5xl md:text-6xl font-bold text-primary">
          {t('title')}
        </h1>
        <p className="text-xl text-text-secondary">
          {t('subtitle')}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link href="/auth/register">
            <Button size="lg" variant="primary">
              {t('register')}
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button size="lg" variant="secondary">
              {t('login')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
        {[
          { icon: '🌊', label: 'Explore' },
          { icon: '🐚', label: 'Discover' },
          { icon: '🤿', label: 'Adventure' },
        ].map((feature) => (
          <div
            key={feature.label}
            className="flex flex-col items-center gap-3 p-6 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="text-4xl">{feature.icon}</div>
            <p className="font-semibold text-text-primary">{feature.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
