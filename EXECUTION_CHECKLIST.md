# ✅ EXECUTION CHECKLIST
## NewsKarnataka Week 1 & 2 - Step-by-Step

---

## 🎯 PRE-EXECUTION (Day 1 Morning)

### Environment Setup
- [ ] Verify Node.js 18+ installed: `node -v`
- [ ] Verify npm installed: `npm -v`
- [ ] Verify Docker installed: `docker -v`
- [ ] Verify Docker Compose installed: `docker-compose -v`
- [ ] Clone/navigate to workspace: `d:\Personal\Kiro\newsKarnataka`

### Pre-Req Checks
- [ ] Strapi running: http://103.191.208.235:1337/admin
- [ ] Database accessible: PostgreSQL 103.191.208.235:5432
- [ ] Credentials ready: reachus@opusinfiniti.com / Opus@321$%^

---

## 🚀 DAY 1: INFRASTRUCTURE START (Monday Morning)

### Step 1: Start Docker Compose (30 min)
```bash
cd d:\Personal\Kiro\newsKarnataka
docker-compose up -d
```
- [ ] PostgreSQL container running
- [ ] Strapi container running (or verify existing)
- [ ] Elasticsearch container running
- [ ] Redis container running
- [ ] All services healthy: `docker-compose ps`

### Step 2: Verify Services (15 min)
- [ ] PostgreSQL: `docker-compose exec postgres pg_isready -U postgres` → accepting connections
- [ ] Redis: `docker-compose exec redis redis-cli ping` → PONG
- [ ] Elasticsearch: `curl http://localhost:9200/_cluster/health` → green status
- [ ] Strapi: http://localhost:1337/admin → login page shows

### Step 3: Create GitHub Repositories (30 min)
- [ ] Create repo: `newskarnataka-public-website`
- [ ] Create repo: `newskarnataka-ai-console`
- [ ] Add secrets to repos:
  - [ ] API_URL = http://103.191.208.235:1337
  - [ ] GRAPHQL_URL = http://103.191.208.235:1337/graphql
  - [ ] API_KEY = (get from Strapi)

### Step 4: Configure Environment Files (20 min)
```bash
# Copy template
cp .env.example .env.local
# Edit .env.local with local values
```
- [ ] .env.local created
- [ ] DATABASE credentials set
- [ ] JWT secrets set
- [ ] All required variables present

**Estimated Time: 1.5 hours**

---

## 📋 DAY 1: SAMPLE DATA (Monday Afternoon)

### Step 5: Get Strapi API Token (10 min)

**In Strapi Admin:**
1. Settings → API Tokens
2. Create new API token (Full access)
3. Copy token

- [ ] API token obtained and saved

### Step 6: Create Sample Data (20 min)

```powershell
.\scripts\create-sample-data.ps1 `
  -StrapiUrl "http://localhost:1337" `
  -ApiToken "your_token_here"
```

- [ ] Categories created (5)
- [ ] Tags created (15)
- [ ] Authors created (3)
- [ ] Article Sources created (5)
- [ ] Sample articles created (10+)

**Verify in Strapi Admin:**
- [ ] Collections visible in sidebar
- [ ] Articles appearing in Content Manager
- [ ] Sample data displaying

**Estimated Time: 30 minutes**

---

## 💻 DAY 2: FRONTEND PROJECT 1 - NEXT.JS (Tuesday Morning)

### Step 7: Initialize Next.js Project (30 min)

```bash
cd d:\Personal\Kiro
npx create-next-app@latest newskarnataka-web --typescript --tailwind
# Select: TypeScript, Tailwind, App Router
```

- [ ] Project created
- [ ] Dependencies installed
- [ ] Dev server runs: `npm run dev` → http://localhost:3000

### Step 8: Configure Apollo Client (20 min)

**File: `newskarnataka-web/lib/apollo-client.ts`**

```typescript
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
  ssrMode: typeof window === 'undefined',
  link: new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
    credentials: 'same-origin'
  }),
  cache: new InMemoryCache()
});

export default client;
```

- [ ] Apollo Client configured
- [ ] Environment variables set
- [ ] GraphQL queries tested in playground

### Step 9: Install Dependencies (10 min)

```bash
npm install @apollo/client graphql react-hot-toast zustand socket.io-client
npm install -D @tailwindcss/forms
```

- [ ] All dependencies installed
- [ ] No errors: `npm run build`

**Estimated Time: 1 hour**

---

## 💻 DAY 2: FRONTEND PROJECT 2 - REACT CONSOLE (Tuesday Afternoon)

### Step 10: Initialize React + Vite (30 min)

```bash
cd d:\Personal\Kiro
npm create vite@latest ai-console -- --template react-ts
cd ai-console
npm install
```

- [ ] Project created
- [ ] Dev server runs: `npm run dev` → http://localhost:5173

### Step 11: Configure Vite + Tailwind (20 min)

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

- [ ] Tailwind configured
- [ ] Styles working

### Step 12: Install Dependencies (10 min)

```bash
npm install @apollo/client graphql react-router-dom zustand react-hot-toast socket.io-client
npm install @headlessui/react @heroicons/react
```

- [ ] All dependencies installed
- [ ] No errors: `npm run build`

**Estimated Time: 1 hour**

---

