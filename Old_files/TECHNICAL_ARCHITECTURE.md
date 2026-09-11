# Technical Architecture & Implementation Guide

**Project:** AI-Enabled Multilingual News Platform  
**Version:** 2.0 Technical Specification  
**Date:** September 2026

---

## Table of Contents
1. [System Architecture Overview](#system-architecture-overview)
2. [Phase 1: Customer App Architecture](#phase-1-customer-app-architecture)
3. [Phase 2: AI Console Architecture](#phase-2-ai-console-architecture)
4. [Data Models & Schemas](#data-models--schemas)
5. [API Specifications](#api-specifications)
6. [Database Design](#database-design)
7. [ML Pipeline](#ml-pipeline)
8. [Deployment & DevOps](#deployment--devops)

---

## System Architecture Overview

### High-Level Component Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     PHASE 1: CUSTOMER APP                       │
├─────────────────────────────────────────────────────────────────┤
│
│  ┌──────────────────┐    ┌──────────────────┐    ┌───────────┐
│  │ Mobile Frontend  │    │  Web Frontend    │    │ Admin Web │
│  │ (Flutter)        │───►│  (React SPA)     │    │ (React)   │
│  │                  │    │                  │    │           │
│  │ iOS/Android      │    │ Progressive      │    │ Manage    │
│  │                  │    │ Web App          │    │ Users     │
│  └─────────┬────────┘    └────────┬─────────┘    └─────┬─────┘
│            │                      │                    │
│            └──────────┬───────────┴────────────────────┘
│                       │
│            ┌──────────▼──────────────┐
│            │   API Gateway (GraphQL) │
│            │   Load Balancer         │
│            │   Rate Limiting         │
│            └──────────┬──────────────┘
│                       │
│    ┌──────────────────┼──────────────────┐
│    │                  │                  │
│ ┌──▼────────┐  ┌──────▼──────┐  ┌─────▼──────┐
│ │   Feed    │  │ Engagement  │  │  Analytics │
│ │ Service   │  │  Service    │  │  Service   │
│ │           │  │             │  │            │
│ │ • Sort    │  │ • Like      │  │ • Track    │
│ │ • Filter  │  │ • Comment   │  │ • Aggr.   │
│ │ • Rank    │  │ • Share     │  │ • Report   │
│ └─────┬─────┘  └──────┬──────┘  └──────┬─────┘
│       │               │               │
│       └───────────────┼───────────────┘
│                       │
│    ┌──────────────────┼──────────────────┐
│    │                  │                  │
│ ┌──▼──────────┐  ┌──────▼────┐  ┌──────▼──────┐
│ │ PostgreSQL  │  │  Redis    │  │ Elasticsearch│
│ │ Primary DB  │  │  Cache    │  │  Search     │
│ │             │  │           │  │             │
│ │ • Stories   │  │ • Sessions│  │ • Full Text │
│ │ • Users     │  │ • Hot Data│  │ • Index     │
│ │ • Likes     │  │           │  │             │
│ └─────────────┘  └───────────┘  └─────────────┘
│
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                 PHASE 2: AI CONSOLE (EDITOR)                    │
├─────────────────────────────────────────────────────────────────┤
│
│  ┌──────────────────────────────────────┐
│  │   Content Sources                    │
│  │   ├─ WhatsApp Groups                │
│  │   ├─ Twitter Streams                │
│  │   ├─ Instagram Accounts             │
│  │   └─ RSS Feeds                      │
│  └───────────────┬──────────────────────┘
│                  │
│         ┌────────▼────────────┐
│         │  Content Ingestion  │
│         │  Service            │
│         │  (Apache Kafka)     │
│         └────────┬────────────┘
│                  │
│  ┌───────────────┼───────────────┐
│  │               │               │
│┌─▼──────┐  ┌───▼────┐  ┌──────▼───┐
││Cleaning │  │Duplicate│  │Enrichment│
││ & Parse │  │ Check   │  │ Engine   │
│└────┬────┘  └───┬────┘  └──────┬───┘
│     │           │              │
│     └───────────┼──────────────┘
│                 │
│      ┌──────────▼──────────┐
│      │ ML Validation       │
│      │ • Quality Score     │
│      │ • Credibility       │
│      │ • Category Predict  │
│      │ • Sentiment         │
│      └──────────┬──────────┘
│                 │
│      ┌──────────▼──────────┐
│      │ Priority Assignment │
│      │ (Color Codes)       │
│      └──────────┬──────────┘
│                 │
│      ┌──────────▼──────────┐
│      │  Editor Dashboard   │
│      │  (AI Console Web)   │
│      │  • Drag & Drop      │
│      │  • One-click Pub    │
│      │  • Analytics        │
│      └──────────┬──────────┘
│                 │
│  ┌──────────────┼─────────────┐
│  │              │             │
│┌─▼────┐  ┌────▼────┐  ┌─────▼──┐
││Publish│  │Analytics │  │Audit   │
││Service│  │DB        │  │Logs    │
│└───────┘  └──────────┘  └────────┘
│
└─────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Customer App Architecture

### 1.1 Frontend Architecture

#### Mobile (Flutter)

**Project Structure:**
```
flutter_app/
├── lib/
│   ├── main.dart                 # App entry
│   ├── config/
│   │   ├── routes.dart          # Navigation routes
│   │   ├── theme.dart           # UI theme
│   │   └── env.dart             # Environment config
│   ├── models/
│   │   ├── story.dart           # Story data model
│   │   ├── user.dart            # User profile
│   │   └── engagement.dart      # Like/Comment models
│   ├── screens/
│   │   ├── feed/
│   │   │   ├── feed_screen.dart
│   │   │   └── feed_bloc.dart
│   │   ├── story/
│   │   │   ├── story_detail_screen.dart
│   │   │   └── story_detail_bloc.dart
│   │   ├── profile/
│   │   │   └── profile_screen.dart
│   │   └── search/
│   │       └── search_screen.dart
│   ├── widgets/
│   │   ├── story_card.dart      # Reusable story component
│   │   ├── engagement_panel.dart # Like/comment UI
│   │   └── location_filter.dart  # Location selector
│   ├── services/
│   │   ├── api_service.dart     # HTTP client
│   │   ├── graphql_service.dart # GraphQL queries
│   │   ├── auth_service.dart    # Authentication
│   │   └── analytics_service.dart
│   ├── cubits/ or blocs/         # State management
│   │   ├── feed_cubit.dart
│   │   ├── user_cubit.dart
│   │   └── engagement_cubit.dart
│   └── utils/
│       ├── constants.dart
│       ├── extensions.dart
│       └── validators.dart
├── test/
├── pubspec.yaml
└── README.md
```

**Key Dependencies:**
```yaml
dependencies:
  flutter:
    sdk: flutter
  # State Management
  flutter_bloc: ^8.0.0
  # Networking
  http: ^0.13.0
  graphql: ^5.0.0
  # Local Storage
  hive: ^2.0.0
  # UI
  cached_network_image: ^3.0.0
  infinite_scroll_pagination: ^3.0.0
  # Analytics
  firebase_analytics: ^10.0.0
  # Location
  geolocator: ^9.0.0
```

#### Web Frontend (React/Next.js)

**Project Structure:**
```
web_app/
├── public/
├── src/
│   ├── index.tsx                # Entry point
│   ├── App.tsx                  # Root component
│   ├── components/
│   │   ├── FeedCard/            # Story display
│   │   ├── Comments/            # Comments section
│   │   ├── LocationFilter/      # Location selector
│   │   └── AnalyticsWidget/     # Engagement stats
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── StoryDetail.tsx
│   │   ├── Profile.tsx
│   │   └── Search.tsx
│   ├── hooks/
│   │   ├── useFeed.ts           # Feed data hook
│   │   ├── useEngagement.ts     # Like/comment hook
│   │   └── useUser.ts           # User auth hook
│   ├── services/
│   │   ├── api.ts               # API client
│   │   ├── graphql.ts           # GraphQL client
│   │   └── analytics.ts
│   ├── store/                   # Redux state
│   │   ├── reducers/
│   │   ├── actions/
│   │   └── selectors/
│   ├── styles/                  # Tailwind/CSS modules
│   └── types/
│       └── index.d.ts           # TypeScript definitions
├── next.config.js               # Next.js config
├── tsconfig.json
└── package.json
```

**Key Technologies:**
- Framework: Next.js 13+ (App Router)
- Styling: Tailwind CSS
- State: Redux Toolkit or Zustand
- GraphQL: Apollo Client
- UI Components: Material-UI or Shadcn/ui

### 1.2 Backend Services Architecture

#### Node.js/Express Service Layer

**Microservices:**

```
backend/
├── services/
│   ├── feed-service/            # Feed ranking & sorting
│   │   ├── index.js
│   │   ├── feedService.js
│   │   ├── rankingEngine.js    # ML-powered ranking
│   │   └── locationFilter.js
│   │
│   ├── story-service/           # Story management
│   │   ├── index.js
│   │   ├── storyController.js
│   │   ├── storyModel.js
│   │   └── cache.js
│   │
│   ├── engagement-service/      # Likes/Comments/Shares
│   │   ├── index.js
│   │   ├── engagementController.js
│   │   ├── likeService.js
│   │   ├── commentService.js
│   │   └── shareService.js
│   │
│   ├── user-service/            # User management
│   │   ├── index.js
│   │   ├── userController.js
│   │   ├── authService.js
│   │   └── prefService.js
│   │
│   └── analytics-service/       # Event tracking
│       ├── index.js
│       ├── eventLogger.js
│       └── metricsAggregator.js
│
├── middleware/
│   ├── auth.js                  # JWT validation
│   ├── rateLimit.js             # Rate limiting
│   ├── errorHandler.js
│   └── logger.js
│
├── config/
│   ├── database.js              # DB connections
│   ├── redis.js                 # Redis client
│   ├── env.js                   # Environment vars
│   └── constants.js
│
└── app.js                       # Express app setup
```

**Key Dependencies:**
```json
{
  "express": "^4.18.0",
  "graphql": "^16.0.0",
  "apollo-server-express": "^3.0.0",
  "pg": "^8.0.0",
  "redis": "^4.0.0",
  "elasticsearch": "^7.0.0",
  "jsonwebtoken": "^9.0.0",
  "bcryptjs": "^2.4.3",
  "joi": "^17.0.0",
  "pino": "^8.0.0"
}
```

### 1.3 GraphQL API Schema (Phase 1)

```graphql
# Feed
type Query {
  getFeed(
    location: Location!
    page: Int
    limit: Int
    category: Category
  ): FeedConnection!
  
  getStory(id: ID!): Story
  
  getTrending(
    location: Location!
    timeframe: TimeFrame
  ): [Story!]!
  
  searchStories(
    query: String!
    location: Location
    category: Category
  ): [Story!]!
  
  getUserProfile: User!
}

type Mutation {
  # Engagement
  likeStory(storyId: ID!): LikeResult!
  unlikeStory(storyId: ID!): Boolean!
  
  addComment(storyId: ID!, text: String!): Comment!
  replyToComment(commentId: ID!, text: String!): Comment!
  deleteComment(commentId: ID!): Boolean!
  
  shareStory(storyId: ID!): ShareResult!
  bookmarkStory(storyId: ID!): Boolean!
  unbookmarkStory(storyId: ID!): Boolean!
  
  # User
  updatePreferences(input: PreferenceInput!): User!
  updateLocation(location: Location!): User!
  setNotificationPreferences(input: NotifPrefInput!): User!
}

type Subscription {
  storyEngagementUpdated(storyId: ID!): EngagementUpdate!
  feedUpdated(location: Location!): Story!
}

# Types
type Story {
  id: ID!
  title: String!
  content: String!
  summary: String!
  source: String!
  primaryLocation: Location!
  secondaryLocations: [Location!]!
  category: Category!
  publishedAt: DateTime!
  updatedAt: DateTime!
  images: [Image!]!
  videos: [Video!]!
  isCritical: Boolean!
  isHot: Boolean!
  importance: Float!
  engagementMetrics: EngagementMetrics!
  comments(page: Int, limit: Int): CommentConnection!
  user: User
}

type User {
  id: ID!
  phoneNumber: String! (encrypted)
  primaryLocation: Location!
  languagePreference: Language!
  categoryPreferences: [Category!]!
  notificationSettings: NotificationSettings!
  savedStories: [Story!]!
  createdAt: DateTime!
  lastActive: DateTime!
}

type EngagementMetrics {
  viewCount: Int!
  likeCount: Int!
  commentCount: Int!
  shareCount: Int!
  userLiked: Boolean!
  userBookmarked: Boolean!
}

# Enums
enum Location {
  BANGALORE
  MYSORE
  MANGALORE
  KARNATAKA
  NATIONAL
  INTERNATIONAL
}

enum Category {
  POLITICS
  SPORTS
  TECHNOLOGY
  ENTERTAINMENT
  BUSINESS
  HEALTH
  EDUCATION
  LOCAL
  OTHER
}

enum Language {
  ENGLISH
  KANNADA
  TAMIL
  TELUGU
  HINDI
}
```

---

## Phase 2: AI Console Architecture

### 2.1 Content Ingestion Pipeline

#### Architecture

```
┌────────────────────┐
│ WhatsApp Business  │
│ API               │
└─────────┬──────────┘
          │
    ┌─────▼─────┐
    │  Kafka    │
    │  Topic    │ ← Twitter Stream
    │  Ingestion│ ← Instagram API
    └─────┬─────┘
          │
    ┌─────▼──────────────────┐
    │ Stream Processor       │
    │ (Kafka Streams/Flink)  │
    │                        │
    │ • Parse content        │
    │ • Extract entities     │
    │ • URL resolution       │
    │ • Image/video handling │
    └─────┬──────────────────┘
          │
    ┌─────▼──────────────────┐
    │ Deduplication Engine   │
    │ (Redis + Bloom Filter) │
    │                        │
    │ • Hash content         │
    │ • Group duplicates     │
    │ • Find similar stories │
    └─────┬──────────────────┘
          │
    ┌─────▼──────────────────┐
    │ Enrichment Service     │
    │                        │
    │ • Add metadata         │
    │ • Extract key info     │
    │ • Add source info      │
    │ • Fetch full articles  │
    └─────┬──────────────────┘
          │
    ┌─────▼──────────────────┐
    │ ML Validation Layer    │
    │ (Python/TensorFlow)    │
    │                        │
    │ • Quality score        │
    │ • Credibility          │
    │ • Category prediction  │
    │ • Sentiment analysis   │
    └─────┬──────────────────┘
          │
    ┌─────▼──────────────────┐
    │ Priority Assignment    │
    │ (Color Codes)          │
    │ 🔴 🟠 🟡 🟢 ⚫       │
    └─────┬──────────────────┘
          │
    ┌─────▼──────────────────┐
    │ Store to PostgreSQL    │
    │ (Stories Table)        │
    └────────────────────────┘
```

### 2.2 Editor Dashboard Components

**Backend Routes (Express):**

```javascript
// Content Management
GET   /api/v1/console/stories          // Get queued stories
GET   /api/v1/console/stories/:id      // Get story details
POST  /api/v1/console/stories/:id/publish
POST  /api/v1/console/stories/:id/schedule
POST  /api/v1/console/stories/:id/reject
PUT   /api/v1/console/stories/:id      // Edit story

// Batch Operations
POST  /api/v1/console/bulk-publish
POST  /api/v1/console/bulk-reject

// Analytics
GET   /api/v1/console/analytics/story/:id
GET   /api/v1/console/analytics/dashboard
GET   /api/v1/console/trending

// Source Management
GET   /api/v1/console/sources
POST  /api/v1/console/sources
DELETE /api/v1/console/sources/:id
```

### 2.3 ML Pipeline (Phase 2)

**Python ML Service:**

```python
# ml_service/
├── models/
│   ├── categorizer.py           # Category classification
│   ├── credibility_scorer.py    # Source credibility
│   ├── quality_checker.py       # Content quality
│   ├── engagement_predictor.py  # Viral prediction
│   └── sentiment_analyzer.py    # Comment sentiment
│
├── training/
│   ├── data_loader.py           # Load training data
│   ├── feature_engineering.py   # Feature creation
│   ├── model_trainer.py         # Model training
│   └── evaluation.py            # Model metrics
│
├── inference/
│   ├── batch_predictor.py       # Batch predictions
│   ├── realtime_predictor.py    # Real-time scoring
│   └── model_server.py          # TensorFlow Serving wrapper
│
├── utils/
│   ├── preprocessing.py         # Text cleaning
│   ├── nlp_utils.py            # NLP operations
│   └── logging.py              # Logging setup
│
└── main.py                      # Service entry
```

**Model Training Pipeline:**

```python
# Weekly retraining
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import tensorflow as tf

class StoryClassifier:
    def __init__(self):
        self.category_model = RandomForestClassifier(n_estimators=100)
        self.engagement_model = tf.keras.Sequential([...])
    
    def train(self, df_stories):
        """Train models on recent engagement data"""
        X = self.extract_features(df_stories)
        
        # Category prediction
        y_category = df_stories['category']
        self.category_model.fit(X, y_category)
        
        # Engagement prediction
        y_engagement = self.compute_engagement_score(df_stories)
        self.engagement_model.fit(X, y_engagement, epochs=10)
    
    def predict_priority(self, story):
        """Predict priority color code"""
        features = self.extract_features(pd.DataFrame([story]))
        
        engagement_score = self.engagement_model.predict(features)[0]
        category = self.category_model.predict(features)[0]
        
        if story['is_critical']:
            return 'RED'
        elif engagement_score > 0.8:
            return 'ORANGE'
        elif engagement_score > 0.5:
            return 'YELLOW'
        elif engagement_score > 0.2:
            return 'GREEN'
        else:
            return 'BLACK'
```

---

## Data Models & Schemas

### Database Schema (PostgreSQL)

```sql
-- Stories Table
CREATE TABLE stories (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  source VARCHAR(100),
  primary_location VARCHAR(50),
  secondary_locations TEXT[],
  category VARCHAR(50),
  published_at TIMESTAMP,
  updated_at TIMESTAMP,
  is_critical BOOLEAN DEFAULT false,
  is_hot BOOLEAN DEFAULT false,
  importance_score FLOAT,
  engagement_score FLOAT,
  view_count INT DEFAULT 0,
  like_count INT DEFAULT 0,
  comment_count INT DEFAULT 0,
  share_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_primary_location (primary_location),
  INDEX idx_published_at (published_at),
  INDEX idx_category (category)
);

-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  phone_number VARCHAR(255) UNIQUE,
  email VARCHAR(255),
  primary_location VARCHAR(50),
  language_preference VARCHAR(20),
  notification_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  last_active TIMESTAMP,
  INDEX idx_phone (phone_number)
);

-- Engagements Table
CREATE TABLE engagements (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  story_id UUID REFERENCES stories(id),
  event_type VARCHAR(50), -- 'like', 'comment', 'share', 'view'
  duration_ms INT,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_user_story (user_id, story_id),
  INDEX idx_created_at (created_at)
);

-- Comments Table
CREATE TABLE comments (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  story_id UUID REFERENCES stories(id),
  parent_comment_id UUID,
  text TEXT NOT NULL,
  sentiment FLOAT, -- -1 to 1
  like_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  INDEX idx_story (story_id),
  INDEX idx_parent (parent_comment_id)
);

-- Bookmarks Table
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  story_id UUID REFERENCES stories(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, story_id)
);

-- Analytics Metrics Table
CREATE TABLE story_analytics (
  id UUID PRIMARY KEY,
  story_id UUID REFERENCES stories(id),
  metric_type VARCHAR(50),
  value INT,
  location VARCHAR(50),
  recorded_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_story_metric (story_id, metric_type),
  INDEX idx_recorded_at (recorded_at)
);
```

---

## Deployment & DevOps

### Docker Compose (Local Development)

```yaml
version: '3.9'

services:
  # Databases
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: kerala_news
      POSTGRES_PASSWORD: dev_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.0.0
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
    ports:
      - "9200:9200"
    volumes:
      - elastic_data:/usr/share/elasticsearch/data

  # Services
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:dev_password@postgres:5432/kerala_news
      - REDIS_URL=redis://redis:6379
      - NODE_ENV=development
    depends_on:
      - postgres
      - redis
    volumes:
      - ./backend:/app

  ml_service:
    build: ./ml_service
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://postgres:dev_password@postgres:5432/kerala_news
    depends_on:
      - postgres
    volumes:
      - ./ml_service:/app

  # Frontend Development Servers
  web_frontend:
    build: ./web_frontend
    ports:
      - "3001:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:3000
    volumes:
      - ./web_frontend:/app

volumes:
  postgres_data:
  elastic_data:
```

### Kubernetes Deployment (Production)

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: kerala-news/backend:v2.0
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: url
        - name: REDIS_URL
          valueFrom:
            configMapKeyRef:
              name: service-config
              key: redis_url
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: backend-service
spec:
  selector:
    app: backend
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: LoadBalancer
```

---

## Monitoring & Observability

### Prometheus Metrics

```python
# metrics.py
from prometheus_client import Counter, Histogram, Gauge

# Counters
stories_published = Counter('stories_published_total', 'Total stories published', ['location', 'category'])
engagement_events = Counter('engagement_events_total', 'Total engagement events', ['event_type'])

# Histograms
api_latency = Histogram('api_latency_seconds', 'API latency', buckets=[0.1, 0.5, 1.0, 2.0, 5.0])
ml_inference_time = Histogram('ml_inference_seconds', 'ML inference time')

# Gauges
active_connections = Gauge('active_connections', 'Active WebSocket connections')
pending_stories = Gauge('pending_stories', 'Stories pending review', ['priority'])
```

### ELK Stack Setup

```bash
# elasticsearch, logstash, kibana
# Logs from all services → Logstash → Elasticsearch
# Kibana dashboard for visualization
```

---

**Document Version:** 2.0  
**Last Updated:** September 2026  
**Status:** Ready for Development


---

## AI-Powered Content Validation with Groq & LLMs

### Overview

Phase 2's AI Console uses **large language models (LLMs)** to provide intelligent, real-time content validation and prioritization. We recommend a **hybrid multi-model approach** for optimal performance, speed, and accuracy.

### LLM Selection Strategy

#### Primary Provider: Groq (Ultra-Fast Inference)
- **Latency:** <100ms per request
- **Cost:** $0.001-0.10 per 1K tokens
- **Use Case:** Initial content validation, real-time processing
- **Advantage:** Fastest inference speed in the industry
- **API:** RESTful + Streaming

#### Secondary Provider: Anthropic Claude 3.5
- **Latency:** 1-3 seconds per request
- **Cost:** $0.01-0.08 per 1K tokens
- **Use Case:** High-accuracy validation, edge cases, complex analysis
- **Advantage:** Best contextual understanding, 200K token window
- **API:** REST, supports function calling

#### Tertiary Provider: Google Gemini
- **Latency:** 1-2 seconds per request
- **Cost:** $0.00075-0.006 per 1K tokens
- **Use Case:** Cost-effective verification, multilingual support
- **Advantage:** Most cost-effective, strong multilingual capabilities
- **API:** REST, supports vision/text

### Architecture: LLM Integration Layer

```
Content Ingestion Pipeline:
    │
    ├─► Groq (Initial validation - 50-100ms)
    │   └─► Extract entities, summarize, quick classification
    │
    ├─► Parallel Processing:
    │   ├─► Traditional ML models (engagement prediction)
    │   ├─► Duplicate detection (Elasticsearch)
    │   └─► Database lookups (credibility history)
    │
    ├─► Claude (Accuracy validation - async, 2-3s)
    │   └─► High-stakes content, edge cases only
    │
    ├─► Fact-Check APIs (Async, 500ms-2s)
    │   └─► Verify factual claims
    │
    └─► Priority Assignment (Consensus scoring)
        └─► Color code output (🔴 🟠 🟡 🟢 ⚫)
```

### Implementation: Python Service

**File: ml_service/llm_validator.py**

```python
import asyncio
from groq import Groq as GroqClient
import anthropic
import google.generativeai as genai
from typing import Dict, List, Optional
import json

class ContentValidator:
    def __init__(self):
        # Initialize LLM clients
        self.groq_client = GroqClient(api_key="sk-groq-...")
        self.claude_client = anthropic.Anthropic(api_key="sk-ant-...")
        genai.configure(api_key="sk-gemini-...")
        
    async def validate_content(self, content: str, source: str) -> Dict:
        """
        Main validation pipeline: Fast → Thorough → Consensus
        """
        
        # Stage 1: Groq (Ultra-fast, required)
        groq_result = await self.groq_validate(content)
        
        # Stage 2: Parallel traditional ML processing
        ml_result = await self.ml_predict(content)
        
        # Stage 3: Claude (Async, for accuracy on important stories)
        if groq_result['confidence'] < 0.7 or groq_result['priority'] in ['RED', 'BLACK']:
            claude_result = await self.claude_validate(content, source)
        else:
            claude_result = None
        
        # Stage 4: Fact-checking (Async)
        fact_check = await self.verify_facts(content)
        
        # Stage 5: Combine results
        final_priority = self.consensus_score(
            groq_result, ml_result, claude_result, fact_check
        )
        
        return final_priority
    
    async def groq_validate(self, content: str) -> Dict:
        """
        Ultra-fast validation using Groq (~100ms)
        """
        prompt = f"""Analyze this news content for quality and priority.
        Respond in JSON format only.
        
        Content:
        {content}
        
        JSON Response Format:
        {{
            "summary": "brief summary",
            "quality_score": 0-100,
            "credibility_score": 0-100,
            "category": "Politics|Sports|Tech|Entertainment|Business|Health|Local",
            "geographic_relevance": "Karnataka/India/International",
            "has_misinformation_signs": true|false,
            "engagement_potential": "high|medium|low",
            "priority_suggestion": "RED|ORANGE|YELLOW|GREEN|BLACK",
            "confidence": 0-100
        }}"""
        
        try:
            message = self.groq_client.messages.create(
                model="mixtral-8x7b-32768",  # Groq's fastest model
                max_tokens=500,
                messages=[{"role": "user", "content": prompt}]
            )
            
            result_json = message.content[0].text
            return json.loads(result_json)
        except Exception as e:
            # Fallback: Return neutral classification
            return {
                "priority_suggestion": "YELLOW",
                "confidence": 0.4,
                "error": str(e)
            }
    
    async def claude_validate(self, content: str, source: str) -> Dict:
        """
        High-accuracy validation using Claude (~2-3s)
        Called only for uncertain or critical stories
        """
        prompt = f"""You are an expert news editor. Validate this content with extreme care.
        
        Source: {source}
        Content:
        {content}
        
        Analyze for:
        1. Factual accuracy - Are claims verifiable?
        2. Source reliability - How trustworthy is the source?
        3. Potential bias - Is there editorial slant?
        4. Newsworthiness - Is this important for Karnataka?
        5. Misinformation risk - Could this spread false information?
        
        Provide structured analysis and priority recommendation."""
        
        try:
            response = self.claude_client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=1000,
                messages=[{"role": "user", "content": prompt}]
            )
            
            return {
                "analysis": response.content[0].text,
                "model": "claude",
                "confidence": 0.95
            }
        except Exception as e:
            return {"error": str(e), "confidence": 0.0}
    
    async def verify_facts(self, content: str) -> Dict:
        """
        Verify factual claims using fact-checking APIs
        """
        claims = self.extract_claims(content)
        
        results = {
            "claims_found": len(claims),
            "verified": 0,
            "disputed": 0,
            "unverified": 0,
            "claims": []
        }
        
        for claim in claims:
            # Query fact-checking services
            status = await self.check_claim(claim)
            results['claims'].append({
                "claim": claim,
                "status": status
            })
            
            if status == "verified":
                results['verified'] += 1
            elif status == "disputed":
                results['disputed'] += 1
            else:
                results['unverified'] += 1
        
        return results
    
    def consensus_score(self, groq: Dict, ml: Dict, claude: Optional[Dict], 
                       fact_check: Dict) -> Dict:
        """
        Combine multiple models for final priority decision
        """
        scores = {
            'RED': 0,
            'ORANGE': 0,
            'YELLOW': 0,
            'GREEN': 0,
            'BLACK': 0
        }
        
        # Weight Groq result (fastest, good baseline)
        groq_priority = groq.get('priority_suggestion', 'YELLOW')
        scores[groq_priority] += 4
        
        # Weight ML prediction
        ml_priority = ml.get('predicted_priority', 'YELLOW')
        scores[ml_priority] += 3
        
        # Weight Claude (if available)
        if claude and 'analysis' in claude:
            claude_priority = self.extract_priority_from_analysis(claude['analysis'])
            scores[claude_priority] += 5  # Highest weight for accuracy
        
        # Weight fact-check results
        if fact_check.get('disputed', 0) > 0:
            scores['BLACK'] += 3
        elif fact_check.get('verified', 0) > fact_check.get('unverified', 0):
            scores['GREEN'] += 2
        
        # Find highest scoring priority
        final_priority = max(scores, key=scores.get)
        confidence = (scores[final_priority] / sum(scores.values())) * 100
        
        return {
            "priority": final_priority,
            "confidence": round(confidence, 1),
            "component_scores": scores,
            "reasoning": f"Priority {final_priority} selected with {confidence:.1f}% confidence"
        }
    
    def extract_claims(self, content: str) -> List[str]:
        """Extract factual claims from content"""
        # Use spaCy NER or simple regex patterns
        claims = []
        # Implementation details...
        return claims
    
    async def check_claim(self, claim: str) -> str:
        """Check claim against fact-checking APIs"""
        # Query Google Fact Check API, Snopes, etc.
        # Return: "verified", "disputed", or "unverified"
        return "unverified"
    
    def extract_priority_from_analysis(self, analysis: str) -> str:
        """Extract priority recommendation from Claude's analysis"""
        # Parse Claude's response to find priority recommendation
        if "breaking" in analysis.lower() or "urgent" in analysis.lower():
            return "RED"
        elif "important" in analysis.lower() or "trending" in analysis.lower():
            return "ORANGE"
        elif "misleading" in analysis.lower() or "false" in analysis.lower():
            return "BLACK"
        return "YELLOW"
    
    async def ml_predict(self, content: str) -> Dict:
        """Traditional ML predictions (engagement, category, etc.)"""
        # Load pre-trained models
        # Return predictions
        return {
            "predicted_priority": "YELLOW",
            "engagement_score": 0.65
        }
```

### Cost Analysis

**Monthly Processing: 1000 stories/day × 30 days = 30,000 stories**

```
Groq Processing (All stories):
- 30,000 stories × 200 tokens avg = 6M tokens
- Cost: 6M × $0.001 = $6.00

Claude Processing (10% of stories for accuracy):
- 3,000 stories × 300 tokens avg = 900K tokens
- Cost: 900K × $0.01 = $9.00

Gemini Processing (5% for cost verification):
- 1,500 stories × 250 tokens avg = 375K tokens
- Cost: 375K × $0.003 = $1.12

Fact-Check APIs:
- 5,000 fact-checks/month = $5.00

TOTAL MONTHLY COST: ~$21.12
TOTAL ANNUAL COST: ~$253.44

Cost per story: $0.008 (less than 1 cent!)
```

### Performance Benchmarks

| Operation | Latency | Provider |
|-----------|---------|----------|
| Quick validation | 50-100ms | Groq |
| High-accuracy check | 1-3s | Claude |
| Cost-effective verification | 1-2s | Gemini |
| Fact-checking | 500ms-2s | Fact-Check APIs |
| **Total per story** | **~1.5 seconds** | **Parallel** |

### Error Handling & Fallbacks

```python
# If Groq is unavailable
def fallback_validation(content):
    if groq_available:
        return groq_validate(content)
    elif claude_available:
        return claude_validate(content)
    elif gemini_available:
        return gemini_validate(content)
    else:
        # Default: Conservative classification
        return {
            "priority": "YELLOW",
            "confidence": 0.3,
            "status": "fallback"
        }
```

### Monitoring LLM Quality

**Track metrics:**
- Average confidence scores
- Editor override rate (did editor disagree with AI?)
- Actual vs. predicted engagement
- False positive/negative rates
- API latency and error rates

**Automatic model switching:**
- If Groq accuracy drops below 75%, increase Claude usage
- If costs exceed $500/month, reduce non-critical validations
- If latency exceeds 2 seconds, optimize prompt engineering

### Integration with Editor Dashboard

```
🔴 RED  (95% confidence from Groq + Claude consensus)
   ├─ Groq: BREAKING NEWS DETECTED
   ├─ Claude: CONFIRMED CRITICAL EVENT
   ├─ Source: WhatsApp News Group
   ├─ Models: Groq + Claude (94% agreement)
   └─ Action: Instant escalation
   
🟠 ORANGE (87% confidence from Groq)
   ├─ Groq: HIGH ENGAGEMENT POTENTIAL
   ├─ Trend Score: 8.5/10
   ├─ Fact Check: All claims verified
   └─ Action: Featured placement
```

---

