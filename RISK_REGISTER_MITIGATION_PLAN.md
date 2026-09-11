# Risk Register & Mitigation Plan
## NewsKarnataka: WordPress to Strapi Migration

**Project:** NewsKarnataka.com - WordPress to Strapi Migration  
**Date:** September 2026  
**Owner:** Project Manager + Tech Lead  
**Status:** Active Management (Week 0 - Week 10+)

---

## EXECUTIVE SUMMARY

This document identifies and tracks all project risks with:
- **Risk ID & Description** - Clear identification
- **Impact & Probability** - Severity scoring
- **Mitigation Strategy** - How to prevent/handle
- **Contingency Plan** - If risk materializes
- **Owner & Trigger** - Who monitors, when to escalate

**Total Risks Identified:** 45 (5 Critical, 12 High, 18 Medium, 10 Low)

---

## SECTION 1: CRITICAL RISKS (Must Prevent!)

### RISK CR-01: Complete Data Loss During Migration

**Category:** Data / Infrastructure  
**Severity:** CRITICAL ⚠️⚠️⚠️⚠️⚠️  
**Probability:** Low (5%) → But catastrophic if occurs

**Description:**
Entire WordPress database corrupted or lost during extraction, transformation, or loading. Result: 55K+ articles permanently lost, impossible recovery.

**Impact if Occurs:**
- ❌ Project delay: 3-4 weeks (restore from backup, restart)
- ❌ Data loss: Potentially 100% (all articles)
- ❌ Financial: ₹20,00,000+ (restart cost + recovery attempts)
- ❌ Reputation: Critical (news outlet loses all content)

**Mitigation Strategies (Prevention):**

1. **Full Backup Before Any Changes**
   - [ ] Create complete WordPress database backup (Week -1)
   - [ ] Backup all images (/wp-content/uploads/)
   - [ ] Store backup on separate S3 bucket (cross-region)
   - [ ] Create backup verification checklist
   - [ ] Document backup location & access procedures
   - **Owner:** DevOps Lead
   - **Completion:** By Week 0, Day 1

2. **Read-Only Mode During Extraction**
   - [ ] Put WordPress in maintenance mode (read-only)
   - [ ] Disable all writes (plugins, API, admin)
   - [ ] Only allow read operations (content extraction)
   - [ ] Prevents new data corruption mid-extraction
   - **Owner:** WordPress Admin
   - **Duration:** Week 1

3. **Continuous Backup During Transformation**
   - [ ] Backup staging database after each transformation phase
   - [ ] Create daily snapshots (S3, cross-region)
   - [ ] Use point-in-time recovery (RDS)
   - [ ] Keep 7 backups (rolling window)
   - **Owner:** DevOps Lead
   - **Frequency:** Daily, Weeks 2-3

4. **Data Validation at Each Stage**
   - [ ] Validate counts: Source vs destination (each load)
   - [ ] Checksum validation (article hashes)
   - [ ] Spot-check 100 random records (manual verification)
   - [ ] Verify image URLs (all 100K+ images)
   - [ ] Document validation results (pass/fail)
   - **Owner:** QA Lead
   - **Frequency:** After each transformation step

5. **Dual-Write Architecture**
   - [ ] New articles written to BOTH WordPress + Strapi (Weeks 6-7)
   - [ ] Allows rollback to WordPress if Strapi fails
   - [ ] No single point of failure
   - [ ] Reduces risk to acceptable level
   - **Owner:** Backend Lead
   - **Duration:** Weeks 6-10

**Contingency Plan (If Data Loss Occurs):**
1. Immediately declare incident (page tech lead)
2. Stop all operations (prevent further loss)
3. Restore from last known good backup (within 24 hours)
4. Investigate root cause (forensics)
5. Restart extraction from backup point
6. Add extra validation steps (prevent recurrence)
7. Communicate to stakeholders (transparent)

**Trigger for Escalation:**
- If backup restore fails → VP level escalation immediately
- If > 1% data loss detected → Critical incident

