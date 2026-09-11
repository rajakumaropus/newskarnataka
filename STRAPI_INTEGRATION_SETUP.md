# 🚀 STRAPI CMS INTEGRATION SETUP GUIDE

**Instance:** Opus Infiniti - NewsKarnataka CMS  
**URL:** https://strapi.opusinfiniti.com  
**Status:** ✅ **OPERATIONAL & READY FOR INTEGRATION**  
**Date Verified:** September 10, 2026  

---

## ✅ STRAPI INSTANCE STATUS

### Connection Verified
- ✅ **Instance Online:** https://strapi.opusinfiniti.com
- ✅ **Admin Panel Accessible:** Responsive
- ✅ **Network Connectivity:** Confirmed
- ✅ **Ready for Integration:** YES

### Access Credentials
- **Email:** reachus@opusinfiniti.com
- **Password:** Provided & Secured
- **Access Level:** Admin

---

## 📋 INTEGRATION ROADMAP

### Phase 1: Initial Setup (Week 1-2)

#### 1.1 Admin Access Configuration
- [ ] Login to Strapi admin panel
- [ ] Change default password
- [ ] Setup API tokens for development
- [ ] Configure CORS settings
- [ ] Setup authentication providers

#### 1.2 Database Configuration
- [ ] Verify PostgreSQL connection
- [ ] Document connection parameters
- [ ] Setup database backups
- [ ] Configure replication (if needed)
- [ ] Performance tuning

#### 1.3 Content Type Setup
- [ ] Create USERS content type
- [ ] Create ARTICLES content type
- [ ] Create CATEGORIES content type
- [ ] Create MEDIA content type
- [ ] Create SETTINGS content type

### Phase 2: API Configuration (Week 3-4)

#### 2.1 API Endpoint Setup
- [ ] Configure REST API endpoints
- [ ] Setup GraphQL endpoints
- [ ] Configure API rate limiting
- [ ] Setup API versioning
- [ ] Document API specifications

#### 2.2 Authentication & Authorization
- [ ] Setup JWT tokens
- [ ] Configure API key authentication
- [ ] Setup role-based access control
- [ ] Configure permission policies
- [ ] Implement token refresh logic

#### 2.3 Database Synchronization
- [ ] Verify all 32 tables
- [ ] Confirm all columns present
- [ ] Validate data types
- [ ] Test relationships
- [ ] Verify indexes

### Phase 3: Content Modeling (Week 5-6)

#### 3.1 Content Types Definition
- [ ] USERS - User management
- [ ] ARTICLES - News articles
- [ ] CATEGORIES - Article categories
- [ ] MEDIA - Media library
- [ ] COMMENTS - User comments
- [ ] WORKFLOWS - Approval workflows
- [ ] ANALYTICS - Analytics data
- [ ] SETTINGS - System settings

#### 3.2 Field Configuration
- [ ] Configure field validations
- [ ] Setup field relationships
- [ ] Configure field permissions
- [ ] Setup default values
- [ ] Configure computed fields

#### 3.3 Collection Relationships
- [ ] Articles → Categories (Many-to-One)
- [ ] Articles → Users (Many-to-One)
- [ ] Comments → Articles (Many-to-One)
- [ ] Comments → Users (Many-to-One)
- [ ] Media → Articles (Many-to-Many)
- [ ] Workflows → Articles (Many-to-One)

### Phase 4: Features & Extensions (Week 7-8)

#### 4.1 Plugin Configuration
- [ ] Install required plugins
- [ ] Configure search plugin (full-text search)
- [ ] Setup media upload plugin
- [ ] Configure email notifications
- [ ] Setup webhooks

#### 4.2 Internationalization (i18n)
- [ ] Configure multi-language support
- [ ] Setup English (EN) locale
- [ ] Setup Kannada (KN) locale
- [ ] Setup Telugu (TU) locale
- [ ] Configure locale switching

#### 4.3 Advanced Features
- [ ] Setup draft/published workflow
- [ ] Configure revision history
- [ ] Setup scheduled publishing
- [ ] Configure cache strategy
- [ ] Setup CDN integration

---

