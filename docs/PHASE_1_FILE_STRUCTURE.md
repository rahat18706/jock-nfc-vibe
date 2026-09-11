# Phase 1 File Structure

**Status:** PROPOSED  
**Purpose:** Define exact file structure for Phase 1 implementation  
**Last Updated:** 2024

---

## Overview

This document defines the complete file structure for Phase 1 (Sellable MVP). All files listed here must be created or modified to complete Phase 1.

**Legend:**
- ✅ = Already exists (may need modifications)
- 🆕 = New file to create
- ⚠️ = Exists but needs significant refactoring
- ❌ = Exists but should be deleted

---

## Backend Structure

```
backend/
│
├── src/
│   │
│   ├── config/
│   │   ├── db.js                          ✅ MongoDB connection
│   │   ├── env.js                         ✅ Environment validation
│   │   └── logger.js                      ✅ Winston logger
│   │
│   ├── controllers/
│   │   ├── auth.controller.js             🆕 Authentication handlers
│   │   ├── adminBusiness.controller.js    🆕 Admin business management
│   │   ├── adminCard.controller.js        🆕 Admin card management
│   │   ├── adminAnalytics.controller.js   🆕 Admin analytics
│   │   ├── business.controller.js         🆕 Business profile management
│   │   ├── businessCard.controller.js     🆕 Business card management
│   │   ├── businessAnalytics.controller.js 🆕 Business analytics
│   │   └── redirect.controller.js         🆕 NFC/QR redirect handler
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js             ✅ JWT authentication
│   │   ├── role.middleware.js             🆕 Role-based access control
│   │   ├── ownership.middleware.js        🆕 Resource ownership verification
│   │   ├── validate.middleware.js         ✅ Request validation
│   │   ├── error.middleware.js            ✅ Global error handler
│   │   ├── rateLimit.middleware.js        🆕 Rate limiting configuration
│   │   └── audit.middleware.js            🆕 Audit logging middleware
│   │
│   ├── models/
│   │   ├── User.js                        ⚠️ Needs businessId field
│   │   ├── Business.js                    ⚠️ Needs cardCount, cardLimit
│   │   ├── NfcCard.js                     ⚠️ MAJOR REFACTOR - status enum
│   │   ├── ScanEvent.js                   ✅ Keep for Phase 3
│   │   ├── Order.js                       ❌ Remove for Phase 1
│   │   ├── Product.js                     ❌ Remove for Phase 1
│   │   └── AuditLog.js                    ✅ Good as-is
│   │
│   ├── routes/
│   │   ├── auth.routes.js                 🆕 Clean auth routes
│   │   ├── admin.routes.js                🆕 Admin routes (businesses, cards)
│   │   ├── business.routes.js             🆕 Business routes (profile, cards)
│   │   └── public.routes.js               🆕 Public redirect route
│   │
│   ├── services/
│   │   ├── auth.service.js                🆕 Authentication logic
│   │   ├── business.service.js            🆕 Business operations
│   │   ├── card.service.js                🆕 Card operations
│   │   ├── redirect.service.js            🆕 Redirect logic
│   │   ├── analytics.service.js           🆕 Analytics calculations
│   │   └── audit.service.js               🆕 Audit logging
│   │
│   ├── validators/
│   │   ├── auth.validators.js             🆕 Auth validation schemas
│   │   ├── business.validators.js         🆕 Business validation schemas
│   │   ├── card.validators.js             🆕 Card validation schemas
│   │   └── common.validators.js           🆕 Shared validation helpers
│   │
│   ├── utils/
│   │   ├── errors.js                      🆕 Custom error classes
│   │   ├── response.js                    🆕 Response formatting helpers
│   │   ├── security.js                    🆕 Security utilities
│   │   └── helpers.js                     🆕 General helper functions
│   │
│   ├── cache/
│   │   └── cardCache.js                   🆕 Card caching (Phase 5, stub for now)
│   │
│   ├── app.js                             🆕 Express app setup
│   └── server.js                          ⚠️ Refactor to use app.js
│
├── tests/
│   ├── unit/
│   │   ├── services/
│   │   │   ├── auth.service.test.js       🆕
│   │   │   ├── business.service.test.js   🆕
│   │   │   └── card.service.test.js       🆕
│   │   └── controllers/
│   │       ├── auth.controller.test.js    🆕
│   │       └── redirect.controller.test.js 🆕
│   │
│   └── integration/
│       ├── auth.test.js                   🆕
│       ├── admin.test.js                  🆕
│       ├── business.test.js               🆕
│       └── redirect.test.js               🆕
│
├── scripts/
│   ├── seed.js                            🆕 Database seeder
│   └── migrate.js                         🆕 Migration runner (Phase 2)
│
├── .env.example                           ✅ Environment template
├── .gitignore                             ✅ Git ignore
├── package.json                           ⚠️ Update dependencies
└── README.md                              ⚠️ Update documentation
```

