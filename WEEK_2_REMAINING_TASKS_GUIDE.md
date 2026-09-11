# 🎯 WEEK 2 REMAINING TASKS GUIDE

**Progress:** 10/20 (50%) → Target: 20/20 (100%)  
**Remaining:** 10 tasks in 9-12 hours

---

## 🚀 FAST TRACK APPROACH FOR MVP

### What Can Be Skipped for MVP?
- ❌ **Tasks #11-12** (Socket.io & Redis) - Not needed for MVP
  - Current polling strategy works fine
  - Can add real-time in Week 3
  - Would add 3-4 hours of work
  
### Priority Order for Remaining
1. **Tasks #13-16** - Authentication (MUST HAVE)
2. **Tasks #19-20** - Deployment (MUST HAVE) 
3. **Tasks #17-18** - Tests (NICE TO HAVE)

---

## 📚 TASK #13-16: AUTHENTICATION & SECURITY

### Quick Implementation Plan

#### Step 1: JWT Setup (Task #13)
```typescript
// Console: src/lib/auth.ts
export const authAPI = {
  login: async (email: string, password: string) => {
    // Call Strapi auth endpoint
    const response = await axios.post(
      `${STRAPI_URL}/api/auth/local`,
      { identifier: email, password }
    );
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
  },

  refreshToken: async (jwt: string) => {
    // Refresh JWT before expiration
  }
};
```

#### Step 2: Login/Logout System (Task #14)
```typescript
// Update Login.tsx to use real auth
const handleSubmit = async (e: React.FormEvent) => {
  try {
    const { jwt, user } = await authAPI.login(email, password);
    localStorage.setItem('jwt', jwt);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    setAuthenticated(true);
    navigate('/');
  } catch (error) {
    setError('Invalid credentials');
  }
};
```

#### Step 3: Role-Based Access Control (Task #15)
```typescript
// lib/rbac.ts
const ROLES = {
  admin: ['view', 'create', 'edit', 'delete', 'publish'],
  editor: ['view', 'create', 'edit', 'publish'],
  viewer: ['view'],
};

export const canPerform = (role: string, action: string) => {
  return ROLES[role]?.includes(action) || false;
};

// Usage in components
{canPerform(user.role, 'edit') && <EditButton />}
```

#### Step 4: Rate Limiting (Task #16)
```typescript
// lib/rateLimiter.ts
import RateLimit from 'express-rate-limit';

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
});

// Apply to API client
strapiClient.interceptors.request.use((config) => {
  // Add rate limit headers
  return config;
});
```

**Time Estimate:** 3-4 hours

---

## 🧪 TASK #17-18: TESTING (OPTIONAL FOR MVP)

### Unit Tests Setup
```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom jest
```

### Example Tests
```typescript
// components/__tests__/ArticleCard.test.tsx
import { render, screen } from '@testing-library/react';
import ArticleCard from '../ArticleCard';

describe('ArticleCard', () => {
  it('renders article title', () => {
    const article = {
      id: 1,
      attributes: {
        title: 'Test Article',
        slug: 'test-article',
        description: 'Test description',
        content: 'Test content',
        publishedAt: '2024-01-01',
        status: 'published',
        is_featured: false,
      },
    };

    render(<ArticleCard article={article} />);
    expect(screen.getByText('Test Article')).toBeInTheDocument();
  });
});
```

**Time Estimate:** 3-4 hours (optional)

---

## 🚀 TASK #19-20: CI/CD & DEPLOYMENT

### Step 1: GitHub Actions (Task #19)

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-website:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: cd newskarnataka-website && npm install
      
      - name: Build
        run: cd newskarnataka-website && npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID_WEBSITE }}

  build-console:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: cd newskarnataka-console && npm install
      
      - name: Build
        run: cd newskarnataka-console && npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID_CONSOLE }}
```

### Step 2: Vercel Deployment (Task #20)

**For Next.js Website:**
1. Connect GitHub repo to Vercel
2. Select `newskarnataka-website` directory
3. Add environment variables:
   ```
   NEXT_PUBLIC_STRAPI_URL=http://103.191.208.235:1337
   STRAPI_API_TOKEN_FULL_ACCESS=...
   ```
4. Deploy

**For React Console:**
1. Create new Vercel project
2. Select `newskarnataka-console` directory
3. Add environment variables:
   ```
   VITE_STRAPI_URL=http://103.191.208.235:1337
   VITE_STRAPI_API_TOKEN=...
   ```
4. Deploy

**Alternative: Railway Deployment**
```bash
# Login to Railway
railway login

