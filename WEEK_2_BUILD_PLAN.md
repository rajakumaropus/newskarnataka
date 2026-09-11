# 🚀 WEEK 2: BUILD PHASE - Frontend & Integration

**Status:** Day 1 Complete ✅ → Moving to Development Phase  
**Duration:** Monday-Friday (5 days)  
**Goal:** Build and deploy Next.js homepage + React AI Console with full Strapi integration

---

## 📅 WEEK 2 DAILY BREAKDOWN

### **Monday - Day 2: Next.js Homepage Setup**
**Duration:** 8 hours  
**Deliverables:**
- [ ] Task #7: Set up Next.js 14 project with TypeScript + Tailwind
- [ ] Task #8: Create article listing page with pagination
- [ ] Task #9: Create category filter component
- [ ] Task #10: Create search functionality

**Files to Create:**
```
newskarnataka-website/
├── pages/
│   ├── index.tsx (Homepage with featured articles)
│   ├── articles/[slug].tsx (Article detail page)
│   ├── categories/[slug].tsx (Category page)
│   └── search.tsx (Search results)
├── components/
│   ├── ArticleCard.tsx
│   ├── ArticleList.tsx
│   ├── CategoryFilter.tsx
│   ├── SearchBar.tsx
│   └── Pagination.tsx
├── lib/
│   ├── strapi.ts (API client)
│   ├── queries.ts (GraphQL queries)
│   └── hooks/useArticles.ts
└── styles/ (Tailwind config)
```

**Success Criteria:**
- ✅ Next.js app runs on localhost:3000
- ✅ Articles display from Strapi
- ✅ Categories filter working
- ✅ Search functional
- ✅ Mobile responsive

---

### **Tuesday - Day 3: React AI Console Setup**
**Duration:** 8 hours  
**Deliverables:**
- [ ] Task #11: Set up React + Vite console app
- [ ] Task #12: Create dashboard layout
- [ ] Task #13: Build article submission form
- [ ] Task #14: Create content queue UI

**Files to Create:**
```
newskarnataka-console/
├── src/
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── SubmitArticle.tsx
│   │   ├── ContentQueue.tsx
│   │   └── Settings.tsx
│   ├── components/
│   │   ├── ArticleForm.tsx
│   │   ├── QueueTable.tsx
│   │   ├── ValidationPanel.tsx
│   │   └── AIAnalysis.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   └── hooks/
│   ├── styles/ (Tailwind)
│   └── App.tsx
```

**Success Criteria:**
- ✅ React app runs on localhost:5173
- ✅ Dashboard displays stats
- ✅ Form submits articles to Strapi
- ✅ Queue shows pending items
- ✅ Real-time updates work

---

### **Wednesday - Day 4: API Integration & Real-time**
**Duration:** 8 hours  
**Deliverables:**
- [ ] Task #15: Connect Next.js to Strapi API
- [ ] Task #16: Connect React Console to Strapi API
- [ ] Task #17: Set up Socket.io for real-time updates
- [ ] Task #18: Configure Redis for caching

**Key Integrations:**
```
Next.js Website:
├── getServerSideProps → Strapi REST API
├── getStaticProps → Strapi GraphQL
└── ISR (Incremental Static Regeneration)

React Console:
├── useApi() hook → Strapi REST API
├── useQuery() hook → Strapi GraphQL
└── useSocket() hook → Socket.io

Real-time:
├── Socket.io server (Node.js)
├── Redis pub/sub for scaling
└── WebSocket connections
```

**Success Criteria:**
- ✅ Next.js fetches articles from Strapi
- ✅ Console creates articles via API
- ✅ Real-time updates work across both apps
- ✅ Redis cache reduces API calls
- ✅ Performance: <500ms API responses

---

### **Thursday - Day 5: Authentication & Security**
**Duration:** 8 hours  
**Deliverables:**
- [ ] Task #19: Implement JWT authentication
- [ ] Task #20: Create login/logout system
- [ ] Task #21: Add role-based access control
- [ ] Task #22: Set up API rate limiting

**Auth Flow:**
```
1. User logs in to console
   → API returns JWT token
   → Token stored in localStorage/httpOnly cookie

2. Token included in API requests
   → Authorization header: "Bearer {token}"
   → Strapi validates token

3. Role-based access
   → Admin: All permissions
   → Editor: Create/edit articles
   → Viewer: Read-only

4. Rate limiting
   → 100 requests/minute per user
   → Redis-based token bucket
```

**Success Criteria:**
- ✅ Login/logout working
- ✅ Tokens refreshed automatically
- ✅ Protected routes enforce auth
- ✅ Role-based permissions enforced
- ✅ Rate limiting active

---

### **Friday - Day 6: Testing & Deployment**
**Duration:** 8 hours  
**Deliverables:**
- [ ] Task #23: Write unit tests (Jest + React Testing Library)
- [ ] Task #24: Write integration tests
- [ ] Task #25: Set up GitHub Actions CI/CD
- [ ] Task #26: Deploy to production (Vercel + Railway)

