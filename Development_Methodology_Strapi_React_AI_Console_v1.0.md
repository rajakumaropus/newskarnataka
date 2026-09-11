# Development Methodology: Strapi CMS + React JS + AI-Enabled Console
## News Karnataka Enterprise Platform

**Architecture**: Hybrid In-House Development  
**CMS**: Strapi.io (Open-Source, Self-Hosted)  
**Frontend**: React JS (Customer App) + React Admin (AI Console)  
**AI Integration**: Groq/LLM-powered authoring, tagging, validation  
**Date**: 08 September 2026  
**Version**: 1.0  

---

## 1. Executive Summary

This document defines a **stage-gated development methodology** optimized for hybrid in-house teams building a Strapi-based CMS with AI-enabled authoring console and React JS customer applications. The methodology emphasizes:

- **Sequential layering** (Database → CMS → API → AI → Frontend)
- **Automated quality gates** at every stage
- **AI governance** (human-in-the-loop validation)
- **Zero-defect migration** (WordPress → Strapi)
- **Production readiness** (security, performance, observability)

**Core Principle**: Each stage must pass defined quality gates before the next stage begins. No parallel development across layers until foundational layers are stable.

---

## 2. Development Philosophy

### 2.1 Layered Architecture with Strict Dependencies

```
┌─────────────────────────────────────────────────────────────┐
│                    Layer 6: Observability                   │
│          Monitoring | Logging | Alerting | Audit            │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │
┌─────────────────────────────────────────────────────────────┐
│                    Layer 5: Frontend                        │
│        React JS Customer App | AI Console | Admin UI        │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │
┌─────────────────────────────────────────────────────────────┐
│                    Layer 4: AI Services                     │
│   Groq/LLM Integration | Tagging | Validation | Summaries   │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │
┌─────────────────────────────────────────────────────────────┐
│                    Layer 3: API Layer                       │
│          Strapi REST API | GraphQL | Webhooks | RBAC        │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │
┌─────────────────────────────────────────────────────────────┐
│                    Layer 2: CMS Configuration               │
│        Strapi Content Types | Workflows | Permissions       │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │
┌─────────────────────────────────────────────────────────────┐
│                    Layer 1: Database & Infrastructure       │
│      PostgreSQL | Redis | Object Storage | CDN | Backup     │
└─────────────────────────────────────────────────────────────┘
```

**Rule**: Never develop Layer N+1 until Layer N is production-ready and passes all quality gates.

---

### 2.2 Development Principles

| Principle | Description | Enforcement |
|-----------|-------------|-------------|
| **Infrastructure First** | Database, storage, CDN, backup before any code | No development access until infrastructure is provisioned |
| **Content Model Before Code** | Strapi content types defined and approved before API development | Editorial sign-off required |
| **API Contract Before Frontend** | OpenAPI/Swagger spec approved before React development | Frontend cannot start without API contract |
| **AI as Last Layer** | AI services integrated only after CMS + API are stable | AI features are enhancements, not core |
| **Automated Testing** | Every feature must have unit + integration tests | CI/CD blocks merge without tests |
| **Human-in-the-Loop AI** | AI never publishes directly; editorial approval required | Hardcoded governance rules |
| **Zero-Defect Migration** | WordPress → Strapi migration must be idempotent, auditable, reversible | Migration adapter with rollback capability |
| **Observability by Design** | Logging, monitoring, alerting built into every layer | No feature is complete without observability |

---

## 3. Development Stages (Sequential)

### Stage 1: Foundation & Infrastructure (Weeks 1–2)

**Objective**: Provision and validate all infrastructure components before any development begins.

#### 1.1 Infrastructure Checklist

| Component | Technology | Configuration | Validation |
|-----------|------------|---------------|------------|
| **Database** | PostgreSQL 15+ | Managed (AWS RDS/DigitalOcean), 2 vCPU, 4 GB RAM, automated backup, point-in-time recovery | Connection test, backup/restore test, read replica test |
| **Cache** | Redis 7+ | Managed (AWS ElastiCache/DigitalOcean), 1 GB RAM, persistence enabled | Connection test, TTL test, failover test |
| **Object Storage** | Cloudflare R2 or AWS S3 | Versioning enabled, lifecycle rules, CORS configured | Upload/download test, CDN integration test |
| **CDN** | Cloudflare | WAF rules, caching policies, SSL/TLS, DDoS protection | Cache hit test, WAF rule test, SSL test |
| **Compute** | AWS EC2 / DigitalOcean Droplet | 4 vCPU, 8 GB RAM, auto-scaling group, load balancer | SSH access, load balancer health check, scaling test |
| **Backup** | Automated daily backups | Database (pg_dump), object storage (versioning), configuration (Git) | Restore test (quarterly) |
| **Monitoring** | Prometheus + Grafana / Datadog | CPU, memory, disk, API latency, error rates | Dashboard validation, alert test |
| **Logging** | ELK Stack / Cloudwatch / Datadog | Structured JSON logs, log rotation, retention policy | Log search test, alert test |
| **Secrets** | AWS Secrets Manager / HashiCorp Vault | API keys, database credentials, LLM tokens | Rotation test, access audit |
| **CI/CD** | GitHub Actions / GitLab CI | Build, test, deploy pipelines for all environments | Pipeline execution test, rollback test |