**Risk Owner:** DevOps Lead  
**Review Frequency:** Daily during Weeks 1-3, weekly after

---

### RISK CR-02: Multi-AZ RDS Failure (Both Zones Down)

**Category:** Infrastructure / Availability  
**Severity:** CRITICAL ⚠️⚠️⚠️⚠️⚠️  
**Probability:** Very Low (0.5%) → But catastrophic if occurs

**Description:**
Both primary and standby RDS instances fail simultaneously (network partition, disk failure, hardware issue). Database becomes inaccessible. No automatic failover (already failed over).

**Impact if Occurs:**
- ❌ Complete application downtime (database unreachable)
- ❌ Estimated recovery: 1-2 hours (restore from snapshot)
- ❌ Data loss: Last 5-15 minutes (last backup interval)
- ❌ User impact: All traffic blocked

**Mitigation Strategies:**

1. **Daily Backup + Cross-Region Replication**
   - [ ] Daily RDS snapshots (automated)
   - [ ] Cross-region backup (us-west-2 or eu-west-1)
   - [ ] Backup retention: 30+ days
   - [ ] Can restore to new instance within 30 minutes
   - **Owner:** DevOps Lead
   - **Verification:** Monthly restore test

2. **Enhanced Monitoring**
   - [ ] Monitor RDS metrics (CPU, memory, disk, connections)
   - [ ] Alert if CPU > 80%, memory > 85%
   - [ ] Alert on failover events
   - [ ] CloudWatch detailed monitoring (1-min granularity)
   - **Owner:** DevOps Lead + Monitoring

3. **Regular Failover Testing**
   - [ ] Manual failover test (monthly)
   - [ ] Verify failover time < 1 minute
   - [ ] Test read replica promotion
   - [ ] Document any issues found
   - **Owner:** DevOps Lead
   - **Schedule:** First Sunday of each month

4. **Preventive Maintenance**
   - [ ] Regular RDS parameter updates (security patches)
   - [ ] Maintenance window configured (low traffic time)
   - [ ] Auto-minor upgrades enabled
   - **Owner:** DevOps Lead

**Contingency Plan:**
1. Incident declared (multi-AZ unavailable)
2. Alert ops team (immediate response)
3. Restore RDS from latest snapshot (new instance)
4. Redirect Strapi connections to restored RDS
5. Expected RTO: 15-30 minutes
6. RDS instance in new AZ (different from failure)
7. Run data integrity checks (verify no corruption)

**Risk Owner:** DevOps Lead  
**Review Frequency:** Monthly failover test

---

### RISK CR-03: Catastrophic Bugs in Production (Post-Cutover)

**Category:** Software / Quality  
**Severity:** CRITICAL ⚠️⚠️⚠️⚠️⚠️  
**Probability:** Medium (15%) → High impact if occurs

**Description:**
Undiscovered critical bugs in Strapi or frontend cause widespread user issues after cutover. Examples: articles not displaying, search broken, images not loading, performance degradation.

**Impact if Occurs:**
- ❌ User experience severely degraded
- ❌ Immediate rollback to WordPress needed
- ❌ Loss of credibility
- ❌ Traffic drop (users go to competitors)
- ❌ Recovery time: 1-2 hours (deploy fix or rollback)

**Mitigation Strategies:**

1. **Comprehensive Testing Before Launch**
   - [ ] Unit tests: 80%+ code coverage
   - [ ] Integration tests: All API endpoints
   - [ ] E2E tests: Critical user workflows (50+ scenarios)
   - [ ] Load testing: 500 concurrent users
   - [ ] Performance testing: Baseline established
   - [ ] Security testing: Penetration test (optional)
   - **Owner:** QA Lead
   - **Completion:** Week 9 end

2. **Staging Environment = Production**
   - [ ] Staging uses production database (replicated)
   - [ ] Staging uses production-like infrastructure
   - [ ] 2-week UAT period (comprehensive testing)
   - [ ] Stakeholder sign-off before cutover
   - **Owner:** Tech Lead + QA Lead
   - **Duration:** Weeks 4-5

