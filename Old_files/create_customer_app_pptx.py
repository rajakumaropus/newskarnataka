"""
Create Customer App Features Presentation
AI-Enabled Multilingual News Platform - Phase 1
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
    fill.fore_color.rgb = RGBColor(0, 51, 102)  # Dark blue
    
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
    p.font.color.rgb = RGBColor(255, 200, 0)  # Gold
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
    title_shape.fill.fore_color.rgb = RGBColor(0, 51, 102)
    title_shape.line.color.rgb = RGBColor(0, 51, 102)
    
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

def create_customer_app_pptx():
    """Create Customer App presentation"""
    prs = Presentation()
    prs.slide_width = Inches(10)
    prs.slide_height = Inches(7.5)
    
    # Slide 1: Title
    add_title_slide(
        prs,
        "Customer App",
        "AI-Powered Location-Based News Platform for Karnataka"
    )
    
    # Slide 2: Overview
    add_content_slide(prs, "Phase 1: Customer App Overview", [
        "🎯 Target: Hyper-localized news delivery for Karnataka users",
        "📍 Primary Markets: Bangalore, Mysore, Mangalore",
        "⏱️ Timeline: Q1-Q2 2026 (4 months)",
        "💰 Budget: $400K-$600K",
        "📱 Platforms: iOS, Android, Progressive Web App",
        "🎨 Platforms: Flutter (mobile) + React (web)"
    ])
    
    # Slide 3: Key Innovation
    add_content_slide(prs, "Key Innovation: Location-Based Hierarchy", [
        "📊 Revolutionary news prioritization model",
        "🏙️ Bangalore Users See:",
        "     • 50% Bangalore news (Tier-1 - Primary)",
        "     • 25% Mysore + Mangalore news (Tier-2 - Regional)",
        "     • 15% Karnataka National news (Tier-3)",
        "     • 10% International news (Tier-4)",
        "⚡ Override Rules: Critical & Hot news promoted immediately"
    ])
    
    # Slide 4: Core Features
    add_content_slide(prs, "Core User Features", [
        "📰 Smart Feed: Location-based, personalized news feed",
        "👍 Likes/Upvotes: Quick engagement signal",
        "💬 Comments & Replies: Discussion threads",
        "🔄 Share/Forward: Viral loops via messaging apps",
        "🔖 Bookmark/Save: Personal content curation",
        "📊 Read Analytics: Track your reading patterns",
        "🔔 Smart Notifications: Location & time-optimized alerts"
    ])
    
    # Slide 5: Engagement Features
    add_content_slide(prs, "Engagement & Retention Features", [
        "🏆 Gamification: User reputation & badges",
        "📈 Trending Stories: Real-time trending section",
        "🎯 Personalization: AI learns from interactions",
        "📝 Story Deep-Dives: Related stories & context",
        "🌙 Offline Mode: Read saved stories without internet",
        "⚙️ Preferences: Fine-tune your feed (categories, locations)",
        "🔐 Privacy-First: All data encrypted, GDPR compliant"
    ])
    
    # Slide 6: Priority Override System
    add_content_slide(prs, "Smart Priority Override System", [
        "🔴 CRITICAL (Breaking News): Emergencies, disasters",
        "     → Instant promotion to feed top",
        "     → Push notification to all users",
        "     → SMS alert to management",
        "",
        "🟠 HOT (Trending): High engagement, viral potential",
        "     → Featured placement in feed",
        "     → Algorithmic boost",
        "",
        "✨ Emerging Stories: AI detects trending with velocity"
    ])
    
    # Slide 7: User Personalization
    add_content_slide(prs, "AI-Powered Personalization", [
        "🤖 Feed Ranking Algorithm:",
        "     • User interaction history (likes, reads, shares)",
        "     • Content preferences (categories selected)",
        "     • Geographic relevance (location settings)",
        "     • Time decay (recent stories weighted higher)",
        "     • Engagement signals (comment sentiment, shares)",
        "",
        "📊 Continuous Learning: Model improves with every interaction"
    ])
    
    # Slide 8: Technical Stack
    add_content_slide(prs, "Technical Architecture", [
        "📱 Mobile: Flutter (iOS/Android cross-platform)",
        "🌐 Web: React/Next.js Progressive Web App",
        "⚙️ Backend: Node.js/Express + GraphQL",
        "🗄️ Database: PostgreSQL (primary)",
        "⚡ Cache: Redis (real-time data)",
        "🔍 Search: Elasticsearch (full-text search)",
        "🤖 ML/AI: TensorFlow/PyTorch (feed ranking)"
    ])
    
    # Slide 9: Launch Timeline
    add_content_slide(prs, "Launch Timeline & Milestones", [
        "📅 Month 1: Design & Development",
        "     • UI/UX finalization • Backend API setup",
        "     • Mobile app development • Database schema",
        "",
        "📅 Month 2: Beta Testing (1000 users - Bangalore)",
        "     • Closed beta testing • Bug fixes • Performance tuning",
        "",
        "📅 Month 3: Public Launch (Bangalore)",
        "     • App store releases • Marketing push • Analytics setup",
        "",
        "📅 Month 4: Expansion (Mysore & Mangalore)"
    ])
    
    # Slide 10: Success Metrics
    add_content_slide(prs, "Phase 1 Success Metrics", [
        "🎯 User Acquisition:",
        "     • 50,000 app downloads by end of Q2",
        "     • 10,000+ Daily Active Users (DAU)",
        "",
        "💪 Engagement:",
        "     • 30%+ engagement rate per session",
        "     • Average session length: 8+ minutes",
        "",
        "📈 Retention:",
        "     • 40% 7-day retention rate",
        "     • 4.0+ app store rating"
    ])
    
    # Slide 11: User Demographics
    add_content_slide(prs, "Target User Profile", [
        "👥 Age: 18-65 years",
        "📱 Tech-Savvy: Smartphone users",
        "🌆 Urban Focus: Metro & Tier-2 cities",
        "📰 News Interest: Current events, local happenings",
        "🔄 Social: Share news with friends/family",
        "⏰ Active Times: Morning commute, lunch, evening",
        "💬 Engagement: Comment & discuss on stories"
    ])
    
    # Slide 12: Competitive Advantages
    add_content_slide(prs, "Why This App Wins", [
        "🏆 Location-Based Hierarchy: Unique, not available elsewhere",
        "💬 Heavy Interactivity: Comments, replies, forward features",
        "🤖 AI Personalization: Learns from your interactions",
        "⚡ Real-Time Trending: Breaking news prioritization",
        "📊 Smart Notifications: Personalized alert timing",
        "🌍 Regional Focus: Karnataka-first, not India-wide",
        "🔐 Privacy: User data protected & encrypted"
    ])
    
    # Slide 13: Monetization Path (Optional)
    add_content_slide(prs, "Future Revenue Opportunities", [
        "📍 Phase 2: Premium subscription (Ad-free experience)",
        "📊 Phase 2: Sponsored content integration",
        "🎯 Phase 3: Advertisement portal (self-serve ads)",
        "📈 Phase 3: Advanced analytics for publishers",
        "💰 Current Focus: User acquisition & engagement",
        "",
        "🎯 Target: Break-even at 100K monthly active users"
    ])
    
    # Slide 14: Team & Resources
    add_content_slide(prs, "Phase 1 Team Structure", [
        "👨‍💻 Engineering: 6 developers",
        "     • 4 Mobile (Flutter iOS/Android)",
        "     • 2 Backend (Node.js/Express)",
        "",
        "🎨 Design: 2 UX/UI designers",
        "🧪 QA: 2 QA engineers",
        "📊 Product: 1 Product manager",
        "📈 Total: 11 team members"
    ])
    
    # Slide 15: Budget Breakdown
    add_content_slide(prs, "Budget Allocation ($500K)", [
        "👥 Payroll (60%): $300K",
        "     • Engineer salaries: $200K • Design: $50K • QA: $40K • PM: $10K",
        "",
        "☁️ Infrastructure (15%): $75K",
        "     • Cloud services • Database • CDN • Monitoring",
        "",
        "🛠️ Tools & Services (15%): $75K",
        "     • Development tools • Testing tools • Analytics",
        "",
        "📱 App Deployment (10%): $50K"
    ])
    
    # Slide 16: Risk & Mitigation
    add_content_slide(prs, "Key Risks & Mitigation", [
        "⚠️ User Adoption Risk:",
        "     → Mitigation: Marketing partnerships, influencer collaborations",
        "",
        "⚠️ Technical Performance:",
        "     → Mitigation: Load testing, CDN optimization, caching",
        "",
        "⚠️ Competitive Pressure:",
        "     → Mitigation: Unique features, rapid iteration, community building",
        "",
        "⚠️ Data Privacy/GDPR:",
        "     → Mitigation: Privacy-by-design, regular audits"
    ])
    
    # Slide 17: Next Steps
    add_content_slide(prs, "Next Steps (Action Items)", [
        "✅ Budget Approval: $400K-$600K",
        "✅ Team Formation: Hire 6 engineers, 2 designers, 2 QA",
        "✅ Infrastructure Setup: Cloud environment, databases",
        "✅ Design System: Finalize UI components",
        "✅ API Design: GraphQL schema & endpoints",
        "✅ Start Development: Begin coding Phase 1",
        "✅ Setup Analytics: Install tracking infrastructure"
    ])
    
    # Slide 18: Summary
    add_title_slide(
        prs,
        "Customer App: Ready to Launch",
        "Location-Based News Platform for Karnataka"
    )
    
    # Save presentation
    prs.save('Customer_App_Features.pptx')
    print("✅ Created: Customer_App_Features.pptx (18 slides)")

if __name__ == "__main__":
    create_customer_app_pptx()
