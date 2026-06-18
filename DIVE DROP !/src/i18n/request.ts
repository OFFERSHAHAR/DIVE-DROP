import { getRequestConfig } from 'next-intl/server';
import enMessages from './messages/en.json';
import heMessages from './messages/he.json';

export default getRequestConfig(async ({ locale }) => {
  const messages = locale === 'he' ? heMessages : enMessages;
  return {
    messages,
  };
});
