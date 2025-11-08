# Administrator Account Setup

## Creating the Admin Account for michael@crowelogic.com

### Step 1: Sign Up Through the UI

1. Go to your Crowe Logic AI platform
2. Navigate to the sign-up page: `/auth/sign-up`
3. Create an account with email: `michael@crowelogic.com`
4. Complete the email verification process
5. Log in to confirm the account is active

### Step 2: Run the Admin SQL Script

Once the account exists in Supabase Auth, run the admin setup script:

**Option A: Using Supabase Dashboard**
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Open `scripts/011_create_admin_account.sql`
4. Click "Run" to execute the script

**Option B: Using psql**
\`\`\`bash
psql $POSTGRES_URL -f scripts/011_create_admin_account.sql
\`\`\`

**Option C: Using the v0 Scripts Runner**
1. Navigate to the Scripts section in v0
2. Select `011_create_admin_account.sql`
3. Click "Execute"

### Step 3: Verify Admin Access

The script will output your admin account details. You should see:

\`\`\`
email: michael@crowelogic.com
is_admin: true
subscription_tier: expert
subscription_status: active
chat_messages_quota: 999999
crowe_vision_quota: 999999
video_studio_quota: 999999
gpt_modules_quota: 999999
\`\`\`

### Admin Privileges

As an administrator, you have:

✅ **Full Platform Access**
- Unlimited AI chat messages
- Unlimited Crowe Vision analysis
- Unlimited video generation
- All GPT modules included
- No usage quotas or restrictions

✅ **Expert Tier Features**
- All Pro features
- Priority support
- Early access to new features
- Monthly group consulting calls

✅ **Admin-Only Features** (Future)
- User management dashboard
- Analytics and insights
- Content moderation tools
- System configuration access

### Troubleshooting

**Issue: User not found**
- Make sure you've signed up through the UI first
- Check that email verification is complete
- Verify the email matches exactly: `michael@crowelogic.com`

**Issue: Script fails on subscription_plans**
- Run the subscription setup script first: `010_setup_subscriptions_v2.sql`
- This creates the necessary subscription plan records

**Issue: Quotas not updating**
- Check the `usage_quotas` table directly
- Run the script again (it's idempotent)
- Verify the user_id matches between tables

### Security Notes

- The admin flag (`is_admin`) should be used to gate admin-only features
- Implement proper role-based access control (RBAC) in your middleware
- Never expose admin status in client-side code
- Always verify admin status on the server side

### Next Steps

After setting up the admin account:

1. **Test Admin Access**: Log in and verify all features work
2. **Set Up RLS Policies**: Configure Row Level Security for admin access
3. **Build Admin Dashboard**: Create admin-only UI components
4. **Implement RBAC**: Add role checks to protected routes and API endpoints
</markdown>
