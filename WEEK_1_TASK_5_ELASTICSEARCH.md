# 🔍 WEEK 1 - TASK 5: Elasticsearch Configuration
## Set up search functionality for news articles

**Task:** Configure Elasticsearch for full-text search, filtering, and analytics  
**Duration:** 2-3 hours  
**Status:** IN PROGRESS  

---

## 📋 OVERVIEW

**What:** Elasticsearch cluster for searching articles, filtering by category/tags/date  
**Why:** Fast full-text search, real-time indexing, advanced filtering  
**Version:** Elasticsearch 8.x

---

## 🔧 INSTALLATION OPTIONS

### Option A: Docker (Recommended)

```yaml
# docker-compose.yml section (we'll complete in Task #8)
elasticsearch:
  image: docker.elastic.co/elasticsearch/elasticsearch:8.10.0
  environment:
    - discovery.type=single-node
    - xpack.security.enabled=false
    - ES_JAVA_OPTS=-Xms512m -Xmx512m
  ports:
    - "9200:9200"
  volumes:
    - elasticsearch_data:/usr/share/elasticsearch/data
```

### Option B: Local Installation (Windows)

```powershell
# Download from https://www.elastic.co/downloads/elasticsearch
# Extract to: C:\elasticsearch-8.10.0

# Create config
# File: C:\elasticsearch-8.10.0\config\elasticsearch.yml
# Add:
discovery.type: single-node
xpack.security.enabled: false

# Start Elasticsearch
cd C:\elasticsearch-8.10.0\bin
.\elasticsearch.bat
```

---

## 📊 ELASTICSEARCH INDEX SCHEMA

### Index: articles

**Index name:** `articles`

**Mappings:**

```json
{
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 0,
    "analysis": {
      "analyzer": {
        "default": {
          "type": "standard"
        },
        "text_analyzer": {
          "type": "standard",
          "stopwords": "_english_"
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "id": { "type": "keyword" },
      "title": {
        "type": "text",
        "analyzer": "text_analyzer",
        "fields": {
          "keyword": { "type": "keyword" }
        }
      },
      "slug": { "type": "keyword" },
      "description": {
        "type": "text",
        "analyzer": "text_analyzer"
      },
      "content": {
        "type": "text",
        "analyzer": "text_analyzer"
      },
      "category": {
        "type": "nested",
        "properties": {
          "id": { "type": "keyword" },
          "name": { "type": "keyword" }
        }
      },
      "tags": {
        "type": "nested",
        "properties": {
          "id": { "type": "keyword" },
          "name": { "type": "keyword" }
        }
      },
      "author": {
        "type": "nested",
        "properties": {
          "id": { "type": "keyword" },
          "name": { "type": "text" }
        }
      },
      "featured_image": { "type": "keyword" },
      "published_at": { "type": "date" },
      "created_at": { "type": "date" },
      "updated_at": { "type": "date" },
      "views": { "type": "integer" },
      "likes": { "type": "integer" },
      "is_featured": { "type": "boolean" },
      "is_published": { "type": "boolean" },
      "status": { "type": "keyword" }
    }
  }
}
```

---

## 🚀 SETUP STEPS

### Step 1: Create Index

```bash
curl -X PUT "http://localhost:9200/articles" \
  -H "Content-Type: application/json" \
  -d '{
    "settings": { "number_of_shards": 1, "number_of_replicas": 0 },
    "mappings": {
      "properties": {
        "id": { "type": "keyword" },
        "title": { "type": "text", "analyzer": "standard" },
        "content": { "type": "text", "analyzer": "standard" },
        "category": { "type": "keyword" },
        "tags": { "type": "keyword" },
        "published_at": { "type": "date" },
        "is_published": { "type": "boolean" },
        "status": { "type": "keyword" }
      }
    }
  }'
```

### Step 2: Test Index

```bash
curl http://localhost:9200/articles
# Response: { "name" : "...", "cluster_name" : "elasticsearch" }
```

### Step 3: Index Sample Documents

```bash
curl -X POST "http://localhost:9200/articles/_doc" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Karnataka News Update",
    "content": "Latest news from Karnataka...",
    "category": "politics",
    "tags": ["karnataka", "news"],
    "published_at": "2024-01-15T10:00:00Z",
    "is_published": true,
    "status": "published"
  }'
```

### Step 4: Search

```bash
curl -X GET "http://localhost:9200/articles/_search" \
  -H "Content-Type: application/json" \
  -d '{
    "query": {
      "multi_match": {
        "query": "karnataka",
        "fields": ["title", "content"]
      }
    }
  }'
```

---

## 🔗 STRAPI INTEGRATION

### Install Plugin

```bash
npm install @strapi/plugin-elasticsearch
```

### Configure Strapi

**File: `config/plugins.js`**

