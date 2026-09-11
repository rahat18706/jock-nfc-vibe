# Frontend ↔ Backend Connection Map

**Version:** 1.0  
**Purpose:** Map every frontend page to backend implementation  
**Last Updated:** 2024

---

## How to Use This Document

This document shows the complete flow from frontend UI to database for every feature.

**Flow:**
```
Frontend Page
    ↓
API Call
    ↓
Route
    ↓
Middleware
    ↓
Controller
    ↓
Service
    ↓
Model
    ↓
Database
```

---

## Authentication Flow

### 1. Login Page

**Frontend:** `src/pages/LoginPage.tsx`

**User Action:**
1. User enters username + password
2. Clicks "Login" button

**API Call:**
```javascript
POST /api/auth/login
Body: { username, password }
```

**Backend Flow:**
```
Route: POST /api/auth/login
    ↓
Middleware: rateLimit (5 req/15min), validate(loginSchema)
    ↓
Controller: authController.login
    ↓
Service: authService.authenticateUser
    ↓
Model: User.findOne({ username })
    ↓
Database: users collection
    ↓
Service: Compare password hash (bcrypt)
    ↓
Service: Generate JWT token
    ↓
Controller: Set HttpOnly cookie
    ↓
Response: { success: true, data: { user, token } }
```

**Files:**
- Frontend: `src/pages/LoginPage.tsx`
- API Service: `src/services/api.ts` → `authAPI.login()`
- Route: `backend/src/routes/auth.routes.js`
- Controller: `backend/src/controllers/auth.controller.js` → `login()`
- Service: `backend/src/services/auth.service.js` → `authenticateUser()`
- Model: `backend/src/models/User.js`
- Validator: `backend/src/validators/auth.validators.js` → `loginSchema`

**Response Handling:**
```javascript
// Success
{
  success: true,
  data: {
    user: { id, username, email, role, businessId },
    token: "eyJhbGc..."
  }
}
→ Store token in localStorage
→ Store user in context
→ Redirect to dashboard based on role

// Error
{
  success: false,
  error: {
    code: "INVALID_CREDENTIALS",
    message: "Invalid username or password"
  }
}
→ Show error message
→ Don't reveal if username or password is wrong
```

---

### 2. Logout

**Frontend:** Any page with logout button

**User Action:**
1. Clicks "Logout" button

**API Call:**
```javascript
POST /api/auth/logout
Headers: { Authorization: Bearer <token> }
```

**Backend Flow:**
```
Route: POST /api/auth/logout
    ↓
Middleware: authMiddleware (verify JWT)
    ↓
Controller: authController.logout
    ↓
Service: Clear HttpOnly cookie
    ↓
Response: { success: true, data: { message: "Logged out" } }
```

**Files:**
- Frontend: `src/components/LogoutButton.tsx`
- API Service: `src/services/api.ts` → `authAPI.logout()`
- Route: `backend/src/routes/auth.routes.js`
- Controller: `backend/src/controllers/auth.controller.js` → `logout()`

**Response Handling:**
```javascript
// Success
{
  success: true,
  data: { message: "Logged out successfully" }
}
→ Clear localStorage
→ Clear context
→ Redirect to login page
```

---

## Admin Flows

### 3. Admin Dashboard

**Frontend:** `src/pages/AdminDashboard.tsx`

**User Action:**
1. Admin logs in
2. Redirected to admin dashboard
3. Dashboard loads stats

**API Calls:**
```javascript
GET /api/auth/me
GET /api/admin/analytics/stats
```

**Backend Flow:**
```
Route: GET /api/admin/analytics/stats
    ↓
Middleware: authMiddleware, roleMiddleware('admin')
    ↓
Controller: adminAnalyticsController.getStats
    ↓
Service: analyticsService.getPlatformStats
    ↓
Model: Business.countDocuments()
Model: NfcCard.countDocuments()
Model: ScanEvent.countDocuments()
    ↓
Database: businesses, nfccards, scanevents collections
    ↓
Response: { success: true, data: { stats } }
```

