# ACE: Detailed V0, V1, V2 & Northstar Roadmap

---

## V0: THE MVP (This Month - February 2026)
### "Proof That Style Can Be Encoded"

**Definition:** Manual workflow that proves one creator's style can be extracted, cloned, and tested.

**Core Loop:**
1. Upload reference video (Varun Maya v0)
2. System extracts/suggests Scene Map + Style DNA
3. Creator refines style rules (human-editable)
4. Define Eval scorecard (7 dimensions)
5. Input new script → Generate 3 variants (via HeyGen API)
6. System scores all 3 on scorecard
7. Auto-picks winner
8. Export Style Pack as JSON

**Key Interfaces:**
```
┌─────────────────────────────────────────────────┐
│  REFERENCE VIDEO UPLOAD                         │
├─────────────────────────────────────────────────┤
│  ✓ Video file (MP4)                            │
│  ✓ Metadata: channel, creator, topic           │
│  → Auto-extract (AI): Scene Map + Style DNA    │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│  STYLE PACK EDITOR (Human review + edit)        │
├─────────────────────────────────────────────────┤
│  • Hook pattern: [aggressive 0-2sec]            │
│  • Pacing: 4 cuts per 5 seconds                 │
│  • Caption density: 40% of screen time          │
│  • Caption font: Arial Bold, 32px, white        │
│  • Backgrounds: [3 stock libraries]             │
│  • Transition speed: 300ms crossfade            │
│  • Scene template: [6-12 beats]                 │
│    - Hook (2sec)                                │
│    - Context (5sec)                            │
│    - Proof A (8sec)                            │
│    - Proof B (8sec)                            │
│    - Explain (10sec)                           │
│    - Takeaway (3sec)                           │
│    - CTA (2sec)                                │
│                                                 │
│  🔧 All fields editable, save as JSON          │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│  EVAL SCORECARD DEFINITION                      │
├─────────────────────────────────────────────────┤
│  Dimension 1: Hook Strength (1-10)              │
│    → Does first 2sec grab attention?            │
│  Dimension 2: Style Match (1-10)                │
│    → How similar to reference video?            │
│  Dimension 3: Visual Rhythm (1-10)              │
│    → Pacing consistent? Dead air? Energy dips?  │
│  Dimension 4: Caption Quality (1-10)            │
│    → Readability + timing + sync?               │
│  Dimension 5: Clarity of Takeaway (1-10)        │
│    → Does viewer understand core message?       │
│  Dimension 6: Proof Integrity (1-10)            │
│    → Do claims have visual proof?               │
│  Dimension 7: Repeat Risk (1-10)                │
│    → Is this too similar to other videos?       │
│                                                 │
│  🎯 All weighted 1:1 initially                  │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│  SCRIPT INPUT + VARIANT GENERATION              │
├─────────────────────────────────────────────────┤
│  Input: New script (text)                       │
│  [Call HeyGen API with Style Pack rules]        │
│                                                 │
│  Generate 3 variants:                           │
│  - Variant A: Aggressive hook, dense captions   │
│  - Variant B: Soft hook, sparse captions        │
│  - Variant C: Balanced (reference style)        │
│                                                 │
│  Output: 3 MP4 files                            │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│  AUTO-SCORING & WINNER PICKING                  │
├─────────────────────────────────────────────────┤
│  Scorecard Results:                             │
│                                                 │
│  Variant A │ Hook:9 │ Style:7 │ Rhythm:6 │ ... │
│  ────────────────────────────────────────────   │
│  Variant B │ Hook:6 │ Style:9 │ Rhythm:8 │ ... │
│  ────────────────────────────────────────────   │
│  Variant C │ Hook:7 │ Style:9 │ Rhythm:9 │ ... │
│                                                 │
│  🏆 WINNER: Variant C (highest total score)    │
│                                                 │
│  Actions:                                       │
│  [Download Variant C] [Export Report]           │
│  [View Scorecard] [Save to History]             │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│  STYLE PACK EXPORT (JSON + Human-Editable)      │
├─────────────────────────────────────────────────┤
│  {                                              │
│    "name": "Varun Maya v0.1",                   │
│    "creator": "Your Name",                      │
│    "reference_video_id": "uuid",                │
│    "style_rules": { ... },                      │
│    "scene_map": [ ... ],                        │
│    "eval_scorecard": { ... },                   │
│    "created_at": "2026-02-01",                  │
│    "version": "0.1"                             │
│  }                                              │
│                                                 │
│  ✓ Download as JSON                            │
│  ✓ Share link (read-only)                       │
│  ✓ Version history                              │
└─────────────────────────────────────────────────┘
```

