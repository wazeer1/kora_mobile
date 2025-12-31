# Debate Platform – Complete Mobile UI/UX Design System

**Status:** Production-ready blueprint for iOS + Android  
**Version:** 1.0  
**Date:** December 2025  

---

## 1. Information Architecture (IA)

### Total Screen Count: 24–28 core screens
(Not including modals, sheets, edge-state variations)

### Screen Hierarchy (Tree Structure)

```
APP ROOT
├── Authentication Layer
│   ├── Splash / App Restore
│   ├── Login / Social Auth
│   ├── Signup (email or social)
│   ├── Phone verification (OTP) – optional
│   └── Onboarding carousel (3–5 screens)
│
├── Main Logged-In App (Bottom Tab Navigation)
│   ├── TAB 1: "Discover" (Home Feed)
│   │   ├── Live Now (sticky top section)
│   │   ├── Recommended Events Feed
│   │   ├── Following / Subscribed Series
│   │   ├── Topic Filter/Search
│   │   └── All events end in: Tap → Room Detail (pre-join)
│   │
│   ├── TAB 2: "Ladder" (Ranked Progression)
│   │   ├── My Current Division (hero card)
│   │   ├── Matchmaking Queue / Upcoming matches
│   │   ├── Ladder leaderboard (top 100, ranked by rating)
│   │   ├── Topic selector (drill into topic-specific ladder)
│   │   └── Stats summary card (win/loss, rating, streak)
│   │
│   ├── TAB 3: "Live/Participate" (Your Role)
│   │   ├── If user is HOST/SPEAKER:
│   │   │   ├── Active room (large, primary)
│   │   │   │   ├── Live Arena view (1v1 podium, audience)
│   │   │   │   ├── Chat sidebar / spectator list
│   │   │   │   ├── Timer bar (round countdown)
│   │   │   │   └── Controls (Raise Hand, Sentiment slider, Facts flag)
│   │   │   └── Post-debate stats screen
│   │   │
│   │   └── If user is AUDIENCE:
│   │       ├── Spectator view (full screen debate + sidebar)
│   │       └── Post-debate: replay & highlights
│   │
│   ├── TAB 4: "Profile & My Space"
│   │   ├── My profile (stats, rank, badges, follow count)
│   │   ├── My created events (history, series)
│   │   ├── My debates (recordings, stats, replays)
│   │   ├── Settings (privacy, notifications, accessibility)
│   │   ├── Monetization (Golden Mic earnings, tickets, analytics sub status)
│   │   └── Org workspace (if user is in org)
│   │
│   └── TAB 5: "More" / Drawer
│       ├── Notifications center
│       ├── Saved/Bookmarks
│       ├── Messages (team chat during debates)
│       ├── Help & feedback
│       └── Logout
│
├── Secondary Flows (Stacks)
│   ├── Room Detail (Pre-join screen)
│   │   ├── Event title, hosts, format, round structure
│   │   ├── Participant list preview
│   │   ├── Debate rules / privacy level
│   │   ├── CTA: "Join as Speaker" or "Watch as Audience"
│   │   └── → Leads to Live Arena or Spectator view
│   │
│   ├── Replay / Highlights (Post-debate consumption)
│   │   ├── Full video with interactive timeline
│   │   ├── Sentiment worm graph overlay
│   │   ├── Transcript + source links
│   │   ├── Clips carousel (auto-generated suggestions)
│   │   ├── Share clips to external platforms
│   │   └── Stats tab (per-speaker analytics)
│   │
│   ├── Create Event (Host flow – multi-step)
│   │   ├── Event title & topic
│   │   ├── Rulebook selector (preset or custom)
│   │   ├── Format & privacy
│   │   ├── Invite participants / schedule
│   │   └── Publish & share
│   │
│   ├── Org Workspace (if user is coach/trainer)
│   │   ├── Team roster
│   │   ├── Scheduled matches & leagues
│   │   ├── Analytics dashboard (student progress)
│   │   ├── Bulk event creation
│   │   └── Revenue & monetization settings
│   │
│   ├── Settings & Preferences (Modal or full screen)
│   │   ├── Account (email, password, 2FA)
│   │   ├── Privacy (profile visibility, recording consent)
│   │   ├── Notifications (push, email, in-app)
│   │   ├── Accessibility (font size, contrast, motion)
│   │   ├── Billing & payments
│   │   └── Logout / account deletion
│   │
│   └── Premium Analytics (Paywall + dashboard)
│       ├── Subscription tier selector
│       ├── Pricing, benefits, compare
│       ├── Performance dashboard (if subscribed)
│       │   ├── Audience retention graph
│       │   ├── Argument tags & insights
│       │   ├── Win/loss breakdown by topic
│       │   └── Export options
│       └── Upgrade / cancel flow
│
└── Conditional Flows
    ├── Permission requests (microphone, camera, notifications)
    ├── Error states (network, payment declined, host disconnected)
    ├── Onboarding (first time only)
    ├── Account recovery
    └── Forced logout (session expired, security event)
```

### Screen Classification by User Type

**Fresh User (Logged Out)**
- Splash → Login/Signup → Onboarding carousel → Discover (home feed)

**Returning User (Logged In)**
- App resume → Discover (home feed) → Ladder / Profile / Create Event as needed

**Host/Creator User**
- Logged in → Ladder/Profile → Create Event → Room Detail (pre-join) → Live Arena (host controls) → Post-debate stats + monetization tools

**Spectator/Trainer**
- Logged in → Discover or Ladder → Room Detail → Spectator view → Replay (with analytics if subscribed)

---

## 2. Navigation System

### Navigation Strategy: **Hybrid Tab + Stack**

#### Primary: Bottom Tab Navigation (Always Visible)
```
[Discover] [Ladder] [Live] [Profile] [More]
```

**Why this structure:**
- 5 tabs keeps scope clear and reduces accidental navigation debt.
- Separates concerns: discovery (feed), progression (ladder), active participation (live), identity (profile), and utilities (more).
- Bottom tabs reduce cognitive load vs drawer (persistent, always available, thumb-friendly).
- "Live" tab acts as a clear entry point for participation.
- "More" drawer avoids tab bloat and groups lower-frequency actions.

#### Secondary: Modal & Sheet Overlays
- **Bottom sheets:** 
  - Rulebook selector during event creation.
  - Topic filter/search in Discover.
  - Share/export clips.
  - Sensitivity/privacy warnings before entering debate on controversial topic.
- **Full-screen modals:** 
  - Event creation (multi-step form).
  - Settings.
  - Payment / checkout.
- **Toasts & snackbars:** 
  - Notifications (live room invite, rating update, payment success).
  - Quick feedback (copied to clipboard, saved bookmark).

#### Tertiary: Stack Navigation (Push/Pop)
- Room Detail → Live Arena (full screen, replaces whole view).
- Debate → Replay (full screen, immersive).
- Profile → Org Workspace (if applicable).
- Ladder → Topic Drill-Down → Matchmaking (progressive disclosure).

---

### Back Button Behavior & Gesture Rules

**Standard iOS back:**
- Swipe from left edge → pop stack.
- Back button (if in non-tab view) → dismiss modal or pop stack.

**Standard Android back:**
- System back button → pop stack or dismiss modal.
- From main tab → app background (not home screen).

**Special cases:**
- During LIVE debate: back button disabled (user must end room via "Leave" CTA).
- During payment: back button disabled (clear "cancel" CTA instead).
- During onboarding: back button disabled (forward-only until complete).

---

### Deep Linking Strategy

**URL scheme:**
- `arena://debate/{debate_id}` → Room Detail
- `arena://ladder/{topic_id}` → Topic-specific ladder
- `arena://replay/{debate_id}?start={timestamp}` → Replay with timestamp
- `arena://user/{user_id}` → Public profile
- `arena://invite/{event_id}/{invite_token}` → Join event with pre-auth

**External links (from clips, shares):**
- TikTok/YouTube clip link → `arena://replay/{debate_id}?clip={clip_id}` → auto-snip and play
- Shared profile → `arena://user/{user_id}` → open profile with follow CTA

---

### Edge Cases & Forced Flows

