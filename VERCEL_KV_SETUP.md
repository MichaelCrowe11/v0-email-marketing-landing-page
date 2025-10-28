# Vercel KV Setup Guide

Complete guide to setting up Vercel KV for your AI orchestration system.

---

## Prerequisites

- ✅ Vercel account
- ✅ Project deployed on Vercel
- ✅ Git repository connected

---

## Step-by-Step Setup

### 1. Create Vercel KV Store

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to **Storage** tab
3. Click **Create Database**
4. Select **KV** (Redis)
5. Configure:
   - **Name:** `ai-orchestration-kv`
   - **Primary Region:** Choose closest to your users
   - **Read Regions:** (Optional) Add for multi-region
6. Click **Create**

### 2. Link KV to Your Project

1. After creation, click **Connect to Project**
2. Select your project from dropdown
3. Choose environment:
   - ☑️ Production
   - ☑️ Preview
   - ☑️ Development
4. Click **Connect**

Environment variables are **automatically added** to your project:
```bash
KV_URL
KV_REST_API_URL
KV_REST_API_TOKEN
KV_REST_API_READ_ONLY_TOKEN
```

### 3. Pull Environment Variables Locally

```bash
# Install Vercel CLI if not installed
npm i -g vercel

# Login to Vercel
vercel login

# Link project
vercel link

# Pull environment variables
vercel env pull .env.local
```

This creates `.env.local` with all KV credentials.

### 4. Verify Setup

Test KV connection:

```bash
# Create test file: test-kv.js
cat > test-kv.js << 'EOF'
import { kv } from '@vercel/kv'

async function testKV() {
  try {
    // Write test value
    await kv.set('test-key', 'Hello from KV!')

    // Read test value
    const value = await kv.get('test-key')

    console.log('✅ KV connected successfully!')
    console.log('Test value:', value)

    // Cleanup
    await kv.del('test-key')
  } catch (error) {
    console.error('❌ KV connection failed:', error)
  }
}

testKV()
EOF

# Run test
node test-kv.js
```

Expected output:
```
✅ KV connected successfully!
Test value: Hello from KV!
```

---

## Pricing

### Free Tier
- **Storage:** 256 MB
- **Requests:** 30,000 per month
- **Bandwidth:** 100 MB per month
- **Perfect for:** Development & small projects

### Pro Tier ($20/month)
- **Storage:** 512 MB
- **Requests:** 100,000 per month
- **Bandwidth:** 1 GB per month
- **Perfect for:** Production apps with moderate traffic

### Enterprise
- Custom pricing
- Unlimited storage & requests
- Multi-region replication
- SLA guarantees

**For your use case:**
- Start with **Free tier** for testing
- Upgrade to **Pro** when hitting limits
- Estimated: ~10,000 requests/month = Free tier ✅

---

## Configuration Options

### Multi-Region Setup (Optional)

For global low latency:

1. In KV dashboard, click **Add Read Region**
2. Select additional regions:
   - US East (Virginia)
   - EU West (Ireland)
   - Asia Pacific (Singapore)
3. Reads automatically routed to nearest region

**Cost:** +$10/month per read region

### Monitoring

Enable Redis monitoring:

1. Go to KV store → **Settings**
2. Enable **Monitoring**
3. View metrics:
   - Commands per second
   - Memory usage
   - Hit rate
   - Latency

---

## Environment Variables Reference

```bash
# Automatically set by Vercel
KV_URL=redis://default:****@****-****-****.kv.vercel-storage.com:****
KV_REST_API_URL=https://****-****-****.kv.vercel-storage.com
KV_REST_API_TOKEN=****
KV_REST_API_READ_ONLY_TOKEN=****

# Your existing AI keys
OPENAI_API_KEY=sk-proj-****
ANTHROPIC_API_KEY=sk-ant-****
GOOGLE_GENERATIVE_AI_API_KEY=****
```

---

## Troubleshooting

### Issue: "Cannot connect to KV"

**Solution:**
```bash
# Check environment variables
vercel env pull .env.local

# Verify KV_URL is set
echo $KV_URL  # Should not be empty
```

### Issue: "Rate limit exceeded"

**Solution:**
```bash
# Check current usage in Vercel dashboard
# Upgrade to Pro if needed
```

### Issue: "Module not found: @vercel/kv"

**Solution:**
```bash
# Install package
npm install @vercel/kv

# Restart dev server
npm run dev
```

### Issue: "KV works locally but not in production"

**Solution:**
1. Verify KV store is linked to production environment
2. Check Vercel deployment logs for errors
3. Ensure all environment variables are set in production

---

## Usage Examples

### Basic Operations

```typescript
import { kv } from '@vercel/kv'

// Set value
await kv.set('user:123', { name: 'John', email: 'john@example.com' })

// Get value
const user = await kv.get('user:123')

// Delete value
await kv.del('user:123')

// Set with expiration (60 seconds)
await kv.set('session:abc', { token: '...' }, { ex: 60 })

// Increment counter
await kv.incr('page-views')

// Get multiple keys
const values = await kv.mget('key1', 'key2', 'key3')
```

