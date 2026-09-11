# AI/ML Technology Stack & Content Validation Pipeline
## NewsKarnataka Intelligent Content Management System

**Project:** NewsKarnataka WordPress to Strapi Migration  
**Status:** Pre-Implementation  
**Date:** September 2026

---

## EXECUTIVE SUMMARY

Comprehensive AI/ML infrastructure for NewsKarnataka enabling:
- **Real-time content validation** (< 2 seconds per article)
- **Automated priority classification** (RED/YELLOW/GREEN)
- **Multi-language processing** (Kannada, English, Tulu)
- **Engagement prediction** (trending probability)
- **Content quality scoring** (0-100)
- **Misinformation detection** (fact-checking)
- **Auto-publishing** (for pre-approved content)

---

## PART 1: LLM INFRASTRUCTURE

### 1.1 Primary LLM: Groq Mixtral 8x7b

```
Why Groq Mixtral?
├─ Ultra-fast inference: < 100ms latency
├─ Cost-effective: ~₹0.35 per 1000 tokens
├─ Multi-language: Kannada, English support
├─ Reliable: 99.9% uptime SLA
├─ API-first: Easy integration
└─ Scalable: Handles 10K+ requests/day

Groq API Specifications:
├─ Endpoint: api.groq.com/openai/v1/chat/completions
├─ Model: mixtral-8x7b-32768
├─ Max tokens: 32,768
├─ Token limit per request: 500 (input + output)
├─ Rate limit: 30 requests/minute (free tier)
├─ Concurrent requests: 10
└─ Timeout: 30 seconds

Pricing:
├─ Input tokens: ₹0.14 per 1M tokens
├─ Output tokens: ₹0.42 per 1M tokens
├─ Estimated usage: 1000 articles/day × 200 tokens = 200K tokens
├─ Daily cost: ~₹0.03-0.05
├─ Monthly cost: ₹0.90-1.50
└─ Annual cost: ₹10.80-18 (extremely cost-effective)

Request Format:
```json
{
  "model": "mixtral-8x7b-32768",
  "messages": [
    {
      "role": "system",
      "content": "You are a news content validator..."
    },
    {
      "role": "user",
      "content": "Validate this article: [article_text]"
    }
  ],
  "temperature": 0.3,
  "max_tokens": 500
}
```

```

### 1.2 Backup LLM: OpenAI GPT-4

```
When to Use GPT-4:
├─ Groq API fails or rate-limited
├─ Complex reasoning needed
├─ Fact-checking required
├─ Edge cases needing accuracy

GPT-4 Specifications:
├─ Model: gpt-4-turbo
├─ Max tokens: 128,000
├─ Cost: ₹3-5 per 1000 tokens (expensive)
├─ Latency: 1-3 seconds
├─ Rate limit: 3,500 requests/minute (paid)
└─ Use sparingly: Only for 5-10% of articles

Implementation:
├─ Try Groq first (primary)
├─ Fall back to GPT-4 if Groq fails
├─ Log all fallback events
├─ Monitor costs (budget alert at ₹5000/month)
└─ Max budget: ₹1000/month for fallback
```

### 1.3 Fallback: Google Gemini Pro

```
Third-Tier LLM:
├─ Model: gemini-pro
├─ Cost: ₹1-2 per 1M tokens (free tier available)
├─ Latency: < 1 second
├─ Max tokens: 30,000
└─ Use if both Groq and GPT-4 fail

LLM Priority Chain:
1. Groq Mixtral (< 100ms) → Primary
2. GPT-4 Turbo (1-3s) → Backup for critical
3. Gemini Pro (< 1s) → Last resort
4. Local Model (fallback) → Basic validation only

Fallback Logic (Python):
```python
async def validate_with_fallback(article):
    # Try Groq first
    try:
        result = await groq_client.validate(article)
        return result
    except RateLimitError:
        log.warning("Groq rate limited, using GPT-4")
        return await gpt4_client.validate(article)
    except Exception as e:
        log.warning(f"GPT-4 failed: {e}, using Gemini")
        return await gemini_client.validate(article)
```
```

---

