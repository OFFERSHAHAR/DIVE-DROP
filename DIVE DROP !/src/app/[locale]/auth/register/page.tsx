'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { Card, CardBody, CardHeader } from '@/components/Card';
import { Input } from '@/components/Input';
import { registerAction } from '@/lib/auth/actions';
import { registerSchema, type RegisterInput } from '@/lib/auth/schemas';
import { ZodError } from 'zod';

export default function RegisterPage() {
  const t = useTranslations('auth');
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterInput, string>>>({});
  const [globalError, setGlobalError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<RegisterInput>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof RegisterInput]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGlobalError('');
    setErrors({});
    setLoading(true);

    try {
      // Validate form data
      registerSchema.parse(formData);

      const result = await registerAction(formData);

      if (result.error) {
        setGlobalError(result.error);
      } else if (result.success) {
        // Redirect to login or verification page
        router.push(`/${locale}/auth/login?registered=true`);
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Partial<Record<keyof RegisterInput, string>> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof RegisterInput] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        setGlobalError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card variant="elevated">
      <CardHeader>
        <h1 className="text-2xl font-bold text-center text-primary">{t('register_title')}</h1>
        <p className="text-center text-text-secondary mt-2 text-sm">{t('register_subtitle')}</p>
      </CardHeader>

      <CardBody className="space-y-4">
        {globalError && (
          <div className="p-3 bg-red-50 border border-error rounded-md text-error text-sm">
            {globalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label={t('first_name')}
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              error={errors.firstName}
              required
              disabled={loading}
            />
            <Input
              label={t('last_name')}
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              error={errors.lastName}
              required
              disabled={loading}
            />
          </div>

          <Input
            label={t('email')}
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
            fullWidth
            disabled={loading}
          />

          <Input
            label={t('password')}
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
            fullWidth
            helperText={t('password_hint')}
            disabled={loading}
          />

          <Input
            label={t('confirm_password')}
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
            fullWidth
            disabled={loading}
          />

          <Button type="submit" fullWidth size="lg" loading={loading}>
            {t('register_button')}
          </Button>
        </form>

        <div className="text-center text-sm">
          <span className="text-text-secondary">{t('have_account')} </span>
          <Link href={`/${locale}/auth/login`} className="text-primary font-semibold hover:underline">
            {t('login_link')}
          </Link>
        </div>
      </CardBody>
    </Card>
  );
}
