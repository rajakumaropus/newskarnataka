# Sprint 1 Starter Pack
## NewsKarnataka.com - Day 1 Implementation Guide

**Status:** 🟢 LIVE - Sprint 1 Active Now  
**Date:** September 2026 - Week 1 (Mon-Fri)  
**Mission:** Build Foundation & Database Infrastructure  

---

## IMMEDIATE ACTION ITEMS (Before Monday 9 AM)

### ✅ SETUP CHECKLIST (TODAY)

**GitHub Repository Setup:**
```bash
# 1. Create organization/repository
gh repo create newskarnataka-project --public

# 2. Clone repository
git clone https://github.com/newskarnataka/newskarnataka-project.git
cd newskarnataka-project

# 3. Create branch structure
git checkout -b develop
git checkout -b release/v0.1.0
git checkout main

# 4. Create .gitignore
cat > .gitignore << 'EOF'
# Environment
.env
.env.local
.env.*.local

# Node/npm
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
package-lock.json

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Build
dist/
build/
.next/

# Testing
coverage/
.nyc_output/

# Strapi
.strapi-updater.json
.cache/
EOF

# 5. Create initial README
cat > README.md << 'EOF'
# NewsKarnataka.com - Strapi Migration

Complete migration of NewsKarnataka.com from WordPress to Strapi with AI-driven authoring console.

## Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 14+ (provided: 103.191.208.235)
- Git

### Setup

1. Clone repository
2. Copy .env.example to .env
3. Update credentials
4. docker-compose up -d
5. npm run develop (for Strapi)

## Documentation
- See docs/ directory for detailed guides
- Sprint plans in sprint_plans/ directory
- Database design in db/ directory

## Team
- Team A: Frontend (React 18, Next.js 14)
- Team B: Backend (Strapi 5.x, PostgreSQL)
- Team C: DevOps (AWS, Docker, CI/CD)
EOF

# 6. Create directory structure
mkdir -p {frontend,backend,devops,docs,sprint_plans,db}

# 7. Initial commit
git add .
git commit -m "Initial project setup"
git push -u origin develop
```

**Slack Setup:**
```
Channels to create:
├─ #daily-standup (standups, updates)
├─ #team-frontend (Team A discussion)
├─ #team-backend (Team B discussion)
├─ #team-devops (Team C discussion)
├─ #blockers (urgent issues)
├─ #database-sync (weekly meetings)
├─ #sprint-1 (Sprint 1 specific)
└─ #general (announcements)

Settings:
├─ Set #daily-standup as announcement channel
├─ Pin: SPRINT_1_KICKOFF_EXECUTION_PLAN.md
├─ Pin: SPRINT_1_DAILY_CHECKLIST.md
└─ Set notification rules
```

**Zoom Rooms:**
```
Booking:
├─ Daily Standup: 9:00 AM (15 min) - Monday-Friday
├─ Sprint Review: Friday 10:00 AM (60 min)
├─ Retrospective: Friday 11:00 AM (60 min)
├─ Database Sync: Wednesday 3:00 PM (30 min)
└─ Team Breakouts: As needed

Settings:
├─ Recurring meetings enabled
├─ Links in Slack pins
├─ Calendar invites sent to all teams
└─ Waiting room disabled (internal only)
```

---

## MONDAY MORNING - SPRINT 1 KICKOFF (9:00 AM)

### Pre-Kickoff (8:00 AM)

**What Each Team Should Have Ready:**

**TEAM A (Frontend):**
- [ ] Node.js 18+ installed: `node --version`
- [ ] npm installed: `npm --version`
- [ ] Git configured: `git config user.name && git config user.email`
- [ ] Text editor/IDE ready (VS Code, WebStorm)
- [ ] Zoom app working
- [ ] Slack desktop app ready

**TEAM B (Backend):**
- [ ] Node.js 18+ installed: `node --version`
- [ ] PostgreSQL client installed: `psql --version`
- [ ] Docker installed: `docker --version`
- [ ] Docker Compose installed: `docker-compose --version`
- [ ] Git configured
- [ ] Zoom & Slack ready
- [ ] Database credentials written down (103.191.208.235, news, news321)