## PART 2: CONTENT VALIDATION PIPELINE

### 2.1 Validation Architecture

```
Article Input
    │
    ├─ Title: string
    ├─ Content: rich text (HTML/Markdown)
    ├─ Category: enum (politics, business, etc.)
    ├─ Author: string
    └─ Images: URL list
    │
    ▼
Step 1: Text Preprocessing
    ├─ HTML tag removal (keep semantic structure)
    ├─ Special character normalization
    ├─ Unicode encoding validation (Kannada chars)
    ├─ Language detection (kannada|english|tulu)
    ├─ Text length validation (min 100 chars, max 50K)
    └─ Profanity check (basic filter)
    │
    ▼
Step 2: Groq LLM Analysis (< 100ms)
    ├─ Content understanding (summarization)
    ├─ Fact plausibility (does it sound accurate?)
    ├─ Bias detection (political, gender bias)
    ├─ Sensationalism score (0-100)
    ├─ Quality assessment (0-100)
    ├─ Misinformation risk (low|medium|high)
    └─ Priority classification (RED|YELLOW|GREEN|BLACK)
    │
    ▼
Step 3: ML Model Scoring
    ├─ Engagement prediction (0-100)
    ├─ Trending probability (0-100)
    ├─ Audience appeal (0-100)
    ├─ Content relevance (0-100)
    └─ Combined score (0-100)
    │
    ▼
Step 4: Fact-Checking (if HIGH RISK)
    ├─ Extract named entities (places, people, orgs)
    ├─ Query fact-check APIs
    ├─ Cross-reference databases
    └─ Generate verification report
    │
    ▼
Step 5: Output: Validation Result
    ├─ Priority: RED|YELLOW|GREEN|BLACK
    ├─ Confidence: 0-100%
    ├─ Quality score: 0-100
    ├─ Engagement score: 0-100
    ├─ Trending score: 0-100
    ├─ Recommendations: [array]
    └─ Reason: human-readable explanation
    │
    ▼
Step 6: Action
    ├─ GREEN → Auto-publish
    ├─ YELLOW → Notify editor (needs review)
    ├─ RED → Hold for manual review
    └─ BLACK → Reject (misinformation, spam)
```

### 2.2 Priority Classification Logic

```
Priority Levels & Actions:

GREEN (High Quality, Auto-publish)
├─ Criteria:
│  ├─ Quality score > 75
│  ├─ Engagement score > 60
│  ├─ No misinformation risk
│  ├─ Appropriate category
│  └─ Proper language
├─ Action: Auto-publish to live site
├─ Editor: Notified only
└─ Timeline: Immediate (< 5 min)

YELLOW (Medium Priority, Editor Review)
├─ Criteria:
│  ├─ Quality score 50-75
│  ├─ Moderate engagement potential
│  ├─ Minor fact-checking needed
│  └─ May need editing
├─ Action: Queue for editor review
├─ Editor: Alert with suggestions
├─ Timeline: 1-2 hours
└─ Manual approval needed

RED (High Risk, Manual Review Required)
├─ Criteria:
│  ├─ Quality score < 50
│  ├─ Potential misinformation
│  ├─ Low engagement probability
│  └─ Fact-checking failed
├─ Action: Hold in pending state
├─ Editor: Requires manual verification
├─ Timeline: 4-24 hours
└─ Can be edited and re-submitted

BLACK (Reject, Do Not Publish)
├─ Criteria:
│  ├─ Confirmed misinformation
│  ├─ Spam/malicious content
│  ├─ Copyright violation
│  ├─ Illegal content
│  └─ Category mismatch > 80%
├─ Action: Automatic rejection
├─ Editor: Notified with reason
├─ Timeline: Permanent (unless appealed)
└─ Manual override: Possible by admin
```

### 2.3 Prompt Engineering

