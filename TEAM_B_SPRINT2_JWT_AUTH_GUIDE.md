# 🔐 TEAM B DAY 3 - JWT AUTHENTICATION & API ENDPOINTS
## Strapi Implementation Guide

**Status:** Ready for Execution  
**Date:** Wednesday, September 10, 2026  
**Lead:** Backend Team Lead  
**Deliverable:** JWT auth + 40+ API endpoints

---

## 🎯 DAY 3 OBJECTIVES

✅ Implement JWT authentication in Strapi  
✅ Create user registration endpoint  
✅ Create login endpoint with token generation  
✅ Create token refresh mechanism  
✅ Set up permission middleware  
✅ Test all auth endpoints  
✅ Document API responses

---

## 🔐 STRAPI JWT AUTHENTICATION SETUP

### Step 1: Install Required Packages

```bash
cd newskarnataka-cms
npm install jsonwebtoken bcryptjs
npm install --save-dev @types/jsonwebtoken
```

### Step 2: Configure JWT in Strapi

**File: `config/server.js`**

```javascript
module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS', ['my-secret-key']),
  },
  jwt: {
    expiresIn: '7d', // Token expiration
  },
});
```

**File: `.env`**

```
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
```

### Step 3: Create Custom Routes

**File: `src/api/auth/routes/auth.ts`**

```typescript
export default {
  routes: [
    {
      method: 'POST',
      path: '/auth/register',
      handler: 'auth.register',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/auth/login',
      handler: 'auth.login',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/auth/refresh',
      handler: 'auth.refreshToken',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/auth/logout',
      handler: 'auth.logout',
      config: {
        auth: true,
      },
    },
    {
      method: 'GET',
      path: '/auth/me',
      handler: 'auth.getCurrentUser',
      config: {
        auth: true,
      },
    },
    {
      method: 'POST',
      path: '/auth/forgot-password',
      handler: 'auth.forgotPassword',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/auth/reset-password',
      handler: 'auth.resetPassword',
      config: {
        auth: false,
      },
    },
  ],
};
```

### Step 4: Create Auth Controller

**File: `src/api/auth/controllers/auth.ts`**

```typescript
import { factories } from '@strapi/strapi';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

export default factories.createCoreController('plugin::users-permissions.auth', {
  // ============================================
  // REGISTER
  // ============================================

  async register(ctx) {
    const { email, username, password, firstName, lastName } = ctx.request.body;

    // Validation
    if (!email || !username || !password) {
      return ctx.badRequest('Email, username, and password are required');
    }

    // Check if user exists
    const userExists = await strapi.db.query('plugin::users-permissions.user').findOne({
      where: {
        $or: [{ email }, { username }],
      },
    });

    if (userExists) {
      return ctx.badRequest('User with this email or username already exists');
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create user
    const user = await strapi.db.query('plugin::users-permissions.user').create({
      data: {
        email,
        username,
        password: hashedPassword,
        firstName,
        lastName,
      },
    });

    // Generate tokens
    const token = generateToken(user.id, '7d');
    const refreshToken = generateToken(user.id, '30d');

    return ctx.created({
      user: sanitizeUser(user),
      token,
      refreshToken,
    });
  },

  // ============================================
  // LOGIN
  // ============================================

  async login(ctx) {
    const { email, password } = ctx.request.body;

    // Validation
    if (!email || !password) {
      return ctx.badRequest('Email and password are required');
    }

    // Find user
    const user = await strapi.db.query('plugin::users-permissions.user').findOne({
      where: { email },
      populate: ['roles'],
    });

    if (!user) {
      return ctx.unauthorized('Invalid email or password');
    }

    // Compare password
    const validPassword = await bcryptjs.compare(password, user.password);

    if (!validPassword) {
      return ctx.unauthorized('Invalid email or password');
    }

    // Update last login
    await strapi.db.query('plugin::users-permissions.user').update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Generate tokens
    const token = generateToken(user.id, '7d');
    const refreshToken = generateToken(user.id, '30d');

    return ctx.ok({
      user: sanitizeUser(user),
      token,
      refreshToken,
    });
  },

  // ============================================
  // REFRESH TOKEN
  // ============================================

  async refreshToken(ctx) {
    const { refreshToken } = ctx.request.body;

    if (!refreshToken) {
      return ctx.badRequest('Refresh token is required');
    }

    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_SECRET || 'default-secret'
      ) as any;

      // Generate new tokens
      const token = generateToken(decoded.id, '7d');
      const newRefreshToken = generateToken(decoded.id, '30d');

      return ctx.ok({
        token,
        refreshToken: newRefreshToken,
      });
    } catch (error) {
      return ctx.unauthorized('Invalid or expired refresh token');
    }
  },

  // ============================================
  // LOGOUT
  // ============================================

  async logout(ctx) {
    // In a stateless JWT system, logout is handled client-side
    // by removing tokens from localStorage
    // Optionally, you could blacklist tokens in a database

    return ctx.ok({
      message: 'Logged out successfully',
    });
  },

  // ============================================
  // GET CURRENT USER
  // ============================================

  async getCurrentUser(ctx) {
    const userId = ctx.state.user?.id;

    if (!userId) {
      return ctx.unauthorized('Authentication required');
    }

    const user = await strapi.db.query('plugin::users-permissions.user').findOne({
      where: { id: userId },
      populate: ['roles'],
    });

    return ctx.ok(sanitizeUser(user));
  },

  // ============================================
  // FORGOT PASSWORD
  // ============================================

  async forgotPassword(ctx) {
    const { email } = ctx.request.body;

    if (!email) {
      return ctx.badRequest('Email is required');
    }

    const user = await strapi.db.query('plugin::users-permissions.user').findOne({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists (security best practice)
      return ctx.ok({ message: 'If the email exists, a reset link has been sent' });
    }

    // Generate reset token
    const resetToken = generateToken(user.id, '1h');

    // Send email (implement your email service here)
    // await sendPasswordResetEmail(user.email, resetToken);

    return ctx.ok({ message: 'Password reset link sent to email' });
  },

  // ============================================
  // RESET PASSWORD
  // ============================================

  async resetPassword(ctx) {
    const { token, password } = ctx.request.body;

    if (!token || !password) {
      return ctx.badRequest('Token and new password are required');
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'default-secret'
      ) as any;

      // Hash new password
      const hashedPassword = await bcryptjs.hash(password, 10);

      // Update user password
      await strapi.db.query('plugin::users-permissions.user').update({
        where: { id: decoded.id },
        data: { password: hashedPassword },
      });

      return ctx.ok({ message: 'Password reset successful' });
    } catch (error) {
      return ctx.unauthorized('Invalid or expired reset token');
    }
  },
});

// ============================================
// HELPER FUNCTIONS
// ============================================

function generateToken(userId: string, expiresIn: string): string {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'default-secret',
    { expiresIn }
  );
}

function sanitizeUser(user: any): any {
  const { password, ...sanitized } = user;
  return sanitized;
}
```