**Files:**
- Frontend: `src/pages/AdminDashboard.tsx`
- API Service: `src/services/api.ts` → `adminAPI.getStats()`
- Route: `backend/src/routes/admin.routes.js`
- Controller: `backend/src/controllers/adminAnalytics.controller.js` → `getStats()`
- Service: `backend/src/services/analytics.service.js` → `getPlatformStats()`
- Models: `Business.js`, `NfcCard.js`, `ScanEvent.js`

**Data Displayed:**
- Total businesses (active/suspended)
- Total cards (active/unassigned/suspended)
- Total scans (today/week/month)
- Recent activity

---

### 4. Admin - List Businesses

**Frontend:** `src/pages/admin/BusinessList.tsx`

**User Action:**
1. Clicks "Businesses" menu
2. Page loads business list
3. Can search, filter, paginate

**API Call:**
```javascript
GET /api/admin/businesses?page=1&limit=20&search=joe&status=active
```

**Backend Flow:**
```
Route: GET /api/admin/businesses
    ↓
Middleware: authMiddleware, roleMiddleware('admin')
    ↓
Controller: adminBusinessController.list
    ↓
Service: businessService.getAllBusinesses
    ↓
Model: Business.find().populate('owner').paginate()
    ↓
Database: businesses collection (with user population)
    ↓
Response: { success: true, data: { businesses }, pagination }
```

**Files:**
- Frontend: `src/pages/admin/BusinessList.tsx`
- API Service: `src/services/api.ts` → `adminAPI.getBusinesses()`
- Route: `backend/src/routes/admin.routes.js`
- Controller: `backend/src/controllers/adminBusiness.controller.js` → `list()`
- Service: `backend/src/services/business.service.js` → `getAllBusinesses()`
- Model: `backend/src/models/Business.js`

**Table Columns:**
- Business name
- Owner name
- Category
- Card count
- Status (active/suspended)
- Created date
- Actions (view, edit, suspend)

---

### 5. Admin - Create Business

**Frontend:** `src/pages/admin/CreateBusiness.tsx`

**User Action:**
1. Clicks "Create Business" button
2. Fills form (name, category, owner details)
3. Clicks "Create"

**API Call:**
```javascript
POST /api/admin/businesses
Body: {
  name: "Joe's Restaurant",
  category: "restaurant",
  ownerName: "Joe Smith",
  ownerEmail: "joe@example.com",
  ownerUsername: "joesrestaurant",
  temporaryPassword: "TempPass123!",
  phone: "+1-555-0123",
  address: { ... }
}
```

**Backend Flow:**
```
Route: POST /api/admin/businesses
    ↓
Middleware: authMiddleware, roleMiddleware('admin'), validate(createBusinessSchema)
    ↓
Controller: adminBusinessController.create
    ↓
Service: businessService.createBusiness
    ↓
Step 1: Check if email/username exists
    ↓
Step 2: Create User (role: business)
    ↓
Step 3: Create Business (ownerId: user._id)
    ↓
Step 4: Generate slug from name
    ↓
Step 5: Log audit (action: 'business_created')
    ↓
Model: User.create(), Business.create(), AuditLog.create()
    ↓
Database: users, businesses, auditlogs collections
    ↓
Response: { success: true, data: { business, credentials } }
```

**Files:**
- Frontend: `src/pages/admin/CreateBusiness.tsx`
- API Service: `src/services/api.ts` → `adminAPI.createBusiness()`
- Route: `backend/src/routes/admin.routes.js`
- Controller: `backend/src/controllers/adminBusiness.controller.js` → `create()`
- Service: `backend/src/services/business.service.js` → `createBusiness()`
- Models: `User.js`, `Business.js`, `AuditLog.js`
- Validator: `backend/src/validators/business.validators.js` → `createBusinessSchema`

**Response Handling:**
```javascript
// Success
{
  success: true,
  data: {
    business: { id, name, slug, ... },
    credentials: {
      username: "joesrestaurant",
      temporaryPassword: "TempPass123!",
      loginUrl: "https://tapreview.com/login"
    }
  }
}
→ Show success message
→ Display credentials (ONLY TIME they're shown)
→ Admin must share credentials securely

// Error - Duplicate email
{
  success: false,
  error: {
    code: "DUPLICATE_EMAIL",
    message: "Email already exists"
  }
}
→ Show error message

// Error - Validation
{
  success: false,
  error: {
    code: "VALIDATION_ERROR",
    message: "Validation failed",
    details: {
      ownerEmail: "Invalid email format"
    }
  }
}
→ Show field-specific errors
```