**System Prompt:**
```
You are NewsKarnataka's intelligent content validator. Your task is to analyze 
news articles and provide structured feedback on quality, engagement potential, 
and publishing readiness.

Evaluate based on:
1. Factual Accuracy: Does the article seem factually plausible?
2. Clarity: Is the writing clear and well-organized?
3. Relevance: Is it relevant to the target audience?
4. Engagement: Will readers find this interesting?
5. Bias: Is there obvious political or gender bias?
6. Sensationalism: Is the headline overstated?
7. Language Quality: Is the language grammatically correct? (Support Kannada)
8. Sources: Are sources mentioned and credible?

Respond in JSON format with scores and recommendations.
```

**User Prompt Template:**
```
Validate this article:

Title: [article_title]
Category: [category]
Language: [kannada|english|tulu]
Content: [article_content_first_500_chars]...

Provide:
1. quality_score (0-100)
2. engagement_score (0-100)
3. trending_probability (0-100)
4. priority (RED|YELLOW|GREEN|BLACK)
5. confidence (0-100)
6. risk_factors: [array]
7. recommendations: [array]
8. reason: "brief explanation"
```

**Expected Response:**
```json
{
  "quality_score": 78,
  "engagement_score": 65,
  "trending_probability": 42,
  "priority": "GREEN",
  "confidence": 87,
  "risk_factors": [],
  "recommendations": [
    "Add more specific quotes",
    "Consider adding statistics"
  ],
  "reason": "Well-written article with good relevance to Karnataka audience"
}
```

---

## PART 3: ML MODELS FOR SCORING

### 3.1 Engagement Prediction Model

```
Technology: TensorFlow 2.x + Scikit-learn
Training Data: Historical articles (55K+ samples)
Features Extracted:
├─ Text features:
│  ├─ Word count
│  ├─ Sentiment (positive/negative/neutral)
│  ├─ Named entity count (people, places, organizations)
│  ├─ Question count (questions drive engagement)
│  └─ Keyword importance (TF-IDF)
├─ Category features:
│  ├─ Category ID (encoded)
│  ├─ Subcategory
│  └─ Historical performance by category
├─ Time features:
│  ├─ Day of week
│  ├─ Hour of day
│  └─ Season/holidays
└─ Image features:
   ├─ Featured image presence
   ├─ Image quality (resolution)
   └─ Image type (photo, graphic, video)

Target Variable: Comments per article (proxy for engagement)
Model: Gradient Boosting (XGBoost or LightGBM)
Accuracy: 75-85% (R² score)
Latency: < 100ms for prediction

Prediction Output:
├─ engagement_score: 0-100
├─ confidence_interval: [lower, upper]
└─ contributing_factors: [feature importance ranking]
```

### 3.2 Trending Detection Model

```
What Makes an Article Trending:
├─ Rapid engagement increase (likes, shares, views)
├─ Social media mentions
├─ Search volume spike
├─ Related breaking events
├─ Celebrity or prominent person mention
└─ Seasonal/cultural relevance

Trending Model:
├─ Input: Article metadata + LLM scores
├─ Historical trending data: 55K articles scored
├─ Features:
│  ├─ Category trending history
│  ├─ Author influence (past trending articles)
│  ├─ Topic relevance (current events)
│  ├─ Keyword relevance (Google Trends)
│  ├─ Urgency/recency
│  └─ Competitor coverage (if available)
├─ Model: Neural Network (MLP or LSTM)
├─ Output: Trending score (0-100)
└─ Confidence: 70-80%

Real-time Trending Feed:
├─ Track articles published in last 24 hours
├─ Rank by trending_score + engagement_score
├─ Update every hour
└─ Display top 10-20 on homepage
```

### 3.3 Quality Score Composition

```
Multi-factor Quality Scoring:

1. Content Quality (weight: 30%)
   ├─ Grammar & spelling (automated check)
   ├─ Clarity & readability (LLM assessment)
   ├─ Structure & organization (LLM)
   └─ Uniqueness (plagiarism check)

2. Factual Accuracy (weight: 30%)
   ├─ Source credibility (if cited)
   ├─ Fact-checking verification
   ├─ Statistical accuracy
   └─ Quote accuracy

3. Relevance (weight: 20%)
   ├─ Category match
   ├─ Audience fit
   ├─ Newsworthiness
   └─ Timeliness

4. Engagement Potential (weight: 20%)
   ├─ Headline effectiveness
   ├─ Topic interest
   ├─ Featured image quality
   └─ Call-to-action clarity

Final Quality Score = 
  0.30 × content_quality +
  0.30 × factual_accuracy +
  0.20 × relevance +
  0.20 × engagement_potential
```