3. **Gradual Traffic Shift**
   - [ ] Week 6: 10% traffic to Strapi (90% WordPress)
   - [ ] Week 6-7: Gradually increase (25% → 50% → 90%)
   - [ ] Monitor at each step (error rate, latency)
   - [ ] Quick rollback if issues detected
   - **Owner:** Tech Lead
   - **Duration:** 7 days

4. **Automated Smoke Tests Post-Deploy**
   - [ ] Automated health checks (every 5 minutes)
   - [ ] Critical path testing (home page → article → search)
   - [ ] Alert if any test fails
   - **Owner:** DevOps Lead
   - **Runtime:** Post-deployment validation

5. **Quick Rollback Capability**
   - [ ] Keep WordPress as fallback (10% traffic always)
   - [ ] Rollback procedure (tested, < 5 minutes)
   - [ ] DNS update (switch back to WordPress)
   - [ ] No data loss (dual-write during transition)
   - **Owner:** DevOps Lead

**Contingency Plan:**
1. User reports issue (Slack, support email)
2. Ops team reproduces bug (1-2 min)
3. If critical:
   - [ ] Option A: Deploy hotfix (15-30 min if ready)
   - [ ] Option B: Rollback to WordPress (5 min, instant)
4. If rollback triggered:
   - [ ] Switch DNS back to WordPress
   - [ ] Verify traffic routed correctly
   - [ ] Communicate to users (transparency)
   - [ ] RCA (root cause analysis)
   - [ ] Fix issue in staging
   - [ ] Re-test comprehensive (prevent recurrence)
   - [ ] Cutover again (when ready)

**Risk Owner:** Tech Lead  
**Monitoring:** Real-time (Week 10 post-launch)

---

### RISK CR-04: Migration Adapter Sync Failure (Data Mismatch)

**Category:** Data Integrity  
**Severity:** CRITICAL ⚠️⚠️⚠️⚠️⚠️  
**Probability:** Low-Medium (10%) → Gradual discovery of issues

