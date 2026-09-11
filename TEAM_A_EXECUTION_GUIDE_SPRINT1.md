# 🎨 TEAM A: IMMEDIATE EXECUTION GUIDE
## Frontend - React 18 + Next.js 14 Component Library

**Timeline:** Monday Afternoon - Friday EOD (Sprint 1)  
**Mission:** Build 20+ reusable components with 80%+ test coverage  
**Target:** Production-ready component library for Team B & editorial console  

---

## 🎯 MONDAY AFTERNOON EXECUTION (1:30 PM - 5:00 PM)

### PHASE 1: Project Setup (1:30 PM - 2:30 PM)

**Step 1: Create Next.js Project**
```bash
# Navigate to your workspace
cd ~/newskarnataka-dev

# Create Next.js project
npx create-next-app@latest newskarnataka-frontend \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --no-git \
  --import-alias '@/*'

# Navigate into project
cd newskarnataka-frontend
```

**Step 2: Install Storybook**
```bash
# Initialize Storybook
npx sb init --type react

# Install additional testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom jest @types/jest
```

**Step 3: Create Directory Structure**
```bash
# Create organized folders
mkdir -p src/{components,stories,__tests__,styles,utils,hooks,types}

# Move Next.js directories
mv app src/app
mv public src/public
```

**Expected by 2:30 PM:**
- ✅ Next.js project initialized
- ✅ Storybook configured
- ✅ Directory structure created
- ✅ Dependencies installed

---

### PHASE 2: First Component (2:30 PM - 4:00 PM)

**Create Button Component**
```bash
# Create Button directory
mkdir -p src/components/Button

# Create component file
cat > src/components/Button/Button.tsx << 'EOF'
import React from 'react';

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
}

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
  const baseStyles = 'font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500',
    tertiary: 'bg-transparent text-blue-600 hover:bg-blue-50 border border-blue-600 focus:ring-blue-500',
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
```

**Create Button Tests**
```bash
# Create test file
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
    render(<Button variant="secondary">Click me</Button>);
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
```

**Create Button Stories**
```bash
# Create Storybook stories
cat > src/stories/Button.stories.tsx << 'EOF'
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../components/Button/Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: { layout: 'centered' },
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
  args: { children: 'Primary Button', variant: 'primary' },
};

export const Secondary: Story = {
  args: { children: 'Secondary Button', variant: 'secondary' },
};

export const Tertiary: Story = {
  args: { children: 'Tertiary Button', variant: 'tertiary' },
};

export const Disabled: Story = {
  args: { children: 'Disabled Button', disabled: true },
};

export const Small: Story = {
  args: { children: 'Small', size: 'small' },
};

export const Large: Story = {
  args: { children: 'Large', size: 'large' },
};
EOF
```

**Run Tests**
```bash
# Run tests for Button
npm test -- --testPathPattern="Button" --run

# Expected output: All tests passing ✅
```

**Expected by 4:00 PM:**
- ✅ Button component created
- ✅ Button tests written (7+ tests)
- ✅ Button stories in Storybook
- ✅ All tests passing

---

### PHASE 3: Version Control & EOD (4:00 PM - 5:00 PM)

**Initialize Git**
```bash
# Initialize Git
git init

# Create .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*

# IDE
.vscode/
.idea/

# Build
dist/
.next/
.cache/

# Environment
.env
.env.local

# OS
.DS_Store
Thumbs.db
EOF

# Initial commit
git add .
git commit -m "feat: Initialize Next.js project with Storybook and Button component"

# Add remote
git remote add origin https://github.com/newskarnataka/newskarnataka-frontend.git

# Create feature branch
git checkout -b feature/component-library

# Push to GitHub
git push -u origin feature/component-library
```

**Post EOD Status in Slack**
```
Post in #team-frontend and #daily-standup:

✅ Team A - Monday EOD Report

Components Built:
✅ Button component (100% test coverage)
✅ Storybook stories (all variants)

Infrastructure:
✅ Next.js 14 + TypeScript
✅ Tailwind CSS configured
✅ Jest + React Testing Library setup
✅ GitHub repository initialized

Status:
✅ Project foundation ready
✅ Component template system working
✅ All tests passing (7/7)
✅ Storybook running on localhost:6006

Next (Tuesday):
🎯 Database connectivity verification (Gate #1)
🎯 Create 4+ additional components
🎯 Maintain 80%+ test coverage

Blockers: NONE ✅
```

**Expected by 5:00 PM:**
- ✅ GitHub repository ready
- ✅ Initial commit pushed
- ✅ Status report posted
- ✅ Team ready for Tuesday

---

## 📋 TUESDAY - GATE #1 EXECUTION (Database Connectivity)

### Morning (9:00 AM - 12:00 PM)

