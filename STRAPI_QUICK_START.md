# ⚡ STRAPI CMS - QUICK START GUIDE

**Status:** ✅ **READY FOR INTEGRATION**  
**Instance:** https://strapi.opusinfiniti.com  
**Admin Email:** reachus@opusinfiniti.com  

---

## 🚀 5-MINUTE SETUP

### Step 1: Access Admin Panel
```
URL: https://strapi.opusinfiniti.com/admin
Email: reachus@opusinfiniti.com
Password: [Provided]
```

### Step 2: Change Password
1. Login with provided credentials
2. Click User Profile (top right)
3. Select Settings
4. Change Password
5. Save Changes

### Step 3: Generate API Token
1. Navigate to **Settings** → **API Tokens**
2. Click **Create new API token**
3. Fill in details:
   - **Name:** NewsKarnataka Backend
   - **Duration:** 90 days
   - **Type:** Full access
4. Copy token and save securely

### Step 4: Test API Connection
```bash
curl -X GET https://strapi.opusinfiniti.com/api/articles \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Step 5: Configure CORS
1. Settings → Providers → CORS
2. Add allowed origins:
   - http://localhost:3000
   - http://localhost:3001
   - https://newskarnataka.com (production)

---

## 📋 ESSENTIAL ENDPOINTS

### REST API Base
```
https://strapi.opusinfiniti.com/api
```

### Key Endpoints
```
GET     /api/articles              # List all articles
POST    /api/articles              # Create article
GET     /api/articles/:id          # Get single article
PUT     /api/articles/:id          # Update article
DELETE  /api/articles/:id          # Delete article

GET     /api/users                 # List users
GET     /api/categories            # List categories
GET     /api/media                 # List media files
GET     /api/comments              # List comments
```

### GraphQL Endpoint
```
https://strapi.opusinfiniti.com/graphql
```

---

## 🔐 AUTHENTICATION

### Bearer Token Format
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Request Example
```bash
curl -X GET https://strapi.opusinfiniti.com/api/articles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

### Node.js Example
```javascript
const axios = require('axios');

const strapi = axios.create({
  baseURL: 'https://strapi.opusinfiniti.com/api',
  headers: {
    Authorization: `Bearer ${process.env.STRAPI_TOKEN}`
  }
});

// Fetch articles
strapi.get('/articles').then(res => console.log(res.data));
```

---

## 📊 CONTENT TYPES TO CREATE

### Priority Order

1. **USERS** (Foundation)
   - Store user profiles
   - User authentication data
   - Admin flags

2. **CATEGORIES** (Foundation)
   - Article categories
   - Navigation structure

3. **ARTICLES** (Core)
   - Main content collection
   - Relations to users & categories

4. **COMMENTS** (Secondary)
   - User comments on articles

5. **MEDIA** (Support)
   - Images & attachments

6. **WORKFLOWS** (Advanced)
   - Approval workflows
   - State management

---

## ⚙️ CONFIGURATION CHECKLIST

### Phase 1: Security (Day 1)
- [ ] Change default password
- [ ] Enable 2FA if available
- [ ] Generate API tokens
- [ ] Configure CORS
- [ ] Setup rate limiting

### Phase 2: Database (Day 1-2)
- [ ] Verify PostgreSQL connection
- [ ] Check all 32 tables exist
- [ ] Confirm all columns present
- [ ] Verify indexes created
- [ ] Test relationships

### Phase 3: Content Types (Day 3-4)
- [ ] Create USERS collection
- [ ] Create ARTICLES collection
- [ ] Create CATEGORIES collection
- [ ] Create MEDIA collection
- [ ] Create COMMENTS collection

### Phase 4: API (Day 5-7)
- [ ] Generate API tokens
- [ ] Test REST endpoints
- [ ] Test GraphQL queries
- [ ] Configure authentication
- [ ] Setup pagination

