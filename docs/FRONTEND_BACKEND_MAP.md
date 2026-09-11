# Frontend ↔ Backend Map

**Version:** 1.0  
**Last Updated:** 2024-01-XX  
**Status:** Phase 1 Implementation Complete

---

## Overview

This document maps every frontend page to its corresponding backend API endpoints, showing the complete data flow from UI to database.

---

## Authentication Flow

### Login Page

**Frontend:** `src/pages/LoginPage.tsx`

**User Action:**
1. User enters username and password
2. Clicks "Login" button

**API Call:**
```
POST /api/auth/login
Body: { username, password }
```

**Backend Flow:**
```
LoginPage.tsx
    ↓
useAuth().login(username, password)
    ↓
authApi.login(username, password)
    ↓
POST /api/auth/login
    ↓
auth.controller.js → login()
    ↓
User.findOne({ username })
    ↓
bcrypt.compare(password)
    ↓
Generate JWT token
    ↓
Set HttpOnly cookie
    ↓
Return { success: true, data: { user, token } }
    ↓
AuthContext stores user
    ↓
Navigate to /dashboard or /admin based on role
```

**Files:**
- Frontend: `src/pages/LoginPage.tsx`
- API Client: `src/lib/api.ts` → `authApi.login()`
- Context: `src/context/AuthContext.tsx` → `login()`
- Backend Route: `backend/routes/auth.js` → `POST /login`
- Backend Controller: `backend/controllers/auth.controller.js` → `login()`
- Backend Model: `backend/models/User.js`

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
→ Store user in AuthContext
→ Redirect based on role

// Error
{
  success: false,
  error: {
    code: "INVALID_CREDENTIALS",
    message: "Invalid username or password"
  }
}
→ Show error message
```

---

### Logout

**Frontend:** Any page with logout button

**User Action:**
1. Clicks "Logout" button

**API Call:**
```
POST /api/auth/logout
```

**Backend Flow:**
```
Logout Button
    ↓
useAuth().logout()
    ↓
authApi.logout()
    ↓
POST /api/auth/logout
    ↓
Clear HttpOnly cookie
    ↓
Return { success: true, message: "Logged out" }
    ↓
AuthContext clears user
    ↓
Navigate to /login
```

**Files:**
- Frontend: `src/context/AuthContext.tsx` → `logout()`
- API Client: `src/lib/api.ts` → `authApi.logout()`
- Backend Route: `backend/routes/auth.js` → `POST /logout`

---

## Business Dashboard Flow

### Dashboard Overview

**Frontend:** `src/pages/DashboardPage.tsx` (activeTab === 'overview')

**User Action:**
1. Business user logs in
2. Redirected to /dashboard
3. Dashboard loads

**API Calls:**
```
GET /api/businesses/my
GET /api/businesses/my/cards
GET /api/analytics/overview
```

**Backend Flow:**
```
DashboardPage.tsx mounts
    ↓
useEffect → fetchData()
    ↓
Promise.all([
  businessApi.getMyBusiness(),
  businessApi.getMyCards(),
  analyticsApi.getOverview()
])
    ↓
GET /api/businesses/my
GET /api/businesses/my/cards
GET /api/analytics/overview
    ↓
business.controller.js → getMyBusiness()
business.controller.js → getMyCards()
analytics.controller.js → getOverview()
    ↓
Business.findOne({ owner: req.user._id })
NfcCard.find({ business: business._id })
ScanEvent.aggregate(...)
    ↓
Return business, cards, stats
    ↓
Set state: business, cards, stats
    ↓
Render dashboard with real data
```

**Files:**
- Frontend: `src/pages/DashboardPage.tsx`
- API Client: `src/lib/api.ts` → `businessApi.getMyBusiness()`, `getMyCards()`, `analyticsApi.getOverview()`
- Backend Routes: `backend/routes/business.js`, `backend/routes/analytics.js`
- Backend Models: `Business.js`, `NfcCard.js`, `ScanEvent.js`

**Data Displayed:**
- Business name, category, status
- Total scans, today scans, week scans, unique visitors
- Card count

---

### My Cards

**Frontend:** `src/pages/DashboardPage.tsx` (activeTab === 'cards')

**User Action:**
1. Clicks "NFC Cards" tab
2. Card list loads

**API Call:**
```
GET /api/businesses/my/cards
```

**Backend Flow:**
```
DashboardPage.tsx (cards tab)
    ↓
businessApi.getMyCards()
    ↓
GET /api/businesses/my/cards
    ↓