**Task 1: Verify Database Connection**
```bash
# Test connection (you'll get this from Team B/C)
psql -h 103.191.208.235 -U news -d newskarnataka -c "SELECT 1;"
# Expected: (1 row) 1
```

**Task 2: Create Component Generator Script**
```bash
# Create script for rapid component generation
cat > scripts/generate-component.sh << 'EOF'
#!/bin/bash
COMPONENT_NAME=$1
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

echo "✓ Component $COMPONENT_NAME created"
EOF

chmod +x scripts/generate-component.sh
```

**Task 3: Create 4 New Components**
```bash
# Use the generator to create components quickly
./scripts/generate-component.sh Input
./scripts/generate-component.sh TextArea
./scripts/generate-component.sh Select
./scripts/generate-component.sh Checkbox

# Write actual implementations for each (detail omitted, follow Button pattern)
# Run tests
npm test -- --run --coverage
# Expected coverage: >80%
```

**Expected by 12:00 PM:**
- ✅ Database connection verified
- ✅ Component generator working
- ✅ 4 new components created
- ✅ All tests passing

---

## 📊 WEDNESDAY-FRIDAY COMPONENT EXPANSION

### Wednesday: Layout & Display Components
```bash
./scripts/generate-component.sh Card
./scripts/generate-component.sh Modal
./scripts/generate-component.sh Header
./scripts/generate-component.sh Sidebar
./scripts/generate-component.sh Container

# Tests: >80% coverage
# Total components so far: 12+
```

### Thursday: Compound Components
```bash
./scripts/generate-component.sh Form
./scripts/generate-component.sh FormField
./scripts/generate-component.sh Table
./scripts/generate-component.sh Dropdown
./scripts/generate-component.sh Alert

# Tests: >80% coverage  
# Total components so far: 17+
```

### Friday: Navigation & Final Components
```bash
./scripts/generate-component.sh Nav
./scripts/generate-component.sh Breadcrumb
./scripts/generate-component.sh Pagination
./scripts/generate-component.sh Badge
./scripts/generate-component.sh Tooltip

# Final verification
npm test -- --run --coverage
npm run build
npm run storybook

# Total components: 20+
# Coverage: 80%+
# Status: ✅ READY for Team B integration
```

---

## 🎯 SPRINT 1 DELIVERABLES CHECKLIST

### By Friday 5:00 PM (All MUST be complete)

- [ ] **20+ Components Built**
  - [ ] Button
  - [ ] Input components (5+)
  - [ ] Display components (4+)
  - [ ] Form components (4+)
  - [ ] Navigation components (3+)

- [ ] **Test Coverage**
  - [ ] 80%+ line coverage
  - [ ] All components have tests
  - [ ] All tests passing

- [ ] **Documentation**
  - [ ] Storybook stories for all components
  - [ ] All variants documented
  - [ ] Usage examples provided

- [ ] **Code Quality**
  - [ ] ESLint checks pass
  - [ ] Prettier formatting applied
  - [ ] TypeScript types complete

- [ ] **Version Control**
  - [ ] GitHub repository ready
  - [ ] Feature branch clean
  - [ ] PRs submitted & reviewed

- [ ] **Integration Ready**
  - [ ] Component library package ready
  - [ ] Exports configured
  - [ ] Ready for Team B API integration

---

## 📋 DAILY STANDUP FORMAT

**Every morning 9:00-9:15 AM:**

```
Team A Status:

Yesterday:
✅ [What you delivered]
✅ [What you delivered]

Today:
🎯 [What you'll build]
🎯 [What you'll test]

Blockers:
❌ [If any] or "None"

Wins:
🎉 [Something good]

Velocity:
Components: X built
Coverage: XX%+
Tests: YY passing
```

---

## 🔧 HELPFUL COMMANDS

```bash
# Start development server
npm run dev                    # localhost:3000

# Start Storybook
npm run storybook             # localhost:6006

# Run tests
npm test                      # Watch mode
npm test -- --run            # Single run
npm test -- --run --coverage # With coverage

# Linting & formatting
npm run lint                  # Check errors
npm run lint -- --fix        # Fix errors
npm run format               # Format code

# Git operations
git status                    # Check status
git add .                     # Stage changes
git commit -m "msg"           # Commit
git push origin feature-branch # Push
```

---

## 🎯 SUCCESS DEFINITION

**Sprint 1 is successful when:**
- ✅ 20+ reusable components created
- ✅ 80%+ test coverage achieved
- ✅ Storybook fully documented
- ✅ Code passes all quality checks
- ✅ GitHub repository organized
- ✅ Ready for Team B to consume
- ✅ Team trained on component system

---

## 🚀 YOU'VE GOT THIS!

**Everything is set up. The path is clear. Execute at your best.**

**Monday afternoon → Friday EOD = 20+ production-ready components**

**Let's build!** 💪

---

*Team A Execution Guide*  
*Sprint 1 Frontend Development*  
*React 18 + Next.js 14*