**Testing Strategy:**
```
Unit Tests (90% coverage):
├── Components (ArticleCard, SearchBar, etc.)
├── Hooks (useArticles, useApi, etc.)
└── Utils (parseDate, formatSlug, etc.)

Integration Tests:
├── Article creation flow
├── Search + filter flow
├── Real-time update flow
└── Authentication flow

E2E Tests (optional):
├── Homepage → Article detail
├── Console login → Submit article
└── Dashboard → Content queue
```

**Deployment:**
```
Next.js Website → Vercel
├── Automatic deploys on push to main
├── Preview deploys on PRs
└── Environment: Production

React Console → Railway (or Vercel)
├── Automatic deploys on push to main
├── Environment: Production

Database → Strapi (already hosted)
├── PostgreSQL at 103.191.208.235:5432
├── Redis at localhost:6379 (or Redis Cloud)
└── Backups: Daily
```

**Success Criteria:**
- ✅ 90% test coverage
- ✅ All tests passing
- ✅ CI/CD pipeline working
- ✅ Deployment automated
- ✅ Both apps live on production URLs

---

## 🛠️ **TECH STACK (Week 2)**

### Frontend
| Tech | Purpose |
|------|---------|
| Next.js 14 | Homepage (SSR + ISR) |
| React 18 | Console (SPA) |
| Vite | Console build tool |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| GraphQL / REST | API queries |

### Backend (Existing)
| Tech | Purpose |
|------|---------|
| Strapi | CMS + API |
| PostgreSQL | Database |
| Redis | Caching + real-time |
| Node.js | Socket.io server |

### DevOps
| Tech | Purpose |
|------|---------|
| GitHub Actions | CI/CD |
| Jest | Unit testing |
| React Testing Library | Component testing |
| Vercel | Next.js hosting |
| Railway | Backend hosting |

---

## 📊 **ESTIMATED TIMELINE**

| Day | Tasks | Hours | Deliverables |
|-----|-------|-------|--------------|
| **Mon** | #7-10 | 8 | Next.js homepage + components |
| **Tue** | #11-14 | 8 | React console + UI |
| **Wed** | #15-18 | 8 | API integration + real-time |
| **Thu** | #19-22 | 8 | Auth + security |
| **Fri** | #23-26 | 8 | Tests + deployment |
| **TOTAL** | 20 tasks | 40 | 2 production apps |

---

## 🎯 **SUCCESS METRICS**

**Performance:**
- ✅ Homepage load time: <3s
- ✅ API response time: <500ms
- ✅ Real-time latency: <200ms

**Quality:**
- ✅ Test coverage: 90%+
- ✅ Lighthouse score: 90+
- ✅ 0 critical bugs

**Users:**
- ✅ 1000+ articles displayable
- ✅ 100+ concurrent users
- ✅ 99.9% uptime

---

## 📝 **DELIVERABLES AT END OF WEEK 2**

✅ **Next.js Homepage**
- Live at: `newskarnataka.vercel.app` (or custom domain)
- Features: Articles, categories, search, pagination
- Performance: Optimized with ISR + caching

✅ **React AI Console**
- Live at: `console.newskarnataka.com` (or custom domain)
- Features: Dashboard, submission, queue, analytics
- Performance: Real-time updates via Socket.io

✅ **Full Integration**
- Both apps connected to Strapi backend
- Real-time sync with Redis
- JWT authentication working
- CI/CD automated

✅ **Documentation**
- API documentation (Swagger/GraphQL)
- Deployment guides
- Architecture diagrams
- Troubleshooting guide

---

## 🚀 **GO/NO-GO CHECKLIST**

Before starting Week 2:
- [ ] Day 1 complete (infrastructure, tokens, sample data)
- [ ] All .env variables configured
- [ ] Docker services running
- [ ] Strapi accessible with data
- [ ] Redis healthy
- [ ] GitHub repos created and CI/CD setup

**Ready to START WEEK 2? 👇**

---

## 📞 **QUICK REFERENCE**

**Strapi Admin:**
- URL: `http://103.191.208.235:1337/admin`
- Email: `reachus@opusinfiniti.com`
- Password: `Opus@321$%^`

**Database:**
- Host: `103.191.208.235:5432`
- Name: `newskarnataka`
- User: `news` / Password: `news321`

**Local Services:**
- Redis: `localhost:6379`
- pgAdmin: `localhost:5050`

**Tokens (in .env):**
- Full Access: `STRAPI_API_TOKEN_FULL_ACCESS`
- Backend Dev: `STRAPI_API_TOKEN_BACKEND_DEV`
- Backend Staging: `STRAPI_API_TOKEN_BACKEND_STAGING`
- Backend Production: `STRAPI_API_TOKEN_BACKEND_PRODUCTION`
- Read Only: `STRAPI_API_TOKEN_READ_ONLY`

---

## ✅ READY TO BUILD!

**Start here:** `Task #7: Set up Next.js project`

Want me to create the Next.js project setup? Type: **"lets build week 2"**

