"""
Create AI Console Features Presentation
AI-Enabled Multilingual News Platform - Phase 2
"""

from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor

def add_title_slide(prs, title, subtitle):
    """Add title slide"""
    slide_layout = prs.slide_layouts[6]  # Blank layout
    slide = prs.slides.add_slide(slide_layout)
    
    # Background
    background = slide.background
    fill = background.fill
    fill.solid()
    fill.fore_color.rgb = RGBColor(102, 0, 153)  # Purple
    
    # Title
    title_box = slide.shapes.add_textbox(
        Inches(0.5), Inches(2), Inches(9), Inches(1.5)
    )
    title_frame = title_box.text_frame
    title_frame.word_wrap = True
    p = title_frame.paragraphs[0]
    p.text = title
    p.font.size = Pt(54)
    p.font.bold = True
    p.font.color.rgb = RGBColor(255, 255, 255)
    p.alignment = PP_ALIGN.CENTER
    
    # Subtitle
    subtitle_box = slide.shapes.add_textbox(
        Inches(0.5), Inches(3.8), Inches(9), Inches(1.5)
    )
    subtitle_frame = subtitle_box.text_frame
    subtitle_frame.word_wrap = True
    p = subtitle_frame.paragraphs[0]
    p.text = subtitle
    p.font.size = Pt(28)
    p.font.color.rgb = RGBColor(0, 255, 200)  # Cyan
    p.alignment = PP_ALIGN.CENTER
    
    return slide

def add_content_slide(prs, title, bullet_points, bg_color=None):
    """Add content slide with bullet points"""
    slide_layout = prs.slide_layouts[6]  # Blank layout
    slide = prs.slides.add_slide(slide_layout)
    
    # Background
    background = slide.background
    fill = background.fill
    fill.solid()
    fill.fore_color.rgb = bg_color if bg_color else RGBColor(245, 245, 245)
    
    # Title bar
    title_shape = slide.shapes.add_shape(
        1,  # Rectangle
        Inches(0), Inches(0), Inches(10), Inches(0.8)
    )
    title_shape.fill.solid()
    title_shape.fill.fore_color.rgb = RGBColor(102, 0, 153)  # Purple
    title_shape.line.color.rgb = RGBColor(102, 0, 153)
    
    # Title text
    title_frame = title_shape.text_frame
    title_frame.text = title
    title_frame.paragraphs[0].font.size = Pt(40)
    title_frame.paragraphs[0].font.bold = True
    title_frame.paragraphs[0].font.color.rgb = RGBColor(255, 255, 255)
    title_frame.margin_left = Inches(0.3)
    title_frame.margin_top = Inches(0.1)
    
    # Content
    content_box = slide.shapes.add_textbox(
        Inches(0.5), Inches(1.2), Inches(9), Inches(5.5)
    )
    text_frame = content_box.text_frame
    text_frame.word_wrap = True
    
    for i, point in enumerate(bullet_points):
        if i == 0:
            p = text_frame.paragraphs[0]
        else:
            p = text_frame.add_paragraph()
        
        p.text = point
        p.level = 0
        p.font.size = Pt(18)
        p.font.color.rgb = RGBColor(40, 40, 40)
        p.space_before = Pt(8)
        p.space_after = Pt(8)
    
    return slide