---

### 6. Admin - List Cards

**Frontend:** `src/pages/admin/CardList.tsx`

**User Action:**
1. Clicks "Cards" menu
2. Page loads card list
3. Can filter by status, business

**API Call:**
```javascript
GET /api/admin/cards?status=active&businessId=biz_xyz&page=1
```

**Backend Flow:**
```
Route: GET /api/admin/cards
    ↓
Middleware: authMiddleware, roleMiddleware('admin')
    ↓
Controller: adminCardController.list
    ↓
Service: cardService.getAllCards
    ↓
Model: NfcCard.find().populate('business').paginate()
    ↓
Database: nfccards collection
    ↓
Response: { success: true, data: { cards }, pagination }
```

**Files:**
- Frontend: `src/pages/admin/CardList.tsx`
- API Service: `src/services/api.ts` → `adminAPI.getCards()`
- Route: `backend/src/routes/admin.routes.js`
- Controller: `backend/src/controllers/adminCard.controller.js` → `list()`
- Service: `backend/src/services/card.service.js` → `getAllCards()`
- Model: `backend/src/models/NfcCard.js`

**Table Columns:**
- Public Card ID (JOCK-A7F92K)
- Label
- Status (unassigned/active/suspended/retired)
- Business name
- Destination URL
- Total scans
- Actions (assign, suspend, retire)

---

### 7. Admin - Create Card

**Frontend:** `src/pages/admin/CreateCard.tsx`

**User Action:**
1. Clicks "Create Card" button
2. Fills form (label, serial number)
3. Clicks "Create"

**API Call:**
```javascript
POST /api/admin/cards
Body: {
  label: "Table 1",
  serialNumber: "SN-2024-001235",
  type: "both"
}
```

**Backend Flow:**
```
Route: POST /api/admin/cards
    ↓
Middleware: authMiddleware, roleMiddleware('admin'), validate(createCardSchema)
    ↓
Controller: adminCardController.create
    ↓
Service: cardService.createCard
    ↓
Step 1: Generate publicCardId (JOCK-XXXXXX)
    ↓
Step 2: Check if publicCardId exists (retry if needed)
    ↓
Step 3: Create NfcCard (status: unassigned)
    ↓
Step 4: Log audit (action: 'card_created')
    ↓
Model: NfcCard.create(), AuditLog.create()
    ↓
Database: nfccards, auditlogs collections
    ↓
Response: { success: true, data: { card } }
```

**Files:**
- Frontend: `src/pages/admin/CreateCard.tsx`
- API Service: `src/services/api.ts` → `adminAPI.createCard()`
- Route: `backend/src/routes/admin.routes.js`
- Controller: `backend/src/controllers/adminCard.controller.js` → `create()`
- Service: `backend/src/services/card.service.js` → `createCard()`
- Model: `backend/src/models/NfcCard.js`, `AuditLog.js`

**publicCardId Generation:**
```javascript
// Generate random alphanumeric string
const generatePublicCardId = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No I, O, 0, 1
  let id = 'JOCK-';
  for (let i = 0; i < 6; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
};
```

---

### 8. Admin - Assign Card to Business

**Frontend:** `src/pages/admin/AssignCard.tsx`

**User Action:**
1. Clicks "Assign" on unassigned card
2. Selects business from dropdown
3. Enters destination URL
4. Clicks "Assign"

**API Call:**
```javascript
POST /api/admin/cards/:id/assign
Body: {
  businessId: "biz_xyz789",
  destinationUrl: "https://g.page/r/joes-restaurant",
  label: "Main Counter"
}
```

**Backend Flow:**
```
Route: POST /api/admin/cards/:id/assign
    ↓
Middleware: authMiddleware, roleMiddleware('admin'), validate(assignCardSchema)
    ↓
Controller: adminCardController.assign
    ↓
Service: cardService.assignCard
    ↓
Step 1: Find card by ID
    ↓
Step 2: Check card status === 'unassigned'
    ↓
Step 3: Find business by ID
    ↓
Step 4: Check business status === 'active'
    ↓
Step 5: Check business.cardCount < business.cardLimit
    ↓
Step 6: Validate destinationUrl
    ↓
Step 7: Update card (businessId, destinationUrl, status: 'active')
    ↓
Step 8: Increment business.cardCount
    ↓
Step 9: Log audit (action: 'card_assigned')
    ↓
Model: NfcCard.findOneAndUpdate(), Business.findOneAndUpdate(), AuditLog.create()
    ↓
Database: nfccards, businesses, auditlogs collections
    ↓
Response: { success: true, data: { card } }
```