#### 1.2 Quality Gates (Must Pass Before Stage 2)

- [ ] All infrastructure components provisioned and accessible
- [ ] Database connection string tested from application server
- [ ] Backup/restore procedure documented and tested
- [ ] Monitoring dashboards created with baseline metrics
- [ ] CI/CD pipelines configured for staging environment
- [ ] Security scan passed (no critical/high vulnerabilities)
- [ ] Disaster recovery plan documented (RTO < 4 hours, RPO < 1 hour)

**Gate Approval**: Infrastructure sign-off by DevOps Lead + Security Engineer

---

### Stage 2: Strapi CMS Configuration (Weeks 3–4)

**Objective**: Configure Strapi content types, workflows, permissions, and APIs before any custom code is written.

#### 2.1 Content Model Definition

**Mandatory Content Types** (aligned with News Karnataka requirements):

| Content Type | Purpose | Key Fields | Validation Rules |
|--------------|---------|------------|------------------|
| `article` | Primary news story | title, slug, summary, body, language, status, published_at, featured_image, seo, source_url | Unique slug, required title/body, valid language code |
| `category` | Editorial section | name, slug, parent_category, display_order, description | Unique slug, hierarchical parent validation |
| `tag` | Topic/entity tagging | name, slug, tag_type, canonical_name | Unique slug, controlled vocabulary for tag_type |
| `location` | Geographic vocabulary | name_en, name_kn, slug, district, state, geo_coordinates | Controlled vocabulary (Mangaluru, Bengaluru, etc.) |
| `author_profile` | Writer/editor information | display_name, bio, image, social_links, active_status | Required display_name, valid social URLs |
| `media_asset` | Managed media metadata | asset_url, alt_text, caption, credit, original_wordpress_url | Required alt_text for accessibility |
| `article_revision` | Editorial/AI audit version | article, version_no, edited_by, change_summary, snapshot | Immutable once created |
| `ai_analysis` | AI output and review record | article, model, task_type, input_hash, output_json, confidence, reviewed_by | AI output never overwrites original content |
| `redirect_rule` | SEO redirects | old_path, new_path, redirect_type, active | Unique old_path, valid HTTP status code |
| `import_batch` | Migration observability | batch_code, source, started_at, completed_at, status, totals, error_count | Immutable audit trail |
| `import_error` | Failed migration records | import_batch, wordpress_post_id, error_code, error_detail, retry_count | Linked to import_batch |

#### 2.2 Strapi Configuration Checklist

| Task | Tool/Method | Validation |
|------|-------------|------------|
| **Install Strapi 5** | `npx create-strapi-app@latest` | Version check, health endpoint test |
| **Configure PostgreSQL** | `database.js` config | Connection test, query performance test |
| **Configure Redis** | `redis-client` package | Cache hit/miss test, TTL test |
| **Configure R2/S3** | `@strapi/provider-upload-aws-s3` | Upload/download test, CDN integration |
| **Define Content Types** | Strapi Admin UI or `schema.json` files | Schema validation, API endpoint test |
| **Configure RBAC** | Strapi Roles & Permissions | Role-based access test (Author, Reviewer, Editor, Admin) |
| **Set Up Workflows** | Strapi Review Workflows or custom plugin | Draft → Review → Published workflow test |
| **Enable GraphQL API** | `@strapi/plugin-graphql` | GraphQL query test, introspection test |
| **Configure Webhooks** | Strapi Webhooks | Webhook trigger test, payload validation |
| **Set Up Localization** | Strapi i18n plugin | Multi-language content test (Kannada, English) |
| **Configure SEO Plugin** | `strapi-plugin-seo` or custom | Meta tags, Open Graph, Twitter Cards test |
| **Enable Audit Logs** | `strapi-plugin-audit-logs` or custom | Audit log creation test, search test |

#### 2.3 Quality Gates (Must Pass Before Stage 3)

