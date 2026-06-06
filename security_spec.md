# Security Specification for SoleBox Firestore Architecture

This document defines the threats, access validations, and constraints that secure our Firestore backend.

## 1. Zero-Trust Access Rules
- **Global Safety Rule**: Default deny-all.
- **Access Isolation**: Standard logins can only list or fetch their own order documents (`resource.data.userId == request.auth.uid`). They are strictly barred from other accounts' transactions.
- **Catalog Public Views**: Unauthenticated or normal visitors can look up the sneaker products catalog to search and buy (`allow read: if true`). They are forbidden from adding, modifying, or deleting sneaker records.
- **Admin Authentication**: Catalog creations (`/products`), state modifications, or shipping tracking allocations are restricted strictly to proven admins checked on `exists(/databases/$(database)/documents/admins/$(request.auth.uid))` or the primary developer email.

## 2. Dynamic Threat Vectors
1. Hostile user logs in and attempts to update a sneaker product's price (`/products/{id}`).
2. Bad actor registers as an admin by pushing a self-assigned admin profile in `/admins/attacker_uid`.
3. Customer tries to change their order status to "Delivered" without payment.
4. Crawler tries to query and scrape other users' email and home addresses from `/orders`.
5. Non-admin pushes a product ID of 1MB length to cause denial-of-wallet spikes.
