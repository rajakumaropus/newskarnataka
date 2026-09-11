# 🚀 WEEK 2: IMPLEMENTATION PLAN
## Build Core Features & AI Pipeline

**Duration:** 5 days (Mon-Fri)  
**Target:** All services integrated and functional  

---

## 📋 WEEK 2 TASKS (10 total)

| Day | Task | Component | Est. Hours |
|-----|------|-----------|-----------|
| Mon | 1 | Create sample data in Strapi | 2 |
| Mon | 2 | API integration hooks (GraphQL/REST) | 3 |
| Tue | 3 | Next.js homepage + layout | 4 |
| Tue | 4 | React Console dashboard | 4 |
| Wed | 5 | Article submission workflow | 3 |
| Wed | 6 | AI validation pipeline (Groq LLM) | 4 |
| Thu | 7 | Real-time updates (Redis + Socket.io) | 3 |
| Thu | 8 | Search functionality (Elasticsearch) | 3 |
| Fri | 9 | Authentication & authorization | 4 |
| Fri | 10 | Testing & deployment prep | 4 |

---

## 🎯 DAY 1 (MONDAY): SAMPLE DATA & API SETUP

### Task 1: Create Sample Data in Strapi

**Objective:** Populate Strapi with realistic news data for development

**Steps:**

1. **Login to Strapi Admin**
   - URL: http://103.191.208.235:1337/admin
   - Credentials: reachus@opusinfiniti.com / Opus@321$%^

2. **Create Categories** (if not exists)
   - Politics
   - Sports
   - Entertainment
   - Technology
   - Business

3. **Create Tags**
   - karnataka, bengaluru, india
   - election, politics
   - cricket, football
   - movie, music
   - tech, startup

4. **Create Authors**
   - Rajesh Kumar (Staff Reporter)
   - Priya Sharma (Editor)
   - Amit Patel (Contributor)

5. **Create 10 Sample Articles**

   ```json
   {
     "title": "Karnataka Election Results: BJP Sweeps Assembly Polls",
     "slug": "karnataka-election-bjp-sweeps",
     "description": "BJP secures majority in assembly elections with significant margins",
     "content": "Detailed article content here...",
     "category": "Politics",
     "tags": ["karnataka", "election", "politics"],
     "author": "Rajesh Kumar",
     "featured_image": "https://via.placeholder.com/800x400",
     "is_featured": true,
     "status": "published"
   }
   ```

6. **Create Article Sources**

   ```json
   {
     "name": "WhatsApp Groups Karnataka",
     "code": "WHATSAPP_KA",
     "source_type": "social_media",
     "trust_score": 70,
     "is_active": true
   }
   ```

**Expected Output:** 10 published articles, 5 categories, 10 tags, 3 authors, 5 sources

---

### Task 2: API Integration Hooks

**Objective:** Create reusable hooks for API calls in React/Next.js

**File: `lib/api/useArticles.ts`** (Next.js)

```typescript
import { useQuery } from '@apollo/client';
import { GET_ARTICLES } from '@/lib/graphql/queries';

interface ArticleFilters {
  category?: string;
  featured?: boolean;
  limit?: number;
  offset?: number;
}

export function useArticles(filters?: ArticleFilters) {
  const { data, loading, error, refetch } = useQuery(GET_ARTICLES, {
    variables: {
      filters: {
        ...(filters?.category && { category: { name: filters.category } }),
        ...(filters?.featured !== undefined && { is_featured: filters.featured })
      },
      pagination: {
        pageSize: filters?.limit || 10,
        start: filters?.offset || 0
      }
    }
  });

  return {
    articles: data?.articles?.data || [],
    total: data?.articles?.meta?.pagination?.total || 0,
    loading,
    error,
    refetch
  };
}

export function useArticleBySlug(slug: string) {
  const { data, loading, error } = useQuery(GET_ARTICLE_BY_SLUG, {
    variables: { slug },
    skip: !slug
  });

  return {
    article: data?.articles?.data?.[0],
    loading,
    error
  };
}
```

**File: `lib/graphql/queries.ts`**