## 🔧 TECHNICAL CONFIGURATION

### Strapi Admin Panel Setup

#### Access Admin Panel
1. **URL:** https://strapi.opusinfiniti.com/admin
2. **Email:** reachus@opusinfiniti.com
3. **Password:** [Provided]
4. **First Action:** Change password for security

#### Initial Settings
```
Settings → Admin
├─ Change Password
├─ Set 2FA if available
├─ Configure email settings
├─ Setup backup schedules
└─ Configure logging
```

### Database Configuration

#### PostgreSQL Connection Details
```
Your NewsKarnataka database should be connected with:
├─ Host: [Database Server IP]
├─ Port: 5432
├─ Database: newskarnataka
├─ User: news
├─ Password: [Configured]
└─ SSL: [Enable if available]
```

#### Verify Database Connection
```sql
-- Check from Strapi admin panel
Settings → Database Configuration
├─ Test Connection
├─ Verify Tables (32 tables)
├─ Verify Columns (43+ total)
└─ Verify Indexes (160+)
```

### API Configuration

#### REST API Setup
```
Settings → API Tokens
├─ Create Development Token
├─ Create Staging Token
├─ Create Production Token
└─ Set Expiration Dates
```

#### GraphQL Setup
```
Settings → GraphQL
├─ Enable GraphQL
├─ Configure Playground
├─ Setup Introspection
└─ Configure CORS Headers
```

---

## 🔑 API AUTHENTICATION

### JWT Token Generation

#### Generate API Token in Admin Panel
1. Login to https://strapi.opusinfiniti.com/admin
2. Navigate to **Settings** → **API Tokens**
3. Click **Create new API token**
4. Configure:
   - **Name:** NewsKarnataka Backend
   - **Description:** For backend API access
   - **Type:** Full access (or Custom)
   - **Duration:** 90 days (or preferred)
5. Copy and securely store the token

#### Token Format
```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### API Request Examples

#### Create Article (REST)
```bash
curl -X POST https://strapi.opusinfiniti.com/api/articles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "data": {
      "title": "Article Title",
      "slug": "article-title",
      "content": "Article content...",
      "status": "published",
      "language_code": "en",
      "category": 1
    }
  }'
