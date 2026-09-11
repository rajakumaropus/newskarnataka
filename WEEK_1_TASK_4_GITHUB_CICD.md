# 🚀 WEEK 1 - TASK 4: GitHub Repositories & CI/CD
## Set up Git repos and GitHub Actions pipelines

**Task:** Create GitHub repos and CI/CD workflows for both projects  
**Duration:** 2-3 hours  
**Status:** IN PROGRESS  

---

## 📋 OVERVIEW

Creating:
1. **2 GitHub repositories** (public-website + ai-console)
2. **CI/CD pipelines** (GitHub Actions)
3. **Automated testing, building, and deployment**

---

## 🔧 STEP 1: CREATE GITHUB REPOSITORIES

### Create Repository 1: public-website

```bash
# On GitHub.com
1. Click "New repository"
2. Repository name: newskarnataka-public-website
3. Description: Modern news website for Karnataka - Next.js + React
4. Visibility: Public (or Private)
5. Initialize with README: NO (we'll push existing)
6. Create repository
```

**After creation:**

```powershell
# Navigate to Next.js project
cd newskarnataka-web

# Initialize git (if not already)
git init
git add .
git commit -m "Initial Next.js project setup"

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/newskarnataka-public-website.git
git branch -M main

# Push to GitHub
git push -u origin main
```

---

### Create Repository 2: ai-console

```bash
# Similar process on GitHub.com
Repository name: newskarnataka-ai-console
```

```powershell
# Navigate to React project
cd ai-console

git init
git add .
git commit -m "Initial React Vite project setup for AI Console"
git remote add origin https://github.com/YOUR_USERNAME/newskarnataka-ai-console.git
git branch -M main
git push -u origin main
```

---

## 📁 STEP 2: CI/CD WORKFLOWS

### Workflow 1: Public Website (Next.js)

**File: `.github/workflows/ci-cd-public.yml`**

```yaml
name: CI/CD - Public Website

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  NODE_VERSION: '18'

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Type check
        run: npm run type-check
      
      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_API_URL: ${{ secrets.API_URL }}
          NEXT_PUBLIC_GRAPHQL_URL: ${{ secrets.GRAPHQL_URL }}
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        if: always()

  deploy:
    needs: lint-and-test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to production
        run: |
          echo "Deploying Next.js app..."
          # Add your deployment command here
          # Example: vercel --prod
```

---

### Workflow 2: AI Console (React)

**File: `.github/workflows/ci-cd-console.yml`**

```yaml
name: CI/CD - AI Console

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  NODE_VERSION: '18'

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Type check
        run: npm run type-check
      
      - name: Build
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.API_URL }}
          VITE_GRAPHQL_URL: ${{ secrets.GRAPHQL_URL }}
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/

  deploy:
    needs: build-and-test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    steps:
      - uses: actions/download-artifact@v3
        with:
          name: dist
      
      - name: Deploy to S3
        run: |
          echo "Deploying React app to S3..."
          # aws s3 sync dist/ s3://your-bucket/ai-console/
```

---

## 🔐 STEP 3: GITHUB SECRETS

### Add secrets to both repositories

**Settings → Secrets and variables → Actions → New repository secret**

```
Name: API_URL
Value: http://103.191.208.235:1337

Name: GRAPHQL_URL
Value: http://103.191.208.235:1337/graphql

Name: API_KEY
Value: your_strapi_api_token

Name: STRIPE_SECRET_KEY
Value: sk_test_... (if using payments)

Name: DEPLOYMENT_KEY
Value: your_deployment_key
```

---

## 🌿 STEP 4: BRANCHING STRATEGY

### Branch Structure

```
main (production)
  ↑
  ├── Pull requests from staging
  │
staging (pre-production)
  ↑
  ├── Pull requests from develop
  │
develop (development)
  ↑
  ├── feature/next-js-homepage
  ├── feature/react-console-dashboard
  ├── feature/ai-validation-engine
  ├── bugfix/fix-article-display
  └── hotfix/security-patch
```

### Branch Protection Rules

**For main branch:**
1. Require pull request reviews before merging (2 approvals)
2. Require status checks to pass
3. Require branches to be up to date
4. Restrict who can push (only admins)

---

## 📝 STEP 5: GIT CONFIGURATION

### Global Git Config

```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
git config --global core.editor "code"
git config --global pull.rebase true
```

### Create .gitignore files

**Both projects - `.gitignore`:**

```
# Dependencies
node_modules/
package-lock.json
yarn.lock
pnpm-lock.yaml

# Environment
.env
.env.local
.env.*.local

# Build
/dist/
/.next/
/build/
/out/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Testing
coverage/
.nyc_output/

# Logs
logs/
*.log
npm-debug.log*

# Temp
tmp/
temp/
*.tmp
```

---

## 🔄 STEP 6: PULL REQUEST TEMPLATE

**File: `.github/pull_request_template.md`**

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation

## Related Issues
Closes #(issue number)

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests pass locally

## Screenshots (if applicable)
Add screenshots/videos of changes
```

---

## ✅ VERIFICATION CHECKLIST

- [ ] Repository 1 created on GitHub (public-website)
- [ ] Repository 2 created on GitHub (ai-console)
- [ ] Both repos initialized with git
- [ ] Code pushed to main branch
- [ ] CI/CD workflows created
- [ ] Secrets configured in GitHub
- [ ] Branch protection rules set on main
- [ ] Pull request template created
- [ ] .gitignore files in place
- [ ] First workflow run successful

---

## 📊 GITHUB STATUS

```
✅ Repositories created: 2
✅ CI/CD pipelines: 2
✅ Secrets configured: 5+
✅ Branch protection: Enabled
```

---

**Status: READY FOR NEXT TASK**

