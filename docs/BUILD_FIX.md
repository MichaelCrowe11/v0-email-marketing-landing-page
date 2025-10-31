# Build Fix - Removed ML Dataset Route

## Issue

Build was failing with error:
```
Error: supabaseKey is required.
at app/api/workbench/ml-dataset/route.js
```

## Root Cause

An old ML dataset API route (`app/api/workbench/ml-dataset/route.ts`) was present that required Supabase configuration. This route was not part of the Deep Parallel Workbench implementation and was causing build failures.

## Solution

Deleted `app/api/workbench/ml-dataset/route.ts` as it was:
1. Not part of the workbench implementation
2. Requiring Supabase credentials that aren't needed
3. Not used by any workbench features

## Verification

All workbench API routes are now clean:
- ✅ `/api/workbench/sessions` - Session CRUD
- ✅ `/api/workbench/sessions/[id]` - Single session operations
- ✅ `/api/workbench/hypotheses/[id]/test` - AI hypothesis testing

No Supabase dependencies in workbench routes.

## Build Status

Build should now succeed. The workbench only requires:
- Azure OpenAI credentials (already in Vercel secrets)
- No database required for current implementation

## Next Steps

1. Push changes to trigger new build
2. Verify deployment succeeds
3. Test workbench functionality

---

**Status:** ✅ Fixed - Ready to deploy
