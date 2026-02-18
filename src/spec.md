# Specification

## Summary
**Goal:** Secure admin access to owner only, fix owner recognition via Twitch username, separate tracking features into dedicated page, implement Stripe Connect OAuth, enforce subscription requirements, and fix authentication/badge display issues.

**Planned changes:**
- Restrict admin dashboard access exclusively to user 'CelestiNix' with backend principal/username verification
- Automatically recognize owner when Twitch username 'auroramoonveil' is entered during profile setup and set isOwner to true
- Move tracking functionality (revenue tracking, finance tracker, donation manager) to a new dedicated page separate from admin dashboard
- Replace Stripe secret key configuration with Stripe Connect OAuth flow for bank account linking
- Enforce subscription requirement for all users except owner to access AI assistant, chat room, Discord tools, finance tracker, calculator, and donation manager
- Fix authentication flow to prevent admin login from triggering simultaneous user login
- Fix owner badge display to correctly show for 'CelestiNix' based on isOwner field

**User-visible outcome:** Only the owner 'CelestiNix' can access the admin dashboard, owner status is automatically recognized when entering Twitch username 'auroramoonveil', tracking features are accessible on a separate dedicated page, Stripe account linking works via OAuth Connect, non-owner users must subscribe to access advanced features, admin login works without redundant user login, and the owner badge displays correctly for the owner.