| Scenario | Behavior |
|----------|----------|
| **User returns after 30+ days** | Splash → auto-login → Discover (highlight new features or season reset) |
| **Session expires during live debate** | Soft reconnect attempt (3 retries); if fails → snackbar "Connection lost, leaving room" + auto-exit to Replay |
| **Payment declined mid-Golden Mic purchase** | Toast notification + retain queue position for retry (1 retry grace period) |
| **Host disconnects during debate** | Co-host (if exists) auto-promoted; else room transitions to "Audience Only" mode with timer paused |
| **User denies microphone permission at join** | Modal: "Microphone required. Allow in Settings?" + link to iOS/Android settings |
| **First-time user joins during debate** | Simplified spectator UI (sentiment slider disabled); full UX unlocked after tutorial |
| **Network goes offline during room load** | Skeleton screens + "Attempting to reconnect..." banner; if >10s offline, show cached room list or "Offline mode" hint |

---

## 3. Authentication & Onboarding UX

### Authentication Flow (5 screens total)

#### Screen 1: Splash / App Initialization
- **Purpose:** Show loading state while checking for existing session.
- **Visual:** Logo + brand color, no copy.
- **Behavior:** 
  - If session valid → auto-proceed to Discover (silent login).
  - If session expired → clear session + show Login screen.
  - Duration: 2–3 seconds max.

#### Screen 2: Login / Sign Up Choice
- **Purpose:** Initial entry point; reduce friction by offering multiple auth methods.
- **Layout:**
  - Top: Branding + tagline ("Where logic wins, not volume").
  - Middle: Auth method buttons:
    - "Continue with Google" (highest conversion, pre-fill email).
    - "Continue with Apple" (iOS preferred).
    - "Continue with Email" (fallback).
    - (Optional) "Continue with Twitter/X" (for creators).
  - Bottom: T&Cs link + privacy.
- **Copy intent:** "Ready to debate?" or "Join the arena."
- **States:**
  - Default: clear buttons, no errors.
  - Loading: button spinner, disabled interaction.
  - Error: "Sign-in failed. Try again." + retry button.

#### Screen 3: Email/Password Entry (if "Email" chosen)
- **Purpose:** Manual signup or login.
- **Layout:**
  - Email input field (single, prefilled if possible).
  - Password field (toggle show/hide).
  - "Forgot password?" link.
  - "Sign up" / "Log in" button.
  - Switch to social auth link ("Use Google instead").
- **Validation timing:** 
  - Email: on blur (valid format check).
  - Password: on blur (if >6 chars) or on submit (stricter: >8, uppercase, number).
- **Error messaging:** 
  - Email not found (if login): "No account with this email. Sign up instead?"
  - Weak password: "Password too weak. Use 8+ chars, uppercase, and number."
  - Network error: "Connection failed. Try again."

#### Screen 4: Phone Verification (Optional, for creators/monetization)
- **Purpose:** Verify phone for payment payouts.
- **Layout:**
  - Explanation: "Verify your phone for creator payments."
  - Phone input (with country picker).
  - "Send code" button.
  - After send: OTP entry (6 digits) + "Resend in 60s" (countdown).
- **States:**
  - Before send: input + button.
  - After send: OTP entry + spinner.
  - Retry limit: 3 attempts; show "Try again later."

#### Screen 5: Onboarding Carousel (3–5 slides)
- **Purpose:** Set expectations and reduce first-debate anxiety.
- **Progressive onboarding:** Not all slides mandatory; skip enabled after slide 1.

**Slide 1: Welcome**
- Title: "Welcome to the Arena"
- Body: "Debates with rules, rankings, and real-time audience engagement."
- Visual: Simple icon or illustration (debaters on podium).
- CTA: "Next" or "Skip"

**Slide 2: How it works**
- Title: "Join or Host Debates"
- Body: "Compete in ranked ladders, practice with coaches, or host live for an audience."
- Visual: Small icon showing 1v1 format.
- CTA: "Next"

**Slide 3: Your profile**
- Title: "Build Your Reputation"
- Body: "Earn rank, badges, and analytics by debating well and following rules."
- Visual: Elo rating graphic or badge icon.
- CTA: "Next"

**Slide 4: Getting started (if new)**
- Title: "Ready to go?"
- Body: "Browse upcoming debates or create your own. No pressure!"
- CTA: "Explore" (goes to Discover tab)

**Animations:**
- Swipe to next (left-to-right).
- Fade transition between slides.
- No parallax or overly complex motion (too many new concepts; keep focus on copy).

---

## 4. Core Screens – Detailed Breakdown

### SCREEN: Discover (Home Feed)
**Tab 1, Primary entry point for all users**

#### a) Purpose
- Reduce friction to first debate participation.
- Show live, trending, and personalized events.
- Separate "serious" debates (political, academic) from "light" (movies, food) to manage expectations.

#### b) Layout Structure

```
┌─────────────────────────────┐
│ Header: "Arena"             │  ← Status bar, time, no actionable header
├─────────────────────────────┤
│ "Live Now" (sticky section) │  
│ ┌─────────────────┐         │  
│ │ Live Event Card │ × 1–3   │  ← Horizontal scroll, limited to 1.5 visible
│ └─────────────────┘         │  
├─────────────────────────────┤
│ Filter Chips (horizontal)   │  ← Topic: All, Politics, Tech, Philosophy, Light
│ [All] [Politics] [Tech] ... │     Tap expands full list in bottom sheet
├─────────────────────────────┤
│ Recommended Events (list)   │
│ ┌─────────────────────────┐ │
│ │ Event Card Row 1        │ │  ← Each card shows: title, hosts, 2–3 participants
│ │ (2v2 Politics Debate)   │ │     Format icon, audience count, "Join" CTA
│ │ 47 watchers             │ │
│ │ [Join]                  │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ Event Card Row 2        │ │
│ └─────────────────────────┘ │
│ ... (continuous scroll)     │
│                             │
│ Search/Filter bar (footer)  │  ← Tap to open search + advanced filters
└─────────────────────────────┘
```

#### c) UI Components Used

**Live Now Section:**
- Horizontal scroll container with max width cards (viewport width - 32px).
- Each card shows:
  - Event title (1 line, truncated).
  - Host avatar + name.
  - Format badge (1v1, 2v2, Panel, Hot Seat).
  - "Live" indicator (pulsing red dot + "47 watching now").
  - Tap entire card → Room Detail screen.

**Topic Filter Chips:**
- Horizontal scroll, snappy feedback (tap highlight color).
- Default: "All" selected.
- Tapping "All" → shows all topics.
- Tapping specific topic (e.g., "Politics") → filters feed to that topic only.
- Tapping again → deselects, back to "All".

**Event Cards (Feed):**
- Full width minus 16px padding each side.
- Card structure:
  ```
  ┌─────────────────────────┐
  │ Title (1 line, bold)    │  ← "Free Speech vs Censorship"
  │                         │
  │ Hosts: [Avatar] Name +1 │  ← Max 2 avatars visible
  │                         │
  │ Format: 2v2 | Audience: │  ← Metadata line
  │ 234 watching            │
  │                         │
  │ [1 line summary if room] │  ← Optional: topic preview
  │                         │
  │ [Join as Speaker] [Watch]│  ← Two CTAs side-by-side
  └─────────────────────────┘
  ```
- States:
  - Default: normal appearance.
  - Hover/long-press (Android): slight elevation + highlight.
  - Tapped: pushed to Room Detail.

**Search / Filter (footer area):**
- Tap zone at bottom of feed.
- Icon: magnifying glass + "Search debates" placeholder text.
- Tap → slides up bottom sheet with:
  - Text search field (topics, host names, debate titles).
  - Filter options: Format (1v1, 2v2, Panel), Privacy (Public, Unlisted), Time range (happening now, this week, anytime).

#### d) Data Density Strategy

- **Visible by default:**
  - Live Now section (1–2 events visible, encouraging scroll).
  - 2–3 full event cards (enough to evaluate debate).
  - Topic filters (highest impact categories).
  
- **Hidden behind interaction:**
  - Full event description (tap card → Room Detail).
  - Topic list beyond visible chips (scroll horizontally or tap "more").
  - Advanced filters (search/filter sheet).

- **Why:**
  - Scrolling is free; prevents cognitive overload on first view.
  - One tap to details keeps users engaged, not overwhelmed.

#### e) Micro-Interactions

- **Tap event card:**
  - Slight scale (1.02x) + shadow elevation for 100ms.
  - Push to Room Detail screen with fade-in animation.
  
- **Swipe Live Now carousel:**
  - Smooth pan gesture; snap to card boundaries.
  - Velocity-based deceleration (feel natural, not sticky).