- [ ] All content types created and validated
- [ ] RBAC roles configured and tested (Author, Reviewer, Editor, Admin)
- [ ] REST API endpoints functional (CRUD operations for all content types)
- [ ] GraphQL API functional (queries and mutations tested)
- [ ] Webhooks configured and tested (content publish triggers webhook)
- [ ] Localization configured (Kannada + English content supported)
- [ ] SEO metadata fields present and validated
- [ ] Audit logs enabled and capturing all CRUD operations
- [ ] Performance test passed (API response time < 200ms for simple queries)
- [ ] Security scan passed (no critical/high vulnerabilities in Strapi config)

**Gate Approval**: CMS sign-off by Strapi Lead + Editorial Product Owner

---

### Stage 3: API Layer & Integration (Weeks 5–6)

**Objective**: Build custom API extensions, integrations, and middleware before frontend development begins.

#### 3.1 Custom API Extensions

| Extension | Purpose | Implementation | Validation |
|-----------|---------|----------------|------------|
| **Custom Controllers** | Extend Strapi default API behavior | `src/api/article/controllers/article.js` | Unit test, integration test |
| **Custom Services** | Business logic layer | `src/api/article/services/article.js` | Unit test, mock test |
| **Custom Policies** | Authorization logic | `src/policies/isAuthor.js`, `src/policies/isEditor.js` | Role-based access test |
| **Custom Middleware** | Request/response transformation | `src/middleware/rateLimiter.js`, `src/middleware/auditLogger.js` | Integration test, performance test |
| **GraphQL Resolvers** | Custom GraphQL queries/mutations | `src/api/article/resolvers.js` | GraphQL query test |
| **Webhook Handlers** | External system integration | `src/api/webhook/controllers/webhook.js` | Webhook trigger test |
| **Batch Operations** | Bulk create/update/delete | `src/api/batch/controllers/batch.js` | Performance test (1000 records/batch) |
| **Search API** | Elasticsearch/Algolia integration | `src/api/search/controllers/search.js` | Search query test, relevance test |

#### 3.2 API Contract Documentation

**Mandatory**: Create OpenAPI/Swagger specification for all custom endpoints.

```yaml
# openapi.yaml
openapi: 3.0.0
info:
  title: News Karnataka Strapi API
  version: 1.0.0
paths:
  /api/articles:
    get:
      summary: List articles
      parameters:
        - name: locale
          in: query
          schema:
            type: string
            enum: [kn, en]
        - name: status
          in: query
          schema:
            type: string
            enum: [draft, in_review, published, archived]
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/Article'
  /api/articles/{id}:
    get:
      summary: Get article by ID
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Article'
components:
  schemas:
    Article:
      type: object
      properties:
        id:
          type: integer
        document_id:
          type: string
        title:
          type: string
        slug:
          type: string
        body:
          type: string
        status:
          type: string
          enum: [draft, in_review, published, archived]
        published_at:
          type: string
          format: date-time
```

#### 3.3 Quality Gates (Must Pass Before Stage 4)

- [ ] All custom API endpoints documented in OpenAPI/Swagger
- [ ] API contract reviewed and approved by frontend team
- [ ] Unit tests written for all custom controllers/services (≥85% code coverage)
- [ ] Integration tests written for all API endpoints (≥90% pass rate)
- [ ] Performance test passed (P95 latency < 300ms for all endpoints)
- [ ] Security test passed (authentication, authorization, input validation)
- [ ] Rate limiting configured (100 requests/minute per IP)
- [ ] Error handling standardized (consistent error response format)
- [ ] API versioning strategy defined (`/api/v1/`, `/api/v2/`)
- [ ] API gateway configured (Kong/AWS API Gateway) with monitoring

**Gate Approval**: API sign-off by Backend Lead + Frontend Lead

---

### Stage 4: AI Services Integration (Weeks 7–8)

**Objective**: Integrate AI/LLM services with strict governance controls.

