"""
Create Advanced Customer-Facing News App Proposal
8-Week Timeline | ₹10,00,000 + GST
Premium Features & Advanced Functionality
"""

from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor

def add_title_slide(prs, title, subtitle, budget=""):
    """Add title slide with professional design"""
    slide_layout = prs.slide_layouts[6]  # Blank layout
    slide = prs.slides.add_slide(slide_layout)
    
    # Background gradient simulation with dark blue
    background = slide.background
    fill = background.fill
    fill.solid()
    fill.fore_color.rgb = RGBColor(10, 30, 70)  # Deep blue
    
    # Title
    title_box = slide.shapes.add_textbox(
        Inches(0.5), Inches(1.5), Inches(9), Inches(2)
    )
    title_frame = title_box.text_frame
    title_frame.word_wrap = True
    p = title_frame.paragraphs[0]
    p.text = title
    p.font.size = Pt(60)
    p.font.bold = True
    p.font.color.rgb = RGBColor(255, 255, 255)
    p.alignment = PP_ALIGN.CENTER
    
    # Subtitle
    subtitle_box = slide.shapes.add_textbox(
        Inches(0.5), Inches(3.7), Inches(9), Inches(1.5)
    )
    subtitle_frame = subtitle_box.text_frame
    subtitle_frame.word_wrap = True
    p = subtitle_frame.paragraphs[0]
    p.text = subtitle
    p.font.size = Pt(28)
    p.font.color.rgb = RGBColor(0, 200, 255)  # Bright cyan
    p.alignment = PP_ALIGN.CENTER
    
    # Budget info
    if budget:
        budget_box = slide.shapes.add_textbox(
            Inches(0.5), Inches(5.5), Inches(9), Inches(1)
        )
        budget_frame = budget_box.text_frame
        p = budget_frame.paragraphs[0]
        p.text = budget
        p.font.size = Pt(24)
        p.font.bold = True
        p.font.color.rgb = RGBColor(0, 255, 150)  # Green
        p.alignment = PP_ALIGN.CENTER
    
    return slide