- **Filter chip tap:**
  - Background color shift (white → primary color).
  - Feed re-sorts with fade transition (200ms).

- **Scroll feed:**
  - Infinite scroll; load next batch when user is 80% down.
  - Show skeleton cards (3–4) during load; fade in real data.

---

### SCREEN: Ladder (Ranked Progression)
**Tab 2, Primary for competitive users**

#### a) Purpose
- Show player's current rank, upcoming matches, and path to advancement.
- Encourage repeated participation and long-term engagement.
- Display leaderboard to foster social comparison and aspirational content.

#### b) Layout Structure

```
┌─────────────────────────────┐
│ "My Rank" (Hero Card)       │  ← Sticky section
│ ┌─────────────────────────┐ │
│ │ Division Badge: Gold III │ │  ← Visual badge, stars/bars
│ │ Rating: 1,847           │ │
│ │ [⬆ +12 from last week]  │ │
│ │ Projected: Silver I     │ │  ← Next division with progress bar
│ │ Progress: [████░░░░░░░] │ │
│ │                         │ │
│ │ [Find Next Match]       │ │  ← CTA to join queue
│ └─────────────────────────┘ │
├─────────────────────────────┤
│ "Upcoming Matches"          │
│ ┌─────────────────────────┐ │
│ │ vs. Alice (Gold II)     │ │  ← Small card; tap to join
│ │ 1v1 Politics            │ │
│ │ Starts in 15 min        │ │
│ │ [Ready?]                │ │
│ └─────────────────────────┘ │
├─────────────────────────────┤
│ Topic Filter (horizontal)   │  ← [All Topics] [Politics] [Tech] [Philosophy]
├─────────────────────────────┤
│ Leaderboard (list)          │
│ Your Rank: #47 of 12,384    │  ← Contextual rank for this topic
│ ┌─────────────────────────┐ │
│ │ 1. [Avatar] Bob (2,104) │ │  ← Top 3 highlighted with trophy icons
│ │ 2. [Avatar] Carol (1,998)│ │
│ │ 3. [Avatar] Dave (1,964)│ │
│ ├─────────────────────────┤ │
│ │ 47. [Avatar] You (1,847)│ │  ← Highlighted row, centered
│ ├─────────────────────────┤ │
│ │ 48. [Avatar] Eve (1,840)│ │
│ │ ... (continues)         │ │
│ └─────────────────────────┘ │
│                             │
│ [View Full Leaderboard]     │  ← Tap to sort/filter (all ranks, by region, by streak)
└─────────────────────────────┘
```

#### c) UI Components Used

**Hero Card (My Rank):**
- Large, visually prominent card with gradient background (primary color + transparent overlay).
- Shows:
  - Division badge (visual: star count or tier bar graphic).
  - Numeric rating (large, bold font).
  - Weekly change (green up arrow + number if gaining, gray if flat, red down if losing).
  - Next division milestone with progress bar (linear).
  - "Find Next Match" button (secondary style, stands out).

**Upcoming Matches:**
- Card per upcoming match (collapse if none scheduled).
- Shows opponent avatar, name, rating delta (±N).
- Format icon.
- Time until match start.
- CTA: "[Ready?]" button (taps to join that room directly).

**Topic Filter Chips:**
- Horizontal scroll (same pattern as Discover).
- "All Topics" is default; tap specific topic to filter ladder by that topic only.
- Leaderboard + upcoming matches re-filter instantly.

**Leaderboard List:**
- Rank number (left-aligned) + avatar + username + rating (right-aligned).
- Top 3 ranks: trophy icon beside rank number (🥇 🥈 🥉).
- Current user's row: highlighted with subtle background color + centered on screen (parallax scroll so user's rank stays visible).
- Tap any row → Public profile view.

#### d) Data Density Strategy

- **Visible by default:**
  - Hero card (reinforces current rank).
  - 1–2 upcoming matches (if scheduled).
  - Topic filters.
  - Top 3 + current user + 2–3 surrounding ranks (context).

- **Hidden behind interaction:**
  - Full leaderboard (scroll down or tap "View Full Leaderboard" → separate screen with sort/filter options).
  - Detailed history (tap user profile → history tab).

