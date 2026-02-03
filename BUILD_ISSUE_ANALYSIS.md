# erlvinc-dashboard Build Issue - Root Cause Analysis

## The Problem

The build is failing during the Next.js build phase with this error:

```
Error: @supabase/ssr: Your project's URL and API key are required to create a Supabase client!
Error occurred prerendering page "/login"
Export encountered an error on /(auth)/login/page: /login, exiting the build.
```

## Root Cause

**The login page is importing and instantiating the Supabase client at the MODULE LEVEL during build time, not inside a browser-only context.**

### The Culprit Code

File: `/c/dev/erlvinc-dashboard/app/(auth)/login/page.tsx`

```typescript
'use client'

import { createClient } from '@/lib/supabase/client'  // ← This line executes at build time!
import Link from 'next/link'

export default function LoginPage() {
  // ... component code
  const supabase = createClient()  // ← This calls the client factory
  // ...
}
```

### Why It Fails

1. **Line 6**: The page imports `createClient` from `@/lib/supabase/client`
2. **Inside component**: Line ~15 calls `const supabase = createClient()`
3. **At build time**: Next.js tries to prerender/export the page
4. **The createClient() factory** (`/lib/supabase/client.ts`) contains:
   ```typescript
   export const createClient = () =>
     createBrowserClient<Database>(
       process.env.NEXT_PUBLIC_SUPABASE_URL!,    // ← Missing during build!
       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!  // ← Missing during build!
     )
   ```
5. **Environment variables are undefined** during the build phase because:
   - Vercel hasn't injected them yet at build time
   - OR they weren't available when build started
   - The non-ECMAScript module execution accesses them before the browser runtime

## Why The Environment Variables Appear To Be Set

According to the Vercel API response, the variables **are configured**:
- `NEXT_PUBLIC_SUPABASE_URL`: Set ✓
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Set ✓

But they may not be available during:
1. Static asset optimization phase
2. TypeScript type checking phase  
3. Page prerendering/export phase

## The Solution

### Option 1: Lazy Initialize Supabase (RECOMMENDED)
Move the `createClient()` call INSIDE the component, ensuring it only runs in the browser:

```typescript
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/types/database'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [supabase, setSupabase] = useState<SupabaseClient<Database> | null>(null)
  const router = useRouter()

  // Initialize Supabase only in browser
  useEffect(() => {
    setSupabase(createClient())
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) return
    
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  // ... rest of component
}
```

### Option 2: Move Supabase Initialization to a Hook
Create a custom hook that safely initializes Supabase:

File: `/lib/hooks/useSupabaseClient.ts`
```typescript
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/types/database'

export function useSupabaseClient() {
  const [supabase, setSupabase] = useState<SupabaseClient<Database> | null>(null)

  useEffect(() => {
    setSupabase(createClient())
  }, [])

  return supabase
}
```

Then use it in the page:
```typescript
const supabase = useSupabaseClient()
```

### Option 3: Wrap in Dynamic Component
Use Next.js dynamic imports with `ssr: false`:

```typescript
import dynamic from 'next/dynamic'

const LoginForm = dynamic(() => import('./LoginForm'), { ssr: false })

export default function LoginPage() {
  return <LoginForm />
}
```

### Option 4: Check next.config.ts
Verify that the project is NOT using `output: 'export'` (static export) which would force all pages to be prerendered:

```typescript
// ❌ This forces static export for all pages
const nextConfig = {
  output: 'export'
}

// ✓ Better: Use default Next.js server rendering
const nextConfig = {
  // no output field = server rendering enabled
}
```

## Files to Check/Update

1. `/c/dev/erlvinc-dashboard/app/(auth)/login/page.tsx` - Main issue
2. `/c/dev/erlvinc-dashboard/next.config.ts` - Check for `output: 'export'`
3. `/c/dev/erlvinc-dashboard/lib/supabase/client.ts` - Client factory
4. Any other pages that import Supabase at module level

## Verification Steps

1. Apply the fix (Option 1 or 2 recommended)
2. Test locally: `npm run build`
3. Should complete without errors
4. Push to GitHub
5. Vercel will auto-deploy and should succeed
6. Test the `/login` page at `erlvinc-dashboard.vercel.app/login`

## Additional Notes

- The `'use client'` directive is correct
- The issue is the timing of Supabase client initialization
- Browser-only code must not execute during static pre-rendering
- Using `useEffect` ensures code runs only in the browser after hydration

---

**Issue Type**: Build configuration / Timing issue  
**Severity**: High (blocks all deployments)  
**Fix Complexity**: Low (simple refactor)  
**Estimated Fix Time**: 5-10 minutes