business.controller.js → getMyCards()
    ↓
Business.findOne({ owner: req.user._id })
NfcCard.find({ business: business._id })
    ↓
Return cards array
    ↓
Render card list
```

**Files:**
- Frontend: `src/pages/DashboardPage.tsx`
- API Client: `src/lib/api.ts` → `businessApi.getMyCards()`
- Backend Route: `backend/routes/business.js` → `GET /my/cards`
- Backend Model: `NfcCard.js`

**Data Displayed:**
- Card ID (publicCardId)
- Label
- Status (active/inactive)
- Destination URL
- Total scans, today scans

---

### Edit Card Destination

**Frontend:** `src/pages/DashboardPage.tsx` (edit form)

**User Action:**
1. Clicks "Edit URL" on a card
2. Enters new destination URL
3. Clicks "Save"

**API Call:**
```
PUT /api/businesses/cards/:cardId/destination
Body: { destinationUrl }
```

**Backend Flow:**
```
Edit Form Submit
    ↓
handleUpdateDestination(cardId, newUrl)
    ↓
businessApi.updateCardDestination(cardId, newUrl)
    ↓
PUT /api/businesses/cards/:cardId/destination
    ↓
business.controller.js → updateCardDestination()
    ↓
NfcCard.findOne({ cardId, business: business._id })
    ↓
Validate URL (http/https only)
    ↓
Update card.destinationUrl
    ↓
Invalidate cache (if using Redis)
    ↓
Return { success: true, data: { card } }
    ↓
Refresh cards list
    ↓
Show success message
```

**Files:**
- Frontend: `src/pages/DashboardPage.tsx`
- API Client: `src/lib/api.ts` → `businessApi.updateCardDestination()`
- Backend Route: `backend/routes/business.js` → `PUT /cards/:cardId/destination`
- Backend Model: `NfcCard.js`

**Validation:**
- Frontend: Basic URL format check
- Backend: Strict validation (http/https only, no IP addresses, no localhost in production)

**Security:**
- Ownership verification: Card must belong to business
- Business must belong to user
- URL validation prevents malicious redirects

---

## Admin Dashboard Flow

### Admin Overview

**Frontend:** `src/pages/AdminPage.tsx` (activeSection === 'overview')

**User Action:**
1. Admin logs in
2. Redirected to /admin
3. Dashboard loads

**API Calls:**
```
GET /api/admin/stats
GET /api/admin/businesses
```

**Backend Flow:**
```
AdminPage.tsx mounts
    ↓
useEffect → fetchData()
    ↓
Promise.all([
  adminApi.getStats(),
  adminApi.getBusinesses()
])
    ↓
GET /api/admin/stats
GET /api/admin/businesses
    ↓
admin.controller.js → getStats()
admin.controller.js → getBusinesses()
    ↓
Business.countDocuments()
NfcCard.countDocuments()
ScanEvent.countDocuments()
Business.find().populate('owner')
    ↓
Return stats, businesses
    ↓
Set state: stats, businesses
    ↓
Render admin dashboard
```

**Files:**
- Frontend: `src/pages/AdminPage.tsx`
- API Client: `src/lib/api.ts` → `adminApi.getStats()`, `getBusinesses()`
- Backend Routes: `backend/routes/admin.js`
- Backend Models: `Business.js`, `NfcCard.js`, `ScanEvent.js`

**Data Displayed:**
- Total businesses
- Total cards
- Total scans
- Total revenue
- Business list with owner info

---

### Business List

**Frontend:** `src/pages/AdminPage.tsx` (activeSection === 'businesses')

**User Action:**
1. Clicks "Businesses" tab
2. Business list loads
3. Can search businesses

**API Call:**
```
GET /api/admin/businesses?search=...
```

**Backend Flow:**
```
AdminPage.tsx (businesses tab)
    ↓
adminApi.getBusinesses({ search })
    ↓
GET /api/admin/businesses?search=...
    ↓
admin.controller.js → getBusinesses()
    ↓
Business.find({ $or: [name regex, slug regex] })
  .populate('owner', 'username email fullName')
  .sort({ createdAt: -1 })
    ↓
Return businesses array
    ↓
