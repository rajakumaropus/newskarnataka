# Frontend Technology Stack Specification
## NewsKarnataka.com - Web & Mobile Applications

**Project:** NewsKarnataka WordPress to Strapi Migration  
**Status:** Pre-Implementation  
**Date:** September 2026

---

## EXECUTIVE SUMMARY

Comprehensive frontend architecture supporting:
- **Web:** React 18 + Next.js 14 (SSR/SSG) for SEO-optimized news site
- **Mobile:** Flutter 3.x for iOS/Android with native performance
- **Admin:** React-based editor console with real-time updates
- **Performance:** <2s page load, Core Web Vitals optimized
- **Multi-Language:** Native support for Kannada, English, Tulu

---

## PART 1: WEB APPLICATION (React + Next.js)

### 1.1 Technology Stack

```
Framework:          Next.js 14.x (App Router)
UI Library:         React 18.x
Language:           TypeScript 5.x
Styling:            Tailwind CSS 3.x + CSS Modules
Component Library:  Shadcn/ui + Radix UI
State Management:   Zustand (lightweight, fast)
Data Fetching:      TanStack Query v5 (React Query)
Testing:            Jest + React Testing Library
Build Tool:         Turbopack (Next.js native)
Package Manager:    npm 9+ or yarn
```

### 1.2 Project Structure

```
newskarnataka-web/
├── app/
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Home page
│   ├── (pages)/
│   │   ├── articles/
│   │   │   ├── [id]/page.tsx     # Single article
│   │   │   └── page.tsx           # Articles list
│   │   ├── category/[slug]/page.tsx
│   │   ├── search/page.tsx
│   │   └── about/page.tsx
│   ├── api/
│   │   ├── search/route.ts        # Search API
│   │   ├── analytics/route.ts     # Page view tracking
│   │   └── comments/route.ts      # Comments API
│   └── sitemap.ts                 # Dynamic sitemap
│
├── components/
│   ├── Header/
│   │   ├── Header.tsx
│   │   ├── Navigation.tsx
│   │   └── SearchBar.tsx
│   ├── ArticleCard/
│   │   ├── ArticleCard.tsx
│   │   ├── ArticleCardSkeleton.tsx
│   │   └── ArticleCard.module.css
│   ├── ArticleDetail/
│   │   ├── ArticleHeader.tsx
│   │   ├── ArticleContent.tsx
│   │   ├── RelatedArticles.tsx
│   │   └── CommentSection.tsx
│   ├── Footer/
│   │   ├── Footer.tsx
│   │   └── SocialLinks.tsx
│   └── common/
│       ├── Button.tsx
│       ├── Badge.tsx
│       ├── Loading.tsx
│       └── ErrorBoundary.tsx
│
├── lib/
│   ├── api.ts                     # API client (Strapi)
│   ├── constants.ts               # App constants
│   ├── utils.ts                   # Utility functions
│   ├── hooks/
│   │   ├── useArticles.ts         # Fetch articles
│   │   ├── useSearch.ts           # Search hook
│   │   ├── useAnalytics.ts        # Track events
│   │   └── useInfiniteScroll.ts   # Pagination
│   └── services/
│       ├── strapiService.ts       # Strapi API calls
│       ├── searchService.ts       # Elasticsearch client
│       └── analyticsService.ts    # Analytics SDK
│
├── styles/
│   ├── globals.css                # Global styles
│   ├── tailwind.config.js         # Tailwind config
│   ├── themes/
│   │   ├── light.css
│   │   └── dark.css
│   └── variables.css              # CSS variables
│
├── public/
│   ├── favicon.ico
│   ├── logo.svg
│   ├── images/
│   └── fonts/
│       ├── Kannada/               # Kannada font (Noto Sans Kannada)
│       ├── English/
│       └── Tulu/
│
├── types/
│   ├── article.ts
│   ├── category.ts
│   ├── user.ts
│   └── strapi.ts
│
├── middleware.ts                  # Request middleware
├── next.config.js                 # Next.js config
├── tsconfig.json                  # TypeScript config
├── tailwind.config.js
├── package.json
└── README.md
```

### 1.3 Key Pages & Components

