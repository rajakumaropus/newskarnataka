# Team A: Frontend Onboarding Guide
## React 18 + Next.js 14 + Component Library

**Team:** 3 Frontend Developers  
**Tech Stack:** React 18, Next.js 14, TypeScript, Tailwind CSS, Storybook  
**Duration:** Ongoing reference during Sprint 1 & beyond

---

## YOUR MISSION

Build and maintain a **reusable component library** with **80+ components** that will power:
- Editorial console (article creation & editing)
- Dashboard (analytics & metrics)
- Admin panel (user management)
- Public website (news display)

**Success = 80%+ test coverage + comprehensive Storybook documentation**

---

## SPRINT 1 GOALS (Week 1)

### Monday EOD
- ✅ Next.js project initialized
- ✅ TypeScript configured
- ✅ Tailwind CSS working
- ✅ Storybook setup complete
- ✅ First Button component created
- ✅ First unit tests written
- ✅ Code pushed to GitHub

### Tuesday EOD
- ✅ Input component created
- ✅ Card component created
- ✅ Layout components (Header, Sidebar)
- ✅ All tests passing

### Wednesday EOD
- ✅ Form components (Form, FormField, FormError)
- ✅ Modal component
- ✅ Dropdown component
- ✅ 12+ components total

### Thursday EOD
- ✅ Navigation components
- ✅ Table component
- ✅ Alert/Toast components
- ✅ 16+ components total

### Friday EOD
- ✅ All 20+ components complete
- ✅ 80%+ test coverage
- ✅ Storybook fully documented
- ✅ Ready for Team B integration

---

## SETUP: MONDAY MORNING (BEFORE BREAKOUT)

### 1. Verify Prerequisites (5 min)

```bash
# Check Node.js version (must be 18+)
node --version
# Expected: v18.x.x or v20.x.x

# Check npm
npm --version
# Expected: 9.x.x or higher

# Check Git
git --version
# Expected: 2.x.x or higher

# Verify editor (VS Code recommended)
code --version
```

### 2. Configure Git (5 min)

```bash
# Set your identity
git config --global user.name "Your Name"
git config --global user.email "your.email@newskarnataka.com"

# Configure helpful aliases
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status

# Verify
git config --global user.name
git config --global user.email
```

### 3. Install VS Code Extensions (5 min)

Essential extensions:
```
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- Thunder Client (or Postman)
- GitLens
- Tailwind CSS IntelliSense
- Storybook
```

Search in VS Code: Extensions → search each name → Install

### 4. Prepare Your Workspace (5 min)

```bash
# Create a development folder
mkdir ~/newskarnataka-dev
cd ~/newskarnataka-dev

# You'll clone the repo here during breakout
```

---

## MONDAY BREAKOUT SESSION (10:30 AM - 12:00 PM)

### Step 1: Initialize Next.js Project (10 min)

```bash
# Navigate to your workspace
cd ~/newskarnataka-dev

# Create Next.js project with TypeScript + Tailwind
npx create-next-app@latest newskarnataka-frontend \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --no-git \
  --import-alias '@/*'

# Navigate into project
cd newskarnataka-frontend

# Verify it works
npm run dev

# Open browser: http://localhost:3000
# You should see Next.js welcome page
# Press Ctrl+C to stop
```

### Step 2: Initialize Git & GitHub (5 min)

```bash
# Initialize Git
git init

# Add all files
git add .

# Initial commit
git commit -m "feat: Initialize Next.js project with TypeScript and Tailwind"

# Add remote (ask Team Lead for repo URL)
git remote add origin https://github.com/newskarnataka/newskarnataka-frontend.git

# Create feature branch
git checkout -b feature/component-library

# Push to GitHub
git push -u origin feature/component-library
```

### Step 3: Install Storybook (10 min)

```bash
# Install Storybook
npx sb init --type react

# This will:
# - Install Storybook dependencies
# - Create .storybook directory
# - Create example stories
# - Update package.json

# Verify Storybook works
npm run storybook

# Open browser: http://localhost:6006
# You should see Storybook interface with example components
# Press Ctrl+C to stop
```

### Step 4: Install Testing Dependencies (5 min)