def add_content_slide(prs, title, bullet_points, bg_color=None):
    """Add content slide with bullet points"""
    slide_layout = prs.slide_layouts[6]
    slide = prs.slides.add_slide(slide_layout)
    
    # Background
    background = slide.background
    fill = background.fill
    fill.solid()
    fill.fore_color.rgb = bg_color if bg_color else RGBColor(248, 248, 250)
    
    # Title bar
    title_shape = slide.shapes.add_shape(
        1,  # Rectangle
        Inches(0), Inches(0), Inches(10), Inches(0.85)
    )
    title_shape.fill.solid()
    title_shape.fill.fore_color.rgb = RGBColor(10, 30, 70)
    title_shape.line.color.rgb = RGBColor(10, 30, 70)
    
    # Title text
    title_frame = title_shape.text_frame
    title_frame.text = title
    title_frame.paragraphs[0].font.size = Pt(42)
    title_frame.paragraphs[0].font.bold = True
    title_frame.paragraphs[0].font.color.rgb = RGBColor(255, 255, 255)
    title_frame.margin_left = Inches(0.3)
    title_frame.margin_top = Inches(0.15)
    
    # Content
    content_box = slide.shapes.add_textbox(
        Inches(0.5), Inches(1.2), Inches(9), Inches(5.8)
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
        p.font.size = Pt(17)
        p.font.color.rgb = RGBColor(30, 30, 40)
        p.space_before = Pt(6)
        p.space_after = Pt(6)
    
    return slide

def create_proposal_pptx():
    """Create advanced customer proposal presentation"""
    prs = Presentation()
    prs.slide_width = Inches(10)
    prs.slide_height = Inches(7.5)
    
    # Slide 1: Title Slide
    add_title_slide(
        prs,
        "Advanced News Platform",
        "Premium Mobile Application with AI Integration",
        "Budget: ₹10,00,000 + GST | Timeline: 8 Weeks"
    )
    
    # Slide 2: Project Overview
    add_content_slide(prs, "Project Overview & Scope", [
        "🎯 Build an advanced, feature-rich news application for Karnataka",
        "📱 iOS & Android native apps + Progressive Web App",
        "🤖 AI-powered location-specific news visibility",
        "💬 Advanced engagement features (comments, sharing, bookmarks)",
        "📊 Real-time analytics & trending detection",
        "📍 Hyper-localized content based on user location",
        "💰 Multiple revenue streams (advertising, premium subscriptions)"
    ])
    
    # Slide 3: Key Features & Differentiators
    add_content_slide(prs, "Premium Features & Differentiators", [
        "🏆 Location-Based News Hierarchy",
        "     • Bangalore → Mysore → Mangalore → National → International",
        "",
        "🤖 AI Integration for Smart Content Discovery",
        "     • Groq-powered NLP for content classification",
        "     • Real-time trending detection & prediction",
        "",
        "💬 Advanced Engagement Features",
        "     • Rich commenting with threading",
        "     • Social sharing to WhatsApp, Twitter, FB",
        "     • Content bookmarking & reading lists"
    ])
    
    # Slide 4: Technology Stack - Frontend
    add_content_slide(prs, "Technology Stack - Frontend Layer", [
        "📱 Mobile Development",
        "     • Framework: Flutter 3.x (iOS & Android)",
        "     • State Management: BLoC/Provider architecture",
        "     • Local Storage: Hive for offline caching",
        "     • Push Notifications: Firebase Cloud Messaging",
        "",
        "🌐 Web Platform",
        "     • Framework: React 18.x + Next.js",
        "     • PWA Support: Offline functionality",
        "     • UI Framework: Material-UI / Shadcn/ui",
        "     • Real-time Updates: WebSocket integration"
    ])
    
    # Slide 5: Technology Stack - Backend
    add_content_slide(prs, "Technology Stack - Backend Services", [
        "⚙️ Backend Framework",
        "     • Node.js 18+ with Express.js",
        "     • TypeScript for type safety",
        "     • GraphQL + REST API endpoints",
        "",
        "🗄️ Database",
        "     • Primary: PostgreSQL 14+ (structured data)",
        "     • Cache: Redis (session & real-time data)",
        "     • Search: Elasticsearch (full-text search)",
        "",
        "🤖 AI & ML Services",
        "     • Groq LLM for content validation",
        "     • TensorFlow/Scikit-learn for ML models",
        "     • Python FastAPI for ML endpoints"
    ])
    
    # Slide 6: Architecture Diagram (Text-based)
    add_content_slide(prs, "System Architecture Overview", [
        "📲 Client Layer:",
        "     Flutter App ↔ React Web ↔ Progressive Web App",
        "",
        "🌐 API Layer:",
        "     Express.js (Node.js) → GraphQL/REST APIs",
        "     Load Balancing & Rate Limiting",
        "",
        "💾 Data Layer:",
        "     PostgreSQL (Primary) | Redis (Cache) | Elasticsearch",
        "",
        "🤖 AI/ML Layer:",
        "     Groq LLM Integration | TensorFlow Models | NLP Processing",
        "",
        "📡 Real-time Layer:",
        "     WebSocket Connections | Push Notifications | Event Streaming"
    ])
    
    # Slide 7: AI Integration - Location-Based Visibility
    add_content_slide(prs, "AI Integration: Smart Location-Based News", [
        "🧠 Groq LLM Powered Content Classification",
        "     • Ultra-fast (<100ms) content understanding",
        "     • Automatic location tagging & extraction",
        "     • Relevance scoring for user location",
        "",
        "📍 Intelligent News Ranking Engine",
        "     • 50% Local news (user's city)",
        "     • 25% Regional news (Karnataka)",
        "     • 15% National news (India)",
        "     • 10% International news",
        "",
        "⚡ Real-Time Trending Detection",
        "     • AI identifies trending topics in real-time",
        "     • Breaking news auto-detection & prioritization",
        "     • Predictive trending (what will trend next hour)"
    ])
    
    # Slide 8: Core Features - News Feed
    add_content_slide(prs, "Feature 1: Advanced News Feed", [
        "📰 Intelligent Feed System",
        "     • Location-aware content prioritization",
        "     • Personalized based on reading history",
        "     • AI-powered trending stories",
        "     • Smart content recommendations",
        "",
        "🔔 Smart Notifications",
        "     • Location-specific alerts",
        "     • Breaking news instant notifications",
        "     • Customizable notification preferences",
        "     • Quiet hours settings",
        "",
        "🎯 Content Discovery",
        "     • Search with autocomplete",
        "     • Category-based browsing",
        "     • Trending section with 24h insights"
    ])
    
    # Slide 9: Core Features - Engagement
    add_content_slide(prs, "Feature 2: Advanced Engagement System", [
        "💬 Rich Comment Thread System",
        "     • Nested reply threads (up to 5 levels)",
        "     • Comment upvoting/downvoting",
        "     • Mention & tagging other users",
        "     • Rich text formatting support",
        "",
        "👍 Advanced Reaction System",
        "     • Multiple reaction types (like, love, wow, sad)",
        "     • Share counter with social integration",
        "     • Bookmark for reading list",
        "",
        "🔄 Social Sharing",
        "     • Share to WhatsApp, Twitter, Facebook, Email",
        "     • Custom share message with story summary",
        "     • Deep linking to shared stories"
    ])
    
    # Slide 10: Core Features - User Profiles
    add_content_slide(prs, "Feature 3: User Profiles & Personalization", [
        "👤 User Profile System",
        "     • Profile with avatar & bio",
        "     • Reading history tracking",
        "     • Saved stories/bookmarks collection",
        "     • Followed topics/categories",
        "",
        "⚙️ Advanced Preferences",
        "     • Location selection (multiple cities)",
        "     • Category preferences with weights",
        "     • Language selection (English, Kannada, etc)",
        "     • Notification fine-tuning",
        "",
        "📊 Personal Analytics Dashboard",
        "     • Reading time insights",
        "     • Favorite topics & categories",
        "     • Engagement statistics"
    ])
    
    # Slide 11: Revenue - Advertising Real Estate
    add_content_slide(prs, "Revenue Stream: Advertising & Real Estate", [
        "💰 Premium Advertising Model",
        "     • Banner ads (top of feed, sidebar)",
        "     • Native ads (sponsored articles)",
        "     • Video pre-roll ads (30-60 seconds)",
        "     • Interstitial ads (between stories)",
        "",
        "🏢 Real Estate Revenue Opportunity",
        "     • Geo-targeted classified listings integration",
        "     • Property news section",
        "     • Local builder/realtor partnerships",
        "     • Sponsored property listings",
        "",
        "📈 Projected Revenue",
        "     • Ad impressions: 100K+/day (₹5-10 CPM)",
        "     • Sponsored content: ₹10K-50K/month",
        "     • Real estate partnerships: ₹50K-100K/month"
    ])
    
    # Slide 12: Premium Subscription Features
    add_content_slide(prs, "Revenue Stream 2: Premium Subscription", [
        "⭐ Premium Tier Benefits (₹99/month)",
        "     • Ad-free reading experience",
        "     • Offline download (100 stories/month)",
        "     • Early access to stories",
        "     • Premium analytics dashboard",
        "",
        "🎁 Subscription Tiers",
        "     • Basic: Free (ads + limited features)",
        "     • Plus: ₹99/month (ad-free, offline)",
        "     • Pro: ₹199/month (all + analytics)",
        "",
        "📊 Revenue Projection",
        "     • Target: 1000 subscribers @ ₹99 = ₹99K/month",
        "     • Breakeven at 2000 monthly subscribers"
    ])
    
    # Slide 13: 8-Week Development Roadmap - Week 1-2
    add_content_slide(prs, "8-Week Roadmap: Week 1-2 (Design & Setup)", [
        "🎨 Week 1: UI/UX Design & Architecture",
        "     ✓ Figma mockups for all screens",
        "     ✓ Design system & component library",
        "     ✓ Database schema design",
        "     ✓ API endpoint specifications",
        "     ✓ Infrastructure setup (cloud, databases)",
        "",
        "⚙️ Week 2: Project Setup & Foundation",
        "     ✓ Flutter project initialization",
        "     ✓ React/Next.js setup",
        "     ✓ Node.js backend services structure",
        "     ✓ PostgreSQL database provisioning",
        "     ✓ Redis cache configuration",
        "     ✓ GitHub repositories & CI/CD pipelines"
    ])
    
    # Slide 14: 8-Week Roadmap - Week 3-4
    add_content_slide(prs, "8-Week Roadmap: Week 3-4 (Core Features)", [
        "📱 Week 3: Frontend Core Development",
        "     ✓ Flutter: News feed UI, story detail screen",
        "     ✓ React: Web app navigation, responsive layout",
        "     ✓ Bottom navigation, search screen",
        "     ✓ Authentication UI (login/signup)",
        "",
        "🔧 Week 4: Backend Core Services",
        "     ✓ User authentication & JWT tokens",
        "     ✓ News feed API endpoint",
        "     ✓ Story detail API",
        "     ✓ Search functionality",
        "     ✓ PostgreSQL queries optimization",
        "     ✓ Redis caching implementation"
    ])
    
    # Slide 15: 8-Week Roadmap - Week 5-6
    add_content_slide(prs, "8-Week Roadmap: Week 5-6 (AI & Engagement)", [
        "🤖 Week 5: AI Integration & Advanced Features",
        "     ✓ Groq LLM integration for content classification",
        "     ✓ Location-based news prioritization",
        "     ✓ Trending detection algorithm",
        "     ✓ Comment system implementation",
        "     ✓ Like/reaction system backend",
        "",
        "💬 Week 6: Engagement Features",
        "     ✓ Comment UI in Flutter & React",
        "     ✓ Nested reply system",
        "     ✓ Bookmark/save stories feature",
        "     ✓ Social sharing integration",
        "     ✓ User profile pages",
        "     ✓ Preferences management screens"
    ])
    
    # Slide 16: 8-Week Roadmap - Week 7-8
    add_content_slide(prs, "8-Week Roadmap: Week 7-8 (Testing & Launch)", [
        "🧪 Week 7: Testing & Optimization",
        "     ✓ Unit tests (80%+ coverage)",
        "     ✓ Integration testing",
        "     ✓ Performance optimization",
        "     ✓ Load testing (1000+ concurrent users)",
        "     ✓ Security audit & penetration testing",
        "     ✓ Analytics integration",
        "",
        "🚀 Week 8: Beta & Launch",
        "     ✓ Internal beta testing (50 users)",
        "     ✓ Bug fixes & refinements",
        "     ✓ App store submissions (Google Play, App Store)",
        "     ✓ Website launch",
        "     ✓ Marketing & user acquisition campaign"
    ])
    
    # Slide 17: Development Team
    add_content_slide(prs, "Development Team Structure", [
        "👨‍💻 Frontend Team (4 developers)",
        "     • 2 Flutter developers (iOS/Android)",
        "     • 2 React.js developers (Web/PWA)",
        "",
        "🔧 Backend Team (3 developers)",
        "     • 2 Node.js/Express backend developers",
        "     • 1 Database & DevOps engineer",
        "",
        "🤖 AI/ML Team (1 developer)",
        "     • Groq LLM integration specialist",
        "",
        "🎨 Design & QA (2 people)",
        "     • 1 UI/UX designer (Figma)",
        "     • 1 QA engineer",
        "",
        "📊 Project Management",
        "     • 1 Project Manager/Team Lead"
    ])
    
    # Slide 18: Budget Breakdown
    add_content_slide(prs, "Budget Breakdown: ₹10,00,000 + GST", [
        "👥 Team Salaries (60% - ₹6,00,000)",
        "     • Frontend: ₹2,00,000",
        "     • Backend: ₹1,80,000",
        "     • AI/ML: ₹60,000",
        "     • Design & QA: ₹1,00,000",
        "     • Project Management: ₹60,000",
        "",
        "☁️ Infrastructure & Tools (25% - ₹2,50,000)",
        "     • AWS/GCP cloud services: ₹1,20,000",
        "     • PostgreSQL, Redis, Elasticsearch: ₹60,000",
        "     • Development tools & licenses: ₹70,000",
        "",
        "📱 App Store & Deployment (15% - ₹1,50,000)",
        "     • App store certificates & developer accounts: ₹20,000",
        "     • Testing & QA services: ₹80,000",
        "     • Deployment & DevOps: ₹50,000"
    ])
    
    # Slide 19: UI/UX Design Highlights
    add_content_slide(prs, "UI/UX Design Highlights", [
        "🎨 Design System",
        "     • Modern material design principles",
        "     • Dark & light theme support",
        "     • Consistent typography & spacing",
        "     • Accessible color contrast ratios",
        "",
        "📱 Key Screens",
        "     • Home/Feed: Location-aware story grid",
        "     • Story Detail: Rich media + comments",
        "     • Search: Advanced filters & autocomplete",
        "     • Profile: User dashboard & preferences",
        "     • Bookmarks: Reading list & collections",
        "",
        "✨ User Experience",
        "     • Smooth animations & transitions",
        "     • Intuitive navigation patterns",
        "     • Loading states & error handling",
        "     • Offline-first architecture"
    ])
    
    # Slide 20: Security & Performance
    add_content_slide(prs, "Security, Privacy & Performance", [
        "🔐 Security Measures",
        "     • End-to-end encryption for user data",
        "     • JWT token-based authentication",
        "     • Rate limiting & DDoS protection",
        "     • HTTPS/TLS everywhere",
        "     • Regular security audits",
        "",
        "⚡ Performance Targets",
        "     • App startup: <2 seconds",
        "     • Feed load: <1.5 seconds",
        "     • API latency: <500ms",
        "     • 99.5% uptime SLA",
        "",
        "📊 Analytics & Monitoring",
        "     • Firebase Analytics integration",
        "     • Real-time error tracking (Sentry)",
        "     • Performance monitoring (New Relic)"
    ])
    
    # Slide 21: Success Metrics & KPIs
    add_content_slide(prs, "Success Metrics & Launch Goals", [
        "📊 3-Month Post-Launch Targets",
        "     • 50,000 app downloads",
        "     • 10,000+ daily active users (DAU)",
        "     • 30%+ engagement rate (users per session)",
        "     • 5,000+ daily article reads",
        "     • 4.0+ app store rating",
        "",
        "💰 Revenue Targets (3 months)",
        "     • Ad revenue: ₹50K-75K/month",
        "     • Premium subscriptions: ₹30K-40K/month",
        "     • Real estate partnerships: ₹20K-30K/month",
        "",
        "👥 User Acquisition",
        "     • Organic: 60% (store listings, referrals)",
        "     • Paid: 40% (ads, partnerships)"
    ])
    
    # Slide 22: Maintenance & Support
    add_content_slide(prs, "Post-Launch: Maintenance & Support (₹50K/month)", [
        "🔧 Ongoing Maintenance",
        "     • Bug fixes & patches: ₹15K",
        "     • Performance optimization: ₹10K",
        "     • Security updates & audits: ₹10K",
        "     • Server maintenance: ₹15K",
        "",
        "📈 Feature Enhancements",
        "     • New features development: ₹20K/month",
        "     • AI model updates: ₹15K/month",
        "     • A/B testing & optimization: ₹10K/month",
        "",
        "📊 Analytics & Insights",
        "     • Monthly performance reports",
        "     • User behavior analysis",
        "     • Revenue tracking & optimization"
    ])
    
    # Slide 23: Project Timeline Summary
    add_content_slide(prs, "Project Timeline Summary", [
        "📅 Total Duration: 8 Weeks",
        "",
        "Week 1-2:    Design & Infrastructure Setup",
        "Week 3-4:    Core Feature Development",
        "Week 5-6:    AI Integration & Engagement Features",
        "Week 7:      Testing, Optimization & Security",
        "Week 8:      Beta Testing & App Store Launch",
        "",
        "🚀 Launch Date: Within 8 Weeks from Project Start",
        "",
        "📊 Deliverables:",
        "     ✓ iOS app (production-ready)",
        "     ✓ Android app (production-ready)",
        "     ✓ Web app + PWA",
        "     ✓ Backend API & microservices",
        "     ✓ Admin dashboard"
    ])
    
    # Slide 24: Why Choose This Proposal
    add_content_slide(prs, "Why This Proposal Stands Out", [
        "🏆 Advanced Technology Stack",
        "     • Flutter for premium native apps",
        "     • Groq LLM for AI-powered features",
        "     • PostgreSQL for scalability",
        "",
        "⚡ Fast Development Timeline",
        "     • 8 weeks to production-ready app",
        "     • Agile methodology & rapid iteration",
        "     • Weekly stakeholder updates",
        "",
        "💰 Multiple Revenue Streams",
        "     • Advertising (highest potential)",
        "     • Premium subscriptions",
        "     • Real estate partnerships",
        "",
        "🎯 Proven Architecture",
        "     • Enterprise-grade scalability",
        "     • High performance (99.5% uptime)",
        "     • Security-first design"
    ])
    
    # Slide 25: Next Steps & Call to Action
    add_content_slide(prs, "Next Steps & Implementation", [
        "✅ Upon Approval:",
        "     1. Contract signature & advance payment (50%)",
        "     2. Team onboarding & kickoff meeting",
        "     3. Design finalization & feedback",
        "     4. Week 1 development begins",
        "",
        "📋 Deliverables Every 2 Weeks:",
        "     • Working prototype/demo",
        "     • GitHub repository access",
        "     • Development status report",
        "     • Stakeholder review sessions",
        "",
        "💡 Support & Contingency:",
        "     • 24/7 technical support during development",
        "     • 2-week post-launch support included",
        "     • Optional extended maintenance package"
    ])
    
    # Slide 26: Contact & Closing
    add_title_slide(
        prs,
        "Ready to Launch Your Premium News App?",
        "Advanced Features | Proven Technology | 8-Week Timeline",
        "Contact Us for Demo & Discussion"
    )
    
    # Save presentation
    prs.save('Advanced_News_App_Proposal.pptx')
    print("✅ Created: Advanced_News_App_Proposal.pptx (26 slides)")
    print("\nPresentation Details:")
    print("  • Total Slides: 26")
    print("  • Budget: ₹10,00,000 + GST")
    print("  • Timeline: 8 Weeks")
    print("  • Technology: Flutter, React, Node.js, PostgreSQL, Groq AI")
    print("  • Features: Location-based news, AI integration, advanced engagement")

if __name__ == "__main__":
    create_proposal_pptx()