---

## PART 4: FACT-CHECKING INTEGRATION

### 4.1 Fact-Check APIs

```
Primary Fact-Check Sources:
├─ Google Fact Check API
│  └─ Verify against fact-check articles
├─ Snopes API
│  └─ Urban legends, common claims
├─ FactCheck.org API
│  └─ Political claims verification
└─ India-specific:
   ├─ FactChecker India
   ├─ Newsmeter
   └─ AltNews

Entity Extraction & Verification:
├─ Named Entity Recognition (spaCy, NLTK)
│  ├─ Extract: People, Places, Organizations, Events
│  ├─ Match against knowledge base
│  └─ Flag unrecognized entities
└─ Claim Extraction:
   ├─ "X said Y" claims
   ├─ "X happened in Y location"
   ├─ Numerical claims (statistics)
   └─ Query fact-check APIs

Fact-Check Result:
├─ Claim: "Statement being verified"
├─ Verification status: verified|false|disputed|unverified
├─ Confidence: 0-100%
├─ Source: Which fact-check organization
└─ Link: URL to fact-check article
```

### 4.2 Misinformation Detection

```
Misinformation Red Flags:
├─ Sensational headlines (ALL CAPS, multiple exclamation marks)
├─ Emotional language (highly charged words)
├─ Unverified claims (no source attribution)
├─ False urgency ("Act now!" "Limited time!")
├─ Conspiracy language ("They don't want you to know...")
├─ Appeal to emotion (fear, anger, outrage)
├─ Misleading images (decontextualized photos)
├─ Poor grammar/spelling (indicates low quality)
├─ Clickbait titles (diverges from article content)
└─ Contradicts established facts

Detection Algorithm:
1. Text analysis (NLP)
   ├─ Sentiment extremity (too positive/negative)
   ├─ Language toxicity (Perspective API)
   └─ Emotional manipulation (keyword matching)

2. Fact-checking
   ├─ Extract verifiable claims
   ├─ Cross-reference with fact-check APIs
   └─ Flag unverified claims

3. Source analysis
   ├─ Check author credibility
   ├─ Verify publication source
   └─ Check for reliable citations

4. Image analysis (optional Phase 2)
   ├─ Reverse image search
   ├─ Check date and context
   └─ Detect manipulated images

Misinformation Score:
├─ 0-20: No risk (trustworthy)
├─ 21-40: Low risk (minor issues)
├─ 41-60: Medium risk (requires review)
├─ 61-80: High risk (likely misinformation)
└─ 81-100: Very high risk (reject)
```

---

## PART 5: MULTI-LANGUAGE PROCESSING

### 5.1 Language Detection & Support

```
Supported Languages:
├─ Kannada (kn) [PRIMARY for NewsKarnataka]
│  ├─ Script: Kannada (native Unicode)
│  ├─ Speakers: 50M+ (target audience)
│  └─ NLP libraries: spaCy (limited), custom models
│
├─ English (en) [SECONDARY]
│  ├─ Script: Latin
│  ├─ Speakers: 150M+ (international)
│  └─ NLP libraries: spaCy, NLTK (excellent support)
│
└─ Tulu (tu) [TERTIARY]
   ├─ Script: Kannada/Malayalam
   ├─ Speakers: 2M+ (regional)
   └─ NLP libraries: Limited (basic support)

Language Detection:
├─ Library: TextBlob, langdetect, fasttext
├─ Accuracy: 95%+ for major languages
├─ Fallback: Analyze script and character set
└─ Store detected language with article

Language-Specific Processing:

For Kannada:
├─ Tokenization: Character-level (complex morphology)
├─ Stopwords: Kannada stopword list
├─ Stemming: Kannada suffix removal
├─ NER: Custom model trained on Kannada corpus
├─ Sentiment: Pre-trained Kannada sentiment model
└─ Translation: (optional) Google Translate API

For English:
├─ Tokenization: Word-level (standard)
├─ Stopwords: English stopword list
├─ Stemming: Porter stemmer
├─ NER: SpaCy English model
├─ Sentiment: Pre-trained English sentiment
└─ Translation: Google Translate API

For Tulu:
├─ Tokenization: Character-level (experimental)
├─ Stopwords: Basic Tulu stopwords
├─ Language support: Limited (future enhancement)
└─ Fallback: Treat as Kannada for processing
```

