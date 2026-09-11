# 🚀 WEEK 1 - TASK 1: Next.js Public Website Setup
## NewsKarnataka Public Website Foundation

**Task:** Set up Next.js project with TypeScript, Tailwind CSS, and essential configurations  
**Duration:** 2-3 hours  
**Status:** IN PROGRESS  
**Target:** Production-ready project structure ready for frontend development

---

## 📋 TASK OVERVIEW

We're creating a **modern, responsive news website** using:
- ✅ **Next.js 14** (React framework with server-side rendering)
- ✅ **TypeScript** (type safety)
- ✅ **Tailwind CSS** (styling)
- ✅ **ESLint & Prettier** (code quality)
- ✅ **Git & GitHub** (version control)

---

## 📁 DIRECTORY STRUCTURE

```
newskarnataka-web/
├── public/                          # Static assets
│   ├── images/
│   │   ├── logos/
│   │   ├── articles/
│   │   └── icons/
│   └── fonts/
│
├── src/
│   ├── app/                         # App Router (Next.js 13+)
│   │   ├── layout.tsx               # Root layout
│   │   ├── page.tsx                 # Homepage
│   │   ├── globals.css              # Global styles
│   │   │
│   │   ├── articles/
│   │   │   └── [slug]/page.tsx      # Article detail page
│   │   │
│   │   ├── search/
│   │   │   └── page.tsx             # Search results
│   │   │
│   │   ├── category/
│   │   │   └── [category]/page.tsx  # Category view
│   │   │
│   │   ├── location/
│   │   │   └── [location]/page.tsx  # Location-based view
│   │   │
│   │   ├── auth/
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── profile/page.tsx
│   │   │
│   │   └── api/                     # API routes (if needed)
│   │       └── route.ts
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── Sidebar.tsx
│   │   │
│   │   ├── articles/
│   │   │   ├── ArticleCard.tsx
│   │   │   ├── ArticleDetail.tsx
│   │   │   ├── ArticleList.tsx
│   │   │   └── RelatedArticles.tsx
│   │   │
│   │   ├── engagement/
│   │   │   ├── LikeButton.tsx
│   │   │   ├── CommentSection.tsx
│   │   │   ├── ShareButtons.tsx
│   │   │   └── CommentForm.tsx
│   │   │
│   │   ├── search/
│   │   │   ├── SearchBar.tsx
│   │   │   ├── SearchResults.tsx
│   │   │   └── FilterPanel.tsx
│   │   │
│   │   ├── location/
│   │   │   ├── LocationFilter.tsx
│   │   │   └── LocationBadge.tsx
│   │   │
│   │   └── trending/
│   │       ├── TrendingWidget.tsx
│   │       └── TrendingList.tsx
│   │
│   ├── hooks/
│   │   ├── useFeed.ts
│   │   ├── useArticle.ts
│   │   ├── useSearch.ts
│   │   ├── useEngagement.ts
│   │   ├── useLocation.ts
│   │   └── useNotifications.ts
│   │
│   ├── services/
│   │   ├── graphqlClient.ts
│   │   ├── api.ts
│   │   ├── analytics.ts
│   │   ├── storage.ts
│   │   └── notifications.ts
│   │
│   ├── store/
│   │   ├── feedStore.ts
│   │   ├── userStore.ts
│   │   ├── uiStore.ts
│   │   └── settingsStore.ts
│   │
│   ├── types/
│   │   ├── article.ts
│   │   ├── user.ts
│   │   ├── engagement.ts
│   │   ├── api.ts
│   │   └── index.ts
│   │
│   ├── styles/
│   │   ├── tailwind.css
│   │   ├── variables.css
│   │   └── components.css
│   │
│   ├── utils/
│   │   ├── constants.ts
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── helpers.ts
│   │
│   ├── lib/
│   │   ├── auth.ts
│   │   └── db.ts
│   │
│   └── config/
│       ├── environment.ts
│       └── api.config.ts
│
├── .github/
│   └── workflows/
│       ├── ci.yml                   # CI/CD pipeline
│       └── deploy.yml               # Deployment pipeline
│
├── .env.example                     # Environment template
├── .env.local                       # Local environment (git-ignored)
├── .eslintrc.json                  # ESLint config
├── .prettierrc.json                # Prettier config
├── next.config.js                   # Next.js config
├── tsconfig.json                    # TypeScript config
├── tailwind.config.ts               # Tailwind config
├── postcss.config.js                # PostCSS config
├── package.json
├── .gitignore
├── README.md
└── SETUP.md                         # Setup instructions
```

---

## 🔧 STEP-BY-STEP SETUP

### Step 1: Create Next.js Project

Open PowerShell and run:

```powershell
# Navigate to project root
cd D:\Personal\Kiro\newsKarnataka

# Create Next.js project with TypeScript and Tailwind
npx create-next-app@latest newskarnataka-web `
  --typescript `
  --tailwind `
  --eslint `
  --app `
  --src-dir `
  --no-git `
  --import-alias '@/*'

# Navigate to project
cd newskarnataka-web
```

**Prompts (Select these options):**
```
✔ Would you like to use TypeScript? › Yes
✔ Would you like to use ESLint? › Yes
✔ Would you like to use Tailwind CSS? › Yes
✔ Would you like your code inside a `src/` directory? › Yes
✔ Would you like to use App Router? › Yes
✔ Would you like to use Turbopack for next dev? › Yes (if available)
✔ Would you like to customize the import alias? › Yes (@/*)
```

---

### Step 2: Install Additional Dependencies

```powershell
# State Management
npm install zustand

# API & GraphQL
npm install @apollo/client graphql

# UI Components & Styling
npm install clsx tailwind-merge
npm install @tailwindcss/forms @tailwindcss/typography

# Forms & Validation
npm install react-hook-form zod @hookform/resolvers

# HTTP Client
npm install axios

# Real-time (WebSocket)
npm install socket.io-client

# Analytics
npm install mixpanel-browser

# Date/Time
npm install date-fns

# Image Optimization
npm install next-image-export-optimizer

# Loading States
npm install nprogress

# Notifications
npm install react-hot-toast

# Testing (optional, install later)
# npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

---

### Step 3: Update TypeScript Configuration

**File: `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    
    /* Path aliases */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src", "next-env.d.ts"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

### Step 4: Configure Tailwind CSS

**File: `tailwind.config.ts`**

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          900: '#78350f',
        },
        success: {
          500: '#10b981',
          600: '#059669',
        },
        danger: {
          500: '#ef4444',
          600: '#dc2626',
        },
        dark: {
          50: '#f9fafb',
          100: '#f3f4f6',
          500: '#6b7280',
          900: '#111827',
        },
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}

export default config
```

---

### Step 5: Set Up Environment Variables

**File: `.env.example`**

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:1337
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:1337/graphql
NEXT_PUBLIC_API_KEY=your_strapi_api_token_here

# Analytics
NEXT_PUBLIC_MIXPANEL_TOKEN=your_mixpanel_token

# App Configuration
NEXT_PUBLIC_APP_NAME=NewsKarnataka
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_DESCRIPTION=Modern news platform for Karnataka

# Features
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
NEXT_PUBLIC_ENABLE_COMMENTS=true

# Authentication (if using NextAuth)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key_here

# Image Optimization
NEXT_PUBLIC_IMAGE_LOADER=cloudinary
NEXT_PUBLIC_CLOUDINARY_NAME=your_cloudinary_name
```

**Copy to `.env.local`:**

```powershell
Copy-Item .env.example .env.local
```

---

### Step 6: Configure Next.js

**File: `next.config.js`**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for development
  reactStrictMode: true,

  // Image optimization
  images: {
    domains: [
      'localhost',
      '103.191.208.235',
      'newskarnataka.com',
      'res.cloudinary.com',
      'cdn.example.com',
    ],
    formats: ['image/webp', 'image/avif'],
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version || '1.0.0',
  },

  // Headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/old-path',
        destination: '/new-path',
        permanent: true,
      },
    ]
  },

  // Rewrites
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
        },
      ],
    }
  },

  // Webpack configuration
  webpack: (config, { isServer }) => {
    return config
  },
}

module.exports = nextConfig
```

---

### Step 7: Set Up ESLint & Prettier

**File: `.eslintrc.json`**

```json
{
  "extends": [
    "next/core-web-vitals"
  ],
  "rules": {
    "react/display-name": "off",
    "react-hooks/rules-of-hooks": "error",
    "@next/next/no-html-link-for-pages": "off",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

**File: `.prettierrc.json`**

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

---

### Step 8: Update package.json Scripts

**File: `package.json`**

Add these scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write \"src/**/*.{js,jsx,ts,tsx,json,css}\"",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
```

---

### Step 9: Create Initial Project Structure

```powershell
# Create directories
mkdir src/components/common
mkdir src/components/articles
mkdir src/components/engagement
mkdir src/components/search
mkdir src/components/location
mkdir src/components/trending

mkdir src/hooks
mkdir src/services
mkdir src/store
mkdir src/types
mkdir src/styles
mkdir src/utils
mkdir src/lib
mkdir src/config

mkdir public/images/logos
mkdir public/images/articles
mkdir public/images/icons
mkdir public/fonts

mkdir .github/workflows
```

---

### Step 10: Create Base Components

**File: `src/components/common/Header.tsx`**

```typescript
import React from 'react'
import Link from 'next/link'

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary-600">
            NewsKarnataka
          </Link>
          <nav className="hidden md:flex space-x-8">
            <Link href="/category/politics" className="text-gray-700 hover:text-primary-600">
              Politics
            </Link>
            <Link href="/category/sports" className="text-gray-700 hover:text-primary-600">
              Sports
            </Link>
            <Link href="/category/technology" className="text-gray-700 hover:text-primary-600">
              Technology
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <input
              type="search"
              placeholder="Search..."
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>
    </header>
  )
}
```

**File: `src/components/common/Footer.tsx`**

```typescript
import React from 'react'
import Link from 'next/link'