**TEAM C (DevOps):**
- [ ] Docker installed & tested: `docker run hello-world`
- [ ] Docker Compose installed: `docker-compose --version`
- [ ] PostgreSQL client installed: `psql --version`
- [ ] AWS CLI installed (if applicable): `aws --version`
- [ ] Git configured
- [ ] Zoom & Slack ready
- [ ] Access to AWS Console (if applicable)

### Kickoff Meeting (9:00 AM - 10:30 AM)

**Agenda (See SPRINT_1_KICKOFF_EXECUTION_PLAN.md for details)**

```
9:00-9:10: Welcome & Overview
9:10-9:30: Enhanced Methodology Briefing
9:30-10:00: Team-Specific Briefings
10:00-10:15: Gating & Success Criteria
10:15-10:30: Logistics & Communication

Then: Breakout sessions 10:30-12:00
```

---

## MONDAY AFTERNOON - TEAM A: COMPONENT LIBRARY

### 1:00 PM - 3:00 PM: Project Initialization

```bash
# 1. Create React project with Next.js 14
npx create-next-app@latest newskarnataka-frontend \
  --typescript \
  --tailwind \
  --eslint \
  --app

cd newskarnataka-frontend

# 2. Install additional dependencies
npm install @storybook/react @storybook/addon-essentials
npm install @testing-library/react @testing-library/jest-dom jest

# 3. Initialize Storybook
npx sb init --type react

# 4. Configure ESLint + Prettier
npm install --save-dev prettier eslint-config-prettier

# 5. Create .eslintrc.json
cat > .eslintrc.json << 'EOF'
{
  "extends": ["next/core-web-vitals", "prettier"],
  "rules": {
    "@next/next/no-any": "error",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
EOF

# 6. Create .prettierrc
cat > .prettierrc << 'EOF'
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
EOF

# 7. Create directory structure
mkdir -p src/{components,pages,stories,__tests__,styles,utils}

# 8. First commit
git add .
git commit -m "feat: Initialize Next.js project with Storybook"
git push origin feature/component-library
```

### 3:00 PM - 5:00 PM: First Components

```bash
# Create Button component
cat > src/components/Button.tsx << 'EOF'
import React from 'react';

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  className = '',
}) => {
  const baseStyles =
    'font-semibold rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    tertiary: 'bg-transparent text-blue-600 hover:bg-blue-50 border border-blue-600',
  };

  const sizeStyles = {
    small: 'px-3 py-1 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </button>
  );
};
EOF

# Create Button story
cat > src/stories/Button.stories.tsx << 'EOF'
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../components/Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: {
      options: ['primary', 'secondary', 'tertiary'],
      control: { type: 'select' },
    },
    size: {
      options: ['small', 'medium', 'large'],
      control: { type: 'select' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: 'Click Me',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
  },
};
EOF

# Create Button tests
cat > src/__tests__/Button.test.tsx << 'EOF'
import { render, screen } from '@testing-library/react';
import { Button } from '../components/Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    screen.getByText('Click me').click();
    expect(onClick).toHaveBeenCalled();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByText('Click me')).toBeDisabled();
  });
});
EOF

# Run tests
npm test -- --testPathPattern=Button.test

# Commit
git add .
git commit -m "feat: Add Button component with Storybook stories and tests"
git push origin feature/component-library
```

---

## MONDAY AFTERNOON - TEAM B: DATABASE SETUP

### 1:00 PM - 3:00 PM: Strapi Configuration

