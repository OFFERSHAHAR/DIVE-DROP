'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { logoutAction } from '@/lib/auth/actions';
import { useState } from 'react';

export function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logoutAction();
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="secondary"
      size="md"
      onClick={handleLogout}
      loading={isLoading}
      className="!text-white !border-white hover:!bg-white hover:!text-primary"
    >
      Logout
    </Button>
  );
}