---

## 📋 API ENDPOINTS REFERENCE

### Authentication Endpoints

**1. Register**
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe"
}

Response 201:
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "username",
    "firstName": "John",
    "lastName": "Doe"
  },
  "token": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

**2. Login**
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}

Response 200:
{
  "user": { ... },
  "token": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

**3. Refresh Token**
```
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}

Response 200:
{
  "token": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

**4. Get Current User**
```
GET /api/auth/me
Authorization: Bearer eyJhbGc...

Response 200:
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "username",
  ...
}
```

**5. Logout**
```
POST /api/auth/logout
Authorization: Bearer eyJhbGc...

Response 200:
{
  "message": "Logged out successfully"
}
```

---

## 📊 40+ API ENDPOINTS BREAKDOWN

### Articles Endpoints (12)
- GET /api/articles - List with filtering
- GET /api/articles/:id - Get single
- POST /api/articles - Create
- PUT /api/articles/:id - Update
- DELETE /api/articles/:id - Delete
- POST /api/articles/:id/approve - Approve
- POST /api/articles/:id/reject - Reject
- POST /api/articles/:id/like - Like article
- POST /api/articles/:id/unlike - Unlike article
- GET /api/articles/:id/comments - Get comments
- GET /api/articles/trending - Trending
- GET /api/articles/search - Search

### Categories Endpoints (5)
- GET /api/categories - List
- GET /api/categories/:id - Get single
- POST /api/categories - Create
- PUT /api/categories/:id - Update
- DELETE /api/categories/:id - Delete

### Comments Endpoints (5)
- GET /api/comments - List
- POST /api/comments - Create
- PUT /api/comments/:id - Update
- DELETE /api/comments/:id - Delete
- POST /api/comments/:id/approve - Approve

### Users Endpoints (6)
- GET /api/users - List (admin only)
- GET /api/users/:id - Get single
- PUT /api/users/:id - Update profile
- DELETE /api/users/:id - Delete
- POST /api/users/:id/roles - Assign role
- GET /api/users/:id/articles - User articles

### Admin Endpoints (8)
- GET /api/admin/users - All users (admin)
- GET /api/admin/articles - All articles (admin)
- GET /api/admin/approvals - Pending approvals
- POST /api/admin/roles - Create role
- GET /api/admin/settings - Get settings
- PUT /api/admin/settings - Update settings
- GET /api/admin/analytics - Analytics data
- GET /api/admin/logs - Audit logs

---

## ✅ TESTING CHECKLIST

- [ ] Register endpoint working
- [ ] Login endpoint working
- [ ] Token generation correct
- [ ] Token refresh working
- [ ] JWT validation working
- [ ] Password hashing secure
- [ ] Permission middleware active
- [ ] All 40+ endpoints documented
- [ ] Error responses consistent
- [ ] Rate limiting configured

---

## 🎯 SUCCESS CRITERIA

✅ JWT authentication fully functional  
✅ User registration working  
✅ Login with token generation  
✅ Token refresh mechanism  
✅ All 40+ API endpoints  
✅ Permission-based access control  
✅ Error handling comprehensive  
✅ API documentation complete

---

**Team B Day 3 - JWT & Endpoints Ready! 🚀**

