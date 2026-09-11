# 🚀 WEEK 1 - TASK 2: React + Vite AI Console Setup
## NewsKarnataka AI Console (Editor Dashboard)

**Task:** Set up React 18 + Vite project with TypeScript, Tailwind CSS, and admin components  
**Duration:** 2-3 hours  
**Status:** IN PROGRESS  
**Target:** Production-ready admin dashboard structure for editors

---

## 📋 TASK OVERVIEW

We're creating a **real-time admin dashboard** using:
- ✅ **React 18** (UI library)
- ✅ **Vite** (fast build tool)
- ✅ **TypeScript** (type safety)
- ✅ **Tailwind CSS** (styling)
- ✅ **React Router** (navigation)
- ✅ **Zustand** (state management)
- ✅ **Apollo Client** (GraphQL)

**Why Vite for Admin?**
- ⚡ Instant HMR (Hot Module Reload)
- 📦 Smaller bundle size
- 🚀 Faster development
- 💻 Perfect for internal tools

---

## 📁 DIRECTORY STRUCTURE

```
ai-console/
├── public/                          # Static assets
│   ├── icons/
│   ├── logos/
│   └── favicon.ico
│
├── src/
│   ├── main.tsx                     # Entry point
│   ├── App.tsx                      # Root component
│   ├── App.css
│   ├── index.css
│   │
│   ├── pages/
│   │   ├── Dashboard.tsx            # Main dashboard
│   │   ├── Queue.tsx                # Content queue (Kanban)
│   │   ├── ArticleEditor.tsx        # Article editor
│   │   ├── Analytics.tsx            # Analytics dashboard
│   │   ├── Sources.tsx              # Source management
│   │   ├── Settings.tsx             # Console settings
│   │   ├── Login.tsx                # Authentication
│   │   └── NotFound.tsx
│   │
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── QueueWidget.tsx      # Shows queue counts
│   │   │   ├── AnalyticsSummary.tsx # Quick stats
│   │   │   └── RecentActivity.tsx   # Activity log
│   │   │
│   │   ├── queue/
│   │   │   ├── QueueBoard.tsx       # Kanban board
│   │   │   ├── StoryCard.tsx        # Individual card
│   │   │   ├── ColorFilter.tsx      # Filter by priority
│   │   │   └── BulkActions.tsx      # Batch operations
│   │   │
│   │   ├── editor/
│   │   │   ├── ArticleEditor.tsx    # WYSIWYG editor
│   │   │   ├── SEOPanel.tsx         # SEO settings
│   │   │   ├── ImageUpload.tsx      # Image uploader
│   │   │   └── PreviewPane.tsx      # Live preview
│   │   │
│   │   ├── analytics/
│   │   │   ├── EngagementChart.tsx  # Charts
│   │   │   ├── TrendingTable.tsx    # Trending articles
│   │   │   ├── LocationMap.tsx      # Geographic data
│   │   │   └── DemographicsChart.tsx # User demographics
│   │   │
│   │   ├── sources/
│   │   │   ├── SourceTable.tsx      # Source list
│   │   │   ├── SourceForm.tsx       # Add/edit source
│   │   │   └── SourceStats.tsx      # Source performance
│   │   │
│   │   ├── common/
│   │   │   ├── Header.tsx           # Top navigation
│   │   │   ├── Sidebar.tsx          # Left sidebar
│   │   │   ├── Footer.tsx           # Footer
│   │   │   ├── Loading.tsx          # Loading spinner
│   │   │   └── Modal.tsx            # Modal dialog
│   │   │
│   │   └── layout/
│   │       └── DashboardLayout.tsx  # Main layout wrapper
│   │
│   ├── hooks/
│   │   ├── useQueue.ts              # Queue operations
│   │   ├── useArticleEditor.ts      # Editor operations
│   │   ├── useAnalytics.ts          # Analytics data
│   │   ├── useSources.ts            # Source operations
│   │   ├── useAuth.ts               # Authentication
│   │   └── useRealtime.ts           # WebSocket/real-time
│   │
│   ├── services/
│   │   ├── api.ts                   # API client setup
│   │   ├── graphql.ts               # GraphQL queries
│   │   ├── queueService.ts          # Queue API
│   │   ├── publishingService.ts     # Publishing API
│   │   ├── analyticsService.ts      # Analytics API
│   │   ├── authService.ts           # Auth API
│   │   └── sourceService.ts         # Source API
│   │
│   ├── store/
│   │   ├── queueStore.ts            # Queue state
│   │   ├── editorStore.ts           # Editor state
│   │   ├── analyticsStore.ts        # Analytics state
│   │   ├── authStore.ts             # Auth state
│   │   └── uiStore.ts               # UI state
│   │
│   ├── types/
│   │   ├── article.ts
│   │   ├── user.ts
│   │   ├── engagement.ts
│   │   ├── analytics.ts
│   │   └── index.ts
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   ├── tailwind.css
│   │   ├── animations.css
│   │   └── variables.css
│   │
│   ├── utils/
│   │   ├── constants.ts
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── helpers.ts
│   │
│   ├── config/
│   │   ├── environment.ts
│   │   └── api.config.ts
│   │
│   └── lib/
│       ├── auth.ts
│       └── storage.ts
│
├── .env.example
├── .env.local
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── package.json
├── index.html
├── .gitignore
├── README.md
└── SETUP.md
```