---

## Frontend Structure

```
frontend/
│
├── src/
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx                 🆕 Reusable button
│   │   │   ├── Input.tsx                  🆕 Reusable input
│   │   │   ├── Card.tsx                   🆕 Reusable card container
│   │   │   ├── Modal.tsx                  🆕 Reusable modal
│   │   │   ├── Loading.tsx                🆕 Loading spinner
│   │   │   ├── Error.tsx                  🆕 Error display
│   │   │   └── ProtectedRoute.tsx         🆕 Route protection
│   │   │
│   │   ├── layout/
│   │   │   ├── Header.tsx                 🆕 Site header
│   │   │   ├── Sidebar.tsx                🆕 Dashboard sidebar
│   │   │   └── Footer.tsx                 🆕 Site footer
│   │   │
│   │   └── cards/
│   │       ├── BusinessCard.tsx           🆕 Business display card
│   │       ├── NfcCard.tsx                🆕 NFC card display
│   │       └── StatCard.tsx               🆕 Statistics card
│   │
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx              ⚠️ Refactor to use real API
│   │   │   └── LogoutButton.tsx           🆕 Logout component
│   │   │
│   │   ├── admin/
│   │   │   ├── AdminDashboard.tsx         🆕 Admin home page
│   │   │   ├── BusinessList.tsx           🆕 List all businesses
│   │   │   ├── CreateBusiness.tsx         🆕 Create business form
│   │   │   ├── EditBusiness.tsx           🆕 Edit business form
│   │   │   ├── CardList.tsx               🆕 List all cards
│   │   │   ├── CreateCard.tsx             🆕 Create card form
│   │   │   ├── AssignCard.tsx             🆕 Assign card to business
│   │   │   └── AdminAnalytics.tsx         🆕 Platform analytics
│   │   │
│   │   ├── business/
│   │   │   ├── BusinessDashboard.tsx      🆕 Business home page
│   │   │   ├── MyCards.tsx                🆕 List business cards
│   │   │   ├── EditCard.tsx               🆕 Edit card destination
│   │   │   ├── BusinessProfile.tsx        🆕 Edit business profile
│   │   │   └── BusinessAnalytics.tsx      🆕 Business analytics
│   │   │
│   │   └── public/
│   │       ├── LandingPage.tsx            ✅ Keep as-is
│   │       └── RedirectError.tsx          🆕 Error page for invalid cards
│   │
│   ├── services/
│   │   └── api.ts                         ⚠️ Implement real API calls
│   │
│   ├── hooks/
│   │   ├── useAuth.ts                     🆕 Authentication hook
│   │   ├── useApi.ts                      🆕 API call hook
│   │   └── useLocalStorage.ts             🆕 Local storage hook
│   │
│   ├── context/
│   │   └── AuthContext.tsx                🆕 Authentication context
│   │
│   ├── utils/
│   │   ├── constants.ts                   🆕 App constants
│   │   ├── helpers.ts                     🆕 Helper functions
│   │   └── validators.ts                  🆕 Client-side validation
│   │
│   ├── types/
│   │   ├── user.ts                        🆕 User types
│   │   ├── business.ts                    🆕 Business types
│   │   ├── card.ts                        🆕 Card types
│   │   └── api.ts                         🆕 API response types
│   │
│   ├── styles/
│   │   └── globals.css                    ✅ Global styles
│   │
│   ├── App.tsx                            ⚠️ Update routing
│   ├── main.tsx                           ✅ Entry point
│   └── index.css                          ✅ Base styles
│
├── public/
│   ├── favicon.ico                        ✅ Site icon
│   └── robots.txt                         ✅ SEO
│
├── .env.example                           ✅ Environment template
├── .gitignore                             ✅ Git ignore
├── package.json                           ⚠️ Update dependencies
├── tsconfig.json                          ✅ TypeScript config
├── vite.config.ts                         ✅ Vite config
└── README.md                              ⚠️ Update documentation
```