def create_ai_console_pptx():
    """Create AI Console presentation"""
    prs = Presentation()
    prs.slide_width = Inches(10)
    prs.slide_height = Inches(7.5)
    
    # Slide 1: Title
    add_title_slide(
        prs,
        "AI Console",
        "Intelligent Content Management & Publishing Platform"
    )
    
    # Slide 2: Overview
    add_content_slide(prs, "Phase 2: AI Console Overview", [
        "🎯 Purpose: Enterprise-grade content management for editors",
        "📊 Ingest: Multi-channel content aggregation",
        "🤖 Validate: AI-powered intelligent validation",
        "📋 Publish: One-click editorial publishing",
        "📈 Analyze: Real-time engagement analytics",
        "⏱️ Timeline: Q3-Q4 2026 (4 months, parallel with Phase 1)",
        "💰 Budget: $600K-$800K"
    ])
    
    # Slide 3: Content Sources
    add_content_slide(prs, "Multi-Channel Content Ingestion", [
        "💬 WhatsApp Groups: Monitor news channels & discussions",
        "     • Auto-extract URLs, images, text content",
        "     • NLP-based classification",
        "",
        "🐦 Twitter: Real-time streams & hashtag monitoring",
        "     • URL resolution • Thread resolution • Influencer tracking",
        "",
        "📷 Instagram: Business accounts & hashtag monitoring",
        "     • Image OCR • Caption analysis • Engagement tracking",
        "",
        "🔗 RSS Feeds: Traditional news sources"
    ])
    
    # Slide 4: AI Validation Pipeline
    add_content_slide(prs, "AI-Powered Content Validation (Groq & LLMs)", [
        "🔴 STAGE 1: Groq Ultra-Fast Validation (~100ms)",
        "     • Content understanding • Entity extraction",
        "     • Quick categorization • Quality assessment",
        "",
        "🔵 STAGE 2: ML-Enhanced Analysis",
        "     • Engagement prediction • Duplicate detection • Trending analysis",
        "",
        "🟣 STAGE 3: Claude Accuracy Validation (High-stakes only)",
        "     • Fact consistency • Misinformation detection • Bias analysis",
        "",
        "🟢 STAGE 4: Consensus Scoring → Color Code Assignment"
    ])
    
    # Slide 5: Color-Coded Priority System
    add_content_slide(prs, "Intelligent Priority Assignment System", [
        "🔴 RED (Urgent/Critical) - 95%+ confidence",
        "     • Breaking news, emergencies, disasters",
        "     • Auto-escalates to dashboard top • SMS alerts to management",
        "",
        "🟠 ORANGE (Hot/Trending) - 87% confidence",
        "     • High engagement potential • Featured placement",
        "     • Publish within 1 hour",
        "",
        "🟡 YELLOW (Standard) - 72% confidence",
        "     • Regular quality news • Scheduled publishing available",
        "",
        "🟢 GREEN (Low Priority) - 65% confidence",
        "🔳 BLACK (Reject/Spam) - Misinformation flagged"
    ])
    
    # Slide 6: Editor Dashboard
    add_content_slide(prs, "AI Editor Dashboard (Command Center)", [
        "📊 Real-Time Story Queue:",
        "     • 🔴 2 | 🟠 12 | 🟡 34 | 🟢 45 | ⚫ 8 (Live counts)",
        "",
        "🎯 Smart Filters:",
        "     • By Location | Category | Source | Confidence Level",
        "",
        "⚡ One-Click Actions:",
        "     • Publish immediately (RED) | Schedule (YELLOW/ORANGE)",
        "     • Batch approve/reject | Drag-drop prioritization",
        "",
        "📈 Real-Time Analytics Widget:",
        "     • Publishing rate • Processing time • System health"
    ])
    
    # Slide 7: Content Validation Details
    add_content_slide(prs, "Multi-Stage Content Validation", [
        "✅ Stage 1: Quality Assessment",
        "     • Minimum length • Grammar & language quality • Relevance scoring",
        "",
        "✅ Stage 2: Credibility Scoring",
        "     • Source reputation • Historical accuracy • Editorial bias detection",
        "",
        "✅ Stage 3: Fact-Checking",
        "     • Claim verification • Cross-reference • Misinformation detection",
        "",
        "✅ Stage 4: Engagement Prediction",
        "     • Viral potential • Audience impact • Trending probability"
    ])
    
    # Slide 8: Analytics Dashboard
    add_content_slide(prs, "NewsWhip-Style Real-Time Analytics", [
        "📊 Engagement Metrics:",
        "     • Total engagements (likes + comments + shares + views)",
        "     • Engagement rate per 1000 impressions",
        "     • Viral score & trending trajectory",
        "",
        "👥 Audience Analytics:",
        "     • Location breakdown (Bangalore/Mysore/Mangalore)",
        "     • Demographics (age, gender)",
        "     • Device breakdowns (mobile vs. web)",
        "",
        "💬 Sentiment Analysis:",
        "     • Positive vs. negative comments",
        "     • Comment quality scoring"
    ])
    
    # Slide 9: Performance Metrics Display
    add_content_slide(prs, "Story Performance Dashboard Example", [
        "📰 Story: 'Breaking: Tech Announcement'",
        "",
        "⚡ Engagement (2 hours after publish):",
        "     • Total: 15,234 engagements (↑23% vs. average)",
        "     • Likes: 8,432 | Comments: 2,156 | Shares: 4,646",
        "     • Impressions: 245,000 | Engagement Rate: 6.2%",
        "",
        "📈 Trending Status: 🔥 #1 in Bangalore",
        "⏱️ Viral Projection: 50,000+ total engagements predicted"
    ])
    
    # Slide 10: Groq/LLM Integration
    add_content_slide(prs, "Groq & LLM Technology Stack", [
        "⚡ Groq (Primary): Ultra-fast LLM inference (<100ms)",
        "     • All initial content validation • Real-time processing",
        "     • Cost: $0.001 per 1K tokens",
        "",
        "🧠 Claude 3.5 (Secondary): High-accuracy validation",
        "     • Edge cases • Critical stories • Complex analysis",
        "     • Cost: $0.01 per 1K tokens",
        "",
        "💰 Cost-Effective: ~$0.35 per 1000 stories validated",
        "📊 Accuracy: 96% with multi-model consensus"
    ])
    
    # Slide 11: Groq Processing Workflow
    add_content_slide(prs, "Groq Processing Pipeline", [
        "1️⃣ Content arrives from WhatsApp/Twitter/Instagram",
        "",
        "2️⃣ Groq processes in 50-100ms:",
        "     • Summarize • Extract entities • Categorize • Score quality",
        "",
        "3️⃣ Parallel ML processing (100-200ms):",
        "     • Engagement prediction • Trending analysis",
        "",
        "4️⃣ Fact-check APIs (async, 500ms-1s):",
        "     • Verify claims • Cross-reference • Detect misinformation",
        "",
        "5️⃣ Total: ~1-2 seconds per story • Instant dashboard display"
    ])
    
    # Slide 12: Source Management
    add_content_slide(prs, "Source Management & Credibility", [
        "🔗 Source Registry:",
        "     • Centralized directory of all monitoring sources",
        "     • Performance metrics per source",
        "     • Credibility scoring & trending",
        "",
        "🛡️ Quality Control:",
        "     • Automatic pause for low-quality sources",
        "     • Manual approval workflow for new sources",
        "     • Reputation tracking over time",
        "",
        "📊 Analytics:",
        "     • Accuracy rate per source",
        "     • Average engagement per story from source"
    ])
    
    # Slide 13: Editorial Workflows
    add_content_slide(prs, "Editor Workflow & Publishing", [
        "1️⃣ Automatic Triage: System assigns color priority (🔴-⚫)",
        "",
        "2️⃣ Editorial Review: Editor reviews AI classification",
        "     • Can override if needed • Add context/tags",
        "",
        "3️⃣ Publishing Decision:",
        "     • RED: One-click instant publish",
        "     • ORANGE/YELLOW: Schedule for optimal time",
        "     • BLACK: Manual review or reject",
        "",
        "4️⃣ Post-Publishing: Auto-track engagement & gather feedback"
    ])
    
    # Slide 14: Batch Publishing
    add_content_slide(prs, "Advanced Batch Operations", [
        "📋 Scheduled Publishing:",
        "     • Queue multiple stories for specific times",
        "     • Optimize for peak user activity windows",
        "     • Batch location-specific deployments",
        "",
        "🎯 Thematic Collections:",
        "     • Group related stories into 'Special Coverage'",
        "     • Coordinate multi-source reporting",
        "     • Create narrative arcs for ongoing stories",
        "",
        "🔄 Bulk Operations:",
        "     • Bulk approve/reject • Bulk location tagging",
        "     • Bulk category reassignment"
    ])
    
    # Slide 15: Technical Stack
    add_content_slide(prs, "Technical Architecture", [
        "🔄 Data Streaming: Apache Kafka (real-time ingestion)",
        "🤖 ML/AI:",
        "     • Groq, Claude, Google Gemini (LLM validation)",
        "     • TensorFlow/Scikit-learn (traditional ML)",
        "",
        "🗄️ Databases:",
        "     • PostgreSQL (transactional data)",
        "     • ClickHouse (analytics & OLAP)",
        "     • InfluxDB (time-series metrics)",
        "",
        "🎯 Frontend: React.js + WebSockets (real-time)",
        "📊 Visualization: D3.js, Chart.js"
    ])
    
    # Slide 16: Deployment Architecture
    add_content_slide(prs, "Deployment & Infrastructure", [
        "☁️ Cloud: AWS/GCP/Azure",
        "",
        "🐳 Containerization: Docker",
        "🎵 Orchestration: Kubernetes",
        "",
        "📡 Streaming: Apache Kafka cluster",
        "⚡ Caching: Redis cluster",
        "🔍 Search: Elasticsearch cluster",
        "",
        "📊 Monitoring: Prometheus + Grafana",
        "📝 Logging: ELK Stack (Elasticsearch, Logstash, Kibana)"
    ])
    
    # Slide 17: Launch Timeline
    add_content_slide(prs, "Phase 2 Launch Timeline", [
        "📅 Month 1: Infrastructure & Core Services",
        "     • Cloud setup • Database provisioning • Kafka cluster",
        "",
        "📅 Month 2: Source Integrations",
        "     • WhatsApp API • Twitter Streams • Instagram API • RSS",
        "",
        "📅 Month 3: Dashboard & ML Pipeline",
        "     • Editor dashboard • Groq integration • ML models",
        "",
        "📅 Month 4: Analytics & Optimization",
        "     • Analytics dashboard • Performance tuning • Beta launch"
    ])
    
    # Slide 18: Success Metrics
    add_content_slide(prs, "Phase 2 Success Metrics", [
        "📊 Processing:",
        "     • 1000+ stories/day processed",
        "     • 800ms - 1.5 seconds per story validation",
        "",
        "💪 Quality:",
        "     • 95%+ publishing accuracy",
        "     • 90%+ ML prediction accuracy",
        "",
        "📈 Efficiency:",
        "     • 60% reduction in manual work time",
        "     • Editor satisfaction: 8.0+/10",
        "",
        "🔧 Reliability:",
        "     • 99.5% system uptime"
    ])
    
    # Slide 19: Cost Analysis
    add_content_slide(prs, "AI Console Cost Breakdown", [
        "💾 Monthly Processing (1000 stories/day):",
        "",
        "🔴 Groq: $6/month (all initial validation)",
        "🔵 Claude: $9/month (10% high-stakes stories)",
        "🟢 Gemini: $1/month (verification)",
        "📋 Fact-Check APIs: $5/month",
        "",
        "💰 Total: ~$21/month (~$252/year)",
        "📊 Cost per story: Less than 1 cent!"
    ])
    
    # Slide 20: Team & Resources
    add_content_slide(prs, "Phase 2 Team Structure", [
        "👨‍💻 Engineering: 8 developers",
        "     • 3 Backend • 2 Frontend • 2 ML Engineers",
        "",
        "🤖 Data Science: 2 ML engineers (dedicated)",
        "🧪 QA: 3 QA engineers",
        "⚙️ DevOps: 1 DevOps engineer",
        "📊 Design: 1 UX/UI designer",
        "🎯 Product: 1 Product manager",
        "",
        "📈 Total: 17 team members"
    ])
    
    # Slide 21: Competitive Advantages
    add_content_slide(prs, "Why AI Console is Revolutionary", [
        "⚡ Ultra-Fast Processing: Groq <100ms inference",
        "🤖 Multi-Model Consensus: 96% accuracy (Groq + Claude)",
        "💰 Cost-Effective: $0.35 per 1000 stories",
        "📊 Real-Time Analytics: NewsWhip-style intelligence",
        "🎯 Intelligent Prioritization: Color-coded auto-classification",
        "🔄 Multi-Source Integration: WhatsApp, Twitter, Instagram",
        "📈 Scalable: Can process 10,000+ stories/day"
    ])
    
    # Slide 22: Risk & Mitigation
    add_content_slide(prs, "Key Risks & Mitigation", [
        "⚠️ LLM API Availability:",
        "     → Fallback models, circuit breakers, graceful degradation",
        "",
        "⚠️ False Negatives (Misinformation not caught):",
        "     → Editor review, fact-check APIs, user flagging",
        "",
        "⚠️ False Positives (Good news flagged as spam):",
        "     → Manual override, feedback loop, model retraining",
        "",
        "⚠️ Cost Overruns:",
        "     → Budget monitoring, query optimization, batch processing"
    ])
    
    # Slide 23: Integration with Phase 1
    add_content_slide(prs, "Integration with Customer App (Phase 1)", [
        "🔗 Symbiotic Relationship:",
        "",
        "Phase 2 (AI Console) → Phase 1 (Customer App):",
        "     • Validates & publishes stories",
        "     • Sends to Customer App for distribution",
        "",
        "Phase 1 (Customer App) → Phase 2 (AI Console):",
        "     • Provides engagement data (likes, comments, shares)",
        "     • Feeds back into ML training",
        "     • Improves AI accuracy over time",
        "",
        "📈 Continuous Improvement Loop"
    ])
    
    # Slide 24: Future Enhancements
    add_content_slide(prs, "Future Enhancements (Post-Phase 2)", [
        "🎬 Video Content Support: Auto-validate video stories",
        "🌍 Language Support: Multilingual content validation",
        "🎙️ Audio Transcription: Convert podcasts to text",
        "📊 Advanced Reporting: Custom report generation",
        "🔔 Smart Notifications: AI determines optimal push timing",
        "🌐 Regional Expansion: Scale beyond Karnataka",
        "🤝 API for Partners: Third-party integrations"
    ])
    
    # Slide 25: Next Steps
    add_content_slide(prs, "Next Steps (Action Items)", [
        "✅ Infrastructure Planning: Cloud architecture design",
        "✅ API Setup: Register with Groq, Claude, Twitter APIs",
        "✅ Team Hiring: Hire ML engineers, backend developers",
        "✅ Database Design: Schema planning for high volume",
        "✅ Kafka Setup: Event streaming infrastructure",
        "✅ Dashboard Design: Figma mockups for editor interface",
        "✅ Start Development: Begin Phase 2 in parallel"
    ])
    
    # Slide 26: Summary
    add_title_slide(
        prs,
        "AI Console: Ready to Transform Publishing",
        "Intelligent Content Management & Real-Time Analytics"
    )
    
    # Save presentation
    prs.save('AI_Console_Features.pptx')
    print("✅ Created: AI_Console_Features.pptx (26 slides)")

if __name__ == "__main__":
    create_ai_console_pptx()
