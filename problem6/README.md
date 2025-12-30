# SYSTEM OVERVIEW

This document designs a secure, real-time scoreboard system that displays the top 10 user scores, supports live updates, and prevents unauthorized or malicious score manipulation. The focus is on security, execution flow, trust boundaries, and real-time delivery.

The solution assumes a modern web architecture with a browser-based frontend, an application backend, a database, and a real-time delivery mechanism.

---

## CORE REQUIREMENTS RESTATED

1. A website displays a scoreboard showing the top 10 users by score.

2. The scoreboard updates live when scores change.

3. Users perform an action that increases their score.

4. Completing the action triggers an API call to update the score.

5. Malicious users must not be able to increase scores without authorization.

---

## HIGH-LEVEL ARCHITECTURE

## Components

* Browser Client (Frontend)

* Authentication & Identity Provider

* Application Server (API)

* Action Validation Layer

* Score Service

* Database (Persistent Store)

* Real-Time Event Channel (WebSocket or Server-Sent Events)

## Trust boundaries

* The browser is untrusted.

* The network is untrusted.

* Only the application server and database are trusted.

---

## Excecution Flow Diagram

![Diagram](./diagram.svg)

---

## SECURITY PRINCIPLES APPLIED

1. The client never decides score values.

2. Every score change is derived server-side.

3. All actions are authenticated and authorized.

4. All actions are validated for legitimacy.

5. Score updates are idempotent and auditable.

6. Real-time updates are read-only for clients.

---

## IDENTITY AND AUTHENTICATION FLOW

## User Authentication

* User logs in via a secure authentication mechanism (OAuth2, OpenID Connect, or session-based auth).

* Upon successful authentication, the server issues a signed access token (e.g., JWT) or a secure HTTP-only session cookie.

* The token/session represents the user identity and cannot be modified by the client.

## Important properties

* Tokens are signed by the server.

* Tokens contain a user identifier and expiration time.

* Tokens are verified on every API request.

---

## ACTION EXECUTION FLOW (SECURE SCORE UPDATE)

This is the most critical part of the system.

## Step 1: User Performs an Action

* The user performs an in-app action (for example: completing a task, winning a match, finishing a level).

* **The client does NOT calculate the score increase.**

* **The client does NOT send a score value.**

## Instead, the client sends

* Action type (string or enum)

* Action context (minimal data required for validation)

* User authentication token/session

---

## Step 2: API Request to Application Server

* The browser sends a POST request to /actions/complete.

* The request includes authentication credentials.

At this point, the server does NOT trust the request.

---

## Step 3: Authentication Verification

* **The application server validates the token or session.**

* If authentication fails, the request is rejected immediately.

## Outcome

* Server now knows who the user claims to be.

* This identity is trusted only after cryptographic verification.

---

## Step 4: Authorization and Rate Limiting

## Authorization

* **The server verifies that the user is allowed to perform this action.**

* For example: user owns the resource, user has not exceeded limits, user is in correct state.

## Rate limiting

* **The server enforces per-user and per-action rate limits.**

* Prevents replay attacks and brute-force score farming.

---

## Step 5: Action Validation (Anti-Cheat Layer)

This layer prevents fake or replayed actions.

## Key validations

* **Action uniqueness: each action has a unique server-generated action ID or nonce.**

* Temporal validity: action must be completed within a valid time window.

* State validation: the user must be in a valid state to perform the action.

* Replay protection: the same action ID cannot be processed twice.

## The server may

* **Cross-check against server-side state**

* **Verify preconditions stored in the database**

* Validate signatures if actions were pre-issued by the server

---

## Step 6: Server-Side Score Calculation

**This is critical.**

* The server determines the score increment based on the action type.

* **Score rules are 100% configured from the server-side.**

* **The client has zero influence over the numeric value.**

## Example logic (conceptual)

* Action A gives +10 points

* Action B gives +50 points

* Action C gives variable points based on server-validated criteria

---

## Step 7: Atomic Score Update

* The server updates the user's score using a transactional operation.

* The update is atomic to prevent race conditions.

## Database guarantees

* Use transactions or atomic update operators.

* Ensure score increments cannot be duplicated.

## Additionally

* **Store a score ledger entry (user_id, action_id, delta, timestamp).**

* This provides auditability and rollback capability.

---

## Step 8: Persistence and Consistency

* **Updated score is persisted in the database.**

* Any derived leaderboard data is updated or marked stale.

## Optional optimizations

* Maintain a separate leaderboard table or sorted set.

* Use caching with controlled invalidation.

---

## REAL-TIME SCOREBOARD UPDATE FLOW

## Step 9: Server Emits Score Update Event

* After a successful score update, the server emits an event.

* The event contains read-only data:

* user_id

* new_score

* leaderboard rank (optional)

This event is published internally.

---

## Step 10: Real-Time Delivery Channel

## Possible mechanisms

* **WebSockets**

* Server-Sent Events

* Managed pub/sub services

## Security rules

* Clients cannot publish events.

* Clients can only subscribe.

* Events are pushed from the server only.

---

## Step 11: Frontend Scoreboard Update

* The client receives the event.

* The UI updates the scoreboard view.

* The client does not persist or re-send any score data.

**The scoreboard is purely a presentation layer.**

---

## MALICIOUS ATTACK VECTORS AND MITIGATIONS

## 1. Client sends fake score values

## Mitigation

* Client never sends scores.

* Server computes all score changes.

## 2. Replay API calls

## Mitigation

* Action IDs are single-use.

* Server enforces idempotency.

## 3. Scripted API abuse

## Mitigation

* Authentication required

* Rate limiting

* Behavioral monitoring

## 4. Forged authentication tokens

## Mitigation

* Cryptographic token verification

* Short token expiration

## 5. WebSocket abuse

## Mitigation

* Read-only subscriptions

* Server-authenticated connections

---

## AUDIT AND MONITORING

* Every score change is logged.

* Anomaly detection flags unusual score growth.

* Admin tools can inspect score history per user.

---

## SUMMARY OF TRUST MODEL

* The client is never trusted.

* The server is the sole authority for score changes.

* Every score update is authenticated, authorized, validated, calculated, and audited.

* Real-time updates are one-way and read-only.

---

## FINAL NOTE

This design ensures that even a fully compromised client cannot arbitrarily increase scores. The only way to gain points is by performing valid, server-verified actions within defined rules, enforced by cryptography, validation, and atomic persistence.