#### Home Page (/)
```
┌─────────────────────────────────────────┐
│           Header + Navigation            │
├─────────────────────────────────────────┤
│          Featured Articles (3-5)        │
│       (Large images, headline only)      │
├─────────────────────────────────────────┤
│  Breaking News   | Top Stories           │
│  Latest (20)     | Trending (20)         │
├─────────────────────────────────────────┤
│  By Category                             │
│  ┌─────────┬──────────┬─────────┐       │
│  │Karnataka│ Business │ Sports  │ ...   │
│  │ (12)    │  (15)    │  (10)   │       │
│  └─────────┴──────────┴─────────┘       │
├─────────────────────────────────────────┤
│           Infinite Scroll                │
│      (Load more articles on scroll)      │
├─────────────────────────────────────────┤
│       Sidebar (Optional)                 │
│    - Newsletter signup                   │
│    - Trending tags                       │
│    - Social media                        │
├─────────────────────────────────────────┤
│           Footer                         │
└─────────────────────────────────────────┘

Rendering: SSR (Server-Side Rendering)
├─ Fetch articles on server (Strapi API)
├─ Render HTML on server
├─ Send to browser (HTML + JS)
├─ Hydrate with React
└─ Enable interactivity (pagination, filters)

Performance:
├─ LCP (Largest Contentful Paint): < 2.5s
├─ FID (First Input Delay): < 100ms
├─ CLS (Cumulative Layout Shift): < 0.1
└─ FCP (First Contentful Paint): < 1.8s
```

#### Article Detail Page (/articles/[id])
```
Components:
├─ Header (title, author, publish date, reading time)
├─ Featured image (1200x630, optimized)
├─ Article metadata (category, tags, share buttons)
├─ Article content (rich text, images, embeds)
├─ Related articles (sidebar or below)
├─ Comments section
├─ Navigation (prev/next article)
└─ Footer

Rendering: ISR (Incremental Static Regeneration)
├─ Generate static HTML at build time
├─ Revalidate every 1 hour
├─ Update on-demand (when article edited)
├─ Fallback: Server-render if not pre-generated

Data Fetching:
├─ getStaticProps: Fetch article data
├─ getStaticPaths: Pre-generate popular articles
├─ revalidate: 3600 (1 hour)
└─ ISR fallback: blocking

Performance:
├─ TTFB (Time to First Byte): < 200ms (cached)
├─ LCP: < 2.5s
├─ CLS: < 0.1
└─ Fully static for common articles
```

#### Search Results Page (/search?q=...)
```
Components:
├─ Search bar (with suggestions)
├─ Filters (category, date, author)
├─ Results grid (20 articles per page)
├─ Pagination or infinite scroll
└─ "Did you mean?" suggestions

Rendering: CSR + SSR hybrid
├─ Initial render: SSR (SEO, faster TTFB)
├─ Interaction: CSR (fast filters, pagination)
├─ Search backend: Elasticsearch (< 100ms)

Features:
├─ Debounced search (300ms)
├─ Faceted search (category, date)
├─ Typo tolerance (Elasticsearch fuzzy)
├─ Result highlighting
└─ Search analytics (track queries)
```

### 1.4 API Integration (Strapi)

```
Strapi Endpoints Used:
├─ GET /api/articles
│  ├─ Query: category, limit, offset, sort, language
│  └─ Response: [{ id, title, slug, excerpt, featured_image, ... }]
│
├─ GET /api/articles/:id
│  └─ Response: { id, title, content, author, comments, ... }
│
├─ GET /api/categories
│  └─ Response: [{ id, name, slug, icon, description }]
│
├─ GET /api/search
│  ├─ Query: q (search query)
│  └─ Uses Elasticsearch backend
│
├─ POST /api/comments
│  ├─ Body: { article_id, name, email, content }
│  └─ Response: { id, status: 'pending' }
│
└─ GET /api/article/[id]/related
   └─ Response: [{ id, title, featured_image, ... }] (5-10 related)

Client Library: axios + TanStack Query
├─ Retry logic (exponential backoff)
├─ Request deduplication
├─ Caching strategy (cache-first for articles)
├─ Error handling (user-friendly messages)
└─ Loading states (skeleton screens)
```

### 1.5 Performance Optimization