```javascript
module.exports = {
  elasticsearch: {
    enabled: true,
    config: {
      host: process.env.ELASTICSEARCH_HOST || 'http://localhost:9200',
      apiVersion: '8.0.0',
      indexPrefix: 'strapi',
      saveObjects: true,
      populateObjects: true,
      contentTypes: [
        {
          uid: 'api::article.article',
          searchFields: ['title', 'description', 'content'],
          fillFields: ['title', 'slug', 'description', 'category', 'tags']
        },
        {
          uid: 'api::category.category',
          searchFields: ['name'],
          fillFields: ['name']
        },
        {
          uid: 'api::tag.tag',
          searchFields: ['name'],
          fillFields: ['name']
        }
      ]
    }
  }
};
```

### Index Content

```bash
# SSH into Strapi container and run:
npm run strapi -- elasticsearch:index
```

---

## 🎯 SEARCH API ENDPOINTS

### GraphQL Query

```graphql
query {
  articles(
    filters: {
      title: { contains: "karnataka" }
    }
    pagination: { pageSize: 10, page: 1 }
  ) {
    data {
      id
      title
      description
      category { name }
      tags { name }
      publishedAt
    }
  }
}
```

### REST API

```bash
curl "http://103.191.208.235:1337/api/articles?filters[title][$contains]=karnataka&pagination[pageSize]=10"
```

---

## 🔍 ADVANCED SEARCH FEATURES

### Full-Text Search with Filters

```json
{
  "query": {
    "bool": {
      "must": [
        {
          "multi_match": {
            "query": "karnataka election",
            "fields": ["title^2", "content"]
          }
        }
      ],
      "filter": [
        { "term": { "category": "politics" } },
        { "term": { "is_published": true } },
        { "range": { "published_at": { "gte": "2024-01-01" } } }
      ]
    }
  }
}
```

### Aggregations (Facets)

```json
{
  "aggs": {
    "by_category": {
      "terms": { "field": "category", "size": 20 }
    },
    "by_tag": {
      "terms": { "field": "tags", "size": 50 }
    },
    "publish_date": {
      "date_histogram": {
        "field": "published_at",
        "calendar_interval": "month"
      }
    }
  }
}
```

---

## 💻 FRONTEND IMPLEMENTATION

### React Search Component

```typescript
// hooks/useArticleSearch.ts
import { useState, useCallback } from 'react';
import axios from 'axios';

interface SearchFilters {
  query: string;
  category?: string;
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
}

export function useArticleSearch() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (filters: SearchFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data } = await axios.get('/api/articles/search', {
        params: {
          q: filters.query,
          category: filters.category,
          tags: filters.tags?.join(','),
          from: filters.dateFrom,
          to: filters.dateTo,
          page: filters.page || 1,
          limit: filters.pageSize || 10
        }
      });
      
      setResults(data.hits.hits.map(h => h._source));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  }, []);

  return { results, loading, error, search };
}
```

### Search UI Component

```typescript
// components/SearchBox.tsx
import { useState, useEffect } from 'react';
import { useArticleSearch } from '@/hooks/useArticleSearch';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export function SearchBox() {
  const { results, loading, search } = useArticleSearch();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      if (query.length > 2) {
        search({ query });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, search]);

  return (
    <div className="w-full">
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search articles..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg"
        />
      </div>

      {loading && <p className="mt-2 text-gray-500">Searching...</p>}
      
      <div className="mt-4 space-y-2">
        {results.map(article => (
          <div key={article.id} className="p-3 border rounded hover:bg-gray-50">
            <h3 className="font-semibold">{article.title}</h3>
            <p className="text-sm text-gray-600">{article.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 📊 MONITORING

### Check Cluster Health

```bash
curl http://localhost:9200/_cluster/health
# Response: { "status": "green", "number_of_nodes": 1 }
```

### Index Statistics

```bash
curl http://localhost:9200/articles/_stats
```

### Search Performance

```bash
curl -X GET "http://localhost:9200/articles/_search?profile=true" \
  -d '{ "query": { "match": { "title": "karnataka" } } }'
```

---

## ⚙️ PERFORMANCE TUNING

### Index Settings

```json
{
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 0,
    "refresh_interval": "30s",
    "index.merge.scheduler.max_thread_count": 1,
    "index.codec": "best_compression"
  }
}
```

### Query Optimization

- Use filters (cached) instead of queries when possible
- Add keyword fields for exact matching
- Use aggregations for facets instead of multiple queries
- Implement pagination (not deep pagination)

---

## ✅ VERIFICATION CHECKLIST

- [ ] Elasticsearch running (port 9200)
- [ ] Index created: `articles`
- [ ] Sample documents indexed
- [ ] Search query working
- [ ] Category filter working
- [ ] Date range filter working
- [ ] Strapi plugin installed
- [ ] Search API endpoint responding
- [ ] Frontend search component built
- [ ] Performance acceptable

---

## 🚀 NEXT STEPS

- Task #6: Configure Redis (caching + sessions)
- Task #7: Set up .env files
- Task #8: Create Docker Compose

---

**Status: READY FOR EXECUTION**