```typescript
import { gql } from '@apollo/client';

export const GET_ARTICLES = gql`
  query GetArticles($filters: ArticleFiltersInput, $pagination: PaginationArg) {
    articles(filters: $filters, pagination: $pagination) {
      data {
        id
        title
        slug
        description
        category { name }
        tags { name }
        author { name }
        featured_image { url }
        publishedAt
        views
      }
      meta {
        pagination {
          total
          count
          pageSize
        }
      }
    }
  }
`;

export const GET_ARTICLE_BY_SLUG = gql`
  query GetArticleBySlug($slug: String!) {
    articles(filters: { slug: { eq: $slug } }) {
      data {
        id
        title
        content
        description
        category { name }
        tags { name }
        author { id name }
        featured_image { url }
        publishedAt
        createdAt
        views
        likes
      }
    }
  }
`;
```

**File: `hooks/useSubmitArticle.ts`** (AI Console)

```typescript
import { useMutation } from '@apollo/client';
import { SUBMIT_ARTICLE } from '@/lib/graphql/mutations';
import { useToast } from 'react-hot-toast';

export function useSubmitArticle() {
  const toast = useToast();
  const [submitArticle, { loading }] = useMutation(SUBMIT_ARTICLE);

  const submit = async (articleData: ArticleSubmissionInput) => {
    try {
      const { data } = await submitArticle({
        variables: { input: articleData }
      });

      toast.success('Article submitted for validation');
      return data.createArticleSubmission.data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  return { submit, loading };
}
```

**Expected Output:** GraphQL hooks ready, API integration tested

---

## 🎯 DAY 2 (TUESDAY): FRONTEND COMPONENTS

### Task 3: Next.js Homepage + Layout

**File: `pages/index.tsx`**

```typescript
import { GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useArticles } from '@/lib/api/useArticles';
import Layout from '@/components/Layout';
import ArticleCard from '@/components/ArticleCard';
import { getCached } from '@/lib/redis';

export default function HomePage({ initialArticles }) {
  const { articles, loading } = useArticles({ limit: 12 });
  const featuredArticles = articles.filter(a => a.is_featured).slice(0, 3);
  const latestArticles = articles.slice(3, 12);

  return (
    <Layout title="NewsKarnataka - Latest News">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">NewsKarnataka</h1>
          <p className="text-xl">Karnataka's Premier News Source</p>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Featured Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredArticles.map(article => (
              <ArticleCard key={article.id} article={article} featured />
            ))}
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Latest News</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestArticles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const articles = await getCached(
      'homepage:articles',
      async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `{ articles(pagination: { pageSize: 12 }) { data { id title description } } }`
          })
        });
        return res.json();
      },
      3600
    );

    return {
      props: { initialArticles: articles },
      revalidate: 3600
    };
  } catch (error) {
    console.error('Error fetching articles:', error);
    return { revalidate: 60 };
  }
};
```

**File: `components/ArticleCard.tsx`**

```typescript
import Image from 'next/image';
import Link from 'next/link';
import { Article } from '@/types';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

export default function ArticleCard({ article, featured = false }: ArticleCardProps) {
  return (
    <Link href={`/article/${article.slug}`}>
      <div className={`group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition cursor-pointer ${
        featured ? 'col-span-full md:col-span-2' : ''
      }`}>
        {article.featured_image && (
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={article.featured_image.url}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition"
            />
          </div>
        )}
        <div className="p-4">
          <span className="text-xs font-semibold text-blue-600">
            {article.category.name}
          </span>
          <h3 className="text-lg font-bold mt-2 group-hover:text-blue-600 transition">
            {article.title}
          </h3>
          <p className="text-gray-600 text-sm mt-2 line-clamp-2">
            {article.description}
          </p>
          <div className="flex justify-between items-center mt-4 pt-4 border-t">
            <span className="text-xs text-gray-500">{article.author.name}</span>
            <span className="text-xs text-gray-500">
              {new Date(article.publishedAt).toLocaleDateString('en-IN')}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
```

### Task 4: React Console Dashboard

**File: `src/pages/Dashboard.tsx`** (AI Console)