**Tech Stack:**
- Frontend: React (simple, focused on forms + video previews)
- Backend: Node.js + Express
- Video Gen: HeyGen API calls (don't build your own)
- Storage: PostgreSQL (style packs, users) + S3 (video files)
- Auth: Firebase Auth (simple email login)

**Launch Criteria:**
- ✅ 50 beta creators can complete the loop
- ✅ Eval scorecard is predictive (creators say "winner is always best")
- ✅ Style Pack JSON is human-editable
- ✅ <5% error rate on variant generation

**Success Metrics:**
- Retention: 30% of beta cohort returns >2 weeks
- NPS: >40 (strong satisfaction)
- Time to value: <30 min (upload → first 3 variants)
- Style match: 80%+ of creators say variants "feel the same"

**What's NOT in V0:**
- ❌ Analytics integration
- ❌ Auto-tuning of evals
- ❌ Team collaboration
- ❌ Marketplace
- ❌ Paid features
- ❌ API

---

## V1: SCALE & MONETIZE (Months 2-4)
### "Make It Repeatable. Make It Pay."

**Goal:** 500+ paid creators, <5% churn, clear product-market fit signals

**New Features:**

### 1. Dashboard + History
```
┌────────────────────────────────┐
│  My Style Packs                │
├────────────────────────────────┤
│  Varun Maya v0.1               │ (5 variants generated)
│  Finance Explainer v1          │ (12 variants generated)
│  Tutorial Template             │ (8 variants generated)
│                                │
│  Recent Generations:           │
│  ├─ Jan 20, 2:30pm – Winner: B │
│  ├─ Jan 19, 11:15am – Winner: A│
│  └─ Jan 18, 5:45pm – Winner: C │
└────────────────────────────────┘
```

### 2. Batch Generation
- Input: 10 scripts in CSV
- Output: 30 videos (3 variants each)
- Queue system (processes 1 at a time, shows progress)
- Bulk scorecard report

### 3. Eval Refinement (Feedback Loop)
```
After posting variant, creator provides feedback:
  "This one performed better than the scorecard predicted"
  → System logs: Hook strength should weight higher
  → Next month: "Your eval improved 15% accuracy"
```

### 4. Freemium Pricing Tier
```
FREE:
  • 1 Style Pack
  • 5 scripts/month
  • 1 variant per script (no choice)
  • Watermark on videos
  • Basic dashboard

CREATOR ($199/mo):
  • 5 Style Packs
  • 50 scripts/month
  • 3 variants per script (choose winner)
  • No watermark
  • Dashboard + History
  • Eval refinement feedback
  • Shareable Style Pack link

STUDIO ($499/mo):
  • 10 Style Packs
  • 150 scripts/month
  • 4 variants per script
  • Team seats (up to 3)
  • All Creator features
  • Batch generation
  • Custom eval dimensions
  • Priority support
```

### 5. Integrations: YouTube Analytics + Postiz
```
YOUTUBE:
  • Connect YouTube channel
  • Auto-pull CTR, retention, watch time per video
  • Show: "Your Hook Strength 9 videos = avg 45% click-through"
  • Feedback loop: evals learn what drives retention

POSTIZ:
  • "Post winner directly to TikTok/Instagram/YouTube"
  • Auto-schedule across platforms
  • Link variant to post (track performance)
```

### 6. Community & Sharing
- Discord server (free, public)
- Creator can share Style Pack link (read-only)
- Leaderboard: "Most used Style Packs this month"
- Testimonials: "This style pack helped me 3x my views"

**Tech Changes:**
- User authentication (email, OAuth)
- Freemium paywall (Stripe)
- YouTube OAuth + analytics API
- Postiz API integration
- Discord bot for community invites
- Email sequences (activation, upsell, education)

**Launch Criteria:**
- ✅ 100+ free signups in first 2 weeks
- ✅ >5% free → Creator conversion
- ✅ <8% monthly churn on Creator tier
- ✅ YouTube integration working (real data flowing)

**Success Metrics:**
- MAU: 500
- Paid users: 50+
- MRR: $10K
- LTV: $2,400 (assuming 12-month retention)
- Organic growth: >30% MoM
- Viral coefficient: 0.5+ (each creator brings 0.5 new users)

---

## V2: NETWORK EFFECTS & AUTOMATION (Months 5-8)
### "Make It Learned. Make It Marketplace."

**Goal:** 5K paid creators, $100K MRR, marketplace as new revenue stream

### 1. Marketplace Launch
```
┌──────────────────────────────────────────┐
│  STYLE PACK MARKETPLACE                  │
├──────────────────────────────────────────┤
│  Finance Explainer                       │
│  ├─ by @SarahFin (450K followers)        │
│  ├─ 2.3K users | ⭐ 4.9/5                │
│  ├─ Price: $29 (1-time) or $9/mo         │
│  ├─ "For educational finance content"    │
│  └─ [Preview] [Buy] [Reviews]            │
│                                          │
│  Product Demo (SaaS)                     │
│  ├─ by @SalesGeek (180K followers)       │
│  ├─ 1.8K users | ⭐ 4.8/5                │
│  ├─ Price: $49 (1-time)                  │
│  ├─ "Proven 2x demo booking rate"        │
│  └─ [Preview] [Buy] [Reviews]            │
│                                          │
│  [Create Your Own]                       │
│  [My Published Style Packs] (earnings)   │
└──────────────────────────────────────────┘

ACE Revenue Model:
  • $29 × 2.3K users × $0 (no cut yet) = awareness phase
  • Month 2: 15% cut = $29 × 2.3K × 0.15 = $10K/mo potential
```

### 2. Auto-Tuning of Evals
```
System learns from real data:
  Week 1:  Hook strength weighted 1.0
  Week 2:  Your videos: strong hook = 72% avg CTR
           weak hook = 31% avg CTR
  → Hook strength weighted 3.0 in Week 3
  
  Week 4:  Caption density weighted 1.0
  Week 5:  Your videos: dense captions = 68% retention
           sparse captions = 54% retention
  → Caption density weighted 2.5 in Week 6

Creator notification:
  "Your eval improved 18% accuracy this month.
   Hook strength is now your biggest lever."
```

### 3. Template Library
Pre-built Style Packs for common niches:
```
┌──────────────────────────────────────────┐
│  STARTER TEMPLATES                       │
├──────────────────────────────────────────┤
│  Finance Explainer (50K+ downloads)      │
│  Product Demo (SaaS) (35K+ downloads)    │
│  News Summary (28K+ downloads)           │
│  Motivational Quote (22K+ downloads)     │
│  Tutorial / How-To (18K+ downloads)      │
│                                          │
│  [Use Template] → customize your rules   │
└──────────────────────────────────────────┘

Revenue: Free initially (drive adoption)
Later: "Premium templates" from top creators
```

### 4. API for Agencies
```
POST /api/v1/generate-variants
{
  "style_pack_id": "uuid",
  "scripts": [
    {"text": "...", "metadata": {...}},
    {"text": "...", "metadata": {...}}
  ],
  "num_variants": 3,
  "webhook_url": "https://your-domain.com/callback"
}

Response:
{
  "job_id": "uuid",
  "status": "queued",
  "variants": [
    {"id": "var-1", "url": "s3://...", "score": 8.2},
    {"id": "var-2", "url": "s3://...", "score": 7.9},
    {"id": "var-3", "url": "s3://...", "score": 8.5}
  ],
  "winner": "var-3"
}
```

Pricing: $0.50 per variant (vs. HeyGen $1.00)
Target: 5-50 person agencies managing 5+ brands

### 5. Advanced Integrations
- TikTok analytics API (real-time performance)
- Instagram analytics (reach, engagement)
- Shopify (for affiliate/e-commerce creators)
- Patreon (for creator funding)

**Tech Changes:**
- Marketplace payment processing (Stripe Connect)
- Real-time analytics pipeline (Firebase + BigQuery)
- ML model for eval auto-tuning (TensorFlow or PyTorch)
- API gateway + rate limiting (Kong or custom)
- Webhook delivery system (Inngest or custom)

**Launch Criteria:**
- ✅ Marketplace with 100+ Style Packs (from top creators)
- ✅ Auto-tuning showing 15%+ accuracy improvement
- ✅ API tested with 3-5 agency partners
- ✅ Real analytics integration working

**Success Metrics:**
- MAU: 5K
- Paid users: 1.5K+
- MRR: $100K
- Marketplace GMV: $50K-100K/month
- Marketplace revenue (15%): $7.5K-15K/month
- LTV:CAC: >3:1 (on paid ads)
- Organic growth: >25% MoM (from marketplace discovery)

---

## NORTHSTAR: The Creator OS (Year 2+)
### "The Inevitable Layer Between Idea and Distribution"

**Vision:**
Every creator thinks: "Before I post, I test in ACE."
Every platform recommends consistency; ACE is how you achieve it.

### Key Metrics (Targets)
```
Users:           50K MAU
Paid:            15K+ (30% conversion)
Revenue:         $50M+ ARR
Retention:       70%+ (monthly)
LTV:CAC:         5:1+
Marketplace:     30% of revenue
Quality:         Generated ≈ Professional (indistinguishable)
```

### Core Product Positioning
```
┌────────────────────────────────────────────────┐
│  ACE: The Creator OS                          │
│                                                │
│  • Every creator has a Style Pack              │
│  • Every post is variant-tested                │
│  • Every upload teaches the system             │
│  • Every creator compounds their edge          │
│                                                │
│  "Before you post, test in ACE."               │
│  (tagline for all marketing)                   │
└────────────────────────────────────────────────┘
```

### Revenue Streams
```
Subscription (70% of revenue):
  • Creator tier: $199/mo × 10K users = $20M/yr
  • Studio tier: $499/mo × 4K users = $24M/yr
  • Enterprise: Custom, $500K-2M/yr contracts

Marketplace (20% of revenue):
  • 15% cut on Style Pack sales
  • Estimated: $8M/yr (once network reaches scale)

API/Integration (10% of revenue):
  • Agencies, platforms, brands
  • $0.50 per variant × 40M variants/yr = $20M
  • Margin to ACE: 60% = $12M/yr

Total potential: $56M+ ARR (low estimate)
```

### Competitive Moat (at Northstar)
1. **Data moat** – Evals improve from 50K creators' feedback (competitors can't access)
2. **Network moat** – Marketplace creates switching cost (can't take your Style Pack elsewhere)
3. **Taste moat** – ACE evals encode the collective knowledge of top creators
4. **Creator moat** – "I built my audience with ACE" mindset

### Market Leadership Position
```
┌──────────────────────────────────────────┐
│  Creator Perception (Goal)               │
├──────────────────────────────────────────┤
│  HeyGen    → "Video generation tool"     │
│  Adobe     → "Professional editing"      │
│  Postiz    → "Scheduling + analytics"    │
│  ACE       → "HOW I MAKE MY CHANNEL"     │
│                                          │
│  "Built on ACE" = status for creators    │
│  "Backed by ACE evals" = trust signal    │
└──────────────────────────────────────────┘
```

---

## PHASE GATES (Funding + Validation)

### Pre-Launch (Feb 2026)
- **Gate 1:** Varun Maya style fully extractable (Day 1-7)
- **Gate 2:** 5 creators validate eval scorecard (Day 8-14)
- **Gate 3:** Style Pack JSON shareable & editable (Day 15-21)

### V0 Launch (Feb 2026)
- **Gate 4:** 50 beta users, 30%+ 2-week retention (Target: Week 4)
- **Gate 5:** NPS >40, >80% say "winner was best" (Target: Week 4)
- **Gate 6:** Zero failed video generations (quality gate)

### V1 Launch (April 2026)
- **Gate 7:** 100+ paid sign-ups, >5% free→Creator conversion (Target: Week 8)
- **Gate 8:** <8% monthly churn on Creator tier (Target: Week 12)
- **Gate 9:** YouTube integration live, real data flowing (Target: Week 10)
- **Gate 10:** LTV > $2,400 (12-month retention estimate) (Target: Week 12)

### V2 Launch (August 2026)
- **Gate 11:** 100+ Style Packs in marketplace (from top creators, not ACE) (Target: Week 20)
- **Gate 12:** Evals showing 15%+ accuracy improvement month-over-month (Target: Week 20)
- **Gate 13:** 3+ agencies using API in production (Target: Week 22)
- **Gate 14:** LTV:CAC > 3:1 on paid ads (Target: Week 24)

### If Any Gate Fails
- Pause and pivot (don't force)
- Example: If <5% free→paid, change pricing or repositioning
- Example: If >8% churn, identify why (survey users)

---

## Summary Table: V0 → V1 → V2 → Northstar

| Dimension | V0 | V1 | V2 | Northstar |
|-----------|----|----|----|----|
| **Users** | 50 | 500 | 5K | 50K |
| **Paid** | 0 | 50 | 1.5K | 15K+ |
| **MRR** | $0 | $10K | $100K | $4M+ |
| **Churn** | N/A | <8% | <6% | <5% |
| **Key Feature** | Manual workflow | Freemium + integrations | Marketplace + Auto-tune | API-first, Maturity |
| **Moat** | None yet | Early lock-in | Network effect + data | Compounding learning |
| **Go-to-Market** | Beta community | Organic + paid | Marketplace flywheel | Platform dominance |
| **Time to Launch** | Feb 2026 | April 2026 | August 2026 | H1 2027 |

---

## THE CONVICTION

**This is winnable because:**

1. **Real gap exists** – No one owns "repeatable creator style" category
2. **Creators are desperate** – Consistency is the #1 way to grow
3. **You have founder-market fit** – You've lived the pain
4. **Defensible moat** – Learning loop > features
5. **Large TAM** – $3.4B market, $140M-700M SAM
6. **Clear wedge** – Start with explainers, expand to agencies
7. **Repeatable unit economics** – $200/mo × 80% → $160 LTV per user per month

**Execution matters more than product.** You don't need to be perfect in V0. You need to be:
- ✅ Fast (ship in weeks, not months)
- ✅ Focused (one style pack, prove it works)
- ✅ Validating (5 creators before scaling)
- ✅ Iterating (churn < 8% tells you if you're right)