```
Image Optimization:
├─ Next.js Image component
├─ Automatic WebP conversion
├─ Responsive images (srcset)
├─ Lazy loading (loading="lazy")
├─ Placeholder blur effect
├─ Format: original.jpg → webp (50-70% smaller)
├─ Sizes: 400x300 (thumb), 800x600 (medium), 1200x630 (large)
└─ CDN: CloudFront with caching

Code Splitting:
├─ Dynamic imports for heavy components
├─ Route-based splitting (per page)
├─ Library splitting (vendor.js)
├─ Chunk size: < 200KB per chunk

Caching Strategy:
├─ Browser cache: 1 year for versioned assets
├─ Service Worker: Offline capability
├─ Redis cache: API responses (1 hour TTL)
├─ Strapi cache: Query results (configurable)
└─ CDN cache: Images (365 days), HTML (1 hour)

CSS & JS:
├─ Minification (production build)
├─ Tree shaking (unused code removal)
├─ CSS-in-JS: Tailwind (utility classes)
├─ Bundle size: < 100KB (main bundle)
└─ Gzip compression: 60-70% reduction
```

### 1.6 SEO Optimization

```
Meta Tags:
├─ og:title, og:description, og:image (OpenGraph)
├─ twitter:card, twitter:image (Twitter Card)
├─ structured data (Article JSON-LD schema)
├─ canonical URL (prevent duplicate indexing)
└─ robots.txt, sitemap.xml (dynamic)

Dynamic Metadata:
├─ generateMetadata() function per page
├─ Article title as page title
├─ Article excerpt as meta description
├─ Featured image as og:image
└─ Dynamic canonical URL

Structured Data (JSON-LD):
```
{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": "Article title",
  "image": ["featured_image_url"],
  "datePublished": "2026-09-01T12:00:00Z",
  "author": {
    "@type": "Person",
    "name": "Author Name"
  },
  "publisher": {
    "@type": "Organization",
    "name": "NewsKarnataka",
    "logo": "https://cdn.newskarnataka.com/logo.png"
  },
  "articleBody": "Article content..."
}
```

```
Sitemap & Robots:
├─ Dynamic sitemap.xml (Next.js)
├─ Articles in sitemap (priority 0.8)
├─ Categories (priority 0.7)
├─ Pages (priority 0.5)
├─ robots.txt: Allow all (Strapi + Next.js)
└─ Auto-update on new articles

Mobile SEO:
├─ Responsive design (mobile-first)
├─ Touch-friendly buttons (44x44px min)
├─ Fast loading (Core Web Vitals)
├─ Mobile screenshot preview
└─ AMP alternative (optional)
```

---

## PART 2: MOBILE APPLICATION (Flutter)

### 2.1 Technology Stack

```
Framework:          Flutter 3.13+ (stable)
Language:           Dart 3.x
State Management:   Riverpod 2.x (modern, scalable)
API Client:         Dio + Retrofit
Local Storage:      Drift (type-safe SQL)
Image Caching:      Cached Network Image
Navigation:         Go Router
Notifications:      Firebase Cloud Messaging
Analytics:          Firebase Analytics
Crash Reporting:    Firebase Crashlytics
```

### 2.2 App Architecture

```
newskarnataka_mobile/
├── lib/
│   ├── main.dart                  # App entry point
│   ├── config/
│   │   ├── app_config.dart        # API URLs, keys
│   │   ├── theme.dart             # Light/dark theme
│   │   └── routes.dart            # Route definitions
│   │
│   ├── features/
│   │   ├── articles/
│   │   │   ├── data/
│   │   │   │   ├── models/article_model.dart
│   │   │   │   ├── datasources/
│   │   │   │   │   ├── remote_datasource.dart
│   │   │   │   │   └── local_datasource.dart
│   │   │   │   └── repositories/article_repository.dart
│   │   │   ├── domain/
│   │   │   │   ├── entities/article.dart
│   │   │   │   └── usecases/get_articles.dart
│   │   │   └── presentation/
│   │   │       ├── providers/
│   │   │       │   └── articles_provider.dart
│   │   │       ├── pages/
│   │   │       │   ├── articles_list_page.dart
│   │   │       │   └── article_detail_page.dart
│   │   │       └── widgets/
│   │   │           ├── article_card.dart
│   │   │           └── article_tile.dart
│   │   │
│   │   ├── categories/
│   │   ├── search/
│   │   ├── bookmarks/
│   │   └── settings/
│   │
│   ├── core/
│   │   ├── services/
│   │   │   ├── api_client.dart
│   │   │   ├── analytics_service.dart
│   │   │   └── storage_service.dart
│   │   ├── providers/
│   │   │   └── app_providers.dart
│   │   ├── widgets/
│   │   │   ├── loading_widget.dart
│   │   │   └── error_widget.dart
│   │   └── utils/
│   │       ├── date_formatter.dart
│   │       ├── text_formatter.dart
│   │       └── constants.dart
│   │
│   └── generated/
│       └── assets.gen.dart         # Auto-generated assets
│
├── test/
│   ├── features/
│   │   └── articles/
│   │       ├── data/
│   │       ├── domain/
│   │       └── presentation/
│   └── core/
│
├── pubspec.yaml
├── pubspec.lock
├── analysis_options.yaml
└── README.md
```

### 2.3 App Features & Screens

```
1. Home Screen
   ├─ Featured articles (carousel)
   ├─ Category tabs (horizontal scroll)
   ├─ Latest articles (infinite list)
   └─ Refresh pull-down

