# NewsKarnataka AI Console - React + Vite Setup Script
# This script automates the setup of the React admin dashboard
# Run: .\setup-react-vite-console.ps1

Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  NewsKarnataka AI Console - React + Vite Setup                 ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Step 1: Create React + Vite Project
Write-Host "📦 Step 1: Creating React + Vite project..." -ForegroundColor Yellow
Write-Host ""

npm create vite@latest ai-console -- --template react-ts

if ($LASTEXITCODE -eq 0) {
  Write-Host "✅ React + Vite project created successfully!" -ForegroundColor Green
} else {
  Write-Host "❌ Failed to create React + Vite project" -ForegroundColor Red
  exit 1
}

Write-Host ""
Write-Host "📁 Step 2: Navigating to project directory..." -ForegroundColor Yellow
cd ai-console

Write-Host ""
Write-Host "📥 Step 3: Installing core dependencies..." -ForegroundColor Yellow

npm install

Write-Host ""
Write-Host "📥 Step 4: Installing additional dependencies..." -ForegroundColor Yellow

# React Router
npm install react-router-dom
Write-Host "✅ react-router-dom installed" -ForegroundColor Green

# State Management
npm install zustand
Write-Host "✅ zustand installed" -ForegroundColor Green

# API & GraphQL
npm install @apollo/client graphql
Write-Host "✅ @apollo/client installed" -ForegroundColor Green

# UI Components
npm install clsx tailwind-merge
npm install @tailwindcss/forms @tailwindcss/typography
Write-Host "✅ UI utilities installed" -ForegroundColor Green

# Forms
npm install react-hook-form zod @hookform/resolvers
Write-Host "✅ react-hook-form installed" -ForegroundColor Green

# HTTP Client
npm install axios
Write-Host "✅ axios installed" -ForegroundColor Green

# Real-time
npm install socket.io-client
Write-Host "✅ socket.io-client installed" -ForegroundColor Green

# Charts
npm install recharts
Write-Host "✅ recharts installed" -ForegroundColor Green

# Rich text editor
npm install react-quill
Write-Host "✅ react-quill installed" -ForegroundColor Green

# File upload
npm install react-dropzone
Write-Host "✅ react-dropzone installed" -ForegroundColor Green

# Date/Time
npm install date-fns
Write-Host "✅ date-fns installed" -ForegroundColor Green

# Notifications
npm install react-hot-toast
Write-Host "✅ react-hot-toast installed" -ForegroundColor Green

# Icons
npm install lucide-react
Write-Host "✅ lucide-react installed" -ForegroundColor Green

# Loading
npm install nprogress
npm install --save-dev @types/nprogress
Write-Host "✅ nprogress installed" -ForegroundColor Green

# Tailwind
npm install --save-dev tailwindcss postcss autoprefixer
Write-Host "✅ Tailwind CSS installed" -ForegroundColor Green

# Initialize Tailwind
Write-Host ""
Write-Host "⚙️  Step 5: Initializing Tailwind CSS..." -ForegroundColor Yellow
npx tailwindcss init -p
Write-Host "✅ Tailwind CSS initialized" -ForegroundColor Green

Write-Host ""
Write-Host "📁 Step 6: Creating project directory structure..." -ForegroundColor Yellow

# Create directories
$dirs = @(
  "src/pages",
  "src/components/dashboard",
  "src/components/queue",
  "src/components/editor",
  "src/components/analytics",
  "src/components/sources",
  "src/components/common",
  "src/components/layout",
  "src/hooks",
  "src/services",
  "src/store",
  "src/types",
  "src/styles",
  "src/utils",
  "src/lib",
  "src/config",
  "public/icons",
  "public/logos"
)

foreach ($dir in $dirs) {
  if (-not (Test-Path $dir)) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
    Write-Host "✅ Created: $dir" -ForegroundColor Green
  }
}

Write-Host ""
Write-Host "⚙️  Step 7: Copying configuration files..." -ForegroundColor Yellow

# Create .env.local
$envContent = @'
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
'@

$envContent | Out-File -FilePath ".env.local" -Encoding UTF8
Write-Host "✅ .env.local created" -ForegroundColor Green

Write-Host ""
Write-Host "🧪 Step 8: Verifying installations..." -ForegroundColor Yellow

# Check Node version
$nodeVersion = node --version
Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green

# Check npm version
$npmVersion = npm --version
Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green

# List installed packages
Write-Host ""
Write-Host "📦 Installed packages:" -ForegroundColor Cyan
npm list --depth=0

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  ✅ SETUP COMPLETE!                                            ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Green

Write-Host ""
Write-Host "🚀 To start development:" -ForegroundColor Cyan
Write-Host "   npm run dev" -ForegroundColor Yellow
Write-Host ""
Write-Host "📖 Documentation:" -ForegroundColor Cyan
Write-Host "   → WEEK_1_TASK_2_REACT_CONSOLE_SETUP.md" -ForegroundColor Yellow
Write-Host ""
Write-Host "🌐 Access the app at: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  Remember to:" -ForegroundColor Yellow
Write-Host "   1. Update VITE_API_KEY in .env.local with your Strapi token" -ForegroundColor Yellow
Write-Host "   2. Make sure Strapi is running on http://localhost:1337" -ForegroundColor Yellow
Write-Host ""
