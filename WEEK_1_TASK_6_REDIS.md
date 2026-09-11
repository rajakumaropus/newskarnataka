# ⚡ WEEK 1 - TASK 6: Redis Configuration
## Set up caching and session management

**Task:** Configure Redis for caching, real-time features, and session storage  
**Duration:** 2-3 hours  
**Status:** IN PROGRESS  

---

## 📋 OVERVIEW

**What:** Redis cache cluster for session management, real-time updates, and performance  
**Why:** Reduce database load, enable real-time features, improve response times  
**Version:** Redis 7.x

---

## 🔧 INSTALLATION OPTIONS

### Option A: Docker (Recommended)

```yaml
# docker-compose.yml section
redis:
  image: redis:7-alpine
  ports:
    - "6379:6379"
  volumes:
    - redis_data:/data
  command: redis-server --appendonly yes
```

### Option B: Local Installation (Windows)

```powershell
# Download from: https://github.com/microsoftarchive/redis/releases
# Or use Chocolatey:
choco install redis-64

# Start Redis
redis-server

# Test connection
redis-cli ping
# Response: PONG
```

---

## 🎯 REDIS DATA STRUCTURES & USAGE

### 1. Session Storage

**Key Pattern:** `session:user_id:token`

```javascript
// Set session
redis.set('session:user123:token_abc', JSON.stringify({
  userId: 'user123',
  email: 'user@example.com',
  role: 'editor',
  permissions: ['publish', 'review'],
  loggedInAt: new Date()
}), 'EX', 86400); // 24 hours expiry

// Get session
redis.get('session:user123:token_abc');
```

### 2. Article Cache

**Key Pattern:** `article:id:data`

```javascript
// Cache article
redis.set('article:123:data', JSON.stringify(articleData), 'EX', 3600);

// Get from cache
redis.get('article:123:data');

// Invalidate cache on update
redis.del('article:123:data');
```

### 3. Search Results Cache

**Key Pattern:** `search:hash:results`

```javascript
// Cache search results
const searchHash = crypto.md5('query=karnataka&category=politics');
redis.set(`search:${searchHash}:results`, JSON.stringify(results), 'EX', 600);
```

### 4. Real-time Data with Pub/Sub

**Channels:** `article:new`, `article:updated`, `user:online`

```javascript
// Publish article update
redis.publish('article:updated', JSON.stringify({
  articleId: '123',
  title: 'Updated Title',
  timestamp: new Date()
}));

// Subscribe to updates
redis.subscribe('article:updated', (err, count) => {
  console.log(`Subscribed to ${count} channels`);
});

redis.on('message', (channel, message) => {
  console.log(`Message from ${channel}: ${message}`);
  // Broadcast to connected clients via WebSocket
});
```

### 5. Rate Limiting

**Key Pattern:** `ratelimit:user_id:action`

```javascript
// Check rate limit
redis.incr(`ratelimit:user123:search`);
redis.expire(`ratelimit:user123:search`, 60); // 1 minute window

// If count > limit, reject request
```

### 6. Task Queue

**Key Pattern:** `queue:pending_tasks`

```javascript
// Add task
redis.lpush('queue:pending_tasks', JSON.stringify({
  type: 'validate_article',
  articleId: '123',
  timestamp: new Date()
}));

// Process task
redis.rpop('queue:pending_tasks', (err, task) => {
  // Process task
});
```

---

## 🔗 STRAPI INTEGRATION

### Install Cache Plugin

```bash
npm install @strapi/plugin-redis
# or for custom caching:
npm install redis ioredis
```

### Configure Strapi

**File: `config/plugins.js`**

```javascript
module.exports = {
  redis: {
    enabled: true,
    config: {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD,
      db: process.env.REDIS_DB || 0
    }
  }
};
```

### Cache Strategy for APIs

**File: `src/api/article/controllers/article.js`**

