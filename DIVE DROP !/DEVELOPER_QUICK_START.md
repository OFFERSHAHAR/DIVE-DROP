# Developer Quick Start Guide

## 5-Minute Setup

### 1. Clone & Install
```bash
cd "DIVE DROP"
npm install
cp .env.example .env.local
```

### 2. Configure Supabase
Edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
SUPABASE_SERVICE_ROLE_KEY=your-key
```

### 3. Run
```bash
npm run dev
# Open http://localhost:3000
```

---

## Key Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run type-check   # Check TypeScript
npm run lint         # Run ESLint
npm run format       # Format with Prettier
npm start            # Run production server
```

---

## Project Structure at a Glance

```
src/
├── app/              # Pages & layouts (Next.js App Router)
├── components/       # UI components (Button, Card, Input)
├── lib/              # Core logic (auth, supabase)
├── hooks/            # React hooks (useAuth)
├── utils/            # Utilities (cn, logger, validation)
├── store/            # Zustand stores (authStore)
├── types/            # TypeScript types (Supabase schema)
└── i18n/             # Translations (en.json, he.json)
```

---

## Common Tasks

### Create a New Page
```tsx
// src/app/[locale]/my-page/page.tsx
export default function MyPage() {
  const t = useTranslations('section');
  return <div>{t('key')}</div>;
}
```

### Use a Translation
1. Add to `src/i18n/messages/en.json`
2. Add to `src/i18n/messages/he.json`
3. Use in component: `t('section.key')`

### Create a Component
```tsx
// src/components/MyComponent.tsx
import clsx from 'clsx';

interface MyComponentProps {
  variant?: 'primary' | 'secondary';
}

export const MyComponent = ({ variant = 'primary' }: MyComponentProps) => {
  return (
    <div className={clsx('p-md rounded-md', {
      'bg-primary text-white': variant === 'primary',
      'bg-secondary': variant === 'secondary',
    })}>
      Content
    </div>
  );
};
```

### Add Form Validation
```tsx
// In lib/auth/schemas.ts
export const mySchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
});

// In server action
const data = mySchema.parse(formData);
```

### Protect a Route
```tsx
// In page.tsx
import { getCurrentUser } from '@/lib/auth/actions';
import { redirect } from 'next/navigation';

export default async function ProtectedPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');
  
  return <div>Protected content for {user.email}</div>;
}
```

---

## Styling with Tailwind

### Colors (from design system)
```tsx
// Primary colors
className="text-primary bg-primary-dark"

// Status colors
className="text-error bg-success"

// Text colors
className="text-primary text-secondary text-tertiary"

// Background
className="bg-primary bg-secondary bg-tertiary"
```

### Spacing (8px grid)
```tsx
// p = padding, m = margin, gap = gap
className="p-md m-lg gap-xs"

// space-y = vertical spacing
className="space-y-sm"
```

### Sizes
- `xs: 8px`
- `sm: 16px`
- `md: 24px`
- `lg: 32px`
- `xl: 40px`
- `2xl: 48px`
- `3xl: 64px`
- `4xl: 80px`

### Common Components
```tsx
// Button
<Button variant="primary" size="lg" fullWidth>
  Click me
</Button>

// Card
<Card variant="elevated">
  <CardHeader>Title</CardHeader>
  <CardBody>Content</CardBody>
</Card>

// Input
<Input
  label="Email"
  type="email"
  error={errors.email}
  fullWidth
/>
```

---

## Debugging

### TypeScript Error
```bash
npm run type-check
# Check the error location and type definitions
```

### ESLint Warning
```bash
npm run lint
# Fix automatically: npm run lint
```

### i18n Not Working
- Check URL has locale: `/en/...` or `/he/...`
- Verify message files exist
- Check key exists in JSON file

### Auth Not Working
- Check `.env.local` has Supabase credentials
- Check browser cookies (DevTools > Application > Cookies)
- Try incognito mode to clear old cookies

### Tailwind Classes Not Applied
- Restart dev server
- Check class name spelling
- Verify file in `content` paths in `tailwind.config.js`

---

## Code Quality Checks

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format