#### 4.1 AI Service Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                   AI Service Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Tagging Svc  │  │ Validation   │  │ Summarization│      │
│  │ (Groq)       │  │ Svc (Groq)   │  │ Svc (Groq)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Location     │  │ Duplicate    │  │ SEO          │      │
│  │ Extractor    │  │ Detector     │  │ Optimizer    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │
┌─────────────────────────────────────────────────────────────┐
│                   AI Governance Layer                       │
│  - Controlled Vocabulary (Locations, Tags, Categories)      │
│  - Confidence Thresholds (min 0.75 for auto-suggestions)    │
│  - Human-in-the-Loop (editor approval required)             │
│  - Audit Trail (all AI outputs logged with model/version)   │
│  - Cost Controls (token limits, rate limits, budget alerts) │
└─────────────────────────────────────────────────────────────┘
```

#### 4.2 AI Service Implementation

| Service | LLM Model | Prompt Template | Output Format | Confidence Threshold |
|---------|-----------|-----------------|---------------|---------------------|
| **Auto-Tagging** | Groq Llama 3.1 8B | "Extract 3-5 topic tags from this news article. Use controlled vocabulary." | JSON: `{tags: [{name, type, confidence}]}` | ≥0.75 |
| **Location Extraction** | Groq Llama 3.1 8B | "Extract location names. Use official names (Mangaluru, Bengaluru, Mysuru)." | JSON: `{locations: [{name_en, name_kn, type, confidence}]}` | ≥0.85 |
| **Kannada/English Validation** | Groq Llama 3.1 8B | "Detect language and flag spelling/grammar issues in Kannada/English." | JSON: `{language, issues: [{type, message, suggestion}]}` | ≥0.80 |
| **Summary Generation** | Groq Llama 3.1 8B | "Generate a 2-sentence summary in the same language as the article." | JSON: `{summary_kn, summary_en}` | ≥0.70 |
| **SEO Optimization** | Groq Llama 3.1 70B | "Suggest SEO title (60 chars) and meta description (155 chars)." | JSON: `{seo_title, seo_description}` | ≥0.75 |
| **Duplicate Detection** | Groq Llama 3.1 8B | "Compare this article with existing articles. Flag if >80% similar." | JSON: `{is_duplicate, similar_article_ids, similarity_score}` | ≥0.80 |
| **Content Completeness** | Rule-based + LLM | "Check if article has title, body, category, tags, featured image, SEO metadata." | JSON: `{is_complete, missing_fields: []}` | 1.0 (rule-based) |

#### 4.3 AI Governance Rules

**Mandatory Implementation**:

1. **AI Never Publishes Directly**: All AI outputs are suggestions only; editorial approval required
2. **Controlled Vocabulary**: Locations, tags, categories must match approved lists
3. **Confidence Thresholds**: AI suggestions below threshold are hidden from editors
4. **Audit Trail**: Log model, prompt version, input hash, output, confidence, editor decision
5. **Cost Controls**: Token limits, rate limits, budget alerts (max ₹10,000/month for AI)
6. **Human Override**: Editors can reject AI suggestions without justification
7. **Version Control**: Prompt templates versioned in Git; changes require approval

#### 4.4 Quality Gates (Must Pass Before Stage 5)

- [ ] All AI services implemented and tested with sample articles
- [ ] Controlled vocabulary loaded (locations, tags, categories)
- [ ] Confidence thresholds configured and validated
- [ ] Audit logging enabled for all AI operations
- [ ] Cost controls implemented (token limits, budget alerts)
- [ ] Human-in-the-loop workflow tested (AI suggestion → editor approval)
- [ ] Performance test passed (AI response time < 5 seconds per article)
- [ ] Security test passed (API keys secured, no PII sent to LLM)
- [ ] Fallback mechanism tested (AI service unavailable → graceful degradation)
- [ ] Editorial team trained on AI features and governance rules

**Gate Approval**: AI sign-off by AI Lead + Editorial Product Owner + Security Engineer

---

### Stage 5: Frontend Development (Weeks 9–14)

**Objective**: Build React JS customer app and AI-enabled authoring console.

#### 5.1 Frontend Architecture

```text
src/
├── apps/
│   ├── customer-app/          # React JS public news app
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── App.tsx
│   │
│   ├── ai-console/            # React Admin for editorial team
│   │   ├── components/
│   │   ├── features/
│   │   │   ├── article-editor/
│   │   │   ├── ai-suggestions/
│   │   │   ├── workflow-review/
│   │   │   └── analytics/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── App.tsx
│   │
│   └── admin-ui/              # Strapi Admin (customized)
│       ├── extensions/
│       └── config/
│
├── packages/
│   ├── ui-components/         # Shared component library
│   ├── api-client/            # Strapi API client (REST + GraphQL)
│   ├── utils/                 # Shared utilities
│   └── types/                 # TypeScript types
│
├── config/
│   ├── webpack.config.js
│   ├── babel.config.js
│   └── tsconfig.json
│
└── tests/
    ├── unit/
    ├── integration/
    └── e2e/
