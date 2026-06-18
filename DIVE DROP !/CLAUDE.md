# DiveDrop Project Documentation

## Project Overview

**DiveDrop** is a Next.js 15 web application for underwater diving enthusiasts. It enables users to:
- Discover and explore dive sites
- Track dive logs and experiences
- Connect with the diving community
- Manage diving profiles and certifications

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Internationalization**: next-intl (English + Hebrew, with RTL support)
- **Form Validation**: Zod + React Hook Form
- **State Management**: Zustand
- **Code Quality**: ESLint, Prettier, TypeScript strict mode

## Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout with i18n wrapper
│   ├── globals.css          # Global styles + safe area insets
│   ├── [locale]/            # Locale-based routing
│   │   ├── page.tsx         # Home page
│   │   ├── layout.tsx       # Locale layout wrapper
│   │   ├── auth/
│   │   │   ├── layout.tsx   # Auth layout wrapper
│   │   │   ├── register/    # Registration page
│   │   │   ├── login/       # Login page
│   │   │   └── forgot-password/
│   │   └── dashboard/       # Protected dashboard area
│
├── components/               # Reusable React components
│   ├── Button.tsx           # Primary CTA component
│   ├── Card.tsx             # Card with header/body/footer
│   ├── Input.tsx            # Text input component
│
├── lib/
│   ├── supabase/            # Supabase integration
│   │   ├── client.ts        # Browser client (hooks)
│   │   └── server.ts        # Server client (RSC/actions)
│   └── auth/                # Authentication logic
│       ├── actions.ts       # Server actions (register, login)
│       ├── schemas.ts       # Zod validation schemas
│
├── hooks/
│   └── useAuth.ts           # Auth state management hook
│
├── utils/
│   ├── cn.ts                # Class name combiner
│   ├── logger.ts            # Structured logging
│   └── validation.ts        # Form validation helpers
│
├── store/
│   └── authStore.ts         # Zustand auth store
│
├── types/
│   └── supabase.ts          # Database type definitions
│
├── i18n/
│   ├── request.ts           # i18n configuration
│   └── messages/
│       ├── en.json          # English translations
│       └── he.json          # Hebrew translations (RTL)
│
├── middleware.ts            # next-intl routing middleware
├── styles/
│   └── design-system.css    # Design system (from Designer)
│
└── (other supporting files)
```

## Key Features

### Authentication Flow
1. **Register** - Email validation, password strength check, profile creation
2. **Login** - Email/password authentication with session management
3. **Logout** - Secure session cleanup
4. **Protected Routes** - Middleware protection for authenticated areas

### Internationalization
- **Languages**: English (LTR) and Hebrew (RTL)
- **Strategy**: URL-based routing with locale prefix (`/en/*`, `/he/*`)
- **Fallback**: English is the default locale
- **Direction**: Automatic HTML `dir` attribute based on locale

### Design System
- **Colors**: 40+ semantic colors (primary, accent, status)
- **Typography**: 7 font sizes with proper line heights
- **Spacing**: 8px grid system (8px - 80px)
- **Elevation**: Shadow system for depth
- **Animations**: 6 animation types (fade, slide, scale, bounce, shake, shimmer)
- **Accessibility**: WCAG AA compliant, keyboard navigation, dark mode

### Mobile Optimization
- **Safe Areas**: Support for notch/Dynamic Island (iOS)
- **Touch Targets**: 44px minimum for easy interaction
- **Font Size**: 16px+ to prevent zoom on input focus
- **Responsive**: Mobile-first design with breakpoints at 320px+
- **Performance**: Image optimization, font subsetting

## Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Installation
```bash
# Install dependencies
npm install

# Create environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

### Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DEFAULT_LOCALE=en
NEXT_PUBLIC_LOCALES=en,he
```

### Running Locally
```bash
# Development server
npm run dev
# App runs at http://localhost:3000

# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format

# Build for production
npm run build
npm start
```

## Authentication Implementation

### Server Actions (Safe for Mutations)
- `registerAction()` - Create new user account
- `loginAction()` - Authenticate user
- `logoutAction()` - End user session
- `getCurrentUser()` - Fetch authenticated user

### Client Hook
- `useAuth()` - Get current user + loading state, syncs with Supabase

### Validation Schemas (Zod)
- `registerSchema` - Email, password (8+ chars, mixed case, numbers), names
- `loginSchema` - Email, password (any format for existing users)
- `completeProfileSchema` - Optional fields: bio, diving experience, location

### Error Handling
- All actions return `{ success?, error?, message? }`
- Client-side validation before submit
- Server-side validation + Supabase error messages
- Type-safe error responses

## Security Considerations

1. **Authentication Tokens**
   - Stored in http-only cookies
   - Automatically managed by Supabase SSR
   - Never exposed to JavaScript

2. **Input Validation**
   - Zod validation on client & server
   - Password strength enforcement
   - Email format validation
   - Max length checks

3. **Security Headers**
   - X-Content-Type-Options: nosniff
   - X-Frame-Options: DENY
   - X-XSS-Protection: enabled
   - CSP ready (not yet enforced)

4. **CSRF Protection**
   - Built into Next.js server actions
   - Token validation on POST/PUT/DELETE

5. **Secrets Management**
   - Service role key never exposed to browser
   - All sensitive operations via server actions

## Styling Guide

### Using Tailwind Classes

#### Colors
```tsx
// Using design system colors
<div className="bg-primary text-primary">
<div className="border border-primary text-secondary">
<div className="bg-error">
```

#### Spacing
```tsx
// Using 8px grid
<div className="p-md m-lg gap-xs">
<div className="space-y-sm">
```

#### Typography
```tsx
// Predefined text styles
<h1 className="text-h1 font-heading">
<p className="text-body-lg">
<small className="text-caption">
```

#### Common Patterns
```tsx
// Button styling
className="px-4 py-2 rounded-md bg-primary text-white transition-all"

// Card styling
className="p-6 bg-white rounded-lg shadow-elevation-2 border border-border-primary"

// Mobile safe area
className="container-safe"
```

## Component Variants

### Button
```tsx
// Variants: primary, secondary, outline, danger, ghost, success
<Button variant="primary" size="lg" fullWidth>
<Button variant="outline" size="sm" loading={isLoading}>
```

### Card
```tsx
// Variants: default, elevated, outlined
<Card variant="elevated">
  <CardHeader>Title</CardHeader>
  <CardBody>Content</CardBody>
  <CardFooter>Actions</CardFooter>
</Card>
```

### Input
```tsx
<Input
  label="Email"
  type="email"
  error={errors.email}
  helperText="We'll never share your email"
  fullWidth
/>
```

## Testing Checklist

### Auth Flow
- [ ] Register with valid data (success)
- [ ] Register with existing email (error)
- [ ] Register with weak password (validation error)
- [ ] Login with correct credentials (success)
- [ ] Login with wrong password (error)
- [ ] Logout clears session (redirect to login)

### Responsive Design
- [ ] iPhone 12 (390px) - all pages render correctly
- [ ] iPad (640px) - layouts stack properly
- [ ] Desktop (1024px+) - grid layout works
- [ ] Form inputs don't zoom on focus (iOS)
- [ ] Safe area insets applied (notch avoided)

### Internationalization
- [ ] Switch to Hebrew (/he/...) - content in Hebrew
- [ ] RTL layout applies (text right-aligned)
- [ ] Switch back to English (/en/...) - content in English
- [ ] LTR layout applies (text left-aligned)
- [ ] Locale persists across navigation

### Accessibility
- [ ] Keyboard navigation (Tab, Enter, Escape)
- [ ] Focus indicators visible
- [ ] Form labels associated with inputs
- [ ] Color contrast 4.5:1+ for text
- [ ] Touch targets 44x44px minimum

### Performance
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1
- [ ] No console errors
- [ ] No console warnings

## Common Tasks

### Adding a New Page
```tsx
// src/app/[locale]/new-page/page.tsx
export default function NewPage() {
  const t = useTranslations('section');
  return <div>{t('key')}</div>;
}
```

### Adding a Translation
1. Edit `src/i18n/messages/en.json`
2. Edit `src/i18n/messages/he.json`
3. Use in component: `const t = useTranslations('section'); t('key')`

### Creating a Protected Route
```tsx
// In any page.tsx
import { getCurrentUser } from '@/lib/auth/actions';
import { redirect } from 'next/navigation';

export default async function ProtectedPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');
  
  return <div>{user.email}</div>;
}
```

### Adding Form Validation
```tsx
// 1. Create schema in lib/auth/schemas.ts
export const newSchema = z.object({ ... });

// 2. Validate in server action
const validated = newSchema.parse(data);

// 3. Use in form with error handling
const [errors, setErrors] = useState({});
try {
  schema.parse(formData);
  // submit
} catch (error) {
  if (error instanceof ZodError) {
    // map errors
  }
}
```

## Troubleshooting

### "Cannot find module" Errors
- Check path aliases in `tsconfig.json`
- Verify file exists in correct location
- Restart dev server

### i18n Not Working
- Verify locale in URL (`/en/` or `/he/`)
- Check `middleware.ts` is configured
- Verify message files exist
- Restart dev server

### Auth State Not Syncing
- Check Supabase credentials in `.env.local`
- Verify cookies enabled in browser
- Check browser DevTools > Application > Cookies
- Try incognito mode to clear cookies

### Tailwind Classes Not Applied
- Check class name syntax (no typos)
- Verify file is in `content` paths in `tailwind.config.js`
- Run `npm run build` to check for purging
- Check CSS import in layout.tsx

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import in Vercel dashboard
3. Add environment variables
4. Deploy

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

### Environment Checklist
- [ ] Supabase project created
- [ ] Auth providers configured (email)
- [ ] Database migrations applied
- [ ] RLS policies enabled
- [ ] Storage buckets created
- [ ] Environment variables set in hosting

## Team Communication

### Reporting Status
- **Format**: "Coder: [Feature] ready for testing"
- **Example**: "Coder: Register flow ready for testing"
- **Includes**: What was built, any caveats, next blockers

### Getting Feedback
- **Designer**: CSS/visual feedback, component tweaks
- **QA**: Test results, device compatibility, bugs
- **Orchestrator**: Architecture concerns, blocking issues

### Git Commit Messages
```
Coder: [Feature] - [Brief description]

[Detailed changes if needed]

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>
```

## Learning Resources

- [Next.js Docs](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [next-intl Guide](https://next-intl-docs.vercel.app/)
- [Zod Validation](https://zod.dev/)

## Questions?

Refer to design docs:
- `DESIGN_SYSTEM.md` - Colors, typography, components
- `COMPONENT_LIBRARY.md` - Component specifications
- `DESIGNER_HANDOFF.md` - Project coordination
- `IOS_RESPONSIVE_GUIDE.md` - Mobile optimization
- `IMPLEMENTATION_STATUS.md` - Current progress