## 🧪 DAY 3: COMPONENT BUILDING (Wednesday)

### Step 13: Build Next.js Homepage (3 hours)

```typescript
// pages/index.tsx
// Use useArticles hook
// Display featured articles + latest articles
```

**Checklist:**
- [ ] Homepage loads
- [ ] Displays articles from API
- [ ] Featured section working
- [ ] Latest section working
- [ ] No console errors

### Step 14: Build React Dashboard (3 hours)

```typescript
// src/pages/Dashboard.tsx
// Use useDashboardStats hook
// Display stats cards + charts
```

**Checklist:**
- [ ] Dashboard loads
- [ ] Stats displaying
- [ ] Charts rendering
- [ ] Real-time data updating
- [ ] No console errors

**Estimated Time: 6 hours**

---

## 🤖 DAY 4: AI & REAL-TIME (Thursday)

### Step 15: Build Submission Workflow (3 hours)

```typescript
// AI Console: SubmissionForm + SubmissionQueue
// Use useSubmitArticle hook
```

**Checklist:**
- [ ] Form submits successfully
- [ ] Queue displays submissions
- [ ] Status updates work
- [ ] Validation results show

### Step 16: Real-Time Updates (2 hours)

```typescript
// Implement Socket.io
// Connect to Redis pub/sub
```

**Checklist:**
- [ ] Socket.io connected
- [ ] Real-time updates working
- [ ] Multiple clients see updates
- [ ] No connection errors

**Estimated Time: 5 hours**

---

## 🔐 DAY 5: AUTH & TESTING (Friday)

### Step 17: Add Authentication (2 hours)

```bash
npm install next-auth
# Configure JWT auth
```

**Checklist:**
- [ ] Login page working
- [ ] Protected routes blocked
- [ ] JWT token stored
- [ ] Logout working

### Step 18: Run Tests (2 hours)

```bash
npm run test
npm run build
```

**Checklist:**
- [ ] All tests passing
- [ ] No build errors
- [ ] No console errors
- [ ] Lighthouse score > 80

### Step 19: Final Verification (2 hours)

- [ ] Next.js homepage loads (port 3000)
- [ ] React Console loads (port 5173)
- [ ] Can submit articles
- [ ] Can see AI validation
- [ ] Real-time updates work
- [ ] Search working
- [ ] Strapi admin accessible

**Estimated Time: 6 hours**

---

## 📊 DAILY TIMELINE

### Monday (8 hours)
- [ ] Morning (1.5h): Infrastructure + GitHub setup
- [ ] Afternoon (0.5h): Sample data creation
- [ ] Remaining: Documentation review

### Tuesday (8 hours)
- [ ] Morning (1h): Next.js setup
- [ ] Afternoon (1h): React + Vite setup
- [ ] Remaining: Component planning

### Wednesday (8 hours)
- [ ] 6 hours: Build components
- [ ] 2 hours: Testing & bug fixes

### Thursday (8 hours)
- [ ] 5 hours: Workflows + real-time
- [ ] 3 hours: Integration testing

### Friday (8 hours)
- [ ] 2 hours: Authentication
- [ ] 2 hours: Testing
- [ ] 2 hours: Final verification
- [ ] 2 hours: Documentation

---

## 🎯 SUCCESS METRICS (Week 2 End)

### Functionality
- [ ] Articles displaying on homepage
- [ ] Can search articles
- [ ] Can submit articles to AI Console
- [ ] AI validation producing scores
- [ ] Real-time updates working
- [ ] Authentication secured

### Performance
- [ ] Homepage: < 2 seconds
- [ ] Search: < 500ms
- [ ] API: < 200ms

### Quality
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Tests passing (70%+)
- [ ] Lighthouse score > 80

### Documentation
- [ ] Code commented
- [ ] README updated
- [ ] API docs generated
- [ ] Deployment guide ready

---

## 🚨 COMMON ISSUES & FIXES

### If Docker fails to start:
```bash
docker-compose down -v
docker system prune -a
docker-compose up -d
```

### If API not responding:
```bash
# Check Strapi logs
docker-compose logs strapi

# Restart Strapi
docker-compose restart strapi
```

### If GraphQL queries fail:
```bash
# Test query in playground
curl -X POST http://localhost:1337/graphql \
  -H "Content-Type: application/json" \
  -d '{ "query": "{ articles { data { id } } }" }'
```

### If npm install fails:
```bash
# Clear cache
npm cache clean --force
rm package-lock.json
npm install
```

---

## 📞 SUPPORT RESOURCES

**Strapi Admin:** http://103.191.208.235:1337/admin  
**GraphQL Playground:** http://localhost:1337/graphql  
**Next.js Docs:** https://nextjs.org/docs  
**React Docs:** https://react.dev  
**Apollo Docs:** https://www.apollographql.com/docs/react  

---

## ✅ FINAL CHECKLIST

Before declaring Week 2 complete:

- [ ] All documentation reviewed
- [ ] All code deployed to GitHub
- [ ] CI/CD workflows passing
- [ ] Staging environment stable
- [ ] No critical bugs
- [ ] Performance metrics met
- [ ] Security checklist passed
- [ ] Team trained on platform

---

**You're ready to execute!**  
**Estimated total time: 40 hours (1 week)**

