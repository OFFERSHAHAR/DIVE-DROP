# Toast Notifications - Quick Start Guide

## Installation

All components are already integrated! No additional setup needed.

## Basic Usage

### Option 1: Direct Component Usage

```typescript
'use client';

import Toast from '@/components/Toast';

export function MyComponent() {
  return (
    <Toast
      id="demo-toast"
      message="This is a success message!"
      type="success"
      duration={4000}
    />
  );
}
```

### Option 2: Using the Hook (Recommended)

```typescript
'use client';

import { useToastManager } from '@/hooks/useToast';

export function LoginForm() {
  const { success, error } = useToastManager();

  const handleSubmit = async (email: string, password: string) => {
    try {
      const result = await loginUser(email, password);
      success('Login successful!');
      // Redirect...
    } catch (err) {
      error('Invalid credentials');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
    </form>
  );
}
```

## API Reference

### useToastManager Hook

```typescript
const {
  success,      // (message: string, options?) => string
  error,        // (message: string, options?) => string
  warning,      // (message: string, options?) => string
  info,         // (message: string, options?) => string
  addToast,     // (message: string, type: string, options?) => string
  removeToast,  // (id: string) => void
  toasts,       // ToastMessage[]
} = useToastManager();
```

### Options Object

```typescript
{
  duration?: number;      // Auto-close in ms (0 = never close, default 4000)
  action?: {              // Optional action button
    label: string;
    onClick: () => void;
  };
}
```

## Examples

### Success Notification
```typescript
// Simple
success('Profile updated successfully!');

// With custom duration
success('Quick message', { duration: 2000 });

// With action
success('Message sent', {
  action: {
    label: 'Undo',
    onClick: () => undoSend(),
  },
});
```

### Error Notification
```typescript
// Simple
error('Failed to save changes');

// Non-dismissible (sticky)
error('Critical error - contact support', { duration: 0 });

// With action
error('Failed to upload', {
  action: {
    label: 'Retry',
    onClick: () => retryUpload(),
  },
});
```

### Warning Notification
```typescript
warning('Are you sure? This cannot be undone.');

warning('Your session expires in 5 minutes', {
  duration: 0, // Sticky until dismissed
});
```

### Info Notification
```typescript
info('New update available');

info('You have 3 new messages', { duration: 2000 });
```

## Types & Colors

```typescript
type: 'success' | 'error' | 'warning' | 'info'

success  → Green (#00C853) + checkmark icon
error    → Red (#FF3D00) + X icon
warning  → Yellow (#FFC400) + alert icon
info     → Cyan (#00B4D8) + info icon
```

## Real-World Example: Login Form

```typescript
'use client';

import { useState } from 'react';
import { useToastManager } from '@/hooks/useToast';
import { loginAction } from '@/lib/auth/actions';

export function LoginForm() {
  const { success, error } = useToastManager();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await loginAction(formData);

      if (result.error) {
        error(result.error);
      } else if (result.success) {
        success('Login successful! Redirecting...');
        // Redirect after showing toast
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 500);
      }
    } catch (err) {
      error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={formData.email}
        onChange={(e) =>
          setFormData({ ...formData, email: e.target.value })
        }
      />
      <input
        type="password"
        value={formData.password}
        onChange={(e) =>
          setFormData({ ...formData, password: e.target.value })
        }
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

## Real-World Example: Form Validation

```typescript
'use client';

import { useToastManager } from '@/hooks/useToast';
import { registerSchema } from '@/lib/auth/schemas';
import { ZodError } from 'zod';

export function RegisterForm() {
  const { success, error } = useToastManager();
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const data = new FormData(e.currentTarget);
      const formData = Object.fromEntries(data);

      // Validate with Zod
      const validated = registerSchema.parse(formData);

      // API call
      const result = await registerAction(validated);

      if (result.error) {
        error(result.error);
      } else {
        success('Registration successful! Check your email.');
      }
    } catch (err) {
      if (err instanceof ZodError) {
        // Show first error as toast
        const firstError = err.errors[0];
        error(`${firstError.path.join('.')}: ${firstError.message}`);
        
        // Show field errors
        setErrors(
          err.errors.reduce((acc, e) => {
            acc[e.path[0]] = e.message;
            return acc;
          }, {})
        );
      } else {
        error('Registration failed');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
    </form>
  );
}
```

## Real-World Example: Async Operations

```typescript
'use client';