**Description:**
The adapter syncing data from WordPress to Strapi fails or gets out of sync. Results in:
- Strapi missing latest articles (editor publishes on WP, doesn't appear on Strapi)
- Data inconsistency between systems
- Conflicts (same article edited in both systems, unclear which wins)
- User confusion (see different content depending on which system)

**Impact if Occurs:**
- ❌ Editorial workflow broken
- ❌ Content appears/disappears randomly
- ❌ Loss of trust in new system
- ❌ May need to rollback

**Mitigation Strategies:**

1. **Robust Adapter Architecture**
   - [ ] Implement retry logic (exponential backoff)
   - [ ] Implement dead-letter queue (failed syncs)
   - [ ] Comprehensive error logging (all sync operations)
   - [ ] Idempotent operations (safe to re-run)
   - [ ] Conflict resolution logic (clear rules)
   - **Owner:** Backend Lead
   - **Testing:** Week 6 before deployment

2. **Real-Time Monitoring**
   - [ ] Monitor queue depth (should be near 0)
   - [ ] Alert if queue > 100 items (backlog building)
   - [ ] Alert if sync lag > 10 minutes
   - [ ] Dashboard showing latest synced timestamp
   - **Owner:** DevOps Lead
   - **Duration:** Weeks 6-10

3. **Data Reconciliation Checks**
   - [ ] Hourly reconciliation report:
     - [ ] Article count comparison
     - [ ] Latest article timestamp comparison
     - [ ] Field-level checksums (verify content matches)
   - [ ] Alert on discrepancies
   - [ ] Manual investigation & fix
   - **Owner:** Data Migration Lead
   - **Frequency:** Hourly, Weeks 6-10

4. **Read-Only WordPress (Post-Cutover)**
   - [ ] Week 10 post-cutover: Switch WordPress to read-only
   - [ ] No new articles can be created on WordPress
   - [ ] Eliminates sync conflicts (only one source of truth)
   - [ ] After verification (1 week), decommission WordPress
   - **Owner:** WordPress Admin
   - **Timeline:** Week 10 end

5. **Comprehensive Test Cases**
   - [ ] Test case: Create article on WP → appears on Strapi
   - [ ] Test case: Edit article on WP → updates on Strapi
   - [ ] Test case: Delete on WP → removed from Strapi
   - [ ] Test case: Multiple changes rapidly → all synced
   - [ ] Test case: Network outage → resumes syncing
   - [ ] Test case: Strapi unavailable → queues until available
   - **Owner:** QA Lead
   - **Testing:** Week 6 before go-live

**Contingency Plan:**
1. Discrepancy detected (hourly reconciliation)
2. Alert team (Slack notification)
3. Determine scope (how many articles affected)
4. If minor (< 10 articles):
   - [ ] Manual fix in Strapi
   - [ ] Re-sync from WordPress
   - [ ] Verify fixed
5. If widespread (> 10 articles):
   - [ ] Investigate root cause (adapter logs)
   - [ ] Fix adapter code (if bug)
   - [ ] Deploy fix
   - [ ] Full re-sync of affected articles
   - [ ] Validation (counts match)
6. Prevent recurrence:
   - [ ] Add additional test case
   - [ ] Improve monitoring/alerting
   - [ ] Document issue + resolution (knowledge base)

**Risk Owner:** Backend Lead  
**Monitoring:** Real-time (Weeks 6-10)

---

### RISK CR-05: Budget Overrun (Exceed ₹60L)

**Category:** Financial / Project Management  
**Severity:** CRITICAL ⚠️⚠️⚠️⚠️⚠️  
**Probability:** Medium (20%) → Scope creep, unforeseen issues

**Description:**
Project costs exceed ₹60L budget due to:
- Scope creep (additional features requested)
- Timeline delays (takes longer than 10 weeks)
- Infrastructure costs higher than estimated
- Staffing costs increase (overtime, additional resources)
- Unforeseen issues requiring re-work

**Impact if Occurs:**
- ❌ Project approval at risk (exceeds budget)
- ❌ Additional ₹5-10L funding required
- ❌ May cut corners (reduce scope, quality)
- ❌ Stakeholder confidence reduced

**Mitigation Strategies:**

1. **Fixed Scope & Budget Baseline**
   - [ ] Locked scope document (signed by stakeholders)
   - [ ] Change control process (any changes = scope meeting)
   - [ ] Budget allocation per week (₹6L/week)
   - [ ] Weekly budget tracking (actual vs budgeted)
   - [ ] Burn-down chart (visible to all)
   - **Owner:** Project Manager
   - **Duration:** Weeks 0-10

2. **Detailed Cost Breakdown**
   - [ ] Infrastructure cost: ₹15L (fixed, pre-paid)
   - [ ] Staffing cost: ₹40L (locked team, 10 weeks)
   - [ ] Third-party services: ₹3L (Groq, GitHub, etc.)
   - [ ] Contingency buffer: ₹2L (10% reserve)
   - **Owner:** Finance + Project Manager

3. **Weekly Budget Tracking**
   - [ ] Track actual spend vs budget (daily)
   - [ ] Identify variances (> 5% = investigate)
   - [ ] Forecast final cost (running total)
   - [ ] Alert if forecast exceeds budget
   - [ ] Weekly dashboard (visible to leadership)
   - **Owner:** Project Manager
   - **Frequency:** Daily tracking, weekly reporting

4. **Strict Scope Control**
   - [ ] No scope changes without approval
   - [ ] Any change = formal change request
   - [ ] Change request includes cost + timeline impact
   - [ ] Stakeholder approval required
   - [ ] Defer non-critical changes to Phase 2
   - **Owner:** Project Manager

5. **Resource Optimization**
   - [ ] Team composition fixed (no additional hires mid-project)
   - [ ] Staffing plan agreed upfront
   - [ ] Prevent scope creep (= need more resources)
   - [ ] Re-allocate if needed (shift between tasks)
   - **Owner:** Tech Lead

**Contingency Plan (If Budget Risk Surfaces):**
1. Alert stakeholders (weekly budget report)
2. Analyze variance (where is overage coming from?)
3. Options:
   - [ ] Option A: Reduce scope (cut non-critical features)
   - [ ] Option B: Extend timeline (slower but cheaper)
   - [ ] Option C: Request budget increase (if justified)
   - [ ] Option D: Combination of above
4. Stakeholder decision (management call)
5. Execute chosen option
6. Adjust plan + communicate impact

**Risk Owner:** Project Manager  
**Monitoring:** Daily spend tracking, weekly reporting

---

## SECTION 2: HIGH RISKS (Monitor Closely!)

### RISK HR-01: WordPress REST API Unavailable/Rate Limited

**Probability:** Medium (20%)  
**Impact:** High (data extraction blocked)

**Description:** WordPress REST API becomes unavailable or rate-limited during data extraction, slowing or stopping extraction.

**Mitigation:**
- Pre-test API (Week 0)
- Implement exponential backoff retry logic
- Use pagination (1000 per request) to avoid timeouts
- Backup extraction to local database if API fails
- Have WordPress database read-only replica as fallback

**Contingency:** Switch to direct database queries (if API fails)

---

### RISK HR-02: Image Quality/Corruption Issues

**Probability:** Medium-High (25%)  
**Impact:** High (poor user experience, SEO impact)

**Description:** 100K+ images either corrupt, missing, or poor quality after download/optimization.

**Mitigation:**
- Download all images (Week 1)
- Verify each image (checksum validation)
- Test optimization (sample 100 images for quality)
- Keep original + optimized versions (S3)
- Fallback: Use original images if optimization fails

**Contingency:** Re-download & re-optimize failed images

---

### RISK HR-03: Elasticsearch Indexing Performance

**Probability:** Medium (15%)  
**Impact:** High (search broken or slow)

**Description:** Elasticsearch indexing of 55K articles takes too long or fails, causing search to be incomplete/slow.

**Mitigation:**
- Pre-size Elasticsearch (5 nodes from day 1)
- Test indexing speed (Week 3 staging)
- Implement batch indexing (1000 at a time)
- Monitor index size + shard health
- Reindex overnight (off-peak)

**Contingency:** Scale ES horizontally (add more data nodes), re-index in batches

---

### RISK HR-04: Strapi Upgrade/Compatibility Issues

**Probability:** Low-Medium (12%)  
**Impact:** High (system broken mid-project)

**Description:** Strapi framework has breaking changes, security issues, or compatibility problems.

**Mitigation:**
- Use Strapi 5.x (latest stable, not beta)
- Test all dependencies (Week 0)
- Use exact versions (not floating)
- Monitor security advisories
- Have rollback plan (previous Strapi version)

**Contingency:** Rollback to previous Strapi version, delay upgrade until post-launch

---

### RISK HR-05: Team Member Unavailability

**Probability:** Medium-High (30%)  
**Impact:** High (timeline delay, quality issues)

**Description:** Critical team members (tech lead, DevOps lead, backend lead) become unavailable due to illness, emergency, resignation.

**Mitigation:**
- Cross-train backup for each role (2nd person)
- Detailed documentation (runbooks, procedures)
- Pair programming on critical tasks
- Knowledge sharing sessions (weekly)
- Succession plan for each role
- Contracts with team leads (locked for project)

**Contingency:** 
- Activate backup person (immediate promotion)
- Adjust timeline (+1-2 weeks if needed)
- Hire temporary consultant (if critical gap)

---

### RISK HR-06: Performance Not Meeting Targets

**Probability:** Medium-High (30%)  
**Impact:** High (user experience, credibility)

**Description:** System performance (latency, throughput) doesn't meet targets (LCP < 2.5s, P99 < 500ms).

**Mitigation:**
- Baseline performance established (Week 4)
- Load testing (Week 5, 500 concurrent users)
- Identify bottlenecks early (database queries, cache, CDN)
- Optimization sprint (Week 8-9)
- Cache strategy (Redis for everything)
- CDN caching (CloudFront)
- Database query optimization (indexes, EXPLAIN)

**Contingency:** Additional optimization sprint, scale infrastructure (more resources), extend timeline

---

### RISK HR-07: Data Integrity Issues (Discovered Post-Launch)

**Probability:** Medium (20%)  
**Impact:** High (requires rollback or correction)

**Description:** Data issues discovered after cutover (missing fields, corrupted data, incorrect conversions).

**Mitigation:**
- Comprehensive validation (Week 3-4)
- Spot-checks of 100+ random articles
- Field-level validation (every field present)
- Checksum validation (data integrity)
- Pre-launch sanity checks
- Gradual traffic shift (catch issues before 100%)

**Contingency:** Rollback, fix in staging, re-cutover

---

### RISK HR-08: DNS Propagation Delay

**Probability:** Low-Medium (8%)  
**Impact:** High (if affects many users)

**Description:** DNS changes (newskarnataka.com → Strapi) don't propagate quickly, some users see old site.

**Mitigation:**
- Lower TTL before cutover (300 seconds)
- Pre-stage all DNS changes (test in Route 53)
- Communicate TTL expectations (may take 5-30 min)
- Monitor DNS resolution (multiple resolvers)
- Have both systems ready (DNS can switch quickly)

**Contingency:** Fallback to WordPress if needed (instant DNS revert)

---

### RISK HR-09: Groq LLM API Rate Limit Exceeded

**Probability:** Low (8%)  
**Impact:** High (content validation blocked)

**Description:** Groq API rate limits hit during validation surge (many articles submitted simultaneously).

**Mitigation:**
- Groq quota: 30 req/min (free tier) → sufficient for 1000 articles/day
- Implement queue (BullMQ) with backpressure
- Fallback LLM (GPT-4) configured
- Cost tracking ($0.35/1000 tokens, well within budget)
- Test high-load scenario (Week 9)

**Contingency:** Queue backs up (articles wait), fallback to GPT-4, manual validation for critical

---

### RISK HR-10: Multi-Language Encoding Issues (Kannada)

**Probability:** Medium-High (25%)  
**Impact:** High (Kannada content corrupted, unusable)

**Description:** Unicode encoding for Kannada characters breaks during migration (ಕನ್ನಡ corrupted).

**Mitigation:**
- UTF-8 throughout (all databases, APIs, frontend)
- Test Kannada content (Week 2, sample 100 articles)
- Normalize Unicode (NFKC normalization)
- Verify font support (Noto Sans Kannada)
- Font files bundled with frontend
- Spot-check Kannada display (Week 4 UAT)

**Contingency:** Re-export Kannada articles, fix encoding, re-import

---

### RISK HR-11: Strapi Admin Portal Performance

**Probability:** Medium (18%)  
**Impact:** High (editors can't work)

**Description:** Strapi admin panel becomes slow/unresponsive when editing 55K+ articles.

**Mitigation:**
- Strapi on powerful hardware (ECS: 2GB memory minimum)
- Database optimized (indexes, query plans)
- Redis cache for frequently accessed content
- Lazy load (don't load all articles at once)
- Test admin performance (Week 5)
- Limit shown articles (pagination in admin UI)

**Contingency:** Scale Strapi (more memory), optimize queries, upgrade infrastructure

---

### RISK HR-12: SSL Certificate Issues

**Probability:** Low (5%)  
**Impact:** High (HTTPS broken, users blocked)

**Description:** SSL certificate not issued, expires unexpectedly, or has domain mismatch.

**Mitigation:**
- ACM (AWS Certificate Manager) handles cert automatically
- Auto-renewal configured (60 days before expiry)
- Monitor cert expiry (CloudWatch)
- Backup cert (manually verified)
- Test HTTPS access (Week 4)
- Wildcard cert (covers newskarnataka.com + *.newskarnataka.com)

**Contingency:** Request new cert (ACM), update ALB (< 1 hour), fallback to HTTP temporary

---

## SECTION 3: MEDIUM RISKS (18 items, track monthly)

### RISK MR-01 through MR-18: (Detailed tracking table below)

| ID | Risk | Probability | Impact | Mitigation | Owner |
|-----|------|-------------|--------|-----------|-------|
| MR-01 | Article slug collisions (duplicate URLs) | 10% | Medium | Add uniqueness constraint, pre-validate | Backend |
| MR-02 | Comment data loss during migration | 8% | Medium | Export comments separately, backup WordPress | Data |
| MR-03 | Featured image not mapping to article | 12% | Medium | Foreign key validation, spot-check | QA |
| MR-04 | Redirect (301) implementation incomplete | 15% | Medium | URL mapping table, test redirects | Backend |
| MR-05 | Analytics data (view counts) not migrated | 20% | Medium | Extract postmeta, map to ai_status | Data |
| MR-06 | SEO rank drop post-launch | 15% | Medium | 301 redirects, maintain domain age, backlinks | DevOps |
| MR-07 | Cache invalidation logic broken | 18% | Medium | Test cache headers, manual invalidation tool | Backend |
| MR-08 | Redis cluster failover issues | 10% | Medium | Test failover monthly, monitor lag | DevOps |
| MR-09 | Elasticsearch shard allocation issues | 12% | Medium | Monitor cluster health, re-shard if needed | DevOps |
| MR-10 | API rate limiting too strict | 15% | Medium | Tunable rate limits, whitelist internal | Backend |
| MR-11 | Pagination broken for large datasets | 10% | Medium | Test pagination > 1000 items | QA |
| MR-12 | Search results relevance poor | 20% | Medium | Tune Elasticsearch scoring, test queries | Backend |
| MR-13 | Admin user permissions incorrect | 14% | Medium | RBAC testing, UAT verification | Security |
| MR-14 | Database backup restore incomplete | 12% | Medium | Test restore monthly, verify all data | DevOps |
| MR-15 | Team training insufficient | 18% | Medium | Week 0 training, documentation, support | PM |
| MR-16 | CloudFront cache not working | 16% | Medium | Verify cache headers, test X-Cache | DevOps |
| MR-17 | Load balancer health checks failing | 8% | Medium | Configure proper health check endpoint | DevOps |
| MR-18 | CORS issues blocking API calls | 12% | Medium | Test CORS, configure headers correctly | Backend |

---

## SECTION 4: LOW RISKS (10 items, track quarterly)

| ID | Risk | Probability | Impact | Mitigation | Owner |
|-----|------|-------------|--------|-----------|-------|
| LR-01 | Documentation outdated post-launch | 30% | Low | Living docs, wiki updates, automated | Tech |
| LR-02 | UI/UX feedback requiring changes | 25% | Low | Usability testing, iterate post-launch | PM |
| LR-03 | Team morale issues (stressful project) | 20% | Low | Regular breaks, celebrations, team building | PM |
| LR-04 | Third-party service outage (GitHub, AWS) | 5% | Low | HA architecture, fallback systems | DevOps |
| LR-05 | Competitor launches similar platform | 15% | Low | Focus on quality, not external threats | PM |
| LR-06 | Browser compatibility issues | 10% | Low | Test on multiple browsers, graceful degradation | QA |
| LR-07 | Mobile app store approval delays | 12% | Low | Submit early, follow guidelines, have backup | DevOps |
| LR-08 | Analytics implementation incomplete | 8% | Low | Configure Google Analytics, Firebase | Frontend |
| LR-09 | Accessibility (WCAG) compliance gaps | 15% | Low | WCAG 2.1 AA testing, accessibility audit | QA |
| LR-10 | Legacy browser support needed | 6% | Low | Polyfills, feature detection, graceful degradation | Frontend |

---

## RISK MONITORING FRAMEWORK

### Weekly Risk Review (Every Friday)

**Attendees:** Tech Lead, Project Manager, DevOps Lead, Backend Lead

**Agenda:**
1. Review critical risks (CR-01 to CR-05)
2. Review high risks (HR-01 to HR-12)
3. Update risk status (emerging issues)
4. Escalate if needed (executive steering)
5. Document decisions in risk log

**Outputs:**
- Updated risk register
- Escalation decisions
- Mitigation progress
- Risk dashboard update

---

### Risk Dashboard (Real-Time Tracking)

**Location:** Shared Google Sheet / Jira Board

**Fields:**
- Risk ID
- Description
- Status (Green = controlled, Yellow = warning, Red = active)
- Probability (%)
- Impact (1-5)
- Risk Score (Prob × Impact)
- Owner
- Mitigation Actions
- Target Completion Date
- Notes

**Status Legend:**
- 🟢 **GREEN:** Risk actively mitigated, under control
- 🟡 **YELLOW:** Risk trending up, increased monitoring
- 🔴 **RED:** Risk materialized, incident response activated

---

## ESCALATION PROCEDURES

### Level 1: Project Team (Daily)
- PM checks for emerging risks
- Team discusses in standup
- Updates risk register
- **No escalation needed** (team handles)

### Level 2: Tech Lead / Project Manager (Weekly)
- Friday risk review
- Medium+ risks discussed
- Mitigation decisions made
- **Escalate if:** High-probability + high-impact risk
- **To:** Tech Lead or Project Manager

### Level 3: Executive Steering (As-Needed)
- Critical risks (CR-01 to CR-05)
- Budget overruns > 5%
- Timeline delays > 1 week
- **Escalate immediately** (don't wait for Friday)
- **To:** VP Engineering, Project Sponsor

### Level 4: Emergency (Incident Response)
- Critical system failure
- Complete data loss
- Security breach
- **Escalate immediately** (page on-call)
- **To:** CTO, Chief Security Officer

---

## RISK ACCEPTANCE DOCUMENT

**Risks Accepted by Stakeholders:**

1. ✅ **Timeline Risk:** 10 weeks is aggressive; may need +1-2 weeks extension
   - **Decision:** Proceed with 10-week plan, contingency funds for extension
   - **Owner:** Project Sponsor
   - **Signed:** _____________

2. ✅ **Performance Risk:** Some performance optimization may extend past Week 10
   - **Decision:** Acceptable to launch with 90-95% of performance targets
   - **Owner:** Tech Lead
   - **Signed:** _____________

3. ✅ **AI Accuracy Risk:** Groq LLM may not reach 95% accuracy initially
   - **Decision:** Acceptable to launch with 85%+ accuracy, improve via model retraining
   - **Owner:** AI/ML Lead
   - **Signed:** _____________

4. ✅ **Team Availability Risk:** If key person unavailable, may impact timeline
   - **Decision:** Cross-train backups, accept 1-2 week delay if needed
   - **Owner:** Tech Lead
   - **Signed:** _____________

---

## RISK LOG TEMPLATE (For Issue Tracking)

```
INCIDENT: [Risk ID - Description]
Date Detected: [YYYY-MM-DD]
Severity: [CRITICAL / HIGH / MEDIUM / LOW]
Status: [OPEN / IN PROGRESS / RESOLVED]
Owner: [Name]

Description:
[What happened, why, impact]

Root Cause:
[Why did this happen? Technical? Process? External?]

Mitigation Actions Taken:
- [ ] Action 1
- [ ] Action 2
- [ ] Action 3

Prevention for Future:
[How to prevent this again?]

Lessons Learned:
[What did we learn? How do we improve?]

Closed: [YYYY-MM-DD]
```

---

## CONTINGENCY BUDGET (10% Buffer)

**Total Project Budget:** ₹60,00,000

**Contingency Allocation (10%):** ₹6,00,000

**Reserved For:**
- Risk CR-01 (data recovery): ₹2,00,000
- Risk CR-05 (budget overruns): ₹2,00,000
- Risk HR-01 through HR-12: ₹2,00,000

**Usage:**
- Released only with Project Sponsor approval
- Documented in risk log
- Tracked separately from main budget

---

**Risk Register - COMPLETE**

*Prepared for: Spearhead Media Pvt Ltd*  
*Project: NewsKarnataka.com - WordPress to Strapi Migration*  
*Date: September 2026*  
*Next Review: Weekly (Friday, 4 PM)*

