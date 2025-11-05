# Security Guidelines for Crowe Logic AI

## CRITICAL: API Key Protection

### What's Protected
Your application uses sensitive API keys that MUST NEVER be committed to git:
- Azure OpenAI API Keys (3 resources)
- Supabase Service Role Key
- Vercel Blob Storage Token

### Current Security Status: ✅ SECURE

- `.env.local` is properly excluded from git tracking
- `.gitignore` includes comprehensive patterns for sensitive files
- No API keys found in git history
- `.env.example` template provided for safe documentation

## Quick Security Checklist

Before every commit:
```bash
# ✅ Verify no sensitive files are staged
git status | grep -E '\.env'

# ✅ Should return nothing (or just .env.example)
git ls-files | grep -E '\.(env|key|secret)'

# ✅ Verify .env.local is ignored
git check-ignore -v .env.local
```

## Environment File Guidelines

### ✅ DO:
- Keep all API keys in `.env.local` (local development)
- Use `.env.example` as a template (safe to commit)
- Set environment variables in Vercel dashboard (production)
- Rotate keys immediately if exposed
- Use different keys for development/staging/production

### ❌ DON'T:
- NEVER commit `.env.local` to git
- NEVER hardcode API keys in source code
- NEVER share API keys in chat/email/screenshots
- NEVER push to public repositories without verification

## Protected File Patterns

The following patterns are excluded in [.gitignore](.gitignore):

```gitignore
# Environment files
.env*
.env.local
.env.development
.env.production
*.env

# API Keys and secrets
*.key
*.pem
*.p12
*.pfx
*.secret
secrets/
credentials.json
serviceAccount.json
```

## Setting Up Environment Variables

### Local Development:
```bash
# 1. Copy the template
cp .env.example .env.local

# 2. Edit .env.local and add your real keys
# (Use your preferred text editor)

# 3. VERIFY it's ignored
git status | grep .env.local  # Should return nothing
```

### Production (Vercel):
1. Go to Vercel Dashboard
2. Select your project
3. Navigate to Settings → Environment Variables
4. Add each variable from `.env.local`:
   - `AZURE_OPENAI_ENDPOINT`
   - `AZURE_OPENAI_API_KEY`
   - `AZURE_OPENAI_NOVA_ENDPOINT`
   - `AZURE_OPENAI_NOVA_API_KEY`
   - `AZURE_OPENAI_MICHAEL_ENDPOINT`
   - `AZURE_OPENAI_MICHAEL_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `BLOB_READ_WRITE_TOKEN`

## Key Rotation Procedure

If API keys are exposed (committed to git, shared publicly, etc.):

### Azure OpenAI:
1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to your OpenAI resource
3. Click "Keys and Endpoint"
4. Click "Regenerate Key 1" or "Regenerate Key 2"
5. Update `.env.local` and Vercel with new key
6. Deploy updated application

### Supabase:
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to Settings → API
4. Under "Service Role Key", click "Regenerate"
5. Update `.env.local` and Vercel with new key

### Vercel Blob:
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to Storage → Blob
3. Regenerate the token
4. Update `.env.local` and Vercel with new token

## Deployment Security Checklist

Before deploying to production, verify:

- [ ] Run: `git ls-files | grep .env` returns nothing (or only `.env.example`)
- [ ] All environment variables set in Vercel dashboard
- [ ] No API keys hardcoded in source files
- [ ] `.gitignore` includes all sensitive file patterns
- [ ] Git history doesn't contain exposed keys
- [ ] Different keys used for dev/staging/production (recommended)

## Emergency Response

If you discover exposed API keys:

1. **IMMEDIATELY** rotate all exposed keys
2. Review git history: `git log --all --full-history -- .env.local`
3. If committed, consider rewriting history (advanced) or rotating keys
4. Update all deployment environments
5. Monitor usage for unauthorized access
6. Document the incident and steps taken

## Additional Resources

- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Azure Key Vault](https://azure.microsoft.com/en-us/services/key-vault/) (for advanced secret management)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/security)

## Questions?

If you're unsure about any security practice:
1. **Ask before committing** - better safe than sorry
2. Review this document and [DEPLOYMENT_CHECKLIST.md](crowe-logic-intro/DEPLOYMENT_CHECKLIST.md)
3. When in doubt, DON'T commit

---

**Last Updated**: 2025-11-05
**Security Status**: ✅ SECURE