```bash
# 1. Create Strapi project
npx create-strapi-app@latest newskarnataka-cms --quickstart

cd newskarnataka-cms

# 2. STOP the auto-start process (Ctrl+C)

# 3. Create .env file
cat > .env << 'EOF'
# Database
DATABASE_URL=postgresql://news:news321@103.191.208.235:5432/newskarnataka
DB_HOST=103.191.208.235
DB_PORT=5432
DB_USER=news
DB_PASSWORD=news321
DB_NAME=newskarnataka
DB_SSL=true

# Strapi
NODE_ENV=production
STRAPI_PORT=1337
STRAPI_HOST=0.0.0.0

# JWT Secrets (Generate with: openssl rand -base64 32)
ADMIN_JWT_SECRET=your-secret-here-generate-new-one
JWT_SECRET=your-secret-here-generate-new-one
API_TOKEN_SALT=your-secret-here-generate-new-one
EOF

# 4. Add to .gitignore
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore

# 5. Build Strapi
npm run build

# 6. If successful, create commit
git add .
git commit -m "feat: Configure Strapi with PostgreSQL connection"
```

### 3:00 PM - 5:00 PM: Start Strapi & Verify

```bash
# 1. Start Strapi development server
npm run develop

# 2. In a new terminal, test database connection
psql -h 103.191.208.235 -U news -d newskarnataka -c "SELECT 1;"

# 3. Screenshot both:
#    - Strapi console showing "✓ Strapi is running"
#    - psql output showing "1"
#    - Database tables created: SELECT COUNT(*) FROM information_schema.tables;

# 4. Post screenshots in #team-backend Slack channel

# 5. Report EOD status in standup tomorrow
```

---

## MONDAY AFTERNOON - TEAM C: DOCKER & VERIFICATION

### 1:00 PM - 3:00 PM: Docker Setup

```bash
# 1. Copy docker-compose.yml from project
# (File: d:\Personal\Kiro\KeralaNews\docker-compose.yml)

# 2. Create .env for Docker
cat > .env << 'EOF'
DB_HOST=103.191.208.235
DB_PORT=5432
DB_USER=news
DB_PASSWORD=news321
DB_NAME=newskarnataka
DB_SSL=true
REDIS_PASSWORD=redis123
PGADMIN_PASSWORD=admin123
NODE_ENV=production
EOF

# 3. Build Docker images
docker-compose build

# 4. Start services
docker-compose up -d

# 5. Verify services
docker-compose ps

# Expected output:
# STATUS: All containers should show "Up"
```

### 3:00 PM - 5:00 PM: Verification & Team Access

```bash
# 1. Test database connectivity from container
docker-compose exec strapi psql -h 103.191.208.235 -U news -d newskarnataka -c "SELECT 1;"

# 2. Verify Strapi is accessible
curl http://localhost:1337/admin

# 3. Check Redis
docker-compose exec redis redis-cli ping

# 4. Create screenshot showing all services running
docker-compose ps > docker_status.txt

# 5. Have each team member test connection:
psql -h 103.191.208.235 -U news -d newskarnataka -c "SELECT version();"

# 6. Post success in #team-devops
# Format: "✅ Docker running. DB connected. All team members verified."
```

---

## MONDAY EOD - STATUS REPORT

### By 5:00 PM Each Team Reports:

**TEAM A:**
```
✅ Component library project initialized
✅ Next.js + TypeScript configured
✅ First Button component created
✅ Storybook working
✅ Tests passing
```

**TEAM B:**
```
✅ Strapi project created
✅ .env configured with production database
✅ npm run build successful
✅ Database connectivity verified
✅ Screenshot posted in #team-backend
```

**TEAM C:**
```
✅ Docker Compose stack built
✅ All services running
✅ Database accessible from container
✅ Team members tested connectivity
✅ Screenshot posted in #team-devops
```

**In #daily-standup Slack:**
```
Team A: ✅ Ready
Team B: ✅ Ready
Team C: ✅ Ready

DECISION: ✅ Proceed to Tuesday
```

---

## TUESDAY - CRITICAL DAY (DATABASE GATING)

### Morning Standup (9:00 AM)
```
Focus: Is database fully operational?
Team C: Database status report
Team B: Strapi status report
Blockers: Escalate immediately if any issues
```

### Team C: Full Database Verification (9:30 AM - 5:00 PM)

