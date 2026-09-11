from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor

# Create presentation in widescreen format (16:9)
prs = Presentation()
prs.slide_width = Inches(10)
prs.slide_height = Inches(5.625)

# Define color scheme
PRIMARY_COLOR = RGBColor(25, 52, 107)  # Dark blue
ACCENT_COLOR = RGBColor(230, 126, 34)  # Orange
TEXT_COLOR = RGBColor(51, 51, 51)      # Dark gray
WHITE = RGBColor(255, 255, 255)

def add_title_slide(prs, title, subtitle):
    """Add enhanced title slide with AI prominence"""
    slide = prs.slides.add_slide(prs.slide_layouts[6])  # Blank layout
    
    # Gradient effect using two rectangles
    # Top half - Dark blue
    top_rect = slide.shapes.add_shape(1, Inches(0), Inches(0), Inches(10), Inches(2.8))
    top_rect.fill.solid()
    top_rect.fill.fore_color.rgb = PRIMARY_COLOR
    top_rect.line.color.rgb = PRIMARY_COLOR
    
    # Bottom half - Lighter shade
    bottom_rect = slide.shapes.add_shape(1, Inches(0), Inches(2.8), Inches(10), Inches(2.825))
    bottom_rect.fill.solid()
    bottom_rect.fill.fore_color.rgb = RGBColor(35, 70, 140)  # Slightly lighter blue
    bottom_rect.line.color.rgb = RGBColor(35, 70, 140)
    
    # AI Badge - Top Right
    ai_badge = slide.shapes.add_shape(1, Inches(7.2), Inches(0.3), Inches(2.5), Inches(0.6))
    ai_badge.fill.solid()
    ai_badge.fill.fore_color.rgb = ACCENT_COLOR
    ai_badge.line.color.rgb = ACCENT_COLOR
    
    ai_badge_text = ai_badge.text_frame
    p = ai_badge_text.paragraphs[0]
    p.text = "🤖 AI POWERED"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = WHITE
    p.alignment = PP_ALIGN.CENTER
    p.space_before = Pt(4)
    p.space_after = Pt(4)
    
    # Main Title
    title_box = slide.shapes.add_textbox(Inches(0.5), Inches(1.0), Inches(9), Inches(1.3))
    title_frame = title_box.text_frame
    title_frame.word_wrap = True
    p = title_frame.paragraphs[0]
    p.text = title
    p.font.size = Pt(60)
    p.font.bold = True
    p.font.color.rgb = WHITE
    
    # Subtitle with AI emphasis
    subtitle_box = slide.shapes.add_textbox(Inches(0.5), Inches(2.4), Inches(9), Inches(1.2))
    subtitle_frame = subtitle_box.text_frame
    subtitle_frame.word_wrap = True
    p = subtitle_frame.paragraphs[0]
    p.text = subtitle
    p.font.size = Pt(24)
    p.font.color.rgb = ACCENT_COLOR
    p.font.italic = True
    
    # AI Features Box
    features_box = slide.shapes.add_shape(1, Inches(0.5), Inches(3.2), Inches(9), Inches(2))
    features_box.fill.solid()
    features_box.fill.fore_color.rgb = RGBColor(245, 245, 245)
    features_box.line.color.rgb = ACCENT_COLOR
    features_box.line.width = Pt(3)
    
    features_text = slide.shapes.add_textbox(Inches(0.7), Inches(3.35), Inches(8.6), Inches(1.7))
    features_frame = features_text.text_frame
    features_frame.word_wrap = True
    
    ai_features = [
        "🚀 AI-Powered Authoring Console  •  🤖 Intelligent Content Moderation",
        "💡 Smart Recommendations  •  📊 Automated Analytics"
    ]
    
    for i, feature in enumerate(ai_features):
        if i == 0:
            p = features_frame.paragraphs[0]
        else:
            p = features_frame.add_paragraph()
        p.text = feature
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = PRIMARY_COLOR
        p.alignment = PP_ALIGN.CENTER
        p.space_before = Pt(2)
        p.space_after = Pt(2)
    
    return slide