```bash
# Install Jest and React Testing Library
npm install --save-dev @testing-library/react @testing-library/jest-dom jest @types/jest

# Create Jest config
cat > jest.config.js << 'EOF'
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
  ],
}

module.exports = createJestConfig(customJestConfig)
EOF

# Create Jest setup
cat > jest.setup.js << 'EOF'
import '@testing-library/jest-dom'
EOF

# Verify Jest works
npm test -- --testPathPattern="Button" --run

# Should show: "Test Suites: 0 passed, 0 total" (no tests yet, that's OK)
```

### Step 5: Create Directory Structure (5 min)

```bash
# Create organized folder structure
mkdir -p src/{components,stories,__tests__,styles,utils,hooks,types}

# Create component structure example
mkdir -p src/components/Button

# Move Next.js files
mv app src/app
mv public src/public

# Update tsconfig.json paths if needed
```

### Step 6: Create First Component - Button (15 min)

```bash
# Create Button component
cat > src/components/Button/Button.tsx << 'EOF'
import React from 'react';
import styles from './Button.module.css';

export interface ButtonProps {
  /**
   * Button label/text content
   */
  children: React.ReactNode;

  /**
   * Click handler
   */
  onClick?: () => void;

  /**
   * Visual style variant
   */
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger';

  /**
   * Size of the button
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Disabled state
   */
  disabled?: boolean;

  /**
   * Custom CSS class
   */
  className?: string;

  /**
   * Button type
   */
  type?: 'button' | 'submit' | 'reset';

  /**
   * Full width button
   */
  fullWidth?: boolean;
}

/**
 * Primary button component for user interactions
 * 
 * @example
 * <Button variant="primary" onClick={() => console.log('clicked')}>
 *   Click me
 * </Button>
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  className = '',
  type = 'button',
  fullWidth = false,
}) => {
  const baseStyles =
    'font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500',
    tertiary: 'bg-transparent text-blue-600 hover:bg-blue-50 border border-blue-600 focus:ring-blue-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  const sizeStyles = {
    small: 'px-3 py-1 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
EOF

# Create Button test
cat > src/components/Button/Button.test.tsx << 'EOF'
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders with text content', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByText('Click me')).toBeDisabled();
  });

  it('renders with correct variant class', () => {
    const { container } = render(<Button variant="secondary">Click me</Button>);
    const button = screen.getByText('Click me');
    expect(button).toHaveClass('bg-gray-200');
  });

  it('renders with correct size class', () => {
    render(<Button size="large">Click me</Button>);
    const button = screen.getByText('Click me');
    expect(button).toHaveClass('px-6');
  });

  it('renders full width when fullWidth prop is true', () => {
    render(<Button fullWidth>Click me</Button>);
    const button = screen.getByText('Click me');
    expect(button).toHaveClass('w-full');
  });

  it('uses correct button type', () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByText('Submit')).toHaveAttribute('type', 'submit');
  });
});
EOF

# Create Button story
cat > src/stories/Button.stories.tsx << 'EOF'
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../components/Button/Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      options: ['primary', 'secondary', 'tertiary', 'danger'],
      control: { type: 'select' },
      description: 'Visual style variant of the button',
    },
    size: {
      options: ['small', 'medium', 'large'],
      control: { type: 'select' },
      description: 'Size of the button',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disabled state',
    },
    fullWidth: {
      control: { type: 'boolean' },
      description: 'Make button full width',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
  },
};

export const Tertiary: Story = {
  args: {
    children: 'Tertiary Button',
    variant: 'tertiary',
  },
};

export const Danger: Story = {
  args: {
    children: 'Delete',
    variant: 'danger',
  },
};

export const Small: Story = {
  args: {
    children: 'Small',
    size: 'small',
  },
};

export const Large: Story = {
  args: {
    children: 'Large',
    size: 'large',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    disabled: true,
  },
};

export const FullWidth: Story = {
  args: {
    children: 'Full Width Button',
    fullWidth: true,
  },
};
EOF

# Create index file for easy imports
cat > src/components/Button/index.ts << 'EOF'
export { Button, type ButtonProps } from './Button';
export { default } from './Button';
EOF
```

### Step 7: Run Tests & Storybook (10 min)

```bash
# Run tests
npm test -- --testPathPattern="Button" --run

# Expected: ✓ Button Component (7 passing tests)

# Start Storybook
npm run storybook

# Open browser: http://localhost:6006
# Click on "Components/Button" in sidebar
# You should see all Button variants
# Click on each variant to see them rendered
# Press Ctrl+C to stop
```

### Step 8: Commit & Push (5 min)

