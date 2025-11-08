# GitHub Integration Setup Guide

Complete guide to enabling GitHub repository management in Crowe Code IDE.

## Prerequisites

1. **Supabase Database**: Ensure your Supabase instance is connected
2. **GitHub App**: Create a GitHub OAuth App at https://github.com/settings/developers

## Step 1: Create GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the details:
   - **Application name**: Crowe Logic Platform
   - **Homepage URL**: `https://your-domain.com` (or `http://localhost:3000` for development)
   - **Authorization callback URL**: `https://your-domain.com/api/github/auth/callback`
4. Click "Register application"
5. Save your **Client ID** and generate a **Client Secret**

## Step 2: Configure Environment Variables

Add these environment variables in your Vercel project or `.env.local`:

\`\`\`bash
# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id

# App URL (for OAuth callback)
NEXT_PUBLIC_APP_URL=https://your-domain.com
\`\`\`

## Step 3: Run Database Migration

Execute the GitHub integration SQL script in your Supabase SQL editor:

\`\`\`sql
-- Located in: scripts/create-github-integration-tables.sql
-- This creates tables for:
-- - github_tokens (OAuth tokens)
-- - github_repositories (cloned repos)
-- - workspace_files (file system)
-- - git_commits (commit history)
\`\`\`

Or use the terminal to run:

\`\`\`bash
psql $DATABASE_URL < scripts/create-github-integration-tables.sql
\`\`\`

## Step 4: Test the Integration

1. Navigate to `/crowe-code`
2. Click "Connect GitHub" in the header
3. Authorize the app
4. You should be redirected back with a success message
5. Click "Clone Repo" to test cloning a repository

## Features

### Available Functionality

- **OAuth Authentication**: Secure GitHub login
- **Repository Cloning**: Clone any public or private repo (with permissions)
- **File Management**: View and edit files from cloned repos
- **Commit & Push**: Push changes back to GitHub with commit messages
- **Real-time Sync**: Track uncommitted changes
- **Workspace Persistence**: Files are stored in Supabase for multi-device access

### API Endpoints

- `GET /api/github/status` - Check connection status
- `GET /api/github/auth/callback` - OAuth callback handler
- `POST /api/github/clone` - Clone a repository
- `POST /api/github/push` - Push changes to GitHub

## Security

- All tokens are encrypted in transit and at rest
- Row-Level Security (RLS) ensures users only access their own data
- OAuth tokens are never exposed to the client
- Refresh tokens enable long-term access without re-authentication

## Troubleshooting

### "OAuth Failed" Error
- Verify your `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` are correct
- Ensure the callback URL matches exactly (including http/https)

### "DB Failed" Error
- Run the migration script to create required tables
- Check RLS policies are enabled on all tables

### "No Code" Error
- User cancelled the GitHub authorization
- Try connecting again

### Repository Won't Clone
- Ensure the repository URL is correct
- For private repos, user must have access permissions
- Check GitHub token has correct scopes

## Example Usage

\`\`\`typescript
// In Crowe Code IDE
// 1. Connect GitHub account
// 2. Clone a repository
const repo = await fetch('/api/github/clone', {
  method: 'POST',
  body: JSON.stringify({
    repoUrl: 'https://github.com/MichaelCrowe11/synapse-lang'
  })
})

// 3. Make changes to files
// 4. Push changes
const result = await fetch('/api/github/push', {
  method: 'POST',
  body: JSON.stringify({
    repositoryId: repo.id,
    commitMessage: 'Updated synapse syntax'
  })
})
\`\`\`

## Next Steps

Once configured, users can:
- Clone repositories directly in Crowe Code
- Edit files with full Monaco editor support
- Commit and push changes without leaving the IDE
- Collaborate on codebases with full Git history
- Deploy from Crowe Code to production via GitHub Actions

## Support

For issues, contact michael@crowelogic.com or open an issue in the repository.