def add_content_slide(prs, title, content_points):
    """Add content slide with bullet points"""
    slide = prs.slides.add_slide(prs.slide_layouts[6])  # Blank layout
    background = slide.background
    fill = background.fill
    fill.solid()
    fill.fore_color.rgb = RGBColor(245, 245, 245)
    
    # Title bar
    title_shape = slide.shapes.add_shape(1, Inches(0), Inches(0), Inches(10), Inches(0.8))
    title_shape.fill.solid()
    title_shape.fill.fore_color.rgb = PRIMARY_COLOR
    title_shape.line.color.rgb = PRIMARY_COLOR
    
    # Title text
    title_frame = title_shape.text_frame
    title_frame.word_wrap = True
    p = title_frame.paragraphs[0]
    p.text = title
    p.font.size = Pt(40)
    p.font.bold = True
    p.font.color.rgb = WHITE
    p.space_before = Pt(8)
    p.space_after = Pt(8)
    
    # Content
    content_box = slide.shapes.add_textbox(Inches(0.75), Inches(1.2), Inches(8.5), Inches(4))
    text_frame = content_box.text_frame
    text_frame.word_wrap = True
    
    for i, point in enumerate(content_points):
        if i == 0:
            p = text_frame.paragraphs[0]
        else:
            p = text_frame.add_paragraph()
        
        p.text = point
        p.font.size = Pt(18)
        p.font.color.rgb = TEXT_COLOR
        p.space_before = Pt(6)
        p.space_after = Pt(6)
        p.level = 0
        
        # Add bullet
        p.font.bold = False
    
    return slide

# PAGE 1: Title Slide
add_title_slide(prs, 
    "NewsKarnataka Platform",
    "Commercial Proposal - Digital Content Management System")

# PAGE 2: Project Overview
add_content_slide(prs,
    "Project Overview",
    [
        "• Multi-language news content management platform (English, Kannada, Telugu)",
        "• WordPress migration and integration for seamless content transition",
        "• Full-featured customer mobile & web application for content consumption",
        "• AI-enabled authoring and moderation console for content management",
        "• PostgreSQL database with 32 tables, RBAC security, and full-text search"
    ])

# PAGE 3: Key Deliverables
add_content_slide(prs,
    "Key Deliverables",
    [
        "✓ Customer Application (Web & Mobile) - React frontend with intuitive UI",
        "✓ Backend API System - Strapi CMS with full REST/GraphQL support",
        "✓ AI Authoring Console - AI-powered content creation and editing tools",
        "✓ Moderation System - Intelligent content moderation with AI assistance",
        "✓ Multi-language Support - Content in EN, KN, TU with full-text search",
        "✓ Analytics & Reporting - Usage analytics, engagement metrics, audit logs"
    ])

# PAGE 4: Project Scope & Timeline
slide = prs.slides.add_slide(prs.slide_layouts[6])
background = slide.background
fill = background.fill
fill.solid()
fill.fore_color.rgb = RGBColor(245, 245, 245)

# Title bar
title_shape = slide.shapes.add_shape(1, Inches(0), Inches(0), Inches(10), Inches(0.8))
title_shape.fill.solid()
title_shape.fill.fore_color.rgb = PRIMARY_COLOR
title_shape.line.color.rgb = PRIMARY_COLOR
title_frame = title_shape.text_frame
p = title_frame.paragraphs[0]
p.text = "Project Scope & Timeline"
p.font.size = Pt(40)
p.font.bold = True
p.font.color.rgb = WHITE
p.space_before = Pt(8)
p.space_after = Pt(8)

# Left column - Scope
scope_box = slide.shapes.add_textbox(Inches(0.5), Inches(1.2), Inches(4.5), Inches(4))
scope_frame = scope_box.text_frame
scope_frame.word_wrap = True