```javascript
const Redis = require('redis');
const client = Redis.createClient({
  host: 'localhost',
  port: 6379
});

module.exports = {
  async find(ctx) {
    const cacheKey = `articles:${ctx.request.query}`;
    
    // Try cache first
    const cached = await client.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // Query database
    const articles = await strapi.query('api::article.article').find(ctx.query);
    
    // Cache result (1 hour)
    await client.setex(cacheKey, 3600, JSON.stringify(articles));
    
    return articles;
  },

  async update(ctx) {
    const { id } = ctx.params;
    const result = await strapi.query('api::article.article').update(id, ctx.request.body);
    
    // Invalidate caches
    await client.del(`articles:*`);
    await client.del(`article:${id}:*`);
    
    // Publish update event
    await client.publish('article:updated', JSON.stringify(result));
    
    return result;
  }
};
```

---

## 💻 NEXT.JS INTEGRATION

### Create Redis Hook

**File: `lib/redis.ts`**

```typescript
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0')
});

export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 3600
): Promise<T> {
  // Try cache
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  // Fetch fresh data
  const data = await fetcher();
  
  // Store in cache
  await redis.setex(key, ttl, JSON.stringify(data));
  
  return data;
}

export async function invalidateCache(pattern: string) {
  const keys = await redis.keys(pattern);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}

export { redis };
```

### Use in Pages

```typescript
// pages/articles/[slug].tsx
import { getCached } from '@/lib/redis';

export async function getStaticProps({ params }: GetStaticPropsContext) {
  const article = await getCached(
    `article:${params.slug}`,
    async () => {
      const res = await fetch(`${API_URL}/api/articles?filters[slug]=${params.slug}`);
      return res.json();
    },
    86400 // 24 hours
  );

  return {
    props: { article },
    revalidate: 3600
  };
}
```

---

## 🎯 REAL-TIME FEATURES WITH REDIS + WEBSOCKETS

### Socket.io Integration

**File: `pages/api/socket.ts`**

```typescript
import { Server } from 'socket.io';
import Redis from 'ioredis';

const redis = new Redis();
const redisPub = new Redis();
const redisSub = new Redis();

export default function handler(req: NextApiRequest, res: any) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server);

    // Subscribe to Redis pub/sub channels
    redisSub.on('message', (channel, message) => {
      io.emit(channel, JSON.parse(message));
    });

    redisSub.subscribe('article:updated', 'article:new', 'user:online');

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      // Handle real-time events
      socket.on('article:view', async (articleId) => {
        // Update view count in Redis
        await redis.incr(`article:${articleId}:views`);
        
        // Publish update
        await redisPub.publish('article:updated', JSON.stringify({
          articleId,
          event: 'view',
          views: await redis.get(`article:${articleId}:views`)
        }));
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });

    res.socket.server.io = io;
  }

  res.end();
}
```

### Frontend Socket Connection

```typescript
// hooks/useSocket.ts
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

export function useSocket() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    socket.on('article:updated', (data) => {
      console.log('Article updated:', data);
      // Update UI
    });

    setSocket(socket);

    return () => socket.disconnect();
  }, []);

  return socket;
}
```

---

## 🛠️ REDIS CLI COMMANDS

### Basic Operations

```bash
# Connect to Redis
redis-cli

# Check connection
ping
# PONG

# Set/Get
set key value
get key

# Delete
del key

# Check TTL
ttl key

# Set with expiry
setex key 3600 value

# List all keys
keys *

# Flush database
flushdb
flushall

# Database info
info
```

### Monitor Commands

```bash
# Monitor real-time commands
monitor

# Stats
info stats

# Memory usage
info memory

# Client connections
client list
```

---

## ✅ VERIFICATION CHECKLIST

- [ ] Redis running (port 6379)
- [ ] Can connect with redis-cli
- [ ] Test key-value storage working
- [ ] Session storage configured
- [ ] Article cache working
- [ ] Rate limiting implemented
- [ ] Pub/Sub channels working
- [ ] Socket.io real-time events working
- [ ] Strapi plugin integrated
- [ ] Next.js Redis hook working

---

## 🚀 NEXT STEPS

- Task #7: Set up .env files
- Task #8: Create Docker Compose

---

**Status: READY FOR EXECUTION**