---

## 🔧 STEP-BY-STEP SETUP

### Step 1: Create React + Vite Project

Open PowerShell and run:

```powershell
# Navigate to project root
cd D:\Personal\Kiro\newsKarnataka

# Create React + Vite project with TypeScript
npm create vite@latest ai-console -- --template react-ts

# Navigate to project
cd ai-console
```

---

### Step 2: Install Dependencies

```powershell
# Core dependencies
npm install

# React Router for navigation
npm install react-router-dom

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

# Charts for analytics
npm install recharts

# Rich text editor
npm install react-quill

# File upload
npm install react-dropzone

# Date/Time
npm install date-fns

# Notifications
npm install react-hot-toast

# Icons
npm install lucide-react

# Loading
npm install nprogress
npm install --save-dev @types/nprogress

# Development dependencies
npm install --save-dev tailwindcss postcss autoprefixer
npm install --save-dev @types/react @types/react-dom

# Initialize Tailwind
npx tailwindcss init -p
```

---

### Step 3: Configure TypeScript

**File: `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,

    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

### Step 4: Configure Vite

**File: `vite.config.ts`**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    strictPort: false,
    proxy: {
      '/api': {
        target: 'http://localhost:1337',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
      '/graphql': {
        target: 'http://localhost:1337',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'apollo-vendor': ['@apollo/client', 'graphql'],
        },
      },
    },
  },
})
```

---

### Step 5: Configure Tailwind CSS

**File: `tailwind.config.ts`**

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
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
        warning: {
          500: '#f59e0b',
          600: '#d97706',
        },
        dark: {
          50: '#f9fafb',
          100: '#f3f4f6',
          500: '#6b7280',
          900: '#111827',
        },
        // Priority colors
        'priority-red': '#ef4444',
        'priority-orange': '#f97316',
        'priority-yellow': '#eab308',
        'priority-green': '#22c55e',
        'priority-black': '#1f2937',
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
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

### Step 6: Set Up Environment Variables

**File: `.env.example`**

```env
# API Configuration
VITE_API_URL=http://localhost:1337
VITE_GRAPHQL_URL=http://localhost:1337/graphql
VITE_API_KEY=your_strapi_api_token_here

# App Configuration
VITE_APP_NAME=NewsKarnataka AI Console
VITE_APP_URL=http://localhost:5173

# Features
VITE_ENABLE_REAL_TIME=true
VITE_ENABLE_ANALYTICS=true
VITE_WEBSOCKET_URL=ws://localhost:1337

# Development
VITE_DEBUG=false
```

**Copy to `.env.local`:**

```powershell
Copy-Item .env.example .env.local
```

---

### Step 7: Create Root Component

**File: `src/App.tsx`**

```typescript
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './App.css'

// Pages
import Dashboard from '@/pages/Dashboard'
import Queue from '@/pages/Queue'
import ArticleEditor from '@/pages/ArticleEditor'
import Analytics from '@/pages/Analytics'
import Sources from '@/pages/Sources'
import Settings from '@/pages/Settings'
import Login from '@/pages/Login'
import NotFound from '@/pages/NotFound'

// Layout
import DashboardLayout from '@/components/layout/DashboardLayout'

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/queue" element={<Queue />} />
          <Route path="/article/:id" element={<ArticleEditor />} />
          <Route path="/article/new" element={<ArticleEditor />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/sources" element={<Sources />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* 404 */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Router>
  )
}

export default App
```

---

### Step 8: Create Layout Component

**File: `src/components/layout/DashboardLayout.tsx`**

```typescript
import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '@/components/common/Header'
import Sidebar from '@/components/common/Sidebar'
import Footer from '@/components/common/Footer'

const DashboardLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}

export default DashboardLayout
```

---

### Step 9: Create Common Components

**File: `src/components/common/Sidebar.tsx`**

```typescript
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Inbox, FileText, BarChart3, Radio, Settings } from 'lucide-react'

const Sidebar: React.FC = () => {
  const location = useLocation()

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/queue', label: 'Content Queue', icon: Inbox },
    { path: '/article/new', label: 'New Article', icon: FileText },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/sources', label: 'Sources', icon: Radio },
    { path: '/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <aside className="w-64 bg-dark-900 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-dark-800">
        <h1 className="text-xl font-bold">NK Console</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-400 hover:bg-dark-800'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-dark-800">
        <button className="w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg text-white transition">
          Logout
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
```

**File: `src/components/common/Header.tsx`**