**Files:**
- Frontend: `src/pages/admin/AssignCard.tsx`
- API Service: `src/services/api.ts` → `adminAPI.assignCard()`
- Route: `backend/src/routes/admin.routes.js`
- Controller: `backend/src/controllers/adminCard.controller.js` → `assign()`
- Service: `backend/src/services/card.service.js` → `assignCard()`
- Models: `NfcCard.js`, `Business.js`, `AuditLog.js`

**Validation:**
```javascript
// Card must be unassigned
if (card.status !== 'unassigned') {
  throw new AppError('Card already assigned', 400, 'CARD_ALREADY_ASSIGNED');
}

// Business must be active
if (business.status !== 'active') {
  throw new AppError('Business is not active', 400, 'BUSINESS_NOT_ACTIVE');
}

// Business must have capacity
if (business.cardCount >= business.cardLimit) {
  throw new AppError('Card limit exceeded', 400, 'BUSINESS_CARD_LIMIT_EXCEEDED');
}

// URL must be valid
if (!isValidDestinationUrl(destinationUrl)) {
  throw new AppError('Invalid URL', 400, 'INVALID_URL');
}
```

---

### 9. Admin - Suspend Business

**Frontend:** `src/pages/admin/BusinessList.tsx` (action button)

**User Action:**
1. Clicks "Suspend" on business
2. Enters reason
3. Confirms

**API Call:**
```javascript
PATCH /api/admin/businesses/:id/suspend
Body: { reason: "Violation of terms" }
```

**Backend Flow:**
```
Route: PATCH /api/admin/businesses/:id/suspend
    ↓
Middleware: authMiddleware, roleMiddleware('admin')
    ↓
Controller: adminBusinessController.suspend
    ↓
Service: businessService.suspendBusiness
    ↓
Step 1: Find business by ID
    ↓
Step 2: Update status to 'suspended'
    ↓
Step 3: Suspend all business cards
    ↓
Step 4: Log audit (action: 'business_suspended')
    ↓
Model: Business.findOneAndUpdate(), NfcCard.updateMany(), AuditLog.create()
    ↓
Database: businesses, nfccards, auditlogs collections
    ↓
Response: { success: true, data: { business } }
```

**Files:**
- Frontend: `src/pages/admin/BusinessList.tsx`
- API Service: `src/services/api.ts` → `adminAPI.suspendBusiness()`
- Route: `backend/src/routes/admin.routes.js`
- Controller: `backend/src/controllers/adminBusiness.controller.js` → `suspend()`
- Service: `backend/src/services/business.service.js` → `suspendBusiness()`
- Models: `Business.js`, `NfcCard.js`, `AuditLog.js`

**Side Effects:**
- Business cannot log in
- All business cards stop redirecting
- Business owner notified (Phase 2)

---

## Business Flows

### 10. Business Dashboard

**Frontend:** `src/pages/BusinessDashboard.tsx`

**User Action:**
1. Business logs in
2. Redirected to business dashboard
3. Dashboard loads profile + cards + stats

**API Calls:**
```javascript
GET /api/auth/me
GET /api/business/profile
GET /api/business/cards
GET /api/business/analytics/overview
```

**Backend Flow:**
```
Route: GET /api/business/profile
    ↓
Middleware: authMiddleware, roleMiddleware('business')
    ↓
Controller: businessController.getProfile
    ↓
Service: businessService.getBusinessProfile
    ↓
Step 1: Get user.businessId
    ↓
Step 2: Find business by ID
    ↓
Step 3: Verify business.ownerId === user._id
    ↓
Model: Business.findById()
    ↓
Database: businesses collection
    ↓
Response: { success: true, data: { business } }
```

