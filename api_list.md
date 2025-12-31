Kora Backend API Documentation
================================

Overview
--------
Base URL: http://localhost:5000/api/v1
Authentication: Bearer Token (JWT) required for protected routes.
Response Format:
{
  "success": true/false,
  "message": "Status message",
  "data": { ... } // Or null on error
}

---

1. Authentication
-----------------
Base Path: /auth

POST /auth/register
- Description: Register a new user.
- Auth: Public
- Payload: { "email": "User email", "password": "User password", "handle": "User handle", "firstName": "First Name", "lastName": "Last Name" }
- Response: User object + Tokens (access, refresh)

POST /auth/login
- Description: Login with email/handle and password.
- Auth: Public
- Payload: { "email" OR "handle": "Identifier", "password": "User password", "skipPasswordCheck": boolean (optional, for dev/magic link flow) }
- Response: User object + Tokens

POST /auth/magic-link
- Description: Request a magic link for passwordless login.
- Auth: Public
- Payload: { "email": "User email" }

POST /auth/verify-otp
- Description: Verify OTP for 2FA or passwordless entry.
- Auth: Public
- Payload: { "email": "User email", "otp": "123456" }

GET /auth/check-handle
- Description: Check if a handle is available.
- Auth: Public
- Params: ?handle=desired_handle
- Response: { "available": true/false }

POST /auth/refresh
- Description: Refresh access token.
- Auth: Refresh Token in Body
- Payload: { "refreshToken": "..." }

POST /auth/logout
- Description: Logout (blacklist current refresh token).
- Auth: Required

GET /auth/me
- Description: Get current user's private profile.
- Auth: Required
- Response: Full User object

PUT /auth/profile
- Description: Update current user's profile.
- Auth: Required
- Payload: { "firstName", "lastName", "avatar_url", "bio" }

PUT /auth/change-password
- Description: Change password.
- Auth: Required
- Payload: { "currentPassword", "newPassword" }

POST /auth/forgot-password, POST /auth/reset-password, POST /auth/verify-email, POST /auth/resend-verification
- Description: Standard account recovery and verification flows.

---

2. Users
--------
Base Path: /users

GET /users/me
- Description: Get my profile (Same as /auth/me).
- Auth: Required

PUT /users/me
- Description: Update my profile.
- Auth: Required

PUT /users/onboarding
- Description: Complete user onboarding (select topics, etc.).
- Auth: Required
- Payload: { "topics": ["topic_id1", ...], "bio": "..." }

GET /users/leaderboard
- Description: Get global leaderboard (Top 50 by ELO).
- Auth: Required

GET /users/:id
- Description: Get public profile of a user.
- Auth: Required

GET /users/:id/stats
- Description: Get statistics for a specific user.
- Auth: Required
- Response: { "total_debates", "wins", "losses", "elo", "win_rate" }

GET /users/stats/overview, /users/stats/by-role, /users/stats/by-date
- Description: Aggregate stats for admin/analytics.
- Auth: Required (Admin likely)

GET /users/search
- Description: Search users.
- Auth: Required
- Params: ?q=query

---

3. Debate & War Ground
----------------------
Base Path: /debate

POST /debate/create
- Description: Create a new debate.
- Auth: Required
- Payload: { "topicId", "categoryId", "type", "ruleSet", "scheduledAt" (optional) }

PUT /debate/:id/rules
- Description: Update rules for a lobby.
- Auth: Required (Host only)
- Payload: JSON object with rule overrides.

POST /debate/:id/schedule
- Description: Schedule or reschedule a debate.
- Auth: Required (Host only)
- Payload: { "scheduledAt": "ISO Date" }

POST /debate/:id/start
- Description: Start a debate (Move to LIVE state).
- Auth: Required (Host only)

POST /debate/:id/cancel, POST /debate/:id/pause
- Description: Cancel or Pause a debate.
- Auth: Required (Host only)

POST /debate/:id/join-team
- Description: Join a team in the lobby.
- Auth: Required
- Payload: { "teamId" } or implicit if logical side assignment.

POST /debate/:id/request-join
- Description: Request to join a team (if closed/invite-only).
- Auth: Required

POST /debate/:id/invite-leader
- Description: Invite a team leader.
- Auth: Required
- Payload: { "userId" }

POST /debate/:id/kick-member
- Description: Kick a participant.
- Auth: Required (Host)
- Payload: { "userId" }

POST /debate/:id/toggle-ready
- Description: Toggle team readiness.
- Auth: Required (Team Captain)

GET /debate/:id/participants
- Description: Get list of participants.
- Auth: Required

GET /debate/:id/summary
- Description: Get debate summary (post-game).
- Auth: Required

POST /debate/:id/ai-analyze
- Description: Trigger AI analysis of the debate.
- Auth: Required

-- Live War Ground --

GET /debate/:id/state
- Description: Get current live state (mic, timer, speaker).
- Auth: Required

POST /debate/:id/mic/request
- Description: Request to speak.
- Auth: Required

POST /debate/:id/mic/grant
- Description: Grant mic to a user.
- Auth: Required (Host/Moderator)
- Payload: { "userId" }

POST /debate/:id/mic/yield
- Description: Yield the mic (stop speaking).
- Auth: Required (Current Speaker)

POST /debate/:id/mic/mute-all
- Description: Mute all participants.
- Auth: Required (Host)

POST /debate/:id/vote
- Description: Submit sentiment vote (Slider).
- Auth: Required
- Payload: { "value": 0-100 } OR { "side": "A"/"B" }

POST /debate/:id/react
- Description: Send an emoji reaction.
- Auth: Required
- Payload: { "emoji": "🔥" }

POST /debate/:id/evidence/upload
- Description: Upload evidence file.
- Auth: Required
- Payload: Multipart Form Data

POST /debate/:id/evidence/present
- Description: Present uploaded evidence to everyone.
- Auth: Required
- Payload: { "evidence_id" }

POST /debate/:id/flag
- Description: Flag content/user behavior.
- Auth: Required
- Payload: { "reason" }

---

4. Home & Dashboard
-------------------
Base Path: /home

GET /home/priority-stack
- Description: Get user's actionable items (invites, turns, etc.).
- Auth: Required

GET /home/timeline
- Description: Get upcoming scheduled debates.
- Auth: Required

GET /home/feed
- Description: Get main content feed.
- Auth: Required

---

5. Social
---------
Base Path: /social

POST /social/user/:id/challenge
- Description: Challenge a user to a debate.
- Auth: Required
- Payload: { "topicId", "wager" }

POST /social/challenge/:id/accept
- Description: Accept a challenge (Creates Debate).
- Auth: Required

POST /social/challenge/:id/decline
- Description: Decline a challenge.
- Auth: Required

GET /social/explore/gauntlet
- Description: Get 'The Gauntlet' (Live high-stakes debates).
- Auth: Required

GET /social/explore/search
- Description: Global search for users/debates.
- Auth: Required
- Params: ?q=...

POST /social/report
- Description: General content reporting.
- Auth: Required
- Payload: { "targetId", "targetType", "reason" }

---

6. Notifications
----------------
Base Path: /notifications

GET /notifications
- Description: Get user's notifications.
- Auth: Required

POST /notifications/read
- Description: Mark all as read.
- Auth: Required

PUT /notifications/:id/read
- Description: Mark specific notification as read.
- Auth: Required

POST /notifications/:id/respond
- Description: Respond to actionable notification (e.g. invite).
- Auth: Required
- Payload: { "action": "accept"/"decline" }