```

#### 5.2 Development Sequence

**Week 9–10: Foundation**
- Set up monorepo (Turborepo/Nx)
- Configure TypeScript, ESLint, Prettier
- Build shared UI component library (buttons, forms, tables, modals)
- Implement API client (REST + GraphQL with caching)
- Set up authentication (JWT with Strapi)

**Week 11–12: Customer App (React JS)**
- Home page with featured articles (API integration)
- Article listing by category/tag (pagination, filters)
- Article detail page (rich text rendering, related articles)
- Search functionality (Elasticsearch/Algolia integration)
- Responsive design (mobile, tablet, desktop)
- Performance optimization (lazy loading, code splitting)

**Week 13–14: AI Console (React Admin)**
- Article editor with AI suggestions (real-time tagging, validation)
- Workflow dashboard (Draft → Review → Published)
- AI suggestion panel (accept/reject with remarks)
- Bulk operations (publish, unpublish, schedule)
- Analytics dashboard (reads, shares, subscriptions)
- Settings (user profile, preferences, notifications)

#### 5.3 Quality Gates (Must Pass Before Stage 6)

- [ ] All UI components built and documented (Storybook)
- [ ] API client implemented with error handling and caching
- [ ] Customer app pages functional (home, listing, detail, search)
- [ ] AI console features functional (editor, workflow, AI suggestions)
- [ ] Responsive design tested (mobile, tablet, desktop)
- [ ] Performance test passed (Lighthouse score ≥90, FCP < 1.5s)
- [ ] Accessibility test passed (WCAG 2.1 AA, axe-core scan)
- [ ] Cross-browser test passed (Chrome, Firefox, Safari, Edge)
- [ ] Unit tests written for all components (≥80% code coverage)
- [ ] Integration tests written for all user flows (≥90% pass rate)
- [ ] E2E tests written for critical paths (login, create article, publish)
- [ ] Security test passed (XSS, CSRF, authentication, authorization)

**Gate Approval**: Frontend sign-off by Frontend Lead + UX Designer + QA Lead

---

### Stage 6: Migration Adapter (Weeks 15–18)

**Objective**: Build and execute WordPress → Strapi migration with zero data loss.

#### 6.1 Migration Adapter Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                   WordPress Source                          │
│  REST API | Database Read Replica | XML Export              │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Extraction Service                        │
│  - Paginated API calls                                      │
│  - Rate limiting (100 requests/minute)                      │
│  - Checkpoint/resume capability                             │
│  - Audit logging (source_id, timestamp, status)             │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Transformation Service                    │
│  - HTML/Gutenberg → Strapi rich text                        │
│  - Media URL extraction and mapping                         │
│  - Taxonomy normalization (categories, tags, locations)     │
│  - Author mapping (WordPress user → Strapi author_profile)  │
│  - SEO metadata extraction (title, description, canonical)  │
│  - Unicode validation (Kannada characters)                  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Loading Service                           │
│  - Strapi API calls (batched, idempotent)                   │
│  - Media upload (checksum-based deduplication)              │
│  - Relationship mapping (article → category/tag/location)   │
│  - Error handling (retry queue, manual exception dashboard) │
│  - Reconciliation (source count vs. destination count)      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Strapi Destination                        │
│  PostgreSQL | Object Storage | Redis Cache                  │
└─────────────────────────────────────────────────────────────┘
```

#### 6.2 Migration Sequence

**Week 15: Adapter Development**
- Build extraction service (WordPress REST API client)
- Build transformation service (HTML → Strapi rich text)
- Build loading service (Strapi API client with batching)
- Implement checkpoint/resume capability
- Set up error queue and retry logic

**Week 16: Pilot Migration**
- Migrate 500–1,000 representative articles
- Include all content types (news, opinion, video, gallery)
- Include all years (oldest to newest)
- Include all categories and authors
- Validate manually (10% sample review)
- Obtain editorial sign-off

**Week 17–18: Bulk Migration**
- Migrate all 55,000 articles in batches (100–500 per batch)
- Media-first approach (upload all images before articles)
- Delta sync (WordPress webhook → Strapi for new/updated content)
- Reconciliation (source count = destination count)
- Generate redirect rules (old WordPress URLs → new Strapi URLs)
- Performance test (API response time under load)

#### 6.3 Quality Gates (Must Pass Before Stage 7)

- [ ] Adapter implemented and tested with pilot migration
- [ ] 100% of articles accounted for (migrated, excluded, or error)
- [ ] 100% of articles have `legacy_wordpress_post_id` field
- [ ] 99.5%+ of featured images successfully migrated
- [ ] 99%+ of inline media URLs rewritten correctly
- [ ] 100% of categories/tags mapped or documented as exception
- [ ] 100% of authors mapped or recreated
- [ ] SEO metadata (title, description, canonical) migrated where available
- [ ] Redirect rules generated for all changed URLs
- [ ] Editorial team validated 5% sample (2,750 articles)
- [ ] No broken links or 404s in validation crawl
- [ ] Kannada Unicode validated (no mojibake/corruption)
- [ ] Performance test passed (Strapi API stable under migration load)