scope_items = ["• Customer App", "• AI Console", "• Backend APIs", "• Database", "• Deployment", "• Documentation"]
for i, item in enumerate(scope_items):
    if i == 0:
        p = scope_frame.paragraphs[0]
    else:
        p = scope_frame.add_paragraph()
    p.text = item
    p.font.size = Pt(16)
    p.font.color.rgb = TEXT_COLOR
    p.space_before = Pt(4)
    p.space_after = Pt(4)

# Right column - Timeline
timeline_box = slide.shapes.add_textbox(Inches(5.2), Inches(1.2), Inches(4.3), Inches(4))
timeline_frame = timeline_box.text_frame
timeline_frame.word_wrap = True

timeline_items = [
    "Timeline: 16 Weeks",
    "",
    "Week 1-2: Setup & Planning",
    "Week 3-8: Development",
    "Week 9-14: Testing & AI Integration",
    "Week 15-16: Deployment & Handover"
]
for i, item in enumerate(timeline_items):
    if i == 0:
        p = timeline_frame.paragraphs[0]
    else:
        p = timeline_frame.add_paragraph()
    p.text = item
    p.font.size = Pt(16) if i == 0 else Pt(14)
    p.font.bold = True if i == 0 else False
    p.font.color.rgb = ACCENT_COLOR if i == 0 else TEXT_COLOR
    p.space_before = Pt(4)
    p.space_after = Pt(4)

# PAGE 5: Investment & Payment Terms
slide = prs.slides.add_slide(prs.slide_layouts[6])
background = slide.background
fill = background.fill
fill.solid()
fill.fore_color.rgb = PRIMARY_COLOR

# Title
title_box = slide.shapes.add_textbox(Inches(0.5), Inches(0.3), Inches(9), Inches(0.6))
title_frame = title_box.text_frame
p = title_frame.paragraphs[0]
p.text = "Investment & Payment Terms"
p.font.size = Pt(40)
p.font.bold = True
p.font.color.rgb = WHITE

# Cost box
cost_shape = slide.shapes.add_shape(1, Inches(0.5), Inches(1.0), Inches(9), Inches(0.75))
cost_shape.fill.solid()
cost_shape.fill.fore_color.rgb = ACCENT_COLOR
cost_shape.line.color.rgb = ACCENT_COLOR

cost_frame = cost_shape.text_frame
p = cost_frame.paragraphs[0]
p.text = "Total Project Cost: ₹20,00,000 + 18% GST (Total: ₹23,60,000)"
p.font.size = Pt(24)
p.font.bold = True
p.font.color.rgb = WHITE
p.alignment = PP_ALIGN.CENTER
p.space_before = Pt(8)

# Payment Terms Header
terms_header_box = slide.shapes.add_textbox(Inches(0.5), Inches(2.0), Inches(9), Inches(0.3))
terms_header_frame = terms_header_box.text_frame
p = terms_header_frame.paragraphs[0]
p.text = "Payment Schedule"
p.font.size = Pt(20)
p.font.bold = True
p.font.color.rgb = WHITE

# Payment terms - three columns
# Column 1: On PO
po_shape = slide.shapes.add_shape(1, Inches(0.5), Inches(2.5), Inches(2.9), Inches(2.8))
po_shape.fill.solid()
po_shape.fill.fore_color.rgb = RGBColor(255, 255, 255)
po_shape.line.color.rgb = ACCENT_COLOR
po_shape.line.width = Pt(2)

po_box = slide.shapes.add_textbox(Inches(0.65), Inches(2.6), Inches(2.6), Inches(2.6))
po_frame = po_box.text_frame
po_frame.word_wrap = True

