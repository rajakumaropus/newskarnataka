# NewsKarnataka Public Website - Next.js Setup Script
# This script automates the setup of the Next.js project
# Run: .\setup-nextjs-public-website.ps1

Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  NewsKarnataka Public Website - Next.js Setup                  ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Step 1: Create Next.js Project
Write-Host "📦 Step 1: Creating Next.js project..." -ForegroundColor Yellow
Write-Host ""

npx create-next-app@latest newskarnataka-web `
  --typescript `
  --tailwind `
  --eslint `
  --app `
  --src-dir `
  --no-git `
  --import-alias '@/*'

if ($LASTEXITCODE -eq 0) {
  Write-Host "✅ Next.js project created successfully!" -ForegroundColor Green
} else {
  Write-Host "❌ Failed to create Next.js project" -ForegroundColor Red
  exit 1
}

Write-Host ""
Write-Host "📁 Step 2: Navigating to project directory..." -ForegroundColor Yellow
cd newskarnataka-web

Write-Host ""
Write-Host "📥 Step 3: Installing additional dependencies..." -ForegroundColor Yellow

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

# Analytics
npm install mixpanel-browser
Write-Host "✅ mixpanel-browser installed" -ForegroundColor Green

# Date/Time
npm install date-fns
Write-Host "✅ date-fns installed" -ForegroundColor Green

# Notifications
npm install react-hot-toast
Write-Host "✅ react-hot-toast installed" -ForegroundColor Green

# Loading States
npm install nprogress
npm install --save-dev @types/nprogress
Write-Host "✅ nprogress installed" -ForegroundColor Green

Write-Host ""
Write-Host "📁 Step 4: Creating project directory structure..." -ForegroundColor Yellow

# Create directories
$dirs = @(
  "src/components/common",
  "src/components/articles",
  "src/components/engagement",
  "src/components/search",
  "src/components/location",
  "src/components/trending",
  "src/hooks",
  "src/services",
  "src/store",
  "src/types",
  "src/styles",
  "src/utils",
  "src/lib",
  "src/config",
  "public/images/logos",
  "public/images/articles",
  "public/images/icons",
  "public/fonts",
  ".github/workflows"
)

foreach ($dir in $dirs) {
  if (-not (Test-Path $dir)) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
    Write-Host "✅ Created: $dir" -ForegroundColor Green
  }
}

Write-Host ""
Write-Host "⚙️  Step 5: Copying configuration files..." -ForegroundColor Yellow

# Copy .env.example to .env.local
if (Test-Path ".env.example") {
  Copy-Item ".env.example" ".env.local"
  Write-Host "✅ .env.local created from .env.example" -ForegroundColor Green
} else {
  Write-Host "⚠️  .env.example not found, creating .env.local..." -ForegroundColor Yellow
  @'
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

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev-secret-key-change-in-production

# Image Optimization
NEXT_PUBLIC_IMAGE_LOADER=cloudinary
NEXT_PUBLIC_CLOUDINARY_NAME=your_cloudinary_name
'@ | Out-File -FilePath ".env.local" -Encoding UTF8
  Write-Host "✅ .env.local created" -ForegroundColor Green
}

Write-Host ""
Write-Host "🧪 Step 6: Verifying installations..." -ForegroundColor Yellow

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
Write-Host "   → WEEK_1_TASK_1_NEXTJS_SETUP.md" -ForegroundColor Yellow
Write-Host ""
Write-Host "🌐 Access the app at: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