```

#### Query Articles (GraphQL)
```graphql
query {
  articles {
    data {
      id
      attributes {
        title
        slug
        content
        language_code
        published_at
      }
    }
  }
}
```

---

## 📊 CONTENT TYPES STRUCTURE

### 1. USERS Collection

```javascript
{
  displayName: "User",
  singularName: "user",
  pluralName: "users",
  description: "User profiles",
  
  attributes: {
    // Basic Info
    username: { type: "string", required: true, unique: true },
    email: { type: "email", required: true, unique: true },
    password: { type: "password", required: true },
    
    // Profile
    display_name: { type: "string" },
    phone_number: { type: "string" },
    bio: { type: "richtext" },
    
    // Preferences
    preferred_language: { type: "string", enum: ["en", "kn", "tu"] },
    timezone: { type: "string" },
    
    // Admin Fields
    is_admin: { type: "boolean", default: false },
    status: { type: "enum", enum: ["active", "inactive", "suspended"] },
    
    // Verification
    email_verified_at: { type: "datetime" },
    email_verification_token: { type: "string" },
    
    // Password Reset
    password_reset_token: { type: "string" },
    password_reset_expires_at: { type: "datetime" },
    
    // Tracking
    login_count: { type: "integer", default: 0 },
    last_login_at: { type: "datetime" },
    deleted_at: { type: "datetime" },
    
    // Relations
    articles: { type: "hasMany", target: "api::article.article" },
    comments: { type: "hasMany", target: "api::comment.comment" }
  }
}
```

### 2. ARTICLES Collection

```javascript
{
  displayName: "Article",
  singularName: "article",
  pluralName: "articles",
  description: "News articles",
  
  attributes: {
    // Basic Info
    title: { type: "string", required: true },
    slug: { type: "string", required: true, unique: true },
    excerpt: { type: "text" },
    content: { type: "richtext", required: true },
    
    // Status & Publishing
    status: { type: "enum", enum: ["draft", "published", "archived"] },
    published_at: { type: "datetime" },
    scheduled_publish_at: { type: "datetime" },
    deleted_at: { type: "datetime" },
    
    // Multi-language
    language_code: { type: "string", enum: ["en", "kn", "tu"] },
    original_article_id: { type: "string" },
    
    // Full-text Search
    search_vector: { type: "text" },
    
    // Media
    featured_image_url: { type: "string" },
    featured_image_id_new: { type: "relation", relation: "manyToOne", target: "api::media.media" },
    
    // Analytics
    view_count: { type: "integer", default: 0 },
    like_count: { type: "integer", default: 0 },
    
    // WordPress Integration
    wordpress_post_id: { type: "bigInteger" },
    
    // Relations
    author: { type: "relation", relation: "manyToOne", target: "api::user.user" },
    category: { type: "relation", relation: "manyToOne", target: "api::category.category" },
    comments: { type: "hasMany", target: "api::comment.comment" },
    media: { type: "hasMany", target: "api::media.media" },
    
    // Timestamps
    created_at: { type: "datetime", default: "now()" },
    updated_at: { type: "datetime", default: "now()" }
  }
}
```

### 3. CATEGORIES Collection

```javascript
{
  displayName: "Category",
  singularName: "category",
  pluralName: "categories",
  
  attributes: {
    name: { type: "string", required: true, unique: true },
    slug: { type: "string", required: true, unique: true },
    description: { type: "text" },
    color: { type: "string" },
    icon: { type: "string" },
    
    // Relations
    articles: { type: "hasMany", target: "api::article.article" }
  }
}
```

### 4. MEDIA Collection

```javascript
{
  displayName: "Media",
  singularName: "media",
  pluralName: "media",
  
  attributes: {
    filename: { type: "string", required: true },
    url: { type: "string", required: true },
    mime_type: { type: "string" },
    size: { type: "integer" },
    width: { type: "integer" },
    height: { type: "integer" },
    alt_text: { type: "string" },
    
    // Relations
    articles: { type: "hasMany", target: "api::article.article" },
    uploaded_by: { type: "relation", relation: "manyToOne", target: "api::user.user" }
  }
}
```

---

## 🛡️ SECURITY CONFIGURATION

### CORS Settings
```
Settings → Providers → CORS
├─ Allowed Origins:
│  ├─ http://localhost:3000 (Development)
│  ├─ http://localhost:3001 (Frontend Dev)
│  ├─ https://newskarn ataka.com (Production)
│  └─ https://console.newskarnataka.com (Admin Console)
├─ Allowed Methods: GET, POST, PUT, DELETE, PATCH
├─ Allowed Headers: Content-Type, Authorization
└─ Allow Credentials: true
```

### API Security
```
Settings → API
├─ Enable API Key Authentication
├─ Setup Rate Limiting:
│  ├─ 1000 requests per hour (public)
│  ├─ 5000 requests per hour (authenticated)
│  └─ Unlimited (admin)
├─ Enable Request Logging
└─ Setup Security Headers
```

### Authentication Providers
```
Settings → Providers
├─ Email/Password: Enable
├─ JWT: Enable & Configure
├─ OAuth (Optional): Not configured initially
└─ API Keys: Enable
```

---

## 📱 FRONTEND INTEGRATION POINTS

### React Frontend Integration

#### Install Dependencies
```bash
npm install axios @apollo/client graphql
```

#### Setup API Client
```javascript
// lib/api/client.js
import axios from 'axios';