Render business table
```

**Files:**
- Frontend: `src/pages/AdminPage.tsx`
- API Client: `src/lib/api.ts` → `adminApi.getBusinesses()`
- Backend Route: `backend/routes/admin.js` → `GET /businesses`
- Backend Model: `Business.js`

**Data Displayed:**
- Business name, slug
- Owner name, email
- Category
- Status (active/suspended)

---

### Create Business

**Frontend:** `src/pages/AdminPage.tsx` (CreateBusinessModal)

**User Action:**
1. Clicks "New Business" button
2. Fills form (username, password, email, business name, category)
3. Clicks "Create Business"

**API Call:**
```
POST /api/admin/businesses
Body: { username, password, email, fullName, businessName, category }
```

**Backend Flow:**
```
CreateBusinessModal Submit
    ↓
handleSubmit(formData)
    ↓
adminApi.createBusiness(formData)
    ↓
POST /api/admin/businesses
    ↓
admin.controller.js → createBusiness()
    ↓
Check if username/email exists
    ↓
User.create({
  username, password (hashed), email, fullName, role: 'business'
})
    ↓
Business.create({
  name: businessName, slug (auto-generated), category, owner: user._id
})
    ↓
AuditLog.create({ action: 'business_created', ... })
    ↓
Return { success: true, data: { business, credentials } }
    ↓
Show credentials modal
    ↓
Close modal after 3 seconds
    ↓
Refresh business list
```

**Files:**
- Frontend: `src/pages/AdminPage.tsx` → `CreateBusinessModal`
- API Client: `src/lib/api.ts` → `adminApi.createBusiness()`
- Backend Route: `backend/routes/admin.js` → `POST /businesses`
- Backend Models: `User.js`, `Business.js`, `AuditLog.js`

**Security:**
- Admin-only endpoint
- Password hashed with bcrypt
- Credentials shown only once
- Audit log entry created

---

## Public Redirect Flow

### NFC/QR Redirect

**Frontend:** `src/pages/RedirectPage.tsx` (fallback only)

**User Action:**
1. Customer taps NFC card or scans QR
2. Phone opens URL: `https://domain.com/s/JOCK-A7F92K`

**Backend Flow (Primary):**
```
NFC/QR Tap
    ↓
Browser opens: https://domain.com/s/JOCK-A7F92K
    ↓
Backend route: GET /s/:publicCardId
    ↓
redirect.controller.js → redirect()
    ↓
NfcCard.findOne({ publicCardId, status: 'active' })
    ↓
Check business.status === 'active'
    ↓
Get destinationUrl
    ↓
Record scan event (async)
    ↓
Return 302 redirect to destinationUrl
    ↓
Browser redirects to destination
```

**Frontend Flow (Fallback):**
```
If backend redirect fails:
    ↓
RedirectPage.tsx loads
    ↓
Show loading state
    ↓
Wait 3 seconds
    ↓
Navigate to / (homepage)
```

**Files:**
- Backend Route: `backend/routes/redirect.js` → `GET /s/:publicCardId`
- Backend Controller: `backend/controllers/redirect.controller.js`
- Backend Model: `NfcCard.js`, `ScanEvent.js`
- Frontend Fallback: `src/pages/RedirectPage.tsx`

**Performance:**
- Target: <100ms redirect time
- Cache: In-memory cache (Redis in Phase 5)
- Async: Scan recording doesn't block redirect

---

## Route Protection Flow

### Protected Routes

**Frontend:** `src/components/ProtectedRoute.tsx`

**Flow:**
```
User navigates to /dashboard
    ↓
ProtectedRoute checks:
  - isAuthenticated?
  - requiredRole === 'business'?
    ↓
If not authenticated:
  → Navigate to /login
    ↓
If authenticated but wrong role:
  → Navigate to appropriate dashboard
    ↓
If all checks pass:
  → Render children (DashboardPage)
```

**Files:**
- Frontend: `src/components/ProtectedRoute.tsx`
- Context: `src/context/AuthContext.tsx`

**Routes Protected:**
- `/dashboard` → requires 'business' role
- `/admin` → requires 'admin' role

---

## API Client Architecture

### Centralized API Layer

**File:** `src/lib/api.ts`

**Structure:**
```typescript
// Base fetch wrapper
async function fetchApi<T>(endpoint, options): Promise<T>

// API modules
export const authApi = {
  login, logout, getMe
}

export const businessApi = {
  getMyBusiness, updateMyBusiness,
  getMyCards, updateCardDestination
}

export const adminApi = {
  getStats, getBusinesses, createBusiness,
  getCards, createCard, assignCard
}

export const analyticsApi = {
  getOverview
}
```

**Features:**
- Centralized error handling
- Automatic cookie inclusion (`credentials: 'include'`)
- TypeScript types for all responses
- Custom ApiError class
- Network error handling