**Gate Approval**: Migration sign-off by Migration Lead + Editorial Product Owner + SEO Lead

---

### Stage 7: Testing & Quality Assurance (Weeks 19–20)

**Objective**: Comprehensive testing before production deployment.

#### 7.1 Testing Pyramid

```text
                    ┌───────────────┐
                    │    E2E Tests  │  (10% of tests)
                    │  (Playwright) │
                    └───────────────┘
                   ┌─────────────────┐
                   │ Integration Tests│ (30% of tests)
                   │   (Jest + MSW)   │
                   └─────────────────┘
                  ┌───────────────────┐
                  │    Unit Tests     │ (60% of tests)
                  │      (Jest)       │
                  └───────────────────┘
```

#### 7.2 Test Coverage Requirements

| Test Type | Coverage Target | Tool | Validation |
|-----------|-----------------|------|------------|
| **Unit Tests** | ≥85% code coverage (backend), ≥80% (frontend) | Jest, React Testing Library | CI/CD blocks merge if below threshold |
| **Integration Tests** | ≥90% API endpoints, ≥85% user flows | Jest, MSW, Supertest | All critical paths tested |
| **E2E Tests** | 100% critical user journeys | Playwright, Cypress | Login, create article, publish, search |
| **Performance Tests** | P95 latency < 300ms, throughput ≥1000 req/s | k6, JMeter | Load test, stress test, spike test |
| **Security Tests** | Zero critical/high vulnerabilities | OWASP ZAP, Snyk, SonarQube | SAST, DAST, dependency scan |
| **Accessibility Tests** | WCAG 2.1 AA compliance | axe-core, WAVE | Automated + manual testing |
| **SEO Tests** | 100% URLs resolve, metadata parity | Screaming Frog, Sitebulb | Crawl test, metadata validation |
| **Migration Tests** | 100% data integrity | Custom reconciliation scripts | Source vs. destination count, checksum |

#### 7.3 Quality Gates (Must Pass Before Stage 8)

- [ ] All unit tests passing (≥85% backend, ≥80% frontend coverage)
- [ ] All integration tests passing (≥90% API, ≥85% user flows)
- [ ] All E2E tests passing (100% critical journeys)
- [ ] Performance test passed (P95 latency < 300ms, no errors under load)
- [ ] Security scan passed (zero critical/high vulnerabilities)
- [ ] Accessibility scan passed (WCAG 2.1 AA, zero critical issues)
- [ ] SEO crawl passed (100% URLs resolve, metadata parity)
- [ ] Migration reconciliation passed (100% data integrity)
- [ ] Disaster recovery test passed (backup restore in < 4 hours)
- [ ] UAT sign-off from editorial team (all features validated)

**Gate Approval**: QA sign-off by QA Lead + Security Engineer + Editorial Product Owner

---

### Stage 8: Production Deployment & Hypercare (Weeks 21–22)

**Objective**: Deploy to production with minimal risk and provide hypercare support.

#### 8.1 Deployment Strategy

**Blue-Green Deployment** (Zero-Downtime):

```text
┌─────────────────────────────────────────────────────────────┐
│                      Load Balancer                          │
│          (AWS ALB / Cloudflare Load Balancing)              │
└─────────────────────────────────────────────────────────────┘
              │                           │
              │                           │
    ┌─────────▼─────────┐       ┌─────────▼─────────┐
    │   Blue (Active)   │       │   Green (Idle)    │
    │   Production v1   │       │   Production v2   │
    │   (WordPress)     │       │   (Strapi)        │
    └───────────────────┘       └───────────────────┘
              │                           │
              │                           │
              └───────────┬───────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │   Database (Shared)   │
              │   PostgreSQL + Redis  │
              └───────────────────────┘
```

**Deployment Steps**:

1. **Deploy Green Environment**: Deploy Strapi + React apps to green environment (parallel to blue/WordPress)
2. **Smoke Test Green**: Run automated smoke tests on green environment
3. **Switch Load Balancer**: Gradually shift traffic (10% → 50% → 100%)
4. **Monitor**: Watch error rates, latency, CPU/memory, database connections
5. **Rollback Plan**: If issues detected, switch back to blue immediately

#### 8.2 Hypercare Support (Weeks 21–22)

