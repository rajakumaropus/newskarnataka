# ⚡ Quick Start - Sprint 1
## 5-Minute Essential Guide

---

## THE BASICS

### What's Happening?
**NewsKarnataka.com migration from WordPress to Strapi + React**
- 10-week project
- 3 teams (10 developers)
- Budget: ₹50-51L
- Goal: Modern, AI-enabled news platform

### Where's the Database?
```
Host: 103.191.208.235
User: news
Password: news321
Database: newskarnataka
```

### When's Kickoff?
**Monday 9:00 AM** - All teams on Zoom

### What Do I Do Now?
1. **Install prerequisites** (see below)
2. **Read team-specific guide** (see links below)
3. **Show up Monday morning ready to execute**

---

## PREREQUISITES (Install Now)

### All Teams Need:
```bash
# Check installations
node --version        # Must be 18+
npm --version         # Must be 9+
git --version         # Must be 2+
```

### Team A (Frontend) Additional:
```bash
# Text editor/IDE
# VS Code recommended with extensions:
# - ES7+ React/Redux snippets
# - Prettier
# - Tailwind CSS IntelliSense
```

### Team B (Backend) Additional:
```bash
# PostgreSQL client
psql --version        # Must be 12+
```

### Team C (DevOps) Additional:
```bash
# Docker
docker --version      # Must be 20.10+
docker-compose --version  # Must be 1.29+

# AWS CLI (if using AWS)
aws --version         # Optional
```

---

## YOUR TEAM GUIDE

### 🎨 Team A - Frontend
**Read:** `TEAM_A_FRONTEND_ONBOARDING.md`

**Monday Delivers:**
- React + Next.js project
- Storybook setup
- First Button component
- Tests passing

**Tools:** React 18, Next.js 14, TypeScript, Tailwind, Jest

---

### 🔌 Team B - Backend
**Read:** `TEAM_B_BACKEND_ONBOARDING.md`

**Monday Delivers:**
- Strapi 5.x initialized
- Database connection verified
- Admin panel running
- Schema planning

**Tools:** Strapi, PostgreSQL, Node.js, Groq API

---

### 🏗️ Team C - DevOps
**Read:** `TEAM_C_DEVOPS_ONBOARDING.md`

**Monday Delivers:**
- Docker Compose running
- All services operational
- Team connectivity verified
- Monitoring active

**Tools:** Docker, AWS, Postgres, Redis, GitHub Actions

---

## MONDAY MORNING TIMELINE

```
8:00 AM   - Teams online 10 min early
8:50 AM   - Final tech check
9:00 AM   - Kickoff begins (90 min)
10:30 AM  - Breakout sessions (90 min)
12:00 PM  - Lunch break
1:00 PM   - Team execution starts
5:00 PM   - EOD status report
```

---

## DAILY STANDUP TEMPLATE

**Every morning 9:00-9:15 AM in Zoom**

Report in Slack #daily-standup:

```
🟢 TEAM X Status

Yesterday:
✅ [What you delivered]
✅ [What you delivered]

Today:
🎯 [What you'll do]
🎯 [What you'll do]

Blockers:
❌ [If any] or "None"

Wins:
🎉 [Something good]
```

---

## IMPORTANT SLACK CHANNELS

```
#daily-standup     - Daily standup updates
#team-frontend     - Team A chat
#team-backend      - Team B chat
#team-devops       - Team C chat
#blockers          - URGENT issues
#database-sync     - Database meetings
#sprint-1          - Sprint-specific
```

---

## CRITICAL DATES & GATES

| Day | Gate | Must Verify | Status |
|-----|------|-------------|--------|
| **Tue** | #1 | All connected to DB | 🟡 |
| **Wed** | #2 | 30+ tables created | 🟡 |
| **Thu** | #3 | Roles & permissions | 🟡 |
| **Fri** | #4 | Sprint complete | 🟡 |

---

## KEY DOCUMENTS

### Must Read Before Monday:
1. `SPRINT_1_KICKOFF_PRESENTATION.md` (agenda overview)
2. Your team-specific onboarding guide
3. `SPRINT_1_DAILY_CHECKLIST.md` (keep handy all week)

### Reference During Sprint:
- `SPRINT_1_MASTER_CHECKLIST.md` (detailed tracking)
- `SPRINT_1_READY_FOR_LAUNCH.md` (complete overview)
- Your team onboarding guide

### Technical Reference:
- `POSTGRESQL_DATABASE_DESIGN_UUID.md` (database schema)
- `ARTICLE_SOURCE_WORKFLOW_SYSTEM.md` (article flow)
- `ADMIN_PRIVILEGES_AND_SCREEN_ACCESS_CONTROL.md` (permissions)

---

## COMMON COMMANDS

### Test Database Connection:
```bash
psql -h 103.191.208.235 -U news -d newskarnataka -c "SELECT 1;"
# Expected: (1 row) 1
```

### Check Git:
```bash
git config --global user.name
git config --global user.email
```