### 5.2 Kannada-Specific NLP

```
Kannada Processing Challenges:
├─ Complex morphology (agglutinative language)
├─ Limited training data for ML models
├─ Unicode normalization needed (NFKC)
├─ Compound words (need segmentation)
└─ Case variations (ಕಾ vs ಕಾಗ)

Kannada Libraries & Tools:
├─ Indic-NLP (multilingual support)
│  └─ Tokenization, stemming, normalization
├─ PyKannada (custom Kannada utilities)
├─ Google Translate API (translation)
└─ Custom models (trained on NewsKarnataka corpus)

Unicode Normalization (Kannada):
```python
import unicodedata

def normalize_kannada(text):
    # NFKC normalization (compatibility decomposition + composition)
    normalized = unicodedata.normalize('NFKC', text)
    return normalized

# Example:
# ಕಾರ್ಯಕ್ರಮ (composed) → normalized form
```

```
Kannada Sentiment Analysis:
├─ Pre-trained model: Distilbert-kannada (if available)
├─ Fallback: English sentiment → Translate to Kannada
├─ Training data: NewsKarnataka historical articles (labeled)
├─ Sentiment labels: Positive, Negative, Neutral
└─ Accuracy: 70-80% (limited training data)

Example Output:
```json
{
  "language": "kannada",
  "sentiment": "positive",
  "confidence": 0.78,
  "tokens": ["ಭಾರತ", "ಐತಿಹಾಸಿಕ", "ಜಯ", ...],
  "entities": [
    {"text": "ಭಾರತ", "label": "GPE"},
    {"text": "ಇಂಡಿಯಾ", "label": "ORG"}
  ]
}
```
```

---

## PART 6: IMPLEMENTATION ARCHITECTURE

### 6.1 Backend Service (Python FastAPI)

```
Service: AI Validation Microservice
Language: Python 3.11+
Framework: FastAPI (async, high performance)
Deployment: Docker container on AWS ECS

Endpoints:

POST /api/validate
├─ Request: { article: { title, content, category, language } }
├─ Response: { priority, score, confidence, recommendations, ... }
├─ Latency: < 2 seconds
└─ Rate limit: 100 req/min per API key

POST /api/validate/batch
├─ Request: { articles: [article1, article2, ...] }
├─ Response: [validation1, validation2, ...]
├─ Latency: < 100ms per article
└─ Use: Batch migration validation

POST /api/fact-check
├─ Request: { claim: "statement", language: "kannada" }
├─ Response: { status, source, confidence, link }
└─ Latency: 1-3 seconds (external API call)

GET /api/health
├─ Response: { status: "healthy", uptime, services: {...} }
└─ Used by: Kubernetes health checks

Stack:
├─ FastAPI: Web framework
├─ Pydantic: Data validation
├─ SQLAlchemy: Database ORM
├─ httpx: Async HTTP client (for Groq, fact-check APIs)
├─ Redis: Caching (LLM responses, ML predictions)
├─ Scikit-learn: ML models
├─ TensorFlow: Neural networks
└─ spaCy: NLP processing
```

### 6.2 Job Queue (BullMQ)

```
Background Jobs (Redis + BullMQ):

1. article_validation_queue
   ├─ Job: Validate article (Groq LLM)
   ├─ Concurrency: 10 workers
   ├─ Timeout: 30 seconds
   ├─ Retry: 3 attempts (exponential backoff)
   └─ Result: Stored in Strapi article.validation_result

2. fact_check_queue
   ├─ Job: Fact-check claims (external APIs)
   ├─ Concurrency: 5 workers (rate limited)
   ├─ Timeout: 60 seconds
   ├─ Retry: 1 attempt (expensive)
   └─ Result: Stored in database