| Support Type | Duration | Responsibility |
|--------------|----------|----------------|
| **24/7 On-Call** | 2 weeks post-launch | DevOps + Backend Lead |
| **Daily Standup** | 2 weeks post-launch | Entire team (15 min daily) |
| **Issue Triage** | 2 weeks post-launch | QA Lead + Product Owner |
| **Performance Monitoring** | 4 weeks post-launch | DevOps + Backend Lead |
| **SEO Monitoring** | 4 weeks post-launch | SEO Lead + Analytics |
| **Editorial Support** | 4 weeks post-launch | Product Owner + Training Lead |

#### 8.3 Quality Gates (Must Pass Before Project Closure)

- [ ] Production deployment successful (zero downtime)
- [ ] Smoke tests passed (all critical features functional)
- [ ] Error rate < 0.1% (first 24 hours)
- [ ] P95 latency < 300ms (first week)
- [ ] No critical/high security vulnerabilities detected
- [ ] SEO traffic stable (no significant drop in impressions/clicks)
- [ ] Editorial team trained and comfortable with new system
- [ ] All hypercare issues resolved or have mitigation plan
- [ ] Documentation complete (architecture, API, operations, troubleshooting)
- [ ] Lessons learned documented (retrospective meeting held)

**Gate Approval**: Project closure sign-off by CTO + Editorial Product Owner + DevOps Lead

---

## 4. Development Best Practices

### 4.1 Code Quality Standards

| Practice | Tool | Enforcement |
|----------|------|-------------|
| **TypeScript** | TypeScript 5+ | Mandatory for all new code |
| **ESLint** | ESLint + Prettier | CI/CD blocks merge on linting errors |
| **Code Review** | GitHub/GitLab PRs | Mandatory 2 approvals before merge |
| **Branch Protection** | GitHub/GitLab rules | No direct commits to main/master |
| **Semantic Versioning** | Git tags | All releases versioned (v1.0.0, v1.1.0) |
| **Changelog** | CHANGELOG.md | All changes documented |
| **Documentation** | Markdown + Swagger | All features documented before merge |

### 4.2 Git Workflow

**GitFlow with Feature Flags**:

```text
main (production)
  │
  ├───release/v1.0 (staging)
  │     │
  │     ├───feature/ai-tagging (feature branch)
  │     ├───feature/workflow-review (feature branch)
  │     └───feature/migration-adapter (feature branch)
  │
  └───develop (integration)
```

**Rules**:
- Feature branches: `feature/{feature-name}`
- Release branches: `release/v{version}`
- Hotfix branches: `hotfix/{issue-number}`
- All branches must have associated Jira ticket
- Feature flags for incomplete features (LaunchDarkly/ConfigCat)

### 4.3 CI/CD Pipeline