```typescript
import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_DASHBOARD_STATS } from '@/graphql/queries';
import StatsCard from '@/components/StatsCard';
import SubmissionQueue from '@/components/SubmissionQueue';
import ValidationChart from '@/components/ValidationChart';

export default function Dashboard() {
  const { data, loading } = useQuery(GET_DASHBOARD_STATS);
  const stats = data?.dashboard || {};

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">AI Console Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage article submissions and AI validation</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Pending Review"
          value={stats.pending_count || 0}
          icon="📋"
          color="bg-blue-100"
        />
        <StatsCard
          title="Ready to Publish"
          value={stats.ready_count || 0}
          icon="✅"
          color="bg-green-100"
        />
        <StatsCard
          title="Flagged Issues"
          value={stats.flagged_count || 0}
          icon="⚠️"
          color="bg-yellow-100"
        />
        <StatsCard
          title="Published Today"
          value={stats.published_today || 0}
          icon="📰"
          color="bg-purple-100"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submission Queue */}
        <div className="lg:col-span-2">
          <SubmissionQueue />
        </div>

        {/* Validation Chart */}
        <div>
          <ValidationChart />
        </div>
      </div>
    </div>
  );
}
```

**Expected Output:** Homepage displaying articles, AI Console dashboard showing metrics

---

## 🎯 DAY 3 (WEDNESDAY): WORKFLOWS

### Task 5: Article Submission Workflow

**File: `src/components/SubmissionForm.tsx`** (AI Console)

```typescript
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSubmitArticle } from '@/hooks/useSubmitArticle';
import toast from 'react-hot-toast';

export default function SubmissionForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { submit, loading } = useSubmitArticle();

  const onSubmit = async (data) => {
    try {
      await submit({
        title: data.title,
        content: data.content,
        source: data.source,
        tags: data.tags?.split(',').map(t => t.trim()),
        category: data.category
      });
    } catch (error) {
      console.error('Submission failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6 bg-white rounded-lg">
      <div>
        <label className="block font-semibold mb-2">Title</label>
        <input
          {...register('title', { required: 'Title is required' })}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="Article title"
        />
        {errors.title && <span className="text-red-500 text-sm">{errors.title.message}</span>}
      </div>

      <div>
        <label className="block font-semibold mb-2">Content</label>
        <textarea
          {...register('content', { required: 'Content is required', minLength: { value: 50, message: 'Minimum 50 characters' } })}
          className="w-full px-4 py-2 border rounded-lg h-48"
          placeholder="Article content"
        />
        {errors.content && <span className="text-red-500 text-sm">{errors.content.message}</span>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold mb-2">Category</label>
          <select {...register('category')} className="w-full px-4 py-2 border rounded-lg">
            <option>Politics</option>
            <option>Sports</option>
            <option>Entertainment</option>
            <option>Technology</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-2">Source</label>
          <select {...register('source')} className="w-full px-4 py-2 border rounded-lg">
            <option>WhatsApp</option>
            <option>Twitter</option>
            <option>Direct Submission</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Submitting...' : 'Submit for Validation'}
      </button>
    </form>
  );
}
```

### Task 6: AI Validation Pipeline

**File: `server/services/aiValidation.ts`** (Strapi custom service)

```typescript
import Anthropic from '@anthropic-ai/sdk';
import { redis } from '@/lib/redis';

interface ValidationInput {
  title: string;
  content: string;
  source: string;
}

interface ValidationResult {
  quality_score: number;
  credibility_score: number;
  priority: 'red' | 'orange' | 'yellow' | 'green' | 'black';
  issues: string[];
  recommendations: string[];
  reasoning: string;
}

export async function validateArticle(input: ValidationInput): Promise<ValidationResult> {
  const client = new Anthropic();

  const prompt = `Analyze this news article for quality and credibility:

Title: ${input.title}
Content: ${input.content}
Source: ${input.source}

Provide:
1. Quality Score (0-100): Grammar, clarity, structure
2. Credibility Score (0-100): Factuality, sources, bias
3. Priority: red (reject), orange (needs work), yellow (moderate), green (good), black (critical)
4. Issues found
5. Recommendations
6. Reasoning

