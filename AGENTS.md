# AGENTS.md

This file defines project instructions for humans and coding agents working on gear-db.

## Product Goal

Build a music gear database app where users can:

- Create an account and sign in.
- Create and manage records for each piece of music gear they own.
- Upload and manage photos of each gear item.
- Store useful details (brand, model, serial number, purchase info, condition, notes).
- Export/share data for insurance documentation purposes.

## Platform And Core Stack

- Framework: Next.js 16.2.6 (App Router).
- Runtime: Node.js LTS compatible with Next.js 16.
- Hosting target: Vercel.
- Language preference: TypeScript for all app code.

## Implementation Priorities

1. Strong authentication and account safety.
2. Correct ownership boundaries (users can only access their own gear by default).
3. Reliable image upload/storage pipeline.
4. Insurance-friendly data quality and exports.
5. Auditability and recovery (timestamps, soft delete where useful).
6. Prefer smaller components rather than large files that implement whole pages.

## Authentication Requirements

- Support OAuth/social sign-in (Google, Facebook, and expandable provider list).
- Prefer Auth.js (NextAuth) with provider-based login.
- Use a persistent database adapter for sessions/users.
- Store only required profile fields and avoid unnecessary PII.
- Enforce secure session handling:
  - HTTP-only cookies.
  - Secure cookie settings in production.
  - CSRF protections and provider state validation.

## Authorization Rules

- Every gear record must be tied to an owner user id.
- All create/read/update/delete operations must verify ownership on the server.
- Do not trust client-submitted owner ids.
- Admin/moderator roles (if added) must be explicit and policy-driven.

## Data Model Guidance

Minimum entities:

- User
- GearItem
- GearImage
- Optional: GearDocument (receipts, valuation docs)

Recommended GearItem fields:

- id
- ownerId
- category (guitar, synth, amp, pedal, mic, interface, other)
- brand
- model
- serialNumber (nullable, indexed)
- year
- purchaseDate
- purchasePrice
- currency
- estimatedValue
- condition
- description
- tags
- createdAt
- updatedAt
- deletedAt (optional soft delete)

## File Upload And Media

- Use signed upload URLs; avoid exposing privileged credentials in clients.
- Validate file type and size server-side.
- Generate multiple image sizes (thumbnail + full).
- Strip EXIF metadata by default when possible for privacy.
- Keep original upload only when required for insurance evidence.
- Store media in object storage compatible with Vercel workflows.

## Security And Privacy

- Treat this as a trust-sensitive app (insurance-related personal property data).
- Validate all input with shared server-side schemas.
- Add rate limiting for auth and upload endpoints.
- Use structured server logging without secrets.
- Never log OAuth tokens, session tokens, or raw sensitive identifiers.
- Add account deletion flow and data export flow.

## API And App Architecture

- Use Next.js App Router conventions.
- Keep server mutations in server-side actions/routes.
- Separate concerns:
  - UI components
  - Domain/business logic
  - Data access layer
- Prefer explicit DTOs and schema validation at boundaries.

## Testing Strategy

- Unit tests for domain logic (ownership checks, valuation helpers, validation).
- Integration tests for auth and gear CRUD routes.
- E2E tests for sign-in and core item lifecycle.
- Add regression tests for permission bypass attempts.

## Future Community Features

When adding forum/chat:

- Keep it modular and independent from core insurance inventory features.
- Reuse existing user identity and permission model.
- Add moderation/reporting hooks from day one.
- If Discord integration is used:
  - Keep OAuth scopes minimal.
  - Make Discord linkage optional.
  - Never block core inventory workflows on Discord availability.

## Vercel Deployment Notes

- Keep secrets in environment variables managed by Vercel.
- Use preview deployments for PR validation.
- Add production-safe defaults:
  - secure cookies
  - strict transport security
  - environment-aware logging verbosity

## Coding Standards For Contributors/Agents

- Use TypeScript.
- Prefer small, composable modules.
- Document non-obvious decisions in short comments.
- Avoid introducing broad dependencies without justification.
- Keep PRs scoped and include tests for behavior changes.
- Do not implement insecure shortcuts for auth, authorization, or uploads.

## Definition Of Done (Feature Level)

A feature is complete when:

- Functional requirements are implemented.
- Ownership and authorization checks are enforced server-side.
- Validation and error states are covered.
- Automated tests are added/updated.
- Docs are updated when contracts or env vars change.