2. Article Detail Screen
   ├─ Article content (scrollable)
   ├─ Share button (social media)
   ├─ Bookmark button
   ├─ Related articles
   └─ Comments (if enabled)

3. Category Screen
   ├─ Category selection
   ├─ Articles filtered by category
   ├─ Sort options (latest, trending, popular)
   └─ Infinite scroll

4. Search Screen
   ├─ Search input with keyboard
   ├─ Search history
   ├─ Search suggestions
   └─ Results grid/list

5. Bookmarks Screen
   ├─ Saved articles list
   ├─ Offline reading support
   └─ Delete saved articles

6. Settings Screen
   ├─ Theme (light/dark)
   ├─ Language (Kannada, English, Tulu)
   ├─ Notifications (push enabled/disabled)
   ├─ About (version, feedback)
   └─ Privacy policy, terms

7. Profile Screen (Optional)
   ├─ User login (optional)
   ├─ Reading history
   ├─ Preferences
   └─ Logout
```

### 2.4 Offline Support

```
Local Database (Drift/SQLite):
├─ Cached articles (save for offline reading)
├─ Reading history (user actions)
├─ Bookmarks (saved articles)
└─ Search history

Sync Strategy:
├─ Auto-sync on app launch (if online)
├─ Incremental sync (fetch new articles since last sync)
├─ Conflict resolution (server version wins)
├─ Background sync (Workmanager plugin)

Data Storage:
├─ Articles: Stored locally (content, title, author)
├─ Images: Cached via Cached Network Image plugin
├─ Max local storage: 500 MB (configurable)
└─ Retention: 30 days (auto-cleanup old articles)
```

### 2.5 Push Notifications

```
Firebase Cloud Messaging (FCM):
├─ Break news notifications
├─ Category-based subscriptions
├─ Scheduled notifications
└─ Click-through to article

Permission Handling:
├─ iOS: Request permission on first launch
├─ Android: Automatic (Android 12+: request at runtime)
├─ User can toggle notifications in settings
└─ Silent notifications (no sound/badge)

Notification Payload:
{
  "notification": {
    "title": "Breaking News",
    "body": "New article in Karnataka"
  },
  "data": {
    "article_id": "123",
    "category": "karnataka"
  }
}
```

### 2.6 Performance & Quality

```
Performance Targets:
├─ App startup: < 2 seconds
├─ List scroll: 60 FPS (smooth)
├─ Image load: < 1 second
├─ Search response: < 500ms
└─ App size: < 50 MB (iOS), < 80 MB (Android)

Quality Metrics:
├─ Code coverage: > 80%
├─ Performance score (Lighthouse): > 90
├─ Zero crashes (Crashlytics monitored)
├─ Responsive design: iOS 11+, Android 5.0+

Testing:
├─ Unit tests (Riverpod providers, services)
├─ Widget tests (UI components)
├─ Integration tests (full user flows)
└─ E2E tests (real device testing)
```

---

## PART 3: ADMIN DASHBOARD (React)

### 3.1 Admin Features

```
Technology: React 18 + Next.js 14 (same as web app)
Purpose: Content management, AI settings, analytics

