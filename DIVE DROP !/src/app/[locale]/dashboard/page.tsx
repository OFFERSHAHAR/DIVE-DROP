import { useTranslations } from 'next-intl';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/actions';
import { Button } from '@/components/Button';
import { Card, CardBody, CardHeader } from '@/components/Card';

export default async function DashboardPage() {
  const t = useTranslations('navigation');
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-cyan-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-primary">
              {t('home')}
            </h1>
            <p className="text-text-secondary mt-2">
              Welcome back, {user.user_metadata?.first_name || 'Diver'}!
            </p>
          </div>
          <Button variant="secondary" size="md">
            {t('logout')}
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Total Dives', value: '0', icon: '🤿' },
            { label: 'Dive Sites', value: '0', icon: '🌊' },
            { label: 'Bottom Time', value: '0 hrs', icon: '⏱️' },
          ].map((stat) => (
            <Card key={stat.label} variant="elevated">
              <CardBody className="text-center">
                <div className="text-4xl mb-3">{stat.icon}</div>
                <p className="text-sm text-text-secondary">{stat.label}</p>
                <p className="text-3xl font-bold text-primary mt-1">{stat.value}</p>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <Card variant="elevated">
          <CardHeader>
            <h2 className="text-xl font-bold text-primary">Recent Dives</h2>
          </CardHeader>
          <CardBody>
            <p className="text-center text-text-secondary py-8">
              No dives recorded yet. Start exploring!
            </p>
            <div className="text-center">
              <Button variant="primary" size="lg">
                {t('explore')}
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