---

## Documentation Structure

```
docs/
│
├── BACKEND_AUDIT.md                       ✅ Current state audit
├── API_CONTRACT.md                        ✅ API specification
├── ARCHITECTURE.md                        ✅ System architecture
├── DATABASE.md                            🆕 Database schema docs
├── SECURITY.md                            🆕 Security documentation
├── FRONTEND_BACKEND_MAP.md                ✅ Page-to-API mapping
├── DEPLOYMENT.md                          🆕 Deployment guide
├── PRODUCTION_CHECKLIST.md                🆕 Launch checklist
├── NOTEBOOK_PLAN.md                       ✅ Simple reference guide
└── PHASE_1_FILE_STRUCTURE.md              ✅ This file
```

---

## Files to Delete

### Backend
```
backend/
├── routes/
│   ├── admin.js                           ❌ Replace with admin.routes.js
│   ├── analytics.js                       ❌ Move to Phase 3
│   ├── auth.js                            ❌ Replace with auth.routes.js
│   ├── business.js                        ❌ Replace with business.routes.js
│   ├── cards.js                           ❌ Replace with card routes
│   ├── orders.js                          ❌ Move to Phase 4
│   └── redirect.js                        ❌ Replace with public.routes.js
│
├── models/
│   ├── Order.js                           ❌ Move to Phase 4
│   └── ScanEvent.js                       ⚠️ Keep but don't use in Phase 1
│
├── middleware/
│   ├── auth.js                            ❌ Replace with auth.middleware.js
│   ├── errorHandler.js                    ❌ Replace with error.middleware.js
│   ├── security.js                        ❌ Split into multiple middleware
│   └── validate.js                        ❌ Replace with validate.middleware.js
│
├── server.js                              ❌ Split into app.js + server.js
├── seed.js                                ❌ Move to scripts/seed.js
└── test-db.js                             ❌ Move to tests/
```

### Frontend
```
frontend/
├── src/
│   ├── pages/
│   │   ├── AdminPage.tsx                  ❌ Split into multiple pages
│   │   ├── DashboardPage.tsx              ❌ Split into multiple pages
│   │   ├── OrderPage.tsx                  ❌ Move to Phase 4
│   │   └── RedirectPage.tsx               ❌ Backend handles this
│   │
│   ├── data/
│   │   └── mockData.ts                    ❌ Remove, use real API
│   │
│   └── components/
│       └── QRCardGenerator.tsx            ❌ Move to Phase 2
```

---

## Implementation Order

### Week 1: Core Backend

**Day 1-2: Foundation**
1. Create `app.js` and refactor `server.js`
2. Create custom error classes (`utils/errors.js`)
3. Create response helpers (`utils/response.js`)
4. Refactor `NfcCard` model (status enum)
5. Update `User` model (add businessId)
6. Update `Business` model (add cardCount, cardLimit)

**Day 3-4: Authentication**
1. Create `auth.service.js`
2. Create `auth.controller.js`
3. Create `auth.routes.js`
4. Create `auth.middleware.js` (role-based)
5. Create auth validators
6. Test login/logout flow

**Day 5-6: Admin Business Management**
1. Create `business.service.js`
2. Create `adminBusiness.controller.js`
3. Create admin business routes
4. Create business validators
5. Test create/list/update business

**Day 7: Admin Card Management**
1. Create `card.service.js`
2. Create `adminCard.controller.js`
3. Create admin card routes
4. Create card validators
5. Test create/assign/unassign card

### Week 2: Business Features + Redirect