### Phase 5: Integration (Day 8+)
- [ ] Frontend API client setup
- [ ] Environment configuration
- [ ] Error handling
- [ ] Caching strategy
- [ ] Performance optimization

---

## 🔍 VERIFICATION QUERIES

### Check Articles (REST)
```bash
curl -X GET "https://strapi.opusinfiniti.com/api/articles?pagination[limit]=5" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Check Users (REST)
```bash
curl -X GET "https://strapi.opusinfiniti.com/api/users" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### List Collections (GraphQL)
```graphql
query {
  articles {
    data {
      id
      attributes {
        title
        slug
      }
    }
  }
}
```

---

## 🛠️ COMMON TASKS

### Create Article (REST)
```bash
curl -X POST https://strapi.opusinfiniti.com/api/articles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "data": {
      "title": "Breaking News",
      "slug": "breaking-news",
      "content": "Article content here...",
      "status": "published",
      "language_code": "en"
    }
  }'
```

### Update Article (REST)
```bash
curl -X PUT https://strapi.opusinfiniti.com/api/articles/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "data": {
      "title": "Updated Title"
    }
  }'
```

### Delete Article (REST)
```bash
curl -X DELETE https://strapi.opusinfiniti.com/api/articles/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📱 FRONTEND INTEGRATION

### Install Dependencies
```bash
npm install axios @apollo/client graphql
```

### Setup API Client
```javascript
// utils/strapiClient.js
import axios from 'axios';

const strapiClient = axios.create({
  baseURL: process.env.REACT_APP_STRAPI_URL + '/api',
  headers: {
    'Authorization': `Bearer ${process.env.REACT_APP_STRAPI_TOKEN}`
  }
});

export default strapiClient;
```

### Fetch Articles Component
```javascript
// components/ArticleList.jsx
import { useEffect, useState } from 'react';
import strapiClient from '../utils/strapiClient';

export default function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    strapiClient
      .get('/articles?sort[0]=published_at:desc')
      .then(res => setArticles(res.data.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {articles.map(article => (
        <article key={article.id}>
          <h2>{article.attributes.title}</h2>
          <p>{article.attributes.excerpt}</p>
        </article>
      ))}
    </div>
  );
}
```

---

## 🚨 TROUBLESHOOTING

### Connection Refused
- [ ] Check Strapi URL is correct
- [ ] Verify internet connection
- [ ] Check firewall rules
- [ ] Confirm Strapi is running

### Authentication Failed
- [ ] Verify API token
- [ ] Check token expiration
- [ ] Confirm Authorization header format
- [ ] Regenerate token if needed

### CORS Error
- [ ] Add origin to CORS allowlist
- [ ] Check headers in request
- [ ] Clear browser cache
- [ ] Test with curl first

### Slow Performance
- [ ] Enable caching
- [ ] Optimize queries (use fields parameter)
- [ ] Add pagination
- [ ] Check database indexes
- [ ] Monitor server resources

---

## 📚 HELPFUL LINKS

### Strapi Docs
- **Getting Started:** https://docs.strapi.io
- **API Reference:** https://docs.strapi.io/developer-docs
- **REST Guide:** https://docs.strapi.io/developer-docs/latest/development/requests

### Your Instance
- **Admin Panel:** https://strapi.opusinfiniti.com/admin
- **API Base:** https://strapi.opusinfiniti.com/api
- **GraphQL:** https://strapi.opusinfiniti.com/graphql

---

## ✅ QUICK CHECKLIST

- [ ] Admin access verified
- [ ] Password changed
- [ ] API token generated
- [ ] CORS configured
- [ ] Connection tested
- [ ] Ready for integration

---

## 🎯 NEXT IMMEDIATE STEPS

1. **Today:** Access admin panel and change password
2. **Today:** Generate first API token
3. **Tomorrow:** Create content types
4. **Tomorrow:** Setup frontend client
5. **This Week:** Begin API integration

---

**Status:** ✅ Ready for Strapi integration  
**Next:** Begin Phase 1 content type configuration