export const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-900 text-white py-12 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold mb-4">NewsKarnataka</h3>
            <p className="text-gray-400">Your trusted source for Karnataka news</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Categories</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/category/politics">Politics</Link></li>
              <li><Link href="/category/sports">Sports</Link></li>
              <li><Link href="/category/technology">Technology</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/about">About</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/careers">Careers</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Follow Us</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#facebook">Facebook</a></li>
              <li><a href="#twitter">Twitter</a></li>
              <li><a href="#instagram">Instagram</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 flex justify-between items-center">
          <p className="text-gray-400">&copy; 2026 NewsKarnataka. All rights reserved.</p>
          <div className="space-x-4">
            <Link href="/privacy" className="text-gray-400 hover:text-white">Privacy</Link>
            <Link href="/terms" className="text-gray-400 hover:text-white">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
```

---

### Step 11: Create Root Layout

**File: `src/app/layout.tsx`**

```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/common/Header'
import { Footer } from '@/components/common/Footer'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'NewsKarnataka - News from Karnataka',
  description: 'Stay updated with the latest news from Bangalore, Mysore, Mangalore and across Karnataka',
  keywords: 'news, Karnataka, Bangalore, Mysore, Mangalore',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-white text-dark-900">
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
```

---

### Step 12: Create Homepage

**File: `src/app/page.tsx`**

```typescript
import React from 'react'

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg overflow-hidden">
          <div className="px-8 py-16 text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Stay Updated with Karnataka News
            </h1>
            <p className="text-lg mb-6">
              Get the latest news from Bangalore, Mysore, Mangalore and across Karnataka
            </p>
            <button className="bg-secondary-500 hover:bg-secondary-600 text-white px-6 py-3 rounded-md font-semibold">
              Explore News
            </button>
          </div>
        </div>
      </section>

      {/* Location Filter */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Select Your Location</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {['Bangalore', 'Mysore', 'Mangalore', 'All Karnataka'].map((location) => (
            <button
              key={location}
              className="p-4 border-2 border-primary-300 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition"
            >
              {location}
            </button>
          ))}
        </div>
      </section>

      {/* Latest Articles (Placeholder) */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Latest News</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition">
              <div className="h-48 bg-gray-300"></div>
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2">Article Title {i}</h3>
                <p className="text-gray-600 mb-4">Article summary goes here...</p>
                <a href="#" className="text-primary-600 hover:text-primary-700 font-semibold">
                  Read More →
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
```

---

### Step 13: Initialize Git & GitHub

```powershell
# Initialize Git
git init

# Add all files
git add .

# Commit
git commit -m "Initial Next.js project setup"

# Create .gitignore (if not exists)
# Add: node_modules/, .env.local, .next/, dist/
```

---

### Step 14: Run Development Server

```powershell
# Start development server
npm run dev

# Output should show:
# ▲ Next.js 14.0.0
# - Local: http://localhost:3000
# - Environments: .env.local
```

**Access:** http://localhost:3000

---

## ✅ VERIFICATION CHECKLIST

- [ ] Next.js project created successfully
- [ ] Dependencies installed (npm list shows all packages)
- [ ] TypeScript configured correctly
- [ ] Tailwind CSS working (styling applied)
- [ ] ESLint & Prettier configured
- [ ] Environment variables set (.env.local created)
- [ ] Base components created (Header, Footer)
- [ ] Homepage rendering correctly
- [ ] Development server running on localhost:3000
- [ ] Git repository initialized

---

## 📊 PROJECT STATUS

```
✅ Next.js 14 Installation: COMPLETE
✅ TypeScript Setup: COMPLETE
✅ Tailwind CSS: COMPLETE
✅ Project Structure: CREATED
✅ Base Components: CREATED
✅ Development Environment: READY
```

---

## 🚀 NEXT STEPS

Once this is complete and verified:

**Task #2:** Set up React admin dashboard (AI Console)  
**Task #3:** Configure Strapi collections for AI Console  
**Task #4:** Set up GitHub repositories and CI/CD  

---

## 📝 NOTES

- Keep `node_modules/` and `.env.local` in `.gitignore`
- Use TypeScript strict mode for type safety
- Commit frequently with meaningful messages
- Install dependencies: `npm install package-name --save`
- Install dev dependencies: `npm install package-name --save-dev`

---

**Status: READY FOR EXECUTION**