Pages:
├─ Dashboard (overview, metrics)
├─ Article Management
│  ├─ Create/Edit articles
│  ├─ Bulk actions
│  └─ Publishing workflow
├─ Category Management
├─ User Management
├─ Comments Moderation
├─ AI Console
│  ├─ Content validation settings
│  ├─ Priority rules
│  ├─ Auto-publish settings
│  └─ Validation logs
├─ Analytics
│  ├─ Article performance
│  ├─ User engagement
│  ├─ Traffic sources
│  └─ Search keywords
└─ Settings
   ├─ General (site name, logo)
   ├─ Email configuration
   ├─ SEO settings
   └─ API keys management
```

### 3.2 Rich Text Editor

```
Library: TipTap (headless editor) or SlateJS
Features:
├─ Markdown support
├─ Bold, italic, underline
├─ Headings (H1-H6)
├─ Lists (ordered, unordered)
├─ Blockquotes
├─ Code blocks (syntax highlighting)
├─ Image embed (drag-and-drop)
├─ Video embed (YouTube, Vimeo)
├─ Links (with URL preview)
├─ Table support
└─ Undo/redo

Output Format: JSON (TipTap) or Markdown
  → Stored in Strapi (JSONB field)
  → Rendered in frontend (rich HTML)
```

### 3.3 Real-Time Collaboration (Optional)

```
Technology: Yjs (CRDT library) + WebSocket
Features:
├─ Multiple editors on same article
├─ Cursor tracking (show who's editing)
├─ Conflict resolution (Yjs handles)
├─ Version history
└─ Collaborative awareness

Use Case:
├─ Team editing articles simultaneously
├─ No data loss on concurrent edits
├─ Live cursor tracking
└─ Optional feature (Phase 2)
```

---

## PART 4: MULTI-LANGUAGE SUPPORT

### 4.1 Language Setup

```
Supported Languages:
├─ Kannada (kn)
├─ English (en)
└─ Tulu (tu)

i18n Library: next-i18next (Next.js)
├─ Internationalization library
├─ Namespace support (common, home, articles)
├─ Language switching (UI button)
├─ Browser language detection
└─ Cookie persistence (remember user choice)

Translation Files:
locales/
├── en/
│   ├── common.json       # Common strings
│   ├── home.json         # Home page
│   ├── articles.json     # Article page
│   └── admin.json        # Admin strings
├── kn/                   # Kannada translations
└── tu/                   # Tulu translations

Example (common.json):
{
  "header": {
    "home": "Home",
    "search": "Search",
    "categories": "Categories"
  },
  "footer": {
    "about": "About Us",
    "contact": "Contact",
    "terms": "Terms & Conditions"
  }
}

Kannada Example (kn/common.json):
{
  "header": {
    "home": "ಮುಖ್ಯ ಪುಟ",
    "search": "ಹುಡುಕಿ",
    "categories": "ವರ್ಗಗಳು"
  }
}
```

### 4.2 RTL Support (if needed)

```
Future Consideration:
├─ Tulu may require RTL (Right-to-Left) layout
├─ Use CSS logical properties (margin-inline, etc.)
├─ CSS flexbox/grid handles RTL automatically
├─ Test with RTL detection library
└─ Phase 2 enhancement
```

---

## PART 5: DEPLOYMENT & BUILD

### 5.1 Web App Deployment

```
Platform: Vercel or AWS Amplify
Deployment Flow:
├─ Push to main branch (GitHub)
├─ GitHub Actions trigger
├─ Run linter, tests, build
├─ Deploy to Vercel/Amplify
├─ Automatic domain update (newskarnataka.com)
└─ CDN distribution (global)

Environment Variables:
├─ NEXT_PUBLIC_API_URL=https://api.newskarnataka.com
├─ NEXT_PUBLIC_CDN_URL=https://cdn.newskarnataka.com
├─ GROQ_API_KEY=(from Secrets Manager)
└─ ANALYTICS_ID=(Google Analytics)

Build Process:
├─ next build
├─ Output: .next/static/ (optimized)
├─ Size: ~50MB (uncompressed)
├─ Gzipped: ~10-15MB
└─ First deployment: ~5 min
```

### 5.2 Mobile App Deployment

```
iOS Deployment:
├─ Build: flutter build ios --release
├─ Code signing: Apple Developer certificate
├─ TestFlight: beta testing (10,000 testers)
├─ AppStore: submit for review (48-72 hours)
└─ Update: automatic via AppStore

Android Deployment:
├─ Build: flutter build apk/aab
├─ Key signing: upload key (one-time)
├─ Google Play: submit for review (1-2 hours)
├─ Store listing: description, screenshots
└─ Update: automatic via Google Play

Versioning:
├─ Version: 1.0.0 (major.minor.patch)
├─ Build number: Incremental
├─ Release: Major feature release (quarterly)
└─ Hotfix: Bug fix (as needed)
```

---

## PART 6: ANALYTICS & MONITORING

### 6.1 Web Analytics

```
Tools:
├─ Google Analytics 4 (free)
├─ Hotjar (optional, for heatmaps)
└─ Mixpanel (optional, for custom events)

Events Tracked:
├─ Page views (article, category)
├─ Article interactions (read time, scroll depth)
├─ Search queries
├─ Category filters
├─ Share clicks
├─ Comment submissions
├─ Newsletter signups
└─ Ads impressions/clicks

Custom Dimensions:
├─ Language (en, kn, tu)
├─ Device type (mobile, tablet, desktop)
├─ Article category
├─ Author name
└─ Content source (RSS, API, etc.)

Dashboards:
├─ Traffic overview (users, sessions, page views)
├─ Top articles (by views, time spent)
├─ User journey (top landing pages)
├─ Conversion funnel (newsletter signup)
└─ Real-time monitor (live users)
```

### 6.2 Mobile Analytics

```
Firebase Analytics (free):
├─ User engagement (DAU, MAU)
├─ Session duration
├─ Feature usage (article views, searches)
├─ Screen flow
├─ Crash-free users
└─ Performance (startup time, frame rate)

Crashlytics (included):
├─ Crash reporting (real-time alerts)
├─ Stack traces
├─ Affected user count
├─ App version analysis
└─ OS/device breakdown
```

---

## PART 7: PERFORMANCE BUDGETS

### 7.1 Web Performance Targets

```
Core Web Vitals (Google standards):
├─ LCP (Largest Contentful Paint): < 2.5s
├─ FID (First Input Delay): < 100ms
├─ CLS (Cumulative Layout Shift): < 0.1
├─ FCP (First Contentful Paint): < 1.8s
└─ TTFB (Time to First Byte): < 600ms

Bundle Sizes:
├─ Main JS: < 100 KB
├─ CSS: < 50 KB
├─ Images: < 50 KB (initial view)
├─ Total page: < 300 KB
└─ Fully loaded: < 2 MB

Lighthouse Scores (PageSpeed):
├─ Performance: > 90
├─ Accessibility: > 95
├─ Best Practices: > 90
├─ SEO: > 95
└─ PWA: > 90 (optional)
```

### 7.2 Mobile Performance Targets

```
App Performance:
├─ Startup time: < 2 seconds
├─ List scroll: 60 FPS
├─ Image load: < 1 second
├─ Search response: < 500ms
└─ App size: < 50 MB (iOS), < 80 MB (Android)

Memory Usage:
├─ Idle: < 50 MB
├─ Active use: < 150 MB
├─ Max: < 250 MB (before GC)
└─ Garbage collection: < 100ms
```

---

## SUMMARY

**Frontend Stack Delivers:**
- ✅ Fast, SEO-optimized web presence (< 2s load)
- ✅ Native mobile experience (iOS/Android)
- ✅ Multi-language support (Kannada, English, Tulu)
- ✅ Offline-first mobile app (read cached articles)
- ✅ Real-time admin dashboard
- ✅ Analytics & monitoring integrated
- ✅ Performance optimized (Core Web Vitals)
- ✅ Accessibility compliant (WCAG 2.1)

**Technology Choices:**
- React/Next.js: Industry standard, excellent SEO
- Flutter: Native performance, code reuse
- Tailwind CSS: Rapid development, consistent design
- TypeScript: Type safety, fewer bugs
- Riverpod: Modern state management for mobile

---

**Frontend Stack Specification - COMPLETE**


