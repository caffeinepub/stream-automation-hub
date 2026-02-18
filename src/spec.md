# Specification

## Summary
**Goal:** Add admin authentication and subscription management dashboard for the app owner.

**Planned changes:**
- Add isOwner field to UserProfile data model to identify the app owner
- Create backend functions to check owner status and manage subscription plans (CRUD operations)
- Build admin dashboard page with subscription plan management interface
- Add owner badge indicator in profile display
- Add admin navigation link in header visible only to owner
- Update migration to handle new isOwner field

**User-visible outcome:** The app owner can log in with their Internet Identity, see an owner badge on their profile, access an admin dashboard from the header navigation, and manage subscription plans (view, create, edit, and delete) through a dedicated interface. Non-owner users cannot access the admin features.