**Critical Checklist:**
```bash
# 1. Connection from 3 locations
psql -h 103.191.208.235 -U news -d newskarnataka -c "SELECT 1;" # Office
# VPN connection test
# AWS instance test

# 2. Connection pooling setup
# Edit docker-compose.yml or Strapi config
# Pool: min 5, max 20, timeout 10s

# 3. Monitoring dashboards
# CloudWatch (if AWS)
# Grafana (if using)

# 4. Team access verification
# Each developer tests from their machine
# Screenshot required for each team member

# 5. Documentation
# Create runbook.md with connection steps
# Troubleshooting guide
# Emergency contact list
```

**EOD Gate #1 (Tuesday 5 PM):**
```
✅ All team members can connect to database
✅ Docker Compose fully working
✅ Strapi running without errors
✅ Monitoring active

IF ANY FAILED: Escalate to Tech Lead immediately!
```

---

## TOOLS & RESOURCES YOU'LL NEED

### Required Software
```
Team A:
├─ Node.js 18+ (nodejs.org)
├─ npm or yarn
├─ Git
└─ Text editor (VS Code recommended)

Team B:
├─ Node.js 18+
├─ PostgreSQL client (psql)
├─ Docker & Docker Compose
├─ Git
└─ Text editor

Team C:
├─ Docker & Docker Compose
├─ PostgreSQL client
├─ AWS CLI (optional)
├─ Terraform (optional)
└─ Git
```

### Database Credentials
```
Host: 103.191.208.235
Port: 5432
Database: newskarnataka
User: news
Password: news321
Connection: postgresql://news:news321@103.191.208.235:5432/newskarnataka
```

### Important Links
```
GitHub: [Your repo URL]
Jira: [Your project URL]
Slack: [Your workspace]
Documentation: d:\Personal\Kiro\KeralaNews\
├─ SPRINT_1_KICKOFF_EXECUTION_PLAN.md (detailed)
├─ SPRINT_1_DAILY_CHECKLIST.md (quick ref)
├─ DATABASE_CONNECTION_SETUP.md (how to connect)
├─ STRAPI_DATABASE_CONFIGURATION.md (Strapi setup)
└─ PRODUCTION_DATABASE_CREDENTIALS.md (security)
```

---

## COMMON ISSUES & SOLUTIONS

### "psql: command not found"
```bash
# Solution: Install PostgreSQL client
# macOS: brew install postgresql
# Linux: sudo apt-get install postgresql-client
# Windows: Download from postgresql.org
```

### "Connection refused on 103.191.208.235"
```bash
# Check:
ping 103.191.208.235
# Check firewall:
nc -zv 103.191.208.235 5432
# Check credentials:
cat .env | grep DB_
```

### "Docker service not running"
```bash
# macOS/Linux: 
sudo systemctl start docker
# Or restart Docker Desktop

# Windows:
# Restart Docker Desktop app
```

### "npm install takes too long"
```bash
# Use npm ci instead (cleaner install)
npm ci

# Or increase npm timeout
npm install --legacy-peer-deps --fetch-timeout=300000
```

---

## SUCCESS METRICS FOR WEEK 1

### Monday EOD ✅
- [ ] Team A: Component project initialized
- [ ] Team B: Strapi built, database accessible
- [ ] Team C: Docker running, team connected

### Tuesday EOD ✅
- [ ] Database connectivity verified (all team members)
- [ ] Strapi running on production database
- [ ] Docker Compose fully operational
- [ ] Monitoring active

### Wednesday EOD ✅
- [ ] 30+ database tables created
- [ ] Schema verified correct
- [ ] Indexes & triggers active

### Thursday EOD ✅
- [ ] Roles & permissions configured
- [ ] Permission system tested
- [ ] All systems healthy

### Friday EOD ✅
- [ ] All deliverables complete
- [ ] Team trained
- [ ] Sprint 2 ready to start

---

## LETS BUILD THIS! 🚀

**Ready to begin?**

Next step: Launch the Monday 9 AM Sprint 1 Kickoff

Questions before starting? Ask now!

Otherwise: **See you Monday morning for kickoff!**