**Files:**
- Frontend: `src/pages/BusinessDashboard.tsx`
- API Service: `src/services/api.ts` → `businessAPI.getProfile()`, `businessAPI.getCards()`, `businessAPI.getAnalytics()`
- Routes: `backend/src/routes/business.routes.js`
- Controllers: `backend/src/controllers/business.controller.js`
- Services: `backend/src/services/business.service.js`, `card.service.js`, `analytics.service.js`

**Data Displayed:**
- Business name, category, status
- Card count / card limit
- Total scans (today/week/month)
- List of cards with quick stats

---

### 11. Business - My Cards

**Frontend:** `src/pages/business/MyCards.tsx`

**User Action:**
1. Clicks "My Cards" menu
2. Page loads card list

**API Call:**
```javascript
GET /api/business/cards
```

**Backend Flow:**
```
Route: GET /api/business/cards
    ↓
Middleware: authMiddleware, roleMiddleware('business')
    ↓
Controller: businessCardController.list
    ↓
Service: cardService.getBusinessCards
    ↓
Step 1: Get user.businessId
    ↓
Step 2: Find all cards where businessId === user.businessId
    ↓
Model: NfcCard.find({ businessId })
    ↓
Database: nfccards collection
    ↓
Response: { success: true, data: { cards } }
```

**Files:**
- Frontend: `src/pages/business/MyCards.tsx`
- API Service: `src/services/api.ts` → `businessAPI.getCards()`
- Route: `backend/src/routes/business.routes.js`
- Controller: `backend/src/controllers/businessCard.controller.js` → `list()`
- Service: `backend/src/services/card.service.js` → `getBusinessCards()`
- Model: `backend/src/models/NfcCard.js`