import { useToastManager } from '@/hooks/useToast';

export function DataActions() {
  const { success, error, info } = useToastManager();

  const handleDelete = async (id: string) => {
    info('Deleting...');

    try {
      await deleteItem(id);
      success('Item deleted successfully');
      // Refresh data...
    } catch (err) {
      error('Failed to delete item');
    }
  };

  const handleBulkUpload = async (files: File[]) => {
    info(`Uploading ${files.length} files...`);

    try {
      const results = await Promise.all(
        files.map((f) => uploadFile(f))
      );
      success(`${results.length} files uploaded successfully`);
    } catch (err) {
      error('Some files failed to upload');
    }
  };

  return (
    <>
      <button onClick={() => handleDelete('item-1')}>Delete</button>
      <input
        type="file"
        multiple
        onChange={(e) =>
          handleBulkUpload(Array.from(e.target.files || []))
        }
      />
    </>
  );
}
```

## Styling & Customization

### Default Styles
- **Appearance**: Semi-transparent background with backdrop blur
- **Border**: Left accent bar (4px) in type color
- **Shadow**: Elevated shadow with glow pulse effect
- **Text**: 14px sans-serif, icon + message layout

### Responsive
- **Desktop**: Slides in from right, 320-420px width
- **Mobile**: Slides in from bottom, 280-90vw width

### Animation
- **Enter**: 200ms spring ease (0.34, 1.56, 0.64, 1)
- **Exit**: 200ms out ease (0.4, 0, 0.2, 1)
- **Glow**: 2s infinite pulse effect

## Accessibility

✅ **Screen Readers**
```html
<div role="alert" aria-live="polite">
  Toast message
</div>
```

✅ **Keyboard**
- ESC to dismiss
- Tab to action button
- Focus visible outlines

✅ **Reduced Motion**
```css
@media (prefers-reduced-motion: reduce) {
  /* Animations disabled */
}
```

✅ **Dark Mode**
- Automatic system preference detection
- Manual toggle via `.dark` class
- Enhanced shadows for visibility

## Tips & Best Practices

### ✅ Do
- Use success for completed actions
- Use error for user-visible failures
- Keep messages concise (< 100 chars)
- Use action buttons for reversible actions
- Stack related toasts together

### ❌ Don't
- Use toasts for critical errors (use modals)
- Stack > 3 unrelated toasts
- Auto-dismiss critical messages (duration: 0)
- Use complex HTML in messages
- Spam with rapid successive toasts

## Common Patterns

### Pattern: Undo Action
```typescript
const { success } = useToastManager();

success('Message deleted', {
  action: {
    label: 'Undo',
    onClick: () => restoreMessage(),
  },
});
```

### Pattern: Loading State
```typescript
const { info } = useToastManager();

const handleAction = async () => {
  info('Processing...');
  try {
    await doAsyncAction();
  } catch (err) {
    // Error toast...
  }
};
```

### Pattern: Form Submission
```typescript
const { success, error } = useToastManager();

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  try {
    await submitForm();
    success('Changes saved!');
  } catch (err) {
    error('Failed to save');
  }
};
```

## Troubleshooting

### Toast not showing?
1. Check if component is inside the app
2. Verify no CSS conflicts
3. Check browser console for errors
4. Ensure duration is > 0

### Animation not smooth?
1. Check `prefers-reduced-motion` setting
2. Verify browser supports CSS transforms
3. Check for CSS animation overrides
4. Update to latest browser version

### Dark mode colors wrong?
1. Verify `.dark` class is applied to `<html>`
2. Check system dark mode preference
3. Clear browser cache
4. Check CSS variable overrides

## File Locations

```
src/
├── components/
│   ├── Toast.tsx              # Component
│   └── ToastContainer.tsx     # Container
├── hooks/
│   └── useToast.ts            # Hook
├── examples/
│   └── ToastExample.tsx       # Demo
└── styles/
    └── design-system.css      # Animations
```

## Next Steps

1. **Integrate with existing forms** - Try in login/register
2. **Use in API calls** - Add to async operations
3. **Custom styling** - Extend with your brand colors
4. **Toast history** - Build a notification center
5. **Sound effects** - Add optional audio feedback

---

**Ready to use!** Copy-paste examples above and start showing great notifications. 🎉
