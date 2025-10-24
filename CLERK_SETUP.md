# Clerk Authentication Setup Guide

This guide will help you set up Clerk authentication for your Crowe Logic AI application.

## Prerequisites

- A Clerk account (sign up at [clerk.com](https://clerk.com))
- Your application deployed or running locally

## Step 1: Create a Clerk Application

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Click "Add application"
3. Name your application (e.g., "Crowe Logic AI")
4. Choose your authentication methods (Email, Google, GitHub, etc.)
5. Click "Create application"

## Step 2: Get Your API Keys

From your Clerk Dashboard:

1. Navigate to **API Keys** in the sidebar
2. Copy your **Publishable Key** (starts with `pk_`)
3. Copy your **Secret Key** (starts with `sk_`)

## Step 3: Add Environment Variables

Add these environment variables to your Vercel project or `.env.local` file:

\`\`\`bash
# Required Clerk Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Clerk URLs (already configured)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
\`\`\`

### For Vercel Deployment:

1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add each variable with its value
4. Make sure to add them for all environments (Production, Preview, Development)

## Step 4: Configure Clerk Dashboard

### Set Allowed Redirect URLs

In your Clerk Dashboard, go to **Paths** and configure:

**Development:**
- `http://localhost:3000`
- `http://localhost:3000/auth/login`
- `http://localhost:3000/auth/sign-up`
- `http://localhost:3000/dashboard`

**Production:**
- `https://yourdomain.com`
- `https://yourdomain.com/auth/login`
- `https://yourdomain.com/auth/sign-up`
- `https://yourdomain.com/dashboard`

## Step 5: Customize Authentication (Optional)

### Email Templates

1. Go to **Customization** → **Emails** in Clerk Dashboard
2. Customize verification emails, password reset emails, etc.

### Appearance

1. Go to **Customization** → **Appearance**
2. Match Clerk's UI to your brand colors
3. Upload your logo

### Social Connections

1. Go to **User & Authentication** → **Social Connections**
2. Enable providers like Google, GitHub, Microsoft, etc.
3. Configure OAuth credentials for each provider

## Step 6: Test Authentication

1. Start your development server: `pnpm dev`
2. Navigate to `/auth/sign-up`
3. Create a test account
4. Verify email (check your inbox)
5. Sign in at `/auth/login`
6. Confirm redirect to `/dashboard`

## Features Enabled

With Clerk installed, your app now has:

- ✅ Email/password authentication
- ✅ Email verification
- ✅ Password reset
- ✅ Session management
- ✅ Protected routes (via middleware)
- ✅ User profile management
- ✅ Multi-factor authentication (optional)
- ✅ Social login (optional)

## Protected Routes

The following routes are automatically protected by Clerk middleware:

- `/dashboard`
- `/chat`
- `/projects/*`
- `/profile`
- `/analytics`
- All other routes except `/`, `/pricing`, and `/auth/*`

## Using Clerk in Your Components

### Get Current User (Server Component)

\`\`\`typescript
import { currentUser } from '@clerk/nextjs/server'

export default async function Page() {
  const user = await currentUser()
  
  if (!user) {
    return <div>Not signed in</div>
  }
  
  return <div>Hello {user.firstName}!</div>
}
\`\`\`

### Get Current User (Client Component)

\`\`\`typescript
'use client'
import { useUser } from '@clerk/nextjs'

export default function Component() {
  const { user, isLoaded } = useUser()
  
  if (!isLoaded) return <div>Loading...</div>
  if (!user) return <div>Not signed in</div>
  
  return <div>Hello {user.firstName}!</div>
}
\`\`\`

### Sign Out Button

\`\`\`typescript
'use client'
import { useClerk } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'

export function SignOutButton() {
  const { signOut } = useClerk()
  
  return (
    <Button onClick={() => signOut()}>
      Sign Out
    </Button>
  )
}
\`\`\`

## Troubleshooting

### "Invalid publishable key" error
- Verify your `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is correct
- Make sure it starts with `pk_test_` or `pk_live_`

### Redirect loops
- Check your middleware configuration
- Verify public routes are correctly defined
- Ensure sign-in/sign-up URLs match your Clerk dashboard settings

### Users can't verify email
- Check spam folder
- Verify email settings in Clerk Dashboard
- Ensure your domain is verified in Clerk

## Migration from Supabase Auth

If you're migrating from Supabase Auth:

1. Export user data from Supabase
2. Import users to Clerk (contact Clerk support for bulk import)
3. Update authentication logic to use Clerk hooks
4. Test thoroughly before removing Supabase auth code

## Support

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk Discord Community](https://clerk.com/discord)
- [Clerk Support](https://clerk.com/support)