### Verify Node.js:
```bash
node --version  # Must be v18+
npm --version   # Must be 9+
```

### Docker Check (Team C):
```bash
docker ps       # List running containers
docker-compose ps  # List compose services
```

---

## IF YOU'RE BLOCKED

### Severity 1 (Blocking everyone):
1. Slack in #blockers
2. Tag @techhead immediately
3. Expected response: 15 minutes

### Severity 2 (Blocking your team):
1. Slack in team channel
2. Tag team lead
3. Expected response: 30 minutes

### Severity 3 (Minor issues):
1. Slack in team channel
2. Continue with other work
3. Will be addressed in standup

---

## EMERGENCY CONTACTS

**Before Monday:** Ask in Slack, responses within hours

**During Sprint:** Ask in team Slack channel

**Critical Issue:** @techhead in Slack or call [phone]

**After Hours:** Call emergency number [phone] (only true emergencies)

---

## WHAT NOT TO DO

❌ Don't wait for someone else to take initiative  
❌ Don't hide blockers - report immediately  
❌ Don't skip standups - attendance is critical  
❌ Don't modify production database without approval  
❌ Don't commit secrets (.env files) to GitHub  
❌ Don't skip tests or documentation  
❌ Don't work siloed - communicate & collaborate  

---

## WHAT TO DO

✅ Show up Monday morning ready to execute  
✅ Read your team onboarding guide tonight  
✅ Install prerequisites now  
✅ Ask questions before Monday  
✅ Report blockers immediately  
✅ Collaborate across teams  
✅ Document as you go  
✅ Push code to GitHub daily  
✅ Celebrate wins!  

---

## SUCCESS DEFINITION

**By Friday 5 PM, Sprint 1 is successful when:**

- ✅ Database fully operational
- ✅ 30+ tables created with UUID PKs
- ✅ Strapi running smoothly
- ✅ 20+ components delivered (Team A)
- ✅ 6 roles + 40+ permissions (Team B)
- ✅ Docker stack ready (Team C)
- ✅ All tests passing
- ✅ Zero critical blockers
- ✅ Team ready for Sprint 2

---

## MONDAY MORNING CHECKLIST

Before 9:00 AM on Monday:

- [ ] Laptop charged & working
- [ ] Internet connection stable
- [ ] Zoom app installed & tested
- [ ] Slack desktop app open
- [ ] Prerequisites installed:
  - [ ] Node.js 18+ ✅
  - [ ] npm 9+ ✅
  - [ ] Git configured ✅
  - [ ] [Team-specific tools] ✅
- [ ] Database credentials saved securely
- [ ] Team-specific guide read
- [ ] Zoom room link opened
- [ ] Calendar event open
- [ ] Text editor/IDE ready
- [ ] Terminal ready
- [ ] Phone nearby (just in case)
- [ ] Coffee/water nearby 😉
- [ ] Excitement level: HIGH! 🚀

---

## QUESTION? ANSWER IS IN:

**"How do I set up Next.js?"**  
→ `TEAM_A_FRONTEND_ONBOARDING.md` Section "Monday Breakout"

**"Where's the database password?"**  
→ See "DATABASE CREDENTIALS" section above (top of this file)

**"What do I do Monday afternoon?"**  
→ `SPRINT_1_STARTER_PACK.md` "Monday Afternoon" section

**"How do I connect to the database?"**  
→ `TEAM_B_BACKEND_ONBOARDING.md` "Setup: Monday Morning"

**"What if Docker won't start?"**  
→ `TEAM_C_DEVOPS_ONBOARDING.md` "Troubleshooting"

**"When's my team breakout session?"**  
→ `SPRINT_1_KICKOFF_PRESENTATION.md` "Breakout Sessions"

**"What's the full sprint plan?"**  
→ `SPRINT_1_MASTER_CHECKLIST.md` entire file

---

## REMEMBER

### You Were Chosen For a Reason
This team has the skills to build something great.

### You Have Full Support
Documentation, infrastructure, and leadership ready.

### This Will Be Challenging
But that's what makes it rewarding.

### Focus on Execution
Plans are made. Now it's about doing.

### Help Each Other
Success is a team effort, not individual achievement.

### Celebrate Wins
Every milestone matters - acknowledge progress.

---

## LAST THING...

### Read This Once More Before Monday:

**Mission:** Build modern news platform  
**Timeline:** 10 weeks  
**Team:** 10 developers, 3 teams  
**Next Step:** Monday 9 AM kickoff  
**Your Role:** Essential to success  

### You've Got Everything You Need:
- ✅ Clear plan
- ✅ Strong team
- ✅ Good infrastructure
- ✅ Detailed documentation
- ✅ Tech leadership
- ✅ Budget approved
- ✅ Timeline confirmed

---

## 🚀 LETS BUILD THIS!

**See you Monday at 9:00 AM.**

**Be on time.**  
**Be ready.**  
**Be excellent.**

---

*Last updated: September 2026*  
*Status: ✅ Ready for Sprint 1 Launch*  
*Questions? Ask in Slack before Monday*

