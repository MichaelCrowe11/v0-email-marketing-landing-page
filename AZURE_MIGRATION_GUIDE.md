# Azure Migration Guide for Crowe Mycology

This guide explains how to migrate from Supabase to Azure resources.

## Environment Variables

Add the following environment variables to your Vercel project:

### Azure SQL Database
\`\`\`
AZURE_SQL_SERVER=your-server.database.windows.net
AZURE_SQL_DATABASE=crowe-mycology
AZURE_SQL_USER=your-username
AZURE_SQL_PASSWORD=your-password
\`\`\`

### Azure Authentication
\`\`\`
AZURE_AUTH_SECRET=your-jwt-secret-key-min-32-chars
\`\`\`

### Optional: Keep Supabase as fallback
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
\`\`\`

## Database Schema

Create these tables in your Azure SQL Database:

\`\`\`sql
-- Users table
CREATE TABLE users (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    email NVARCHAR(255) UNIQUE NOT NULL,
    password_hash NVARCHAR(255) NOT NULL,
    name NVARCHAR(255),
    avatar_url NVARCHAR(500),
    is_admin BIT DEFAULT 0,
    stripe_customer_id NVARCHAR(255),
    created_at DATETIME2 DEFAULT GETUTCDATE(),
    updated_at DATETIME2 DEFAULT GETUTCDATE()
);

-- AI Conversations
CREATE TABLE ai_conversations (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id UNIQUEIDENTIFIER REFERENCES users(id),
    title NVARCHAR(255),
    created_at DATETIME2 DEFAULT GETUTCDATE(),
    updated_at DATETIME2 DEFAULT GETUTCDATE()
);

-- AI Messages
CREATE TABLE ai_messages (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    conversation_id UNIQUEIDENTIFIER REFERENCES ai_conversations(id),
    role NVARCHAR(50) NOT NULL,
    content NVARCHAR(MAX) NOT NULL,
    created_at DATETIME2 DEFAULT GETUTCDATE()
);

-- Cultivation Projects
CREATE TABLE cultivation_projects (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id UNIQUEIDENTIFIER REFERENCES users(id),
    name NVARCHAR(255) NOT NULL,
    species NVARCHAR(255),
    substrate NVARCHAR(255),
    status NVARCHAR(50) DEFAULT 'active',
    start_date DATE,
    created_at DATETIME2 DEFAULT GETUTCDATE(),
    updated_at DATETIME2 DEFAULT GETUTCDATE()
);

-- Add more tables as needed...
\`\`\`

## How It Works

1. **Compatibility Layer**: The existing `lib/supabase/client.ts` and `lib/supabase/server.ts` files now redirect to Azure implementations.

2. **Fallback Support**: The middleware checks for Azure auth first, then falls back to Supabase if configured.

3. **API Routes**: New API routes under `/api/azure/` handle database queries and authentication.

## Gradual Migration

You can migrate gradually:
1. Keep Supabase credentials configured as fallback
2. Set up Azure resources
3. Test with Azure auth
4. Once stable, remove Supabase dependencies

## Security Notes

- All passwords are hashed with bcrypt (12 rounds)
- Sessions use JWT tokens stored in HTTP-only cookies
- Azure SQL connections use TLS encryption
- Protected routes check both Azure and Supabase sessions