---

## Authentication State Management

### AuthContext

**File:** `src/context/AuthContext.tsx`

**State:**
```typescript
{
  user: User | null,
  loading: boolean,
  isAuthenticated: boolean,
  isAdmin: boolean,
  isBusiness: boolean
}
```

**Functions:**
```typescript
login(username, password): Promise<void>
logout(): Promise<void>
checkAuth(): Promise<void>
```

**Flow:**
```
App mounts
    ↓
AuthProvider wraps app
    ↓
checkAuth() called
    ↓
GET /api/auth/me
    ↓
If valid cookie:
  → Set user state
  → isAuthenticated = true
    ↓
If invalid/no cookie:
  → user = null
  → isAuthenticated = false
```

**Usage:**
```typescript
const { user, isAuthenticated, isAdmin, login, logout } = useAuth();
```

---

## Summary Table

| Page | API Endpoint | Method | Auth | Role | Data |
|------|--------------|--------|------|------|------|
| Login | `/api/auth/login` | POST | No | - | Token + User |
| Logout | `/api/auth/logout` | POST | Yes | - | - |
| Dashboard Overview | `/api/businesses/my` | GET | Yes | Business | Business |
| Dashboard Overview | `/api/businesses/my/cards` | GET | Yes | Business | Cards |
| Dashboard Overview | `/api/analytics/overview` | GET | Yes | Business | Stats |
| My Cards | `/api/businesses/my/cards` | GET | Yes | Business | Cards |
| Edit Destination | `/api/businesses/cards/:id/destination` | PUT | Yes | Business | Card |
| Admin Overview | `/api/admin/stats` | GET | Yes | Admin | Stats |
| Admin Overview | `/api/admin/businesses` | GET | Yes | Admin | Businesses |
| Business List | `/api/admin/businesses` | GET | Yes | Admin | Businesses |
| Create Business | `/api/admin/businesses` | POST | Yes | Admin | Business |
| NFC Redirect | `/s/:publicCardId` | GET | No | - | Redirect |

---

## Error Handling

### Frontend Error Handling

**API Errors:**
```typescript
try {
  const response = await businessApi.getMyCards();
  // Handle success
} catch (err) {
  if (err instanceof ApiError) {
    setError(err.message); // Show user-friendly message
  } else {
    setError('An unexpected error occurred');
  }
}
```

**Error Types:**
- `NETWORK_ERROR` - No internet connection
- `UNAUTHORIZED` - Not logged in
- `FORBIDDEN` - Wrong role
- `VALIDATION_ERROR` - Invalid input
- `NOT_FOUND` - Resource doesn't exist
- `SERVER_ERROR` - Backend error

### Backend Error Handling

**Error Response Format:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": {}
  }
}
```

**Error Codes:**
- `INVALID_CREDENTIALS` - Wrong username/password
- `UNAUTHORIZED` - Not authenticated
- `FORBIDDEN` - Wrong role/ownership
- `VALIDATION_ERROR` - Invalid input data
- `NOT_FOUND` - Resource not found
- `CARD_NOT_FOUND` - Card doesn't exist
- `BUSINESS_NOT_FOUND` - Business doesn't exist
- `INVALID_URL` - Malicious/invalid URL

---

## Security Measures

### Frontend Security

1. **No JWT in localStorage** - Using HttpOnly cookies
2. **Route protection** - ProtectedRoute component
3. **Role checking** - Frontend guards (UX only)
4. **Input validation** - Basic client-side validation
5. **Error sanitization** - No stack traces shown

### Backend Security

1. **JWT authentication** - Secure token-based auth
2. **HttpOnly cookies** - Tokens not accessible via JS
3. **Role middleware** - Enforces admin/business roles
4. **Ownership verification** - Checks resource ownership
5. **Input validation** - Joi validation on all inputs
6. **URL validation** - Prevents malicious redirects
7. **Rate limiting** - Prevents brute force attacks
8. **Audit logging** - Tracks all admin actions

---

## Next Steps

1. ✅ API client created
2. ✅ Auth context implemented
3. ✅ Login page connected
4. ✅ Dashboard connected
5. ✅ Admin panel connected
6. ✅ Route protection added
7. ✅ Mock data removed
8. ⏳ Test all flows end-to-end
9. ⏳ Add loading states
10. ⏳ Add error states
11. ⏳ Add empty states
12. ⏳ Test on mobile devices

---

**Document Status:** COMPLETE  
**Implementation Status:** Phase 1 Frontend-Backend Integration Complete