**Card Display:**
- Public Card ID (JOCK-A7F92K)
- Label
- Status (active/suspended)
- Destination URL
- NFC URL (https://tapreview.com/s/JOCK-A7F92K)
- QR URL (same as NFC URL)
- Total scans
- Actions (edit destination)

---

### 12. Business - Edit Card Destination

**Frontend:** `src/pages/business/EditCard.tsx`

**User Action:**
1. Clicks "Edit" on card
2. Changes destination URL
3. Clicks "Save"

**API Call:**
```javascript
PATCH /api/business/cards/:id
Body: {
  destinationUrl: "https://g.page/r/joes-restaurant-new",
  label: "Main Entrance"
}
```

**Backend Flow:**
```
Route: PATCH /api/business/cards/:id
    ↓
Middleware: authMiddleware, roleMiddleware('business'), validate(updateCardSchema), ownershipMiddleware
    ↓
Controller: businessCardController.update
    ↓
Service: cardService.updateCardDestination
    ↓
Step 1: Find card by ID
    ↓
Step 2: Verify card.businessId === user.businessId (OWNERSHIP CHECK)
    ↓
Step 3: Validate destinationUrl
    ↓
Step 4: Update card
    ↓
Step 5: Invalidate cache (if using Redis)
    ↓
Step 6: Log audit (action: 'destination_changed')
    ↓
Model: NfcCard.findOneAndUpdate(), AuditLog.create()
    ↓
Database: nfccards, auditlogs collections
    ↓
Response: { success: true, data: { card } }
```

**Files:**
- Frontend: `src/pages/business/EditCard.tsx`
- API Service: `src/services/api.ts` → `businessAPI.updateCard()`
- Route: `backend/src/routes/business.routes.js`
- Controller: `backend/src/controllers/businessCard.controller.js` → `update()`
- Service: `backend/src/services/card.service.js` → `updateCardDestination()`
- Models: `NfcCard.js`, `AuditLog.js`
- Middleware: `backend/src/middleware/ownership.middleware.js`

**CRITICAL SECURITY CHECK:**
```javascript
// Ownership verification
if (card.businessId.toString() !== user.businessId.toString()) {
  throw new AppError('Forbidden', 403, 'FORBIDDEN');
}
```

**URL Validation:**
```javascript
const isValidDestinationUrl = (url) => {
  try {
    const parsed = new URL(url);
    
    // Only HTTP/HTTPS
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return false;
    }
    
    // No IP addresses
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(parsed.hostname)) {
      return false;
    }
    
    // No localhost in production
    if (process.env.NODE_ENV === 'production') {
      if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') {
        return false;
      }
    }
    
    return true;
  } catch {
    return false;
  }
};
```

---

## Public Flow

### 13. NFC/QR Redirect

**Frontend:** None (backend only)

**User Action:**
1. Customer taps NFC card or scans QR
2. Phone opens URL: `https://tapreview.com/s/JOCK-A7F92K`

**Backend Flow:**
```
Route: GET /s/:publicCardId
    ↓
Middleware: rateLimit (30 req/min), detectBot
    ↓
Controller: redirectController.redirect
    ↓
Service: redirectService.processRedirect
    ↓
Step 1: Find card by publicCardId (with status: 'active')
    ↓
Step 2: If not found → return 404 error page
    ↓
Step 3: Populate business
    ↓
Step 4: Check business.status === 'active'
    ↓
Step 5: If suspended → return 403 error page
    ↓
Step 6: Get destinationUrl
    ↓
Step 7: Validate destinationUrl (double-check)
    ↓
Step 8: Record scan event (ASYNC, non-blocking)
    ↓
Step 9: Return 302 redirect to destinationUrl
    ↓
Model: NfcCard.findOne({ publicCardId, status: 'active' })
    ↓
Database: nfccards collection
    ↓
Response: 302 Redirect to destinationUrl
```

**Files:**
- Route: `backend/src/routes/public.routes.js`
- Controller: `backend/src/controllers/redirect.controller.js` → `redirect()`
- Service: `backend/src/services/redirect.service.js` → `processRedirect()`
- Model: `backend/src/models/NfcCard.js`, `ScanEvent.js`

**Performance Optimization:**
```javascript
// Use lean() for faster query
const card = await NfcCard.findOne(
  { publicCardId, status: 'active' },
  { destinationUrl: 1, businessId: 1 }
).lean();

// Populate only needed fields
await card.populate('business', 'status');

// Record scan asynchronously
recordScanEvent(card, req).catch(err => {
  logger.error('Failed to record scan', { error: err.message });
});

// Redirect immediately
res.redirect(302, card.destinationUrl);
```

**Error Pages:**
- 404: "Card not found or inactive"
- 403: "This card is currently unavailable"
- 429: "Too many requests, please try again later"

---

## Summary Table

| # | Frontend Page | API Endpoint | Controller | Service | Model |
|---|---------------|--------------|------------|---------|-------|
| 1 | LoginPage | POST /auth/login | auth.login | auth.authenticateUser | User |
| 2 | (Logout) | POST /auth/logout | auth.logout | - | - |
| 3 | AdminDashboard | GET /admin/analytics/stats | adminAnalytics.getStats | analytics.getPlatformStats | Business, NfcCard, ScanEvent |
| 4 | BusinessList | GET /admin/businesses | adminBusiness.list | business.getAllBusinesses | Business |
| 5 | CreateBusiness | POST /admin/businesses | adminBusiness.create | business.createBusiness | User, Business, AuditLog |
| 6 | CardList | GET /admin/cards | adminCard.list | card.getAllCards | NfcCard |
| 7 | CreateCard | POST /admin/cards | adminCard.create | card.createCard | NfcCard, AuditLog |
| 8 | AssignCard | POST /admin/cards/:id/assign | adminCard.assign | card.assignCard | NfcCard, Business, AuditLog |
| 9 | (Suspend) | PATCH /admin/businesses/:id/suspend | adminBusiness.suspend | business.suspendBusiness | Business, NfcCard, AuditLog |
| 10 | BusinessDashboard | GET /business/profile | business.getProfile | business.getBusinessProfile | Business |
| 11 | MyCards | GET /business/cards | businessCard.list | card.getBusinessCards | NfcCard |
| 12 | EditCard | PATCH /business/cards/:id | businessCard.update | card.updateCardDestination | NfcCard, AuditLog |
| 13 | (NFC Tap) | GET /s/:publicCardId | redirect.redirect | redirect.processRedirect | NfcCard, ScanEvent |

---

## Next Steps

1. ✅ Review this connection map
2. ⏳ Implement backend according to this map
3. ⏳ Update frontend to use real API calls
4. ⏳ Test each flow end-to-end
5. ⏳ Update this document as features are added

---

**Document Status:** COMPLETE  
**Ready for Implementation:** Yes