Format as JSON.`;

  const response = await client.messages.create({
    model: 'claude-3-sonnet-20240229',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }]
  });

  const result = JSON.parse(response.content[0].type === 'text' ? response.content[0].text : '{}');

  return {
    quality_score: result.quality_score,
    credibility_score: result.credibility_score,
    priority: result.priority,
    issues: result.issues,
    recommendations: result.recommendations,
    reasoning: result.reasoning
  };
}
```

**Expected Output:** Submission form working, AI validation pipeline producing scores

---

## 🎯 DAY 4 (THURSDAY): REAL-TIME & SEARCH

### Task 7: Real-Time Updates

**File: `pages/api/socket.ts`**

```typescript
import { Server } from 'socket.io';
import { redis } from '@/lib/redis';

export default function handler(req, res) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server, {
      cors: { origin: process.env.NEXT_PUBLIC_SOCKET_URL }
    });

    // Subscribe to Redis events
    const redisSub = redis.duplicate();
    redisSub.subscribe('article:updated', 'article:published', 'validation:complete');

    redisSub.on('message', (channel, message) => {
      io.emit(channel, JSON.parse(message));
    });

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });

    res.socket.server.io = io;
  }

  res.end();
}
```

### Task 8: Search Functionality

**File: `lib/search.ts`**

```typescript
import axios from 'axios';

interface SearchQuery {
  q: string;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
}

export async function searchArticles(query: SearchQuery) {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/search`,
    {
      query: {
        bool: {
          must: [
            {
              multi_match: {
                query: query.q,
                fields: ['title^2', 'content']
              }
            }
          ],
          filter: [
            ...(query.category ? [{ term: { category: query.category } }] : []),
            ...(query.dateFrom ? [{ range: { published_at: { gte: query.dateFrom } } }] : [])
          ]
        }
      }
    }
  );

  return response.data.hits.hits.map(hit => hit._source);
}
```

**Expected Output:** Real-time socket connection, search returning results

---

## 🎯 DAY 5 (FRIDAY): AUTH & TESTING

### Task 9: Authentication & Authorization

**File: `middleware/auth.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'change_me');

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/admin/:path*', '/console/:path*']
};
```

### Task 10: Testing & Deployment Prep

**File: `__tests__/ArticleCard.test.tsx`**

```typescript
import { render, screen } from '@testing-library/react';
import ArticleCard from '@/components/ArticleCard';

describe('ArticleCard', () => {
  const mockArticle = {
    id: '1',
    title: 'Test Article',
    slug: 'test-article',
    description: 'Test description',
    category: { name: 'Politics' },
    featured_image: { url: 'https://via.placeholder.com/400' },
    author: { name: 'Test Author' },
    publishedAt: '2024-01-01'
  };

  it('renders article title', () => {
    render(<ArticleCard article={mockArticle} />);
    expect(screen.getByText('Test Article')).toBeInTheDocument();
  });

  it('displays category', () => {
    render(<ArticleCard article={mockArticle} />);
    expect(screen.getByText('Politics')).toBeInTheDocument();
  });
});
```

---

## 📊 WEEK 2 COMPLETION CHECKLIST

- [ ] Sample data created in Strapi (10 articles, 5 sources)
- [ ] API hooks working (GraphQL queries)
- [ ] Next.js homepage displaying articles
- [ ] React Console dashboard showing stats
- [ ] Submission form submitting articles
- [ ] AI validation producing scores
- [ ] Real-time socket events working
- [ ] Search returning results
- [ ] Authentication protecting routes
- [ ] Tests passing
- [ ] All services communicating
- [ ] No console errors

---

## 🎯 DEPLOYMENT CHECKLIST

Before deploying to staging:

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Elasticsearch indexes created
- [ ] Redis connected
- [ ] GitHub workflows passing
- [ ] Security headers set
- [ ] API rate limiting enabled
- [ ] Error logging configured
- [ ] Performance baseline established

---

## 🚀 WEEK 3 PREVIEW

After Week 2 completion:
- Advanced AI features (fact-checking, sentiment analysis)
- Analytics & reporting
- Mobile app (React Native)
- Admin panel (Next.js)
- Performance optimization

---

**Status: WEEK 2 READY TO START**