```typescript
import React from 'react'
import { Bell, User, LogOut } from 'lucide-react'

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-dark-900">NewsKarnataka AI Console</h2>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:text-primary-600 transition">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="flex items-center space-x-2 pl-4 border-l border-gray-200">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              ED
            </div>
            <span className="text-sm font-medium text-dark-900">Editor</span>
            <button className="p-2 text-gray-600 hover:text-danger-600 transition">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
```

---

### Step 10: Create Dashboard Page

**File: `src/pages/Dashboard.tsx`**

```typescript
import React from 'react'
import QueueWidget from '@/components/dashboard/QueueWidget'
import AnalyticsSummary from '@/components/dashboard/AnalyticsSummary'
import RecentActivity from '@/components/dashboard/RecentActivity'

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-dark-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <QueueWidget />
        <AnalyticsSummary />
        <RecentActivity />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-dark-900 mb-4">Content Performance</h2>
          <div className="h-48 bg-gray-100 rounded flex items-center justify-center text-gray-500">
            Chart placeholder
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-dark-900 mb-4">Top Sources</h2>
          <div className="h-48 bg-gray-100 rounded flex items-center justify-center text-gray-500">
            Table placeholder
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
```

---

### Step 11: Create Queue Component

**File: `src/pages/Queue.tsx`**

```typescript
import React from 'react'

const Queue: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-dark-900">Content Queue</h1>
        <p className="text-gray-600 mt-1">Manage articles by priority level.</p>
      </div>

      {/* Queue Board */}
      <div className="grid grid-cols-5 gap-4">
        {['🔴 RED', '🟠 ORANGE', '🟡 YELLOW', '🟢 GREEN', '⚫ BLACK'].map((priority) => (
          <div key={priority} className="bg-white rounded-lg shadow p-4 min-h-96">
            <h2 className="font-bold text-dark-900 mb-4">{priority}</h2>
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <div key={i} className="p-3 bg-gray-50 rounded border border-gray-200 hover:shadow-md cursor-move transition">
                  <p className="font-semibold text-sm">Article Title {i}</p>
                  <p className="text-xs text-gray-600 mt-1">Source: WhatsApp</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Queue
```

---

### Step 12: Update package.json Scripts

**File: `package.json`** - Add scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext ts,tsx",
    "type-check": "tsc --noEmit"
  }
}
```

---

### Step 13: Create Placeholder Pages

Create empty placeholder pages (will implement later):
- `src/pages/Login.tsx`
- `src/pages/ArticleEditor.tsx`
- `src/pages/Analytics.tsx`
- `src/pages/Sources.tsx`
- `src/pages/Settings.tsx`
- `src/pages/NotFound.tsx`

Each with basic structure:

```typescript
import React from 'react'

const PageName: React.FC = () => {
  return (
    <div>
      <h1>Page Name</h1>
      <p>Page content coming soon...</p>
    </div>
  )
}

export default PageName
```

---

### Step 14: Create Placeholder Components

Create placeholder components in respective directories:
- `src/components/dashboard/QueueWidget.tsx`
- `src/components/dashboard/AnalyticsSummary.tsx`
- `src/components/dashboard/RecentActivity.tsx`
- `src/components/common/Footer.tsx`

---

### Step 15: Initialize Git & GitHub

```powershell
# Initialize Git
git init

# Add all files
git add .

# Commit
git commit -m "Initial React Vite project setup for AI Console"
```

---

### Step 16: Run Development Server

```powershell
# Start development server
npm run dev

# Output should show:
# VITE v5.x.x  ready in XXX ms
# ➜  Local:   http://localhost:5173/
# ➜  Press r + enter to reload
```

**Access:** http://localhost:5173

---

## ✅ VERIFICATION CHECKLIST

- [ ] React + Vite project created successfully
- [ ] Dependencies installed (npm list shows all packages)
- [ ] TypeScript configured correctly
- [ ] Tailwind CSS working (styling applied)
- [ ] Vite config with proxy setup
- [ ] Environment variables set (.env.local created)
- [ ] React Router configured
- [ ] Layout structure created (Sidebar, Header, Footer)
- [ ] Dashboard page rendering correctly
- [ ] Development server running on localhost:5173
- [ ] Git repository initialized

---

## 📊 PROJECT STATUS

```
✅ React 18 Installation: COMPLETE
✅ Vite Setup: COMPLETE
✅ TypeScript Configuration: COMPLETE
✅ Tailwind CSS: COMPLETE
✅ Project Structure: CREATED
✅ Base Components: CREATED
✅ Development Environment: READY
```

---

## 🚀 NEXT STEPS

Once this is complete and verified:

**Task #3:** Configure additional Strapi collections for AI Console  
**Task #4:** Set up GitHub repositories and CI/CD  
**Task #5:** Configure Elasticsearch for search  

---

## 📝 NOTES

- Vite provides instant HMR (hot reload) - save and see changes immediately
- Use `npm run build` to create production bundle
- All TypeScript errors must be fixed before commit
- Keep development and production builds separate

---

**Status: READY FOR EXECUTION**