**GitHub Actions Example**:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop, feature/*]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm run test:unit
      - run: npm run test:integration
      - run: npm run build

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

  deploy-staging:
    needs: [test, security]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run build
      - run: ./deploy.sh staging

  deploy-production:
    needs: [test, security]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run build
      - run: ./deploy.sh production
```

---

## 5. Risk Management

### 5.1 Risk Register

| Risk | Probability | Impact | Mitigation | Owner |
|------|-------------|--------|------------|-------|
| **WordPress custom fields unmapped** | Medium | High | Complete discovery before migration; pilot with 1,000 articles | Migration Lead |
| **SEO traffic loss** | Medium | High | Slug preservation, redirect matrix, pre/post-launch crawls | SEO Lead |
| **AI misclassification** | Medium | Medium | Controlled vocabulary, confidence thresholds, editorial approval | AI Lead |
| **Performance degradation** | Low | High | Load testing, caching strategy, CDN, database indexing | DevOps Lead |
| **Security vulnerability** | Low | High | SAST/DAST scans, dependency updates, penetration testing | Security Engineer |
| **Editorial team resistance** | Medium | Medium | Early involvement, training, feedback loops, phased rollout | Product Owner |
| **Migration data loss** | Low | High | Checkpoint/resume, reconciliation, backup before migration | Migration Lead |
| **AI cost overrun** | Medium | Low | Token limits, rate limits, budget alerts, cost monitoring | AI Lead |
| **Strapi upgrade breaks custom code** | Low | Medium | Use supported extensions, version control, upgrade testing | Backend Lead |
| **Key developer attrition** | Medium | High | Documentation, pair programming, knowledge sharing sessions | CTO |

### 5.2 Escalation Matrix

| Issue Severity | Response Time | Escalation Path |
|----------------|---------------|-----------------|
| **Critical (P0)** | 15 minutes | On-call Engineer → DevOps Lead → CTO |
| **High (P1)** | 1 hour | Backend/Frontend Lead → DevOps Lead |
| **Medium (P2)** | 4 hours | Feature Team Lead → Product Owner |
| **Low (P3)** | 24 hours | Feature Team Lead → Backlog |

---

## 6. Success Metrics

### 6.1 Technical KPIs

| Metric | Target | Measurement |
|--------|--------|-------------|
| **API Latency (P95)** | < 300ms | Prometheus/Grafana |
| **Error Rate** | < 0.1% | Error tracking (Sentry) |
| **Uptime** | ≥ 99.9% | Uptime monitoring |
| **Page Load Time (FCP)** | < 1.5s | Lighthouse, WebPageTest |
| **Database Query Time (P95)** | < 100ms | Database monitoring |
| **Cache Hit Ratio** | ≥ 80% | Redis monitoring |
| **Build Time** | < 10 minutes | CI/CD pipeline metrics |
| **Deployment Time** | < 5 minutes | CI/CD pipeline metrics |
| **Test Coverage** | ≥85% backend, ≥80% frontend | Jest, Coverage reports |
| **Security Vulnerabilities** | 0 critical/high | Snyk, OWASP ZAP |

### 6.2 Business KPIs

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Editorial Productivity** | +30% articles/day | CMS analytics |
| **AI Adoption Rate** | ≥80% editors using AI features | AI Console analytics |
| **Migration Success Rate** | 100% articles migrated | Migration reconciliation |
| **SEO Traffic** | No drop >5% post-launch | Google Search Console |
| **User Satisfaction** | ≥4.5/5 rating | Editorial team survey |
| **Time to Publish** | -40% (AI-assisted workflow) | CMS workflow analytics |
| **Content Quality** | Improved (editorial review) | Editorial feedback |

---

## 7. Documentation Deliverables

| Document | Owner | Due Date |
|----------|-------|----------|
| **Architecture Decision Records (ADRs)** | Solution Architect | Week 2 |
| **API Documentation (Swagger)** | Backend Lead | Week 6 |
| **Frontend Component Library (Storybook)** | Frontend Lead | Week 14 |
| **AI Governance Policy** | AI Lead | Week 8 |
| **Migration Playbook** | Migration Lead | Week 15 |
| **Operations Manual** | DevOps Lead | Week 20 |
| **Troubleshooting Guide** | QA Lead | Week 20 |
| **User Training Materials** | Product Owner | Week 21 |
| **Lessons Learned Report** | CTO | Week 22 |

---

## 8. Project Timeline Summary

| Stage | Duration | Key Deliverable | Gate Approval |
|-------|----------|-----------------|---------------|
| **Stage 1: Foundation** | Weeks 1–2 | Infrastructure provisioned | DevOps Lead + Security |
| **Stage 2: Strapi CMS** | Weeks 3–4 | Content types, workflows, RBAC | Strapi Lead + Editorial |
| **Stage 3: API Layer** | Weeks 5–6 | Custom APIs, OpenAPI spec | Backend Lead + Frontend |
| **Stage 4: AI Services** | Weeks 7–8 | AI integration, governance | AI Lead + Editorial + Security |
| **Stage 5: Frontend** | Weeks 9–14 | Customer app + AI Console | Frontend Lead + UX + QA |
| **Stage 6: Migration** | Weeks 15–18 | WordPress → Strapi migration | Migration Lead + Editorial + SEO |
| **Stage 7: Testing** | Weeks 19–20 | Comprehensive testing | QA Lead + Security + Editorial |
| **Stage 8: Deployment** | Weeks 21–22 | Production launch + hypercare | CTO + Editorial + DevOps |

**Total Duration**: 22 weeks (5.5 months)

---

## 9. Conclusion

This development methodology ensures a **robust, bug-free, enterprise-grade platform** through:

1. **Sequential layering** (infrastructure → CMS → API → AI → frontend → migration)
2. **Strict quality gates** at every stage (no parallel development across layers)
3. **Automated testing** (unit, integration, E2E, performance, security)
4. **AI governance** (human-in-the-loop, controlled vocabulary, audit trail)
5. **Zero-defect migration** (checkpoint/resume, reconciliation, rollback capability)
6. **Production readiness** (monitoring, logging, alerting, disaster recovery)

**Key Success Factor**: Editorial team involvement from Day 1 (content model design, workflow approval, UAT sign-off).

---

**Document Control**

| Item | Value |
|------|-------|
| Document | Development Methodology: Strapi + React JS + AI Console |
| Version | 1.0 |
| Date | 08 September 2026 |
| Prepared By | Solution Architecture Team |
| Approved By | CTO |
| Project | News Karnataka AI-Enabled Editorial Platform |