3. ml_scoring_queue
   ├─ Job: Run ML models (engagement, trending)
   ├─ Concurrency: 20 workers
   ├─ Timeout: 5 seconds
   ├─ Retry: 2 attempts
   └─ Result: Updated in Strapi

4. auto_publish_queue
   ├─ Job: Auto-publish GREEN articles
   ├─ Concurrency: 1 worker (sequential)
   ├─ Timeout: 10 seconds
   ├─ Requirement: Approval from editor (if configured)
   └─ Action: Call Strapi API to set published=true

5. model_retraining_queue
   ├─ Job: Retrain ML models (weekly)
   ├─ Frequency: Every Sunday 02:00 UTC
   ├─ Duration: 1-2 hours
   ├─ Data: All articles from past 3 months
   └─ Result: New model weights saved to S3
```

### 6.3 Caching Strategy

```
Redis Cache:
├─ LLM responses (key: md5(article_id))
│  ├─ TTL: 24 hours
│  └─ Reuse if article unchanged
│
├─ ML model predictions
│  ├─ TTL: 24 hours
│  └─ Invalidate on model retrain
│
├─ Fact-check results (key: md5(claim))
│  ├─ TTL: 7 days
│  └─ Reuse same claim verification
│
└─ Language detection
   ├─ TTL: 30 days
   └─ Cache detected language
```

---

## PART 7: MONITORING & OPTIMIZATION

### 7.1 Metrics & KPIs

```
Validation Metrics:
├─ Validation accuracy (human reviews)
│  └─ Target: 95%+ (compare to editor decisions)
├─ False positive rate (incorrectly rejected)
│  └─ Target: < 5%
├─ False negative rate (incorrectly approved)
│  └─ Target: < 5%
└─ Latency (avg validation time)
   └─ Target: < 2 seconds per article

Model Performance:
├─ Engagement prediction R² score
│  └─ Target: > 0.75
├─ Trending detection accuracy
│  └─ Target: > 80%
├─ ML model precision/recall
│  └─ Target: > 0.85 each
└─ Fact-check accuracy
   └─ Target: > 90%

System Metrics:
├─ API uptime
│  └─ Target: 99.9%
├─ Queue processing time
│  └─ Target: < 5 min average
├─ Cache hit rate
│  └─ Target: > 70%
└─ Error rate
   └─ Target: < 0.5%
```

### 7.2 Continuous Improvement

```
Weekly Reviews:
├─ Analyze validation accuracy
├─ Identify misclassified articles
├─ Gather editor feedback
├─ Update prompt/rules

Monthly Retraining:
├─ Collect new labeled data
├─ Retrain ML models
├─ A/B test new model versions
├─ Deploy improvements

Quarterly Audits:
├─ Review false positives/negatives
├─ Update fact-check data sources
├─ Improve misinformation detection
├─ Language model updates

Annual Review:
├─ LLM model updates (new versions)
├─ ML architecture optimization
├─ New feature evaluation
└─ Scaling preparation
```

---

## SUMMARY

**AI/ML Capabilities Delivered:**
- ✅ Real-time content validation (< 2 sec)
- ✅ Automated priority classification (RED/YELLOW/GREEN)
- ✅ Multi-language support (Kannada, English, Tulu)
- ✅ Engagement & trending prediction
- ✅ Fact-checking integration
- ✅ Misinformation detection
- ✅ Auto-publishing for pre-approved content
- ✅ Continuous learning (model retraining)

**Technology Stack:**
- Groq Mixtral (LLM) - ultra-fast, cost-effective
- Python FastAPI (backend service)
- TensorFlow & Scikit-learn (ML models)
- spaCy (NLP)
- Redis BullMQ (job queue)
- AWS ECS (deployment)

**Cost Impact:**
- Groq LLM: ₹0.90-1.50/month (1000 articles/day)
- Infrastructure: Included in AWS bill (₹59K/month)
- Total AI/ML cost: < ₹2000/month

---

**AI/ML Stack Specification - COMPLETE**