- **Why:**
  - Hero card drives emotional engagement (gamified progression).
  - Upcoming matches reduce friction to "next action" (explicit queue visible).
  - Leaderboard shows achievable targets (not just #1, but peers close by).

#### e) Micro-Interactions

- **Tap "Find Next Match":**
  - Button changes to "Searching..." + spinner.
  - After 3–5s, if match found → bottom sheet "Match found: vs. Bob (Gold II)" with [Accept] / [Decline].
  - If no match → snackbar "No opponents available right now. Try again later."

- **Filter topic:**
  - Chip highlights, leaderboard fades + re-renders with new rankings (200ms fade).

- **Scroll to own rank:**
  - If user scrolls past own rank, sticky header shows "Your Rank: #47" + jump-to button to re-center.

- **Weekly rating update (if displayed):**
  - Animate +/- number with green/red text; subtle pulse effect to draw attention.

---

### SCREEN: Live Arena (Debate Room)
**Tab 3, Only visible during active debate**

#### a) Purpose
- Provide clear visual hierarchy for speaker(s), teammates, and audience actions.
- Reduce cognitive load during high-stakes live interaction.
- Enable audience engagement without distracting debaters.

#### b) Layout Structure

**Host/Debater View (Speaker):**

```
┌──────────────────────────────┐
│ Status Bar (system)          │
├──────────────────────────────┤
│ Round Indicator & Timer      │  ← "Round 2 of 4: Rebuttal"
│ [████████░░░░░░░░░] 1:23     │    Timer bar fills left-to-right
├──────────────────────────────┤
│ Main Arena (Podium)          │
│ ┌──────────────────────────┐ │
│ │ ACTIVE SPEAKER (Large)   │ │  ← Full-width, avatar, name, text "Speaking..."
│ │ [Avatar] NAME            │ │
│ │ "Speaking..."            │ │  ← Or "Waiting..." or "Waiting to speak"
│ └──────────────────────────┘ │
│                              │
│ ┌──────────────────────────┐ │
│ │ Other Participant (Small)│ │  ← Opponent or team mate (muted)
│ │ [Avatar] NAME            │ │
│ │ "Listening..." / Muted   │ │
│ └──────────────────────────┘ │
├──────────────────────────────┤
│ Action Bar (Bottom)          │
│ [Chat] [Raise Hand] [Fact?] │  ← 3 main controls; tap to open
│ [More options ⋯]            │
└──────────────────────────────┘
```

**Audience/Spectator View:**

```
┌──────────────────────────────┐
│ Status Bar (system)          │
├──────────────────────────────┤
│ Round Indicator & Timer      │
│ [████████░░░░░░░░░] 1:23     │
├──────────────────────────────┤
│ Main Arena (Full Screen)     │
│ ┌──────────────────────────┐ │
│ │ ACTIVE SPEAKER (Large)   │ │
│ │ [Avatar] NAME            │ │
│ │ "Speaking..."            │ │
│ └──────────────────────────┘ │
│                              │
│ ┌──────────────────────────┐ │
│ │ Opposing Speaker         │ │
│ │ [Avatar] NAME            │ │
│ │ "Listening..."           │ │
│ └──────────────────────────┘ │
├──────────────────────────────┤
│ Sentiment Slider (Live)      │  ← Interactive slider: Agree ←→ Disagree
│ ← Pro | Worm graph | Con →  │    Worm animates in real-time
│ 68% | (Agree)    | 32%      │
├──────────────────────────────┤
│ Audience Controls           │
│ [Golden Mic] [Fact Check]   │  ← Tap to flag/queue question
│ [More ⋯]                    │
└──────────────────────────────┘
```

#### c) UI Components Used

**Round Indicator & Timer:**
- Top bar, sticky, full-width.
- Shows round name + current time (e.g., "Round 2 of 4: Rebuttal").
- Linear progress bar underneath (primary color fills left-to-right).
- Numeric countdown on right (MM:SS format, large enough to read at arm's length).
- When time is <10s: bar animates red + timer text pulses.

**Speaker Avatar & Name:**
- Large circle avatar (120px+) centered.
- Name below avatar (large font, bold).
- Status text below name (e.g., "Speaking now", "Waiting to speak", "Listening...").
- If speaker is muted: muted icon overlay on avatar.

**Sentiment Slider:**
- Full-width, interactive slider with labels "Agree" (left) and "Disagree" (right).
- User's slider thumb position is persistent during debate; dragging updates real-time.
- Worm graph appears below: line shows live sentiment trend (red = disagree, green = agree, gray = neutral).
- Percentage labels (e.g., "68% agree") update as graph shifts.
- Tap anywhere on slider to set position; smooth animation (100ms).

**Action Buttons (Debater):**
- Row of 3–4 buttons, full-width, equal-width layout.
  - [Chat]: Opens team chat sidebar (if in team).
  - [Raise Hand]: Queues user for next interrupt or question (if Interruption Queue enabled).
  - [Fact?]: Flags current speaker for fact-check required (audience-accessible via "Fact Check" count).
  - [More ⋯]: Opens modal with additional actions (mute self, leave room, settings).

**Action Buttons (Audience):**
- [Golden Mic]: Opens purchase flow if not already paid; shows queue position if paid.
- [Fact Check]: Increments counter or opens sheet to flag specific claim.
- [More ⋯]: Share, report, settings.

#### d) Data Density Strategy

- **Visible by default:**
  - Timer & round progress (always top-of-mind for debaters).
  - Active speaker + opposing speaker (1–2 roles only).
  - Sentiment slider (real-time feedback for audience).
  - Core action buttons (3–4 most important).

- **Hidden behind interaction:**
  - Full participant list (tap roster icon in "More" → side sheet).
  - Chat (tap Chat button → side sheet).
  - Advanced settings (tap settings icon in "More" → modal).

- **Why:**
  - Debate is high-attention; minimize UI clutter.
  - Sentiment slider is new/differentiating; make it prominent but not overwhelming.
  - Tap-to-expand patterns avoid creating "dead space" with unused controls.

#### e) Micro-Interactions

- **Speaker changes:**
  - Fade out old speaker, fade in new speaker (150ms).
  - Scale avatar up slightly on entrance (draw attention to new speaker).

- **Timer countdown:**
  - Every second, timer updates (no animation, just number change).
  - At <10s: bar turns red, number text pulses (pulsing animation 500ms duration, repeats).
  - At 0s: hard stop, mic icon disappears, "Time's up" message appears briefly.

- **Sentiment slider drag:**
  - User drags thumb; worm graph updates smoothly in real-time (no lag).
  - On release: thumb snaps to nearest position if not perfectly placed (improves accuracy).

- **Raise Hand / Fact Check tap:**
  - Button fills with highlight color, text changes to "Raised" / "Flagged".
  - After action completes, button returns to default state.
  - Snackbar feedback: "You've raised your hand. Queue position: #3."

- **Share/Report tap:**
  - Bottom sheet slides up from bottom with options:
    - [Share to X/Twitter]
    - [Share to WhatsApp]
    - [Copy Link]
    - [Report User] (with reason selector).

---

### SCREEN: Post-Debate Stats
**Secondary screen, shown immediately after debate ends**

#### a) Purpose
- Provide immediate feedback on performance.
- Reinforce reputation/rating gains.
- Drive retention via "see next debate" CTA.

#### b) Layout Structure

```
┌─────────────────────────────┐
│ Debate Summary (Hero)       │
│ "vs. Alice (Gold II)"       │  ← Opponent name + rating
│ You: Politics 1v1           │  ← Topic + format
│ Duration: 14 min 23 sec     │
├─────────────────────────────┤
│ Rating Change (Large)       │
│ Your Rating: 1,847 → 1,889  │  ← Green text, +42 points
│ (+42 points, +0.3 division) │
├─────────────────────────────┤
│ Performance Stats (Cards)   │
│ ┌─────────────────────────┐ │
│ │ You        | Alice      │ │
│ │ Time Spoken: 6:40 | 6:12 │ │
│ │ Interrupts: 3     | 5     │ │  ← Row per metric
│ │ Fact Checks: 1    | 0     │ │
│ │ Unique Words: 187 | 201   │ │
│ └─────────────────────────┘ │
│                             │
│ [View Full Replay]          │  ← CTA
│ [Join Next Debate]          │  ← CTA (highlights next scheduled match)
├─────────────────────────────┤
│ Social Share                │
│ [Share on TikTok]           │
│ [Share on Instagram]        │
│ [Share to X]                │
└─────────────────────────────┘
```

#### c) UI Components Used

**Hero Summary Card:**
- Large, prominent, shows opponent info + topic.
- Reinforces "game" feeling (like sports match summary).

**Rating Change Display:**
- Large font, primary color, shows numeric delta.
- Subtext: next division milestone + progress (e.g., "Now 47 points from Silver I").

**Stats Comparison Table:**
- Two-column layout (You | Opponent).
- Rows: Time Spoken, Interruptions, Fact Checks, Unique Words, etc.
- Use emoji or icons to differentiate stat type (⏱️ for time, 🎯 for accuracy, etc.).

**CTAs:**
- [View Full Replay]: Secondary button, leads to full replay screen.
- [Join Next Debate]: Primary button, highlights next scheduled match or opens matchmaking.
- Share buttons (secondary, less prominent).

#### d) Micro-Interactions

- **Screen entrance:**
  - Fade in with slight scale-up (celebrate the moment).
  
- **Rating display:**
  - Animate number from old → new (1,847 → 1,889) over 500ms with easing.
  - Green color pulses briefly at end of animation.

- **Tap [Join Next Debate]:**
  - If match scheduled: push to Room Detail.
  - If no match: open matchmaking bottom sheet.

---

### SCREEN: My Profile & Workspace
**Tab 4, Personal hub**

#### a) Purpose
- Display user's public identity, achievements, and content library.
- Provide entry point to settings, monetization, and org workspace (if applicable).

#### b) Layout Structure

**Personal Profile:**

```
┌─────────────────────────────┐
│ Header (Profile Section)    │
│ [Avatar]                    │  ← Large, tappable to change
│ Username / Display Name     │
│ Rank: Gold III (Rating)     │  ← Current rank + numeric rating
│ Verified Expert (if applicable)
│ [Edit Profile]              │  ← CTA (settings icon)
├─────────────────────────────┤
│ Stats Snapshot              │
│ Debates: 47 | Win Rate: 73% │  ← Key metrics in columns
│ Followers: 234 | Following: 18
├─────────────────────────────┤
│ [Follow / Message] buttons  │  ← If viewing another user
├─────────────────────────────┤
│ Tabs (segmented control)    │
│ [Debates] [Series] [Saved]  │  ← Swipeable tabs
├─────────────────────────────┤
│ TAB CONTENT:                │
│ If [Debates]:               │
│ ┌─────────────────────────┐ │
│ │ Recent Debate Card 1    │ │  ← Tap to view replay
│ │ vs. Alice (Won +42 pts) │ │
│ │ Politics 1v1            │ │
│ │ [Watch Replay]          │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ Recent Debate Card 2    │ │
│ └─────────────────────────┘ │
│ ... (scroll, load more)     │
│                             │
│ If [Series]:                │
│ ┌─────────────────────────┐ │
│ │ Series / Shows hosted   │ │
│ │ "Weekly Politics Lab"   │ │
│ │ 12 episodes, 5.2K views │ │
│ │ [View Series]           │ │
│ └─────────────────────────┘ │
│                             │
│ If [Saved]:                 │
│ ┌─────────────────────────┐ │
│ │ Bookmarked Replays      │ │
│ │ (empty if none)         │ │
│ └─────────────────────────┘ │
│                             │
├─────────────────────────────┤
│ [Settings] [Monetization]   │  ← Footer CTAs
│ [Org Workspace]             │  ← If user is in org
└─────────────────────────────┘
```

#### c) UI Components Used

**Profile Header:**
- Large avatar (120px+), centered, with edit icon overlay.
- Username, rank badge, and optional "Verified Expert" label.
- Social actions: [Follow], [Message] (if viewing other user's profile).

**Stats Snapshot:**
- Row of key metrics: Debates, Win Rate, Followers, Following.
- Tap any stat to drill into detailed view (e.g., [Debates: 47] → full debate history with filters).

**Segmented Control (Debates | Series | Saved):**
- Horizontal tabs at top of content area.
- Tap to switch between views.
- Content fades/slides to new selection.

**Debate / Series Cards:**
- Card per item with thumbnail (if replay available), title, metadata, and [Watch] or [View] CTA.

**Footer CTAs:**
- [Settings]: Gear icon, leads to settings modal.
- [Monetization]: Dollar icon, leads to creator payment/analytics dashboard.
- [Org Workspace]: Team icon, leads to org management (if applicable).

#### d) Data Density Strategy

- **Visible by default:**
  - Profile header (identity).
  - Stats snapshot (quick overview of activity).
  - One tab (default: [Debates]).
  - First 3–4 debates/series (enough to fill screen).

- **Hidden:**
  - Full debate history (scroll or tap "View All").
  - Detailed stat breakdowns (tap stat card).
  - Org workspace (separate screen).

---

### SCREEN: Room Detail (Pre-Join)
**Secondary screen, accessed from Discover or Ladder**

#### a) Purpose
- Provide full context about debate before user commits.
- Reduce anxiety by showing participants, format, and rules upfront.
- Clearly surface monetization (e.g., "This is a ticketed debate; $5 entry fee").

#### b) Layout Structure

```
┌─────────────────────────────┐
│ Header (Sticky)             │
│ [Back] "Politics Debate"    │  ← Back button + title
│ [Share ⋯]                   │
├─────────────────────────────┤
│ Event Title (Large)         │
│ "Free Speech vs Censorship" │
│ Hosted by: [Avatar] Name    │  ← Host avatar + name
├─────────────────────────────┤
│ Event Details Card          │
│ Format: 2v2 1v1             │  ← Or "1v1 ranked ladder match"
│ Topic: Politics             │
│ Privacy: Public (live-streamed)
│ Participants: 2/4           │  ← Show filled slots
│ Audience: 47 watching       │
│ Starts in: 12 minutes       │  ← Countdown or absolute time
├─────────────────────────────┤
│ Participants Preview        │
│ ┌─────────────────────────┐ │
│ │ [Avatar] Alice (Gold II)│ │  ← PRO side
│ │ [Avatar] Bob (Gold III) │ │
│ │ vs.                     │ │
│ │ [Avatar] Carol (Silver I)│ │ ← CON side
│ │ [?] Open slot           │ │
│ └─────────────────────────┘ │
├─────────────────────────────┤
│ Rulebook / Format Details   │
│ Round 1 (Opening): 3 min    │  ← Expandable section
│ Round 2 (Rebuttal): 2 min   │
│ [More details...]           │
├─────────────────────────────┤
│ Source Links / Resources    │  ← If host provided context
│ "Debate background: ..."    │
├─────────────────────────────┤
│ CTAs (Bottom, sticky)       │
│ [Join as Participant]       │  ← Primary button (if slot available)
│ [Watch as Audience]         │  ← Secondary button (always available)
│ [Golden Mic Q&A]            │  ← If applicable
└─────────────────────────────┘
```

#### c) UI Components Used

**Event Header:**
- Title, host info, share icon.
- Back button to return to Discover.

**Details Card:**
- Structured information: format, topic, participants, audience count, start time.
- Tap any field to drill into details (e.g., [Privacy: Public] → shows stream info).

**Participants Preview:**
- Avatars + names + current rating.
- Show "vs." separator between teams if applicable.
- Open slots shown as [?] placeholder or "+ 1 Open".
- Tap participant → view profile.

**Rulebook Section:**
- Expandable / collapsible.
- Show round names + durations.
- Tap to expand → full rulebook with additional details (time stop rules, mic behavior, etc.).

**CTAs:**
- [Join as Participant]: Only enabled if slots available and user is logged in.
- [Watch as Audience]: Always enabled.
- [Golden Mic Q&A]: If debate supports paid queue-jump and user hasn't already paid.

#### d) Micro-Interactions

- **Tap [Join as Participant]:**
  - If user is already in debate (as different role), show modal: "You're already watching this debate as audience. Switch to participant?" + [Switch] / [Keep Watching].
  - If available: add user to participant list, countdown to debate start, push to Live Arena.

- **Tap [Watch as Audience]:**
  - If debate is live now → push directly to Live Arena (spectator view).
  - If debate starts in future → add to calendar + show "Debate starts in X minutes" notification.

- **Countdown timer:**
  - If <5 minutes to start, highlight with colored badge and pulsing animation.

---

### SCREEN: Replay / Highlights
**Secondary screen, post-debate consumption**

#### a) Purpose
- Provide rich, interactive replay with layers (video, sentiment graph, transcript, sources).
- Enable clip creation and sharing.
- Show detailed analytics for debaters (if Pro subscribed).

#### b) Layout Structure

```
┌─────────────────────────────┐
│ Video Player (Full-width)   │
│ ┌─────────────────────────┐ │
│ │ [Video with controls]   │ │  ← Play/pause, volume, fullscreen
│ │ [█████░░░░░░░░░░░░░░]  │ │  ← Progress bar
│ │ Time: 5:42 / 14:23      │ │
│ └─────────────────────────┘ │
├─────────────────────────────┤
│ Interactive Overlay (below video):
│ Sentiment Worm (live during playback)
│ ← Pro | [████████░░] | Con →
│ 62% | Sentiment Over Time  | 38%
│ [Tap to scrub timeline]
├─────────────────────────────┤
│ Tabs (Segmented Control)    │
│ [Overview] [Transcript]     │  ← Swipeable tabs
│ [Stats] [Clips] [Sources]   │
├─────────────────────────────┤
│ TAB CONTENT:                │
│ If [Overview]:              │
│ ┌─────────────────────────┐ │
│ │ Debate Summary          │ │
│ │ Winner: Alice (Pro)     │ │  ← If judged
│ │ Sentiment: 62% agreed   │ │
│ │ Audience: 234 watched   │ │
│ │ Key Moments:            │ │
│ │ [📍 0:45] Turning point │ │  ← Tap to jump to moment
│ │ [📍 8:20] Fact check    │ │
│ │ [📍 12:30] Closing      │ │
│ └─────────────────────────┘ │
│                             │
│ If [Transcript]:            │
│ ┌─────────────────────────┐ │
│ │ [0:00] Alice: "First... │ │  ← Searchable, tappable
│ │ argument is..."         │ │
│ │ [1:20] Bob: "I disagree │ │
│ │ because..."             │ │
│ │ [Search transcript]     │ │
│ └─────────────────────────┘ │
│                             │
│ If [Stats]:                 │
│ ┌─────────────────────────┐ │
│ │ Time Spoken:            │ │  ← If Pro tier
│ │ Alice: 6:40 | Bob: 6:12 │ │
│ │ Interruptions:          │ │
│ │ Alice: 3 | Bob: 5       │ │
│ │ Unique Words:           │ │
│ │ Alice: 187 | Bob: 201   │ │
│ │ Fallacies Flagged: 2    │ │
│ └─────────────────────────┘ │
│                             │
│ If [Clips]:                 │
│ ┌─────────────────────────┐ │
│ │ Auto-suggested Clips    │ │
│ │ [Clip 1: "Mic drop"] 30s │ │
│ │ [Export] [Share]        │ │
│ │ [Clip 2: "Quote"] 45s   │ │
│ │ [Export] [Share]        │ │
│ └─────────────────────────┘ │
│                             │
│ If [Sources]:               │
│ ┌─────────────────────────┐ │
│ │ Sources Cited:          │ │
│ │ [📰] "Article title..." │ │  ← Tap to open
│ │ [📊] "Report PDF..."    │ │
│ │ [🔗] "Link..."          │ │
│ └─────────────────────────┘ │
│                             │
├─────────────────────────────┤
│ Social Share (Footer)       │
│ [Share Replay] [Share Clip] │
│ [Report]                    │
└─────────────────────────────┘
```

#### c) UI Components Used

**Video Player:**
- Standard controls: play/pause, volume, fullscreen, progress bar.
- Progress bar shows sentiment coloring (left side = pro color, right side = con color).

**Sentiment Worm:**
- Animated line chart showing Pro vs Con sentiment over time.
- Tappable to scrub; dragging the worm scrubs the video.
- Percentage labels update as video plays.

**Tabs (Overview | Transcript | Stats | Clips | Sources):**
- Horizontal scroll or segmented control (5 tabs may need to scroll).
- Tap to switch content.

**Key Moments (in Overview tab):**
- Vertically stacked list of "marked moments" with timestamp + description.
- Tap any moment → video scrubs to that timestamp.

**Transcript:**
- Chronological list of speaker quotes with timestamps.
- Tap any line → video scrubs to that point.
- Search field at bottom to find specific words or phrases.

**Stats (if Pro tier unlocked):**
- Table-style metrics comparing participants.
- More detailed than post-debate screen (e.g., "Fallacies detected" becomes a modal with explanations).

**Clips:**
- Grid or list of suggested 30–60s clips.
- Each clip shows: preview thumbnail, duration, suggested title.
- [Export] → download as MP4 or GIF.
- [Share] → opens social share sheet (TikTok, Instagram, X, etc.).

**Sources:**
- List of URLs, PDFs, or citations mentioned.
- Tap to open external link (confirm dialog shown first).

#### d) Micro-Interactions

- **Play video:**
  - Sentiment worm animates in sync with playback.
  
- **Sentiment worm tap:**
  - Video scrubs to that timestamp; smooth seek animation.

- **Tab swipe:**
  - Tap or swipe to navigate tabs; content fades in (100ms).

- **Clip export:**
  - Show progress indicator if processing.
  - After completion: snackbar "Clip exported" + [Share] button.

- **Transcript search:**
  - Type keyword → matches highlighted in yellow.
  - Tap match → video scrubs to that line.

---

## 5. Forms & Input UX

### Form Structure Principles

**Single-step forms (preferred):**
- Reduce cognitive friction; users prefer one "complete" action vs multi-step wizards.
- Use for: login, event join, payment.

**Multi-step forms (when unavoidable):**
- Group related fields per step (e.g., Step 1: Event title & topic; Step 2: Participants).
- Show progress indicator (step 2 of 4).
- Allow back navigation; save form state locally (so user doesn't lose input).

### Validation Timing

- **On blur (after user leaves field):**
  - Email: valid format.
  - Phone: valid length/format for region.
  - Password: length + complexity (if required).
  
- **Real-time (as user types):**
  - Username availability (with debounce 300ms; show "Checking..." placeholder).
  - Input length (e.g., "Max 140 chars" counter).
  
- **On submit:**
  - All fields validated; first error field focused + error message shown.
  - Submission disabled until all required fields valid.

### Error Messaging

**Good error messages:**
- Specific: "Email format invalid. Did you mean bob@gmail.com?"
- Actionable: "Password too weak. Use at least 8 characters, 1 uppercase, 1 number."
- Kind: Avoid "Invalid input"; use "That's not quite right. Try again."

**Placement:** Inline, below field (red text, small font size).

**Network errors:** "Connection failed. Check your internet and try again." + [Retry] button.

### Disabled vs Loading States

| State | Appearance | Behavior |
|-------|------------|----------|
| **Disabled** | Button greyed out, no opacity animation | Not tappable; show tooltip on long-press why disabled |
| **Loading** | Button filled, spinner inside text area | Not tappable; spinner indicates in-flight operation |
| **Error** | Button red or highlighted, error icon | Tappable for retry; error message inline |

### Keyboard Behavior

- **Email input:** Numeric keypad + "@" symbol visible.
- **Password input:** Alphanumeric, default to hidden text with toggle (eye icon).
- **Phone input:** Numeric keypad + "+" symbol (for international).
- **Auto-dismiss keyboard:** After form submission or field exit (don't leave keyboard open).

### Example: Event Creation Form (Multi-step)

**Step 1: Event Basics**
```
Title: [_____________________]  ← Single-line text input
Topic: [Dropdown ▼]            ← Tap to open modal with topic list
       (Politics, Tech, Philosophy, etc.)
Format: [2v2 ▼]                ← 1v1, 2v2, Panel, Hot Seat
Privacy: [Public ▼]            ← Public, Unlisted, Private
[Back] [Next]                  ← Navigation buttons
```

**Step 2: Rulebook**
```
Round 1 (Opening):    [3] min   ← Spinner to adjust
Round 2 (Rebuttal):   [2] min   
Round 3 (Crossfire):  [5] min   
Round 4 (Closing):    [2] min   
[Use Preset] → [Standard Format]  ← CTA to save as template
[Back] [Next]
```

**Step 3: Participants & Invite**
```
Invite speakers:
[Add Participant] button → opens searchable user list modal
Selected:
[Avatar] Alice
[Avatar] Bob
[X] to remove

[Back] [Create Debate]
```

On submit: 
- Loading state + spinner.
- If success: push to Room Detail (pre-join) with success toast "Debate created! Sharing to followers..."
- If error: show error message + [Retry] button.

---

## 6. Modals, Sheets & Overlays

### When to Use Each

| Type | Use Case | Behavior |
|------|----------|----------|
| **Bottom Sheet** | Non-critical workflows, topic filters, topic selection | Slides up from bottom; swipe down to dismiss; tap outside to dismiss |
| **Full-screen Modal** | Complex forms (event creation), settings, payment | Covers entire screen; [Back] / [X] to dismiss; can't dismiss by tapping outside |
| **Toast** | Confirmation (payment success), transient info | Small message at top or bottom; auto-disappears after 3s; can tap to dismiss early |
| **Snackbar** | Error + retry action, undo action | Small bar at bottom with [Retry] or [Undo] button; auto-disappears or persistent until dismissed |
| **Alert Modal** | Critical confirmation ("Delete debate?", payment confirmation) | Large modal with [Cancel] and [Confirm] buttons; dark overlay on background |

### Dismiss Rules

- **Bottom sheets:** Swipe down, tap outside, tap [X].
- **Full-screen modals:** [Back] button, [X] button, or explicit [Cancel] CTA.
- **Toasts:** Auto-dismiss after 3s or tap to dismiss immediately.
- **Snackbars:** Auto-dismiss after 5s or tap [X].
- **Alert modals:** Only via [Cancel] or [Confirm] buttons (no outside tap dismiss).

### Accessibility Considerations

- **Modal focus:** Focus trap enabled (keyboard navigation cycles within modal only).
- **Dismissible:** Always provide a clear dismiss path (not just swipe gesture).
- **Screen reader:** Modal announced as "alert" or "dialog" depending on urgency.
- **Keyboard:** [Escape] key dismisses (where applicable).

---

## 7. Visual Design System

### Theme Strategy

**Light Mode (Default):**
- Background: Off-white (#F8F8F6 or system color).
- Text: Near-black (#1A1A1A).
- Accent: Primary brand color (teal/blue-green).

**Dark Mode (System/Manual Toggle):**
- Background: Deep charcoal (#1F2121).
- Text: Off-white (#F5F5F5).
- Accent: Brighter variant of primary color (higher saturation, higher value).

**When system theme overrides apply:**
- User selects "System" in settings → app respects device theme preference.
- User selects "Light" or "Dark" explicitly → override system preference.
- All screens inherit theme globally (no per-screen theme changes).

### Contrast Rules

- **WCAG 2.1 AA minimum:**
  - Normal text (14px): 4.5:1 contrast ratio.
  - Large text (18px+): 3:1 contrast ratio.
  - **Never use:** text on light background with <4.5:1, disabled text on background with <3:1.

- **Interactive elements (buttons, links):**
  - Minimum touch target: 48px × 48px (iOS human interface guidelines).
  - Minimum spacing between targets: 8px.

- **Icon + text:** Icons should not be the sole indicator of function; pair with text label or tooltip.

### Typography

**Font Family:**
- Humanist sans-serif (friendly, approachable for debate platform).
- Recommendation: **Inter**, **Geist**, or **FK Grotesk Neue** (if custom).
- Mono font for code/transcript: **IBM Plex Mono** or **JetBrains Mono**.

**Font Scale (iOS/Android standard):**
- **H1 (Hero):** 32px, weight 600 (bold), line-height 1.2
  - Use: Page titles, event names, large stats.
- **H2 (Heading):** 24px, weight 600, line-height 1.25
  - Use: Section headers, moderator labels in live.
- **H3 (Subheading):** 18px, weight 600, line-height 1.35
  - Use: Tab titles, card titles.
- **Body (Large):** 16px, weight 400, line-height 1.5
  - Use: Primary body text, form inputs, CTAs.
- **Body (Normal):** 14px, weight 400, line-height 1.5
  - Use: Secondary text, descriptions, fine print.
- **Caption:** 12px, weight 400, line-height 1.4
  - Use: Timestamps, metadata, hints.
- **Overline:** 11px, weight 500 (medium), line-height 1.3, uppercase
  - Use: Labels, section labels (e.g., "RECENT DEBATES").

**Why this scale:**
- Hierarchy is clear without too many sizes (avoids visual chaos).
- Large body (16px) ensures readability on mobile.
- Mono font reserved for technical content (transcripts, timestamps).
- Line height >1.4 ensures readable spacing on small screens.

### Color System

**Primary Color (Accent):**
- Light mode: Teal / Blue-green (#208D9E or similar).
- Dark mode: Brighter teal (#32B8C6 or similar).
- Use for: Buttons (primary action), links, highlights, active states.

**Secondary Color (Muted):**
- Light mode: Pale gray (#E8E8E6).
- Dark mode: Dark gray (#2A2A2A).
- Use for: Disabled states, borders, subtle backgrounds.

**Semantic Colors:**
- **Success (Green):** #22C55E (light) / #10B981 (dark).
- **Warning (Orange):** #F59E0B (light) / #D97706 (dark).
- **Error (Red):** #EF4444 (light) / #DC2626 (dark).
- **Info (Blue):** #3B82F6 (light) / #1D3557 (dark).

**Avoided Colors & Why:**
- ❌ Pure black (#000000): Too harsh; use near-black (#1A1A1A) instead.
- ❌ Pure white (#FFFFFF): Too harsh; use off-white (#F8F8F6) instead.
- ❌ Saturated reds/greens used for non-semantic purposes (confuses meaning).
- ❌ Multiple accent colors competing for attention.

**Sentiment Colors (for debate platform):**
- **Pro / Agree:** Green tint (#22C55E).
- **Con / Disagree:** Red tint (#EF4444).
- **Neutral:** Gray (#9CA3AF).
- Used in sentiment slider, worm graph, voting indicators.

---

## 8. Motion & Animation System

### Transition Types

| Type | Duration | Easing | Use Case |
|------|----------|--------|----------|
| **Screen Push** | 300ms | ease-out-cubic | Navigating forward (tab → detail screen) |
| **Screen Pop** | 250ms | ease-in-cubic | Navigating back (detail → list) |
| **Fade** | 200ms | ease-in-out | Content swap (tab change), state updates |
| **Scale (subtle)** | 150ms | ease-out | Button tap feedback, card entrance |
| **Slide Up (bottom sheet)** | 250ms | ease-out-cubic | Sheet/modal appearance |
| **Slide Down (bottom sheet)** | 200ms | ease-in-cubic | Sheet/modal dismissal |

### Easing Philosophy

- **ease-out-cubic:** Starts fast, slows near end (natural deceleration, feels responsive).
- **ease-in-cubic:** Starts slow, accelerates (objects "falling away" feel natural).
- **ease-in-out:** Smooth throughout (for content swaps, feels deliberate).
- **Avoid:** linear (feels robotic), bounce (too playful for serious platform).

### Where Animation MUST be Avoided

- ❌ During user input (don't animate while user types).
- ❌ Disabled or loading buttons (animation could distract from inability to interact).
- ❌ Rapid sequences (more than 3 animations in 1 second = cognitive overload).
- ❌ In live debate (every animation adds latency; keep real-time UX minimal).

### Micro-animation Examples

**Button tap:**
```
1. User taps [Join Debate]
2. Scale down 0.95x (50ms, ease-out)
3. Scale back to 1x (100ms, ease-out) + color fill animation
4. Button shows "Joining..." with spinner
5. After success: fade in checkmark, color shifts to green
```

**Sentiment slider drag:**
```
1. User drags slider thumb
2. Real-time tracking (no animation, just position update)
3. On release: thumb snaps to nearest position (100ms spring easing)
4. Worm graph animates to reflect new sentiment (300ms ease-out)
```

**Tab switch:**
```
1. User taps [Transcript] tab
2. Tab chip animates underline color (150ms)
3. Old content fades out (100ms)
4. New content fades in (150ms, slight delay 50ms after out)
5. Total perceived time: ~300ms, feels snappy
```

---

## 9. Accessibility & Usability

### Touch Target Sizes

**Minimum:** 48px × 48px (iOS HIG standard, also suits Android).
- Buttons, links, tappable cards all meet this.
- Grouped buttons (e.g., [Back] [Cancel] [OK]): 8px minimum spacing.

**Safe areas (notches, dynamic island):**
- Padding: 16px top (status bar), 8–16px bottom (home indicator).
- No critical content in safe areas; icons/buttons recessed.

### Font Scaling & Accessibility

- **Dynamic type support (iOS):**
  - Sizes scale with system accessibility setting (xSmall → xxxLarge).
  - Base scale: 14px–18px body; adjust –2 / +4 points per level.

- **Android scaling:**
  - System font scaling (small → large) adjusts all text proportionally.
  - Test at 200% scaling to ensure no overflow.

### One-Hand Usage

- **Bottom tab navigation:** Positioned at bottom so thumb can reach while holding phone.
- **Bottom sheets:** Content at bottom; dismiss at bottom (common gesture).
- **Primary CTAs:** Bottom-aligned or bottom half of screen when possible.
- **Text input fields:** Top half of screen preferred (keyboard pops up from bottom; input visible).

### Cognitive Load Reduction Techniques

- **Progressive disclosure:** Hide advanced options behind tap; show defaults only.
- **Clear hierarchy:** One primary CTA per screen (color, size, positioning).
- **Descriptive microcopy:** Avoid jargon; use plain language.
- **Confirmation for destructive actions:** "Delete this debate?" with [Cancel] / [Delete] options.
- **Undo support:** "Debate created" + [Undo] snackbar (if feasible).
- **Consistent patterns:** Same navigation, buttons, and state indicators across all screens.

### Color Blind & Contrast

- Never use color alone to convey meaning (e.g., red text = error; pair with 🚫 icon).
- Use patterns / icons in addition to colors (e.g., sentiment graph uses Pro = green + "↑", Con = red + "↓").
- Test with Sim Daltonism or similar tool; verify 4.5:1 contrast in both light and dark modes.

### Screen Reader Support

- All buttons, images, and interactive elements have descriptive labels (not icon-only).
- Form labels associated with inputs (not floating placeholders).
- Modals announced as dialogs; focus trapped within.
- Semantic HTML / roles used (button, link, heading) vs generic divs.

---

## 10. Edge States & System UX

### Empty States

**First-time user with no debates:**
```
[Empty cup icon]
"No debates yet"
"Join an upcoming debate or create your own to get started."
[Explore Debates] [Create Debate] buttons
```

**No search results:**
```
[Magnifying glass icon]
"No debates found"
"Try different keywords or topic filters."
[Clear filters] [Suggest topic]
```

**No matches available:**
```
[Hourglass icon]
"No opponents available right now"
"Check back in a few minutes or try a different topic."
[Notify me] [Change topic]
```

### First-Time States

**First login onboarding:**
- Show carousel (3–5 slides) explaining platform.
- Skip button available after slide 1 (reduces friction for returning users).
- Dismiss onboarding → land on Discover tab with "Recommended for new users" section highlighted.

**First debate anxiety reduction:**
- Show simplified spectator UI (no advanced controls).
- Provide in-room help: "Tip: Tap [Raise Hand] to queue for questions."
- Post-debate: emphasize "You did it! Check your stats."

### Loading Skeletons

**Debate list loading:**
```
[Skeleton card 1]  ← Gray placeholder, pulsing animation
[Skeleton card 2]  
[Skeleton card 3]
```
- Show 3–4 skeleton cards while real data loads.
- Fade in real cards as they arrive (one by one or batch).
- Duration: typically 1–3 seconds (if >5s, show spinner + "Loading..." message).

**Video player loading:**
- Show video thumbnail (if available) + [Play] button overlay.
- Tap play → loading spinner inside button.
- If network slow (>3s load): show "Loading video..." message + [Cancel] option.

### Offline States

**User offline (no network):**
- Toast: "You're offline. Some features may be limited."
- Disable real-time features (Raise Hand, live sentiment).
- Allow replay viewing if cached locally.
- CTAs disabled: [Join Debate], [Create], [Upload].

**Partial offline (slow network):**
- Show "Reconnecting..." banner at top; periodic retry.
- Allow time-insensitive actions (browse, read).
- Disable real-time features.

### Error States

**Network error during live debate:**
```
[Exclamation icon]
"Connection lost"
"Attempting to reconnect..."
[Retry] button (shown after 5s of continuous failure)
```
- Auto-retry every 2s for 10s, then show manual [Retry].
- After 30s continuous failure: show "Connection failed. Leave room?" + [Leave] button.

**Payment declined:**
```
[X icon]
"Payment failed"
"Your card was declined. Try again or use a different payment method."
[Retry] [Change payment]
```

**Server error during debate:**
```
[Warning icon]
"Something went wrong"
"The debate room encountered an error. Try refreshing or joining again."
[Refresh] [Leave] buttons
```

### Permission Denial Flows

**Microphone denied (iOS/Android):**
```
[Microphone icon]
"Microphone access required"
"To participate in debates, we need permission to access your microphone."
[Open Settings] [Cancel]
```
- Tap [Open Settings] → system settings for app permissions.
- Return to app → auto-retry permission.

**Camera denied (if video debates added later):**
```
[Camera icon]
"Camera access required"
"To use video, enable camera access in Settings."
[Open Settings] [Use audio only]
```
- [Use audio only] falls back to audio-only participation.

---

## 11. Platform-Specific Adaptations

### iOS vs Android Differences

| Aspect | iOS (HIG) | Android (Material) | Adaptation |
|--------|-----------|-------------------|------------|
| **Back gesture** | Swipe from left edge | System back button (top-left or hardware) | Both supported; ensure both work smoothly |
| **Bottom navigation** | Tab bar (typically fixed) | Bottom navigation bar | Both fixed at bottom; same function |
| **Modals** | Full-screen sheet (iOS 14+) or modal | Bottom sheet (Material Design) | Use native API for each platform |
| **Safe areas** | Notch, Dynamic Island | Status bar, navigation bar | Respect both; padding adjustments per platform |
| **Status bar** | Light/dark mode inherited | Light/dark mode inherited | Support both; use system colors |
| **Dialogs** | UIAlertController | Material AlertDialog | Native component per platform |
| **Input keyboard** | iOS keyboard with auto-correct | Android keyboard (depends on IME) | Design forms to work with both |

### Gesture Navigation vs Button Navigation

**iOS (gesture-first):**
- Swipe left edge → back.
- Swipe bottom edge (on mini) → app switcher.
- 3D touch or long-press → context menu.
- Always provide explicit [Back] button as fallback (esp. in modals).

**Android (button-first):**
- System back button (top-left or hardware) → back.
- Long-press (haptic feedback) → context menu.
- Explicit back buttons useful but not required (system back covers).

**Adaptation:**
- Implement both gestures and buttons; don't rely on gesture alone.
- Provide haptic feedback on long-press (both platforms).
- Test navigation thoroughly on each OS.

### Status Bar & Safe Areas

**iOS:**
- Safe area: top (status bar + notch/Dynamic Island), bottom (home indicator).
- Ensure buttons not obscured; use 16px padding.
- Light status bar (white text) on dark background, dark status bar on light background.

**Android:**
- Safe area: top (status bar), bottom (navigation bar).
- Status bar height typically 24–25px (varies by device).
- Navigation bar height 48px (can be hidden on some devices).
- Same padding rule: 16px top, 16px bottom.

**Adaptation:**
- Request safe area insets from OS.
- Apply padding dynamically based on reported insets.
- Test on notched, full-screen, and standard devices.

---

## 12. Final UX Verdict

### Strengths of This UI System

1. **Clear Information Hierarchy**
   - Bottom tab navigation reduces cognitive load; each tab has distinct purpose.
   - Live Arena prioritizes speaker + timer; secondary elements in sheets/modals.
   - Ranking/progression (Ladder tab) is prominent, driving long-term engagement.

2. **Defensible Differentiation**
   - Sentiment slider + worm graph in replays are unique; not replicated by generic social audio.
   - Structured rulebooks and pre-join room details reduce friction vs Spaces/Clubhouse.
   - Stats dashboard (post-debate) gives immediate feedback, reinforcing "game" positioning.

3. **Low-Friction Onboarding**
   - Progressive onboarding (carousel) doesn't force setup before first interaction.
   - Room Detail (pre-join) surfaces all context, reducing join anxiety.
   - First-time debater gets simplified spectator UX, then graduates to full controls.

4. **Mobile-first, Accessible**
   - 48px touch targets, WCAG AA contrast, semantic HTML/roles.
   - Bottom tabs and bottom sheets favor thumb-friendly one-hand usage.
   - Dark mode + font scaling built-in; not afterthought.

5. **Monetization Surfaced Naturally**
   - Golden Mic queue-jump appears in-context during live debate (not forced popup).
   - Premium Analytics tier integrated into profile + post-debate screens.
   - Ticketed events shown on Room Detail (transparency, not hidden upsell).

---

### UX Risks

1. **Live Audio Complexity**
   - Real-time sentiment slider + speaker changes + interruption queue all happen simultaneously.
   - Risk: UI feels cluttered or input lag makes it feel unresponsive.
   - Mitigation: Start with audio-only MVP; test latency ruthlessly; remove non-essential overlays during debates.

2. **Gamification Backlash**
   - Elo rating + division system can breed toxicity or elitism.
   - Risk: Users feel excluded if they're not in top tiers; casual users churn.
   - Mitigation: Non-competitive "practice" ladder separate from ranked; emphasize learning over winning in copy.

3. **Moderation at Scale**
   - Penalty Box, bans, and appeals system not fully designed here.
   - Risk: Harassment or inappropriate content slips through; platform reputation damaged.
   - Mitigation: Implement robust T&S framework early (see Section 9, Compliance & Risks in prior doc); don't defer moderation.

4. **Video/Audio Quality**
   - If network is poor, real-time experience degrades sharply.
   - Risk: Users on 3G or high-latency networks have bad first impression.
   - Mitigation: Implement network quality detection; graceful fallback to audio-only; test on throttled connections.

5. **Cold-start Problem**
   - Empty Ladder (no matches available) or empty Discover (no debates scheduled) kills onboarding.
   - Risk: First-time user lands on empty state and bounces.
   - Mitigation: Seed platform with "practice debates" hosted by team; guarantee beginner ladder has events at specific times.

---

### 3 Changes That Would Most Improve Usability

1. **Add "Playback Speed" Control to Replay**
   - Current: Users watch full replay in real-time (14+ minutes typical).
   - Improvement: [×0.75], [×1], [×1.5], [×2] buttons on video player.
   - Why: Lets power users review debates faster; accommodates ADHD/low-attention viewers; widely expected on video platforms.
   - Effort: Low (standard video player feature).

2. **Surface "Debate Suggestions" Based on User History**
   - Current: Discover feed is generic; user has to manually search/filter.
   - Improvement: "Recommended for you" section using past debate topics, topics user follows, and Ladder ratings to suggest nearby opponents.
   - Why: Reduces friction to "next action"; exploits network effects (users get matched faster); key retention driver.
   - Effort: Medium (requires rec algorithm + data pipeline).

3. **Explicit "Practice Mode" with AI Opponent**
   - Current: Beginners must find and join real debates; anxiety-inducing.
   - Improvement: "Practice 1v1 vs. Bot" button in Ladder allows practice against AI-controlled opponent before ladder play.
   - Why: Onboarding improvement; reduces user churn from first-debate anxiety; teaches mechanics.
   - Effort: Medium-high (requires AI opponent logic, but can be rule-based initially).

---

### Summary

This UI/UX system is **production-ready** for an MVP launch targeting competitive students, creators, and educators. It prioritizes clarity over novelty, accessibility over trends, and mobile-first experience.

**Key design decisions:**
- Bottom tabs (vs drawer) keep scope visible and navigation predictable.
- Ladder tab (vs generic profile) reinforces the "sport" positioning.
- Sentiment slider + worm graph (vs flat chat) differentiate from social audio competitors.
- Progressive onboarding + Room Detail context reduce first-debate anxiety.
- Monetization (Golden Mic, Premium Analytics, Ticketed events) surfaces naturally, not aggressively.

**Critical next steps:**
1. Wireframe Live Arena in high fidelity; test audio latency + sentiment slider responsiveness.
2. Build and test cold-start mitigations (practice debates, AI opponent, scheduled beginner ladder).
3. Design robust moderation console (separate from user UX) to handle T&S at scale.
4. Conduct accessibility audit (WCAG 2.1 AA minimum) before code freeze.
5. A/B test onboarding variants (carousel vs guided tour vs minimal) with real users.

