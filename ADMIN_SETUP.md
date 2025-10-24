# Admin System Setup Guide

This guide explains how the admin system works in Crowe Logic AI.

## Overview

The admin system uses Supabase authentication with a custom `is_admin` column in the `users` table. Admin users have elevated privileges to manage content, users, and system settings.

## Current Admin User

- **Email:** michael@crowelogic.com
- **Status:** Admin privileges enabled

## Database Schema

The `users` table includes an `is_admin` boolean column:

\`\`\`sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON users(is_admin);
\`\`\`

## Admin Functions

The `lib/admin.ts` file provides three main functions:

### `isAdmin()`
Checks if the current authenticated user is an admin.

\`\`\`typescript
import { isAdmin } from '@/lib/admin'

export default async function Page() {
  const admin = await isAdmin()
  
  if (!admin) {
    return <div>Access denied</div>
  }
  
  return <div>Admin content</div>
}
\`\`\`

### `requireAdmin()`
Throws an error if the current user is not an admin. Use this in API routes and server actions.

\`\`\`typescript
import { requireAdmin } from '@/lib/admin'

export async function POST(request: Request) {
  await requireAdmin() // Throws error if not admin
  
  // Admin-only logic here
}
\`\`\`

### `getAdminUser()`
Returns the full user object if they're an admin, or null otherwise.

\`\`\`typescript
import { getAdminUser } from '@/lib/admin'

export default async function Page() {
  const adminUser = await getAdminUser()
  
  if (!adminUser) {
    return <div>Access denied</div>
  }
  
  return <div>Welcome, {adminUser.full_name}!</div>
}
\`\`\`

## Adding New Admins

### Method 1: SQL Script (Recommended)

Create a new SQL script in the `scripts` folder:

\`\`\`sql
-- scripts/002-add-new-admin.sql
UPDATE users 
SET is_admin = TRUE 
WHERE email = 'newemail@example.com';
\`\`\`

Run the script from the v0 interface.

### Method 2: Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Table Editor** → **users**
3. Find the user by email
4. Set `is_admin` to `true`
5. Save changes

### Method 3: Admin API Route (Future)

Create an admin-only API route to manage other admins:

\`\`\`typescript
// app/api/admin/users/[id]/route.ts
import { requireAdmin } from '@/lib/admin'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  await requireAdmin()
  
  const { is_admin } = await request.json()
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('users')
    .update({ is_admin })
    .eq('id', params.id)
  
  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
  
  return Response.json({ success: true })
}
\`\`\`

## Protected Admin Routes

To protect an entire route, check admin status in the page component:

\`\`\`typescript
// app/admin/page.tsx
import { isAdmin } from '@/lib/admin'
import { redirect } from 'next/navigation'

export default async function AdminPage() {
  const admin = await isAdmin()
  
  if (!admin) {
    redirect('/dashboard')
  }
  
  return <div>Admin Dashboard</div>
}
\`\`\`

## Admin UI Components

Create reusable admin-only components:

\`\`\`typescript
// components/admin-only.tsx
import { isAdmin } from '@/lib/admin'

export async function AdminOnly({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const admin = await isAdmin()
  
  if (!admin) {
    return null
  }
  
  return <>{children}</>
}
\`\`\`

Usage:

\`\`\`typescript
import { AdminOnly } from '@/components/admin-only'

export default function Page() {
  return (
    <div>
      <h1>Public Content</h1>
      
      <AdminOnly>
        <button>Delete All Users</button>
      </AdminOnly>
    </div>
  )
}
\`\`\`

## Security Best Practices

1. **Always verify admin status server-side** - Never trust client-side checks
2. **Use `requireAdmin()` in API routes** - Throws errors for unauthorized access
3. **Log admin actions** - Track who does what for audit trails
4. **Limit admin count** - Only give admin access to trusted users
5. **Use Row Level Security (RLS)** - Add Supabase RLS policies for extra protection

## Troubleshooting

### User is admin but can't access admin features

1. Check if the user is signed in: `supabase.auth.getUser()`
2. Verify `is_admin` is `true` in the database
3. Clear browser cache and cookies
4. Check middleware is not blocking the route

### SQL script didn't set admin status

1. Verify the user exists in the `users` table
2. Check the email matches exactly (case-sensitive)
3. Run the script again from the v0 interface
4. Check Supabase logs for errors

## Future Enhancements

- Admin dashboard UI
- Role-based permissions (super admin, moderator, etc.)
- Admin activity logging
- Bulk user management
- Content moderation tools