# Build (catches errors)
npm run build
```

---

## File Locations

| What | Where |
|------|-------|
| Home page | `src/app/[locale]/page.tsx` |
| Register | `src/app/[locale]/auth/register/page.tsx` |
| Login | `src/app/[locale]/auth/login/page.tsx` |
| Dashboard | `src/app/[locale]/dashboard/page.tsx` |
| Button component | `src/components/Button.tsx` |
| Auth logic | `src/lib/auth/` |
| Supabase setup | `src/lib/supabase/` |
| Translations | `src/i18n/messages/` |
| Styles | `tailwind.config.js`, `src/styles/design-system.css` |
| Config | Root directory (`.env`, `next.config.mjs`, etc.) |

---

## Architecture Patterns

### Server vs Client

**Server (Use for):**
- Database access
- Secret/private API calls
- Auth operations
- Heavy computation

```tsx
// 'use server' in function
export async function registerAction(data) {
  // Server code here
}
```

**Client (Use for):**
- User interactions
- State management
- Form handling
- UI animations

```tsx
'use client'

export default function Form() {
  const [state, setState] = useState();
  // Client code here
}
```

### Data Flow

```
User Input → Form Handler → Validation (Zod) 
→ Server Action → Supabase → Response → UI Update
```

### Component Composition

```tsx
// Small, reusable components
<Button>Click</Button>
<Input label="Name" />

// Combine into larger layouts
<Card>
  <Form>
    <Input />
    <Button />
  </Form>
</Card>
```

---

## Performance Tips

1. **Use `next/image`** for images
2. **Code split** with `dynamic()`
3. **Use server actions** for mutations
4. **Lazy load** components
5. **Monitor** with DevTools

---

## Accessibility

- ✅ Keyboard navigation (Tab, Enter, Escape)
- ✅ Focus indicators visible
- ✅ Form labels linked to inputs
- ✅ Color contrast 4.5:1+
- ✅ 44px touch targets

---

## Testing Mindset

### Auth Test
```
1. Go to /register
2. Enter email + strong password
3. Click register → success msg
4. Go to /login
5. Enter credentials
6. Dashboard loads
```

### Responsive Test
```
1. Open DevTools (F12)
2. Toggle device toolbar
3. Test: 390px (mobile), 640px (tablet), 1024px (desktop)
4. Forms should be usable on all
```

### i18n Test
```
1. Visit /en/... → English content
2. Visit /he/... → Hebrew content, RTL layout
3. Content should be right-aligned in Hebrew
```

---

## Useful Links

- **Next.js**: https://nextjs.org/docs
- **Tailwind**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs/
- **Supabase**: https://supabase.com/docs
- **Zod**: https://zod.dev
- **next-intl**: https://next-intl-docs.vercel.app/

---

## Emergency Commands

```bash
# Hard reset (lose all changes)
git reset --hard HEAD

# Clear Next.js cache
rm -rf .next
npm run dev

# Reinstall everything
rm -rf node_modules package-lock.json
npm install

# Check what changed
git status
git diff

# Undo last commit (keep changes)
git reset --soft HEAD~1
```

---

## Git Workflow

```bash
# Check status
git status

# Make changes, then stage
git add .

# Commit with message
git commit -m "Coder: [Feature] description

Details here

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"

# Push to remote
git push
```

---

## When Stuck

1. **Check error message** - Usually tells you what's wrong
2. **Search the CLAUDE.md** - Comprehensive guide
3. **Look at similar code** - Reference existing patterns
4. **Type checking** - `npm run type-check` helps catch errors
5. **Read the design docs** - DESIGN_SYSTEM.md has all specs
6. **Ask for help** - Team review is valuable

---

## Success Indicators

✅ `npm run dev` starts without errors
✅ `npm run type-check` passes
✅ `npm run lint` passes
✅ Pages load without console errors
✅ Responsive on mobile (no horizontal scroll)
✅ i18n works (English and Hebrew)
✅ Forms validate correctly

---

## Next.js Quick Tips

- **App Router**: Pages in `app/` directory (not `pages/`)
- **Server Components**: Default (no `'use client'`)
- **Server Actions**: Mutations with `'use server'`
- **Dynamic Routes**: Use `[param]` in folder names
- **Layouts**: Automatically wrap children
- **Middleware**: `middleware.ts` at root

---

Happy coding! For detailed info, see:
- `CLAUDE.md` - Full reference
- `IMPLEMENTATION_STATUS.md` - Current status
- `DESIGN_SYSTEM.md` - Design specs
- `COMPONENT_LIBRARY.md` - Component reference