```bash
# Stage changes
git add .

# Commit
git commit -m "feat(button): Add Button component with Storybook stories and tests"

# Push to GitHub
git push origin feature/component-library

# Create Pull Request
# - Go to GitHub
# - Click "Compare & pull request"
# - Add description: "Initial Button component with full test coverage"
# - Add team lead as reviewer
# - Submit PR
```

---

## MONDAY AFTERNOON: CONTINUATION (1:00 PM - 5:00 PM)

### Create Component Template System

```bash
# Create a template script for generating components
cat > scripts/generate-component.sh << 'EOF'
#!/bin/bash

COMPONENT_NAME=$1

if [ -z "$COMPONENT_NAME" ]; then
  echo "Usage: ./scripts/generate-component.sh ComponentName"
  exit 1
fi

COMPONENT_PATH="src/components/$COMPONENT_NAME"

mkdir -p "$COMPONENT_PATH"

# Component template
cat > "$COMPONENT_PATH/$COMPONENT_NAME.tsx" << COMPONENT
import React from 'react';

export interface ${COMPONENT_NAME}Props {
  children?: React.ReactNode;
  className?: string;
}

export const $COMPONENT_NAME: React.FC<${COMPONENT_NAME}Props> = ({
  children,
  className = '',
}) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

export default $COMPONENT_NAME;
COMPONENT

# Test template
cat > "$COMPONENT_PATH/$COMPONENT_NAME.test.tsx" << TEST
import { render, screen } from '@testing-library/react';
import { $COMPONENT_NAME } from './$COMPONENT_NAME';

describe('$COMPONENT_NAME', () => {
  it('renders correctly', () => {
    render(<$COMPONENT_NAME>Test</$COMPONENT_NAME>);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
TEST

# Story template
cat > "src/stories/$COMPONENT_NAME.stories.tsx" << STORY
import type { Meta, StoryObj } from '@storybook/react';
import { $COMPONENT_NAME } from '../components/$COMPONENT_NAME/$COMPONENT_NAME';

const meta: Meta<typeof $COMPONENT_NAME> = {
  title: 'Components/$COMPONENT_NAME',
  component: $COMPONENT_NAME,
};

export default meta;
type Story = StoryObj<typeof $COMPONENT_NAME>;

export const Default: Story = {
  args: {
    children: 'Content',
  },
};
STORY

# Index file
cat > "$COMPONENT_PATH/index.ts" << INDEX
export { $COMPONENT_NAME, type ${COMPONENT_NAME}Props } from './$COMPONENT_NAME';
export { default } from './$COMPONENT_NAME';
INDEX

echo "✓ Component $COMPONENT_NAME created at $COMPONENT_PATH"
EOF

chmod +x scripts/generate-component.sh

# Test the script
./scripts/generate-component.sh Input

# This creates: src/components/Input/ with all necessary files
```

### Create ESLint & Prettier Configuration

```bash
# ESLint config
cat > .eslintrc.json << 'EOF'
{
  "extends": ["next/core-web-vitals", "prettier"],
  "rules": {
    "@next/next/no-any": "error",
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "react/react-in-jsx-scope": "off",
    "react/display-name": "off"
  }
}
EOF

# Prettier config
cat > .prettierrc << 'EOF'
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "arrowParens": "always"
}
EOF

# Add pre-commit hook (optional but recommended)
npm install husky lint-staged --save-dev
npx husky install

cat > .husky/pre-commit << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
EOF

chmod +x .husky/pre-commit

cat > .lintstagedrc.json << 'EOF'
{
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.md": ["prettier --write"]
}
EOF
```

### Add GitHub Actions CI/CD

```bash
# Create GitHub Actions workflow
mkdir -p .github/workflows

cat > .github/workflows/ci.yml << 'EOF'
name: CI

on:
  push:
    branches: [main, develop, feature/*]
  pull_request:
    branches: [main, develop]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
      - uses: actions/checkout@v3

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

      - name: Run tests
        run: npm run test -- --run --coverage

      - name: Build
        run: npm run build

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
EOF
```

---

## TUESDAY-FRIDAY: COMPONENT DEVELOPMENT SCHEDULE

### Tuesday: Input Components
```bash
./scripts/generate-component.sh Input
./scripts/generate-component.sh TextArea
./scripts/generate-component.sh Select
./scripts/generate-component.sh Checkbox
./scripts/generate-component.sh RadioButton

# Run tests
npm test -- --run --coverage

# Expected coverage: >80%
```