### Pattern Matching

```typescript
// Get all keys matching pattern
const keys = await kv.keys('user:*')

// Scan large keyspaces (better than keys for production)
const cursor = 0
const result = await kv.scan(cursor, { match: 'user:*', count: 100 })
```

### Advanced: Transactions

```typescript
// Atomic operations
const pipeline = kv.pipeline()
pipeline.set('key1', 'value1')
pipeline.set('key2', 'value2')
pipeline.incr('counter')
await pipeline.exec()
```

---

## Best Practices

### 1. Key Naming Convention

Use prefixes for organization:
```
ratelimit:user:123        # Rate limit data
cache:prompt:abc123       # Cached responses
dedup:request:xyz789      # Deduplication
tokens:user:123:totals    # Token usage
health:model:gpt-4o       # Model health
```

### 2. Set Appropriate TTLs

Always set expiration for temporary data:
```typescript
// Good ✅
await kv.set('cache:data', value, { ex: 3600 })

// Bad ❌ (memory leak)
await kv.set('cache:data', value)
```

### 3. Handle Connection Errors

```typescript
try {
  await kv.set('key', 'value')
} catch (error) {
  console.error('KV error:', error)
  // Fail gracefully - continue without cache
}
```

### 4. Monitor Memory Usage

Check regularly in Vercel dashboard:
- High memory = need to clean up old keys
- Set TTLs on all temporary data
- Use `kv.del()` to remove unused keys

### 5. Use Namespaces

Organize keys by feature:
```typescript
const PREFIX = {
  RATE_LIMIT: 'rl:',
  CACHE: 'cache:',
  SESSION: 'session:',
}

await kv.set(`${PREFIX.CACHE}${key}`, value)
```

---

## Migration from In-Memory to KV

### Before (In-Memory)
```typescript
const cache = new Map()

function setCache(key, value) {
  cache.set(key, value)
}

function getCache(key) {
  return cache.get(key)
}
```

### After (Vercel KV)
```typescript
import { kv } from '@vercel/kv'

async function setCache(key, value) {
  await kv.set(key, value, { ex: 3600 })
}

async function getCache(key) {
  return await kv.get(key)
}
```

**Key Changes:**
1. All operations become async
2. Add TTLs for expiration
3. Handle errors gracefully
4. No need to manage memory

---

## Testing

### Unit Tests

```typescript
import { kv } from '@vercel/kv'

describe('KV Operations', () => {
  afterEach(async () => {
    // Cleanup after tests
    await kv.del('test-key')
  })

  it('should set and get value', async () => {
    await kv.set('test-key', 'test-value')
    const value = await kv.get('test-key')
    expect(value).toBe('test-value')
  })
})
```

### Load Testing

```bash
# Install k6
brew install k6  # macOS
# or download from https://k6.io/

# Create load test: load-test.js
cat > load-test.js << 'EOF'
import http from 'k6/http';

export let options = {
  vus: 10,  // 10 virtual users
  duration: '30s',
};

export default function () {
  http.post('https://your-app.vercel.app/api/ai/v2/chat',
    JSON.stringify({
      messages: [{ role: 'user', content: 'Hello' }]
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
}
EOF

# Run test
k6 run load-test.js
```

---

## Monitoring & Alerts

### Set Up Alerts

1. Go to Vercel dashboard → **Settings** → **Notifications**
2. Enable alerts for:
   - KV storage limit (80%)
   - Request limit (80%)
   - Error rate spikes

### Custom Monitoring

Add to your health check:

```typescript
import { kv } from '@vercel/kv'

export async function GET() {
  const info = await kv.info()

  return Response.json({
    memory: {
      used: info.used_memory_human,
      peak: info.used_memory_peak_human,
    },
    stats: {
      total_commands: info.total_commands_processed,
      ops_per_sec: info.instantaneous_ops_per_sec,
    }
  })
}
```

---

## FAQ

**Q: Is Vercel KV Redis-compatible?**
A: Yes, it's a managed Redis service.

**Q: Can I use redis-cli?**
A: Yes, connect using `KV_URL` from environment variables.

**Q: What happens if KV is down?**
A: Your app should gracefully degrade (fail open). We've built fallbacks into the system.

**Q: Can I export data?**
A: Yes, use `redis-cli --rdb dump.rdb` or Vercel dashboard export.

**Q: Is data encrypted?**
A: Yes, encryption at rest and in transit.

**Q: Can I use KV for sessions?**
A: Yes, perfect for sessions, but consider TTLs.

---

## Next Steps

1. ✅ Create KV store
2. ✅ Link to project
3. ✅ Pull environment variables
4. ⬜ Deploy updated code
5. ⬜ Monitor usage for 48 hours
6. ⬜ Adjust settings as needed

---

## Support Resources

- [Vercel KV Documentation](https://vercel.com/docs/storage/vercel-kv)
- [Redis Commands Reference](https://redis.io/commands)
- [Vercel Support](https://vercel.com/support)
- Your implementation: `lib/kv/`

---

**Ready to power your AI orchestration with Vercel KV!** 🚀