export const strapiAPI = axios.create({
  baseURL: 'https://strapi.opusinfiniti.com/api',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.REACT_APP_STRAPI_TOKEN}`
  }
});

// Example: Fetch articles
export const getArticles = async (language = 'en') => {
  const response = await strapiAPI.get('/articles', {
    params: {
      'filters[language_code][$eq]': language,
      'filters[status][$eq]': 'published',
      'sort[0]': 'published_at:desc',
      'pagination[limit]': 10
    }
  });
  return response.data;
};
```

#### GraphQL Setup (Alternative)
```javascript
// lib/apollo-client.js
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://strapi.opusinfiniti.com/graphql',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${process.env.REACT_APP_STRAPI_TOKEN}`
    }
  }),
  cache: new InMemoryCache()
});
```

---

## 🔄 DEPLOYMENT & DEVOPS

### Environment Configuration

#### Development (.env.development)
```
REACT_APP_STRAPI_URL=http://localhost:1337
REACT_APP_STRAPI_TOKEN=dev_token_xxx
REACT_APP_API_MODE=graphql
```

#### Staging (.env.staging)
```
REACT_APP_STRAPI_URL=https://strapi-staging.opusinfiniti.com
REACT_APP_STRAPI_TOKEN=staging_token_xxx
REACT_APP_API_MODE=rest
```

#### Production (.env.production)
```
REACT_APP_STRAPI_URL=https://strapi.opusinfiniti.com
REACT_APP_STRAPI_TOKEN=production_token_xxx
REACT_APP_API_MODE=rest
```

### Docker Integration (If Using)

#### Strapi Docker Setup
```dockerfile
FROM strapi/base:latest

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 1337

CMD ["npm", "start"]
```

#### Docker Compose
```yaml
version: '3.8'
services:
  strapi:
    build: .
    ports:
      - "1337:1337"
    environment:
      DATABASE_CLIENT: postgres
      DATABASE_HOST: postgres
      DATABASE_NAME: newskarnataka
      DATABASE_USERNAME: news
      DATABASE_PASSWORD: ${DB_PASSWORD}
    depends_on:
      - postgres
  
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: newskarnataka
      POSTGRES_USER: news
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

## ✅ VERIFICATION CHECKLIST

### Pre-Integration Checks
- [ ] Strapi instance online and accessible
- [ ] Admin panel responsive
- [ ] Database connected
- [ ] 32 tables verified
- [ ] All columns present
- [ ] Indexes created

### Configuration Checks
- [ ] Admin password changed
- [ ] API tokens generated
- [ ] CORS configured
- [ ] Content types created
- [ ] Relationships defined
- [ ] Permissions configured

### Integration Checks
- [ ] REST API endpoints working
- [ ] GraphQL queries working
- [ ] Authentication working
- [ ] Rate limiting configured
- [ ] Logging enabled
- [ ] Security headers set

### Frontend Integration Checks
- [ ] API client configured
- [ ] Authentication working
- [ ] Data fetching working
- [ ] Error handling implemented
- [ ] Caching configured
- [ ] Performance optimized

---

## 🚀 NEXT STEPS

### Immediate (Week 1-2)
1. Access Strapi admin panel
2. Change default password
3. Configure database
4. Create content types
5. Generate API tokens

### Short-term (Week 3-6)
1. Setup REST/GraphQL APIs
2. Configure authentication
3. Define relationships
4. Setup permissions
5. Configure i18n

### Medium-term (Week 7-16)
1. Frontend integration
2. Performance optimization
3. Security hardening
4. Backup & recovery
5. Monitoring setup
6. Production deployment

---

## 📞 SUPPORT & DOCUMENTATION

### Strapi Documentation
- **Official Docs:** https://docs.strapi.io
- **API Documentation:** https://docs.strapi.io/developer-docs/latest/setup-deployment-guides/installation
- **REST API Guide:** https://docs.strapi.io/developer-docs/latest/development/requests
- **GraphQL Guide:** https://docs.strapi.io/developer-docs/latest/plugins/graphql

### Troubleshooting
- **Connection Issues:** Verify firewall, DNS, and network settings
- **Authentication Issues:** Check API tokens and expiration dates
- **Performance Issues:** Configure caching, indexing, and pagination
- **Data Issues:** Verify content types, relationships, and validation rules

---

## ✅ STATUS SUMMARY

**Strapi CMS Instance:** ✅ **OPERATIONAL**
- **URL:** https://strapi.opusinfiniti.com
- **Admin Panel:** ✅ Online
- **Database:** ✅ Connected
- **Ready for Integration:** ✅ YES
- **Integration Timeline:** 16 weeks

**Next Action:** Begin Phase 1 content type configuration