### Wednesday: Layout Components
```bash
./scripts/generate-component.sh Card
./scripts/generate-component.sh Modal
./scripts/generate-component.sh Header
./scripts/generate-component.sh Sidebar
./scripts/generate-component.sh Container
```

### Thursday: Compound Components
```bash
./scripts/generate-component.sh Form
./scripts/generate-component.sh Table
./scripts/generate-component.sh Dropdown
./scripts/generate-component.sh Tabs
./scripts/generate-component.sh Alert
```

### Friday: Navigation & Utils
```bash
./scripts/generate-component.sh Nav
./scripts/generate-component.sh Breadcrumb
./scripts/generate-component.sh Pagination
./scripts/generate-component.sh Badge
./scripts/generate-component.sh Tooltip

# Final check
npm run test -- --run --coverage
npm run build
npm run storybook

# Submit final PR
```

---

## DAILY STANDUP TEMPLATE

**When:** 9:00 AM - 9:15 AM  
**Where:** Zoom link in Slack  
**Report In:** #daily-standup channel

```
🟢 Team A - Frontend Status

Yesterday (Mon):
✅ Next.js project initialized
✅ Storybook configured
✅ Button component created with tests
✅ First PR submitted

Today (Tue):
🎯 Create 4 input components (Input, TextArea, Select, Checkbox)
🎯 80%+ test coverage on all
🎯 All stories in Storybook

Blockers:
❌ None currently

Wins:
🎉 Button component has 100% test coverage!
```

---

## TESTING BEST PRACTICES

### Unit Test Structure

```typescript
describe('Component', () => {
  // Arrange - Setup
  beforeEach(() => {
    // Setup before each test
  });

  it('should [specific behavior]', () => {
    // Arrange - Create test data
    const mockHandler = jest.fn();
    
    // Act - Perform action
    render(<Component onClick={mockHandler} />);
    fireEvent.click(screen.getByRole('button'));
    
    // Assert - Check result
    expect(mockHandler).toHaveBeenCalled();
  });
});
```

### Coverage Targets
```
Line Coverage:     ≥80%
Branch Coverage:   ≥75%
Function Coverage: ≥80%
Statement Coverage: ≥80%
```

---

## USEFUL COMMANDS

```bash
# Development
npm run dev              # Start dev server (localhost:3000)
npm run storybook       # Start Storybook (localhost:6006)
npm run build           # Build for production
npm run test            # Run tests in watch mode
npm run test -- --run   # Run tests once

# Linting & Formatting
npm run lint            # Check for lint errors
npm run lint -- --fix   # Fix lint errors
npm run format          # Format with Prettier

# Git
git status              # Check status
git add .               # Stage all changes
git commit -m "msg"     # Commit changes
git push                # Push to GitHub
git pull                # Pull latest changes

# Helpful
npm list                # List installed packages
npm outdated            # Check for outdated packages
npm audit               # Check for security vulnerabilities
npm audit fix           # Fix vulnerabilities
```

---

## FREQUENTLY ASKED QUESTIONS

**Q: How do I create a new component?**
A: Use the generator script: `./scripts/generate-component.sh ComponentName`

**Q: How much test coverage do I need?**
A: At least 80% line coverage. Aim for higher on critical components.

**Q: How do I write good component stories?**
A: Show all variants and states (default, disabled, error, loading, etc)

**Q: How do I deploy a new component?**
A: Create a PR, get review from team lead, merge to develop branch

**Q: What if Storybook doesn't start?**
A: Clear cache: `rm -rf .next node_modules/.cache && npm run storybook`

**Q: How do I test async components?**
A: Use `waitFor()` from @testing-library/react for async operations

---

## SUCCESS CHECKLIST

By Friday EOD, you should have:

- [ ] 20+ components created
- [ ] 80%+ test coverage
- [ ] All components documented in Storybook
- [ ] All PRs reviewed and merged
- [ ] Component library package ready for Team B integration
- [ ] README with component usage guide created
- [ ] Deployment pipeline configured

---

## NEXT STEPS (AFTER SPRINT 1)

- Sprint 2: Create 30+ additional components (forms, tables, charts)
- Sprint 3: Integrate with Team B (consume Strapi API)
- Sprint 4: Performance optimization & accessibility audit
- Sprint 5: Production hardening & deployment

---

**Questions?** Ask in #team-frontend Slack channel.

**Let's build something great!** 🚀