**Day 1-2: Business Profile**
1. Create `business.controller.js`
2. Create business routes
3. Create `ownership.middleware.js`
4. Test business profile CRUD

**Day 3-4: Business Cards**
1. Create `businessCard.controller.js`
2. Add card routes to business routes
3. Test card listing (ownership verified)
4. Test destination update (ownership verified)

**Day 5-6: NFC Redirect**
1. Create `redirect.service.js`
2. Create `redirect.controller.js`
3. Create `public.routes.js`
4. Add rate limiting
5. Test redirect flow

**Day 7: Audit Logging**
1. Create `audit.service.js`
2. Create `audit.middleware.js`
3. Integrate into all controllers
4. Test audit trail

### Week 3: Frontend Integration

**Day 1-2: Auth Flow**
1. Create `AuthContext.tsx`
2. Create `useAuth.ts` hook
3. Create `ProtectedRoute.tsx`
4. Refactor `LoginPage.tsx` to use real API
5. Test login/logout

**Day 3-4: Admin Pages**
1. Create `AdminDashboard.tsx`
2. Create `BusinessList.tsx`
3. Create `CreateBusiness.tsx`
4. Create `CardList.tsx`
5. Create `AssignCard.tsx`
6. Test admin workflow

**Day 5-6: Business Pages**
1. Create `BusinessDashboard.tsx`
2. Create `MyCards.tsx`
3. Create `EditCard.tsx`
4. Create `BusinessProfile.tsx`
5. Test business workflow

**Day 7: Testing & Polish**
1. End-to-end testing
2. Error handling
3. Loading states
4. Responsive design
5. Bug fixes

### Week 4: Testing & Deployment

**Day 1-3: Testing**
1. Unit tests for services
2. Integration tests for controllers
3. End-to-end tests for workflows
4. Security tests (ownership, auth)
5. Performance tests (redirect speed)

**Day 4-5: Documentation**
1. Update API documentation
2. Write deployment guide
3. Create user guide
4. Write admin guide
5. Create troubleshooting guide

**Day 6-7: Deployment**
1. Set up production environment
2. Configure database
3. Deploy backend
4. Deploy frontend
5. Configure DNS/SSL
6. Smoke testing
7. Go live!

---

## Dependencies

### Backend (package.json)

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.3",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "joi": "^17.11.0",
    "helmet": "^7.1.0",
    "cors": "^2.8.5",
    "express-rate-limit": "^7.1.5",
    "winston": "^3.11.0",
    "express-mongo-sanitize": "^2.2.0",
    "cookie-parser": "^1.4.6",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "jest": "^29.7.0",
    "supertest": "^6.3.3"
  }
}
```

### Frontend (package.json)

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.1",
    "axios": "^1.6.2",
    "zustand": "^4.4.7",
    "lucide-react": "^0.294.0",
    "framer-motion": "^10.16.16"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.3.3",
    "vite": "^5.0.8",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32"
  }
}
```

---

## File Count Summary

### Backend
- **Existing files to keep:** 8
- **Existing files to refactor:** 6
- **Existing files to delete:** 15
- **New files to create:** 45
- **Total backend files:** 53

### Frontend
- **Existing files to keep:** 5
- **Existing files to refactor:** 4
- **Existing files to delete:** 6
- **New files to create:** 35
- **Total frontend files:** 40

### Documentation
- **Existing files to keep:** 5
- **Existing files to update:** 3
- **New files to create:** 4
- **Total documentation files:** 12

### Grand Total
- **Total files:** 105
- **New files:** 84
- **Files to refactor:** 10
- **Files to delete:** 21
- **Files to keep as-is:** 10

---

## Success Criteria

Phase 1 is complete when:

✅ All files listed above are created  
✅ All tests pass  
✅ Admin can create business  
✅ Admin can create and assign cards  
✅ Business can login  
✅ Business can view and update cards  
✅ NFC redirect works (<100ms)  
✅ Ownership verification works  
✅ Audit logging works  
✅ Documentation is complete  
✅ Deployed to production  

---

**Document Status:** APPROVED  
**Ready for Implementation:** Yes  
**Estimated Completion:** 4 weeks