# Link project
railway link

# Deploy
railway up
```

**Time Estimate:** 2-3 hours

---

## 📋 IMPLEMENTATION CHECKLIST

### Authentication (Tasks #13-16)
- [ ] Create JWT auth service
- [ ] Update Login page to use real auth
- [ ] Add role-based access control
- [ ] Implement rate limiting
- [ ] Test auth flow end-to-end

### Testing (Tasks #17-18) - OPTIONAL
- [ ] Set up Jest + React Testing Library
- [ ] Write component tests
- [ ] Write hook tests
- [ ] Write integration tests
- [ ] Achieve 80%+ coverage

### Deployment (Tasks #19-20)
- [ ] Create GitHub Actions workflow
- [ ] Set up Vercel for Next.js
- [ ] Set up Vercel/Railway for Console
- [ ] Add environment variables
- [ ] Test production builds
- [ ] Monitor deployment logs

---

## ⚡ QUICK WIN: SKIP SOCKET.IO & REDIS FOR MVP

**Why?**
- Polling works fine for initial launch
- Can add real-time in Week 3
- Would delay deployment by 3-4 hours

**When to add later:**
- If users need <1s updates
- When scaling to 1000+ concurrent users
- When article creation frequency increases

---

## 🎯 RECOMMENDED COMPLETION SEQUENCE

### Session 1 (2-3 hours)
1. Implement JWT authentication
2. Update login flow
3. Add role-based access control

### Session 2 (2-3 hours)
4. Set up rate limiting
5. Test auth end-to-end
6. Deploy to production

### Session 3 (1-2 hours) - OPTIONAL
7. Add unit tests
8. Add integration tests
9. Monitor production

---

## 📱 TESTING CHECKLIST BEFORE DEPLOYMENT

### Homepage (Next.js)
- [ ] Articles load on homepage
- [ ] Search works
- [ ] Category filter works
- [ ] Article detail page works
- [ ] Pagination works
- [ ] Mobile responsive

### Console (React)
- [ ] Login works
- [ ] Submit article form works
- [ ] Content queue loads
- [ ] Publish button works
- [ ] Delete button works
- [ ] Logout works

### API Integration
- [ ] Strapi connection stable
- [ ] API tokens working
- [ ] Database reads working
- [ ] Database writes working

---

## 🔑 SECRETS TO CONFIGURE IN CI/CD

### GitHub Secrets (needed for Actions)
```
VERCEL_TOKEN=<your_vercel_token>
VERCEL_ORG_ID=<your_org_id>
VERCEL_PROJECT_ID_WEBSITE=<project_id>
VERCEL_PROJECT_ID_CONSOLE=<project_id>
GITHUB_TOKEN=<auto_generated>
```

### Environment Variables (Vercel)
```
NEXT_PUBLIC_STRAPI_URL=http://103.191.208.235:1337
STRAPI_API_TOKEN_FULL_ACCESS=...
VITE_STRAPI_URL=http://103.191.208.235:1337
VITE_STRAPI_API_TOKEN=...
```

---

## 📞 QUICK REFERENCE

### Deploy Commands
```bash
# Build locally
cd newskarnataka-website && npm run build
cd newskarnataka-console && npm run build

# Test production build
npm run preview

# Deploy manually
vercel deploy --prod
```

### Monitoring
- Vercel Dashboard: https://vercel.com/dashboard
- Strapi Admin: http://103.191.208.235:1337/admin
- GitHub Actions: https://github.com/<repo>/actions

---

## ✅ MVP COMPLETION CHECKLIST

- [ ] Authentication working
- [ ] Both apps deployed
- [ ] CI/CD pipeline active
- [ ] Strapi backend stable
- [ ] Zero broken links
- [ ] Mobile responsive
- [ ] Error tracking enabled
- [ ] Ready for user testing

**Once all checked:** Week 2 MVP Complete ✅