po_items = ["50%", "On PO", "", "₹10,00,000"]
for i, item in enumerate(po_items):
    if i == 0:
        p = po_frame.paragraphs[0]
    else:
        p = po_frame.add_paragraph()
    p.text = item
    if i == 0:
        p.font.size = Pt(32)
        p.font.bold = True
        p.font.color.rgb = ACCENT_COLOR
    elif i == 1:
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = TEXT_COLOR
    elif i == 2:
        p.font.size = Pt(8)
    else:
        p.font.size = Pt(18)
        p.font.bold = True
        p.font.color.rgb = PRIMARY_COLOR
    p.alignment = PP_ALIGN.CENTER
    p.space_before = Pt(4)
    p.space_after = Pt(4)

# Column 2: On UAT
uat_shape = slide.shapes.add_shape(1, Inches(3.55), Inches(2.5), Inches(2.9), Inches(2.8))
uat_shape.fill.solid()
uat_shape.fill.fore_color.rgb = RGBColor(255, 255, 255)
uat_shape.line.color.rgb = ACCENT_COLOR
uat_shape.line.width = Pt(2)

uat_box = slide.shapes.add_textbox(Inches(3.7), Inches(2.6), Inches(2.6), Inches(2.6))
uat_frame = uat_box.text_frame
uat_frame.word_wrap = True

uat_items = ["30%", "On UAT", "", "₹6,00,000"]
for i, item in enumerate(uat_items):
    if i == 0:
        p = uat_frame.paragraphs[0]
    else:
        p = uat_frame.add_paragraph()
    p.text = item
    if i == 0:
        p.font.size = Pt(32)
        p.font.bold = True
        p.font.color.rgb = ACCENT_COLOR
    elif i == 1:
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = TEXT_COLOR
    elif i == 2:
        p.font.size = Pt(8)
    else:
        p.font.size = Pt(18)
        p.font.bold = True
        p.font.color.rgb = PRIMARY_COLOR
    p.alignment = PP_ALIGN.CENTER
    p.space_before = Pt(4)
    p.space_after = Pt(4)

# Column 3: On Go Live
live_shape = slide.shapes.add_shape(1, Inches(6.6), Inches(2.5), Inches(2.9), Inches(2.8))
live_shape.fill.solid()
live_shape.fill.fore_color.rgb = RGBColor(255, 255, 255)
live_shape.line.color.rgb = ACCENT_COLOR
live_shape.line.width = Pt(2)

live_box = slide.shapes.add_textbox(Inches(6.75), Inches(2.6), Inches(2.6), Inches(2.6))
live_frame = live_box.text_frame
live_frame.word_wrap = True

live_items = ["20%", "On Go Live", "", "₹4,00,000"]
for i, item in enumerate(live_items):
    if i == 0:
        p = live_frame.paragraphs[0]
    else:
        p = live_frame.add_paragraph()
    p.text = item
    if i == 0:
        p.font.size = Pt(32)
        p.font.bold = True
        p.font.color.rgb = ACCENT_COLOR
    elif i == 1:
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = TEXT_COLOR
    elif i == 2:
        p.font.size = Pt(8)
    else:
        p.font.size = Pt(18)
        p.font.bold = True
        p.font.color.rgb = PRIMARY_COLOR
    p.alignment = PP_ALIGN.CENTER
    p.space_before = Pt(4)
    p.space_after = Pt(4)

# Save presentation with new filename
prs.save('d:\\Personal\\Kiro\\newsKarnataka\\NewsKarnataka_Commercial_Proposal_v2.pptx')
print("✅ PowerPoint presentation created successfully!")
print("📁 File: d:\\Personal\\Kiro\\newsKarnataka\\NewsKarnataka_Commercial_Proposal_v2.pptx")
print("📊 Format: Widescreen (16:9)")
print("📄 Pages: 5")
print("")
print("✨ Enhanced Features:")
print("  • Attractive AI-enabled first page")
print("  • AI Badge prominently displayed")
print("  • AI features highlighted in box")
print("  • Professional gradient background")
