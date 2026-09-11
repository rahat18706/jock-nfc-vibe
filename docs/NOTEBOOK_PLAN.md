# JOCK NFC - Technical Notebook Plan

**Last Updated:** 2024  
**Purpose:** Simple reference guide for development

---

## 📦 PRODUCT

**What am I selling?**

NFC + QR smart review cards for businesses.

**Value Proposition:**
- Businesses get physical cards
- Customers tap/scan → leave Google review
- Business can change destination URL anytime
- No need to replace physical card

**Target Customers:**
- Restaurants
- Cafes
- Salons
- Retail shops
- Service businesses

---

## 👥 USERS

### 1. Visitor (Public)
- Taps NFC or scans QR
- Gets redirected to review page
- No account needed
- Anonymous

### 2. Business Owner (Authenticated)
- Logs in with credentials
- Views dashboard
- Manages cards
- Changes destination URLs
- Views analytics

### 3. Admin (Authenticated + Admin Role)
- Full system access
- Creates businesses
- Manages cards
- Views all analytics
- System configuration

---

## 🔄 CORE FLOW

### NFC/QR Tap Flow

```
Customer taps card
        ↓
Card has publicCardId (e.g., JOCK-A7F92K)
        ↓
Phone opens: https://tapreview.com/s/JOCK-A7F92K
        ↓
Backend receives request
        ↓
Lookup card by publicCardId
        ↓
Check card status (must be ACTIVE)
        ↓
Check business status (must be ACTIVE)
        ↓
Get destinationUrl
        ↓
Redirect (302) to destinationUrl
        ↓
Customer lands on Google review page
        ↓
Customer leaves review
```

**Performance Target:** <100ms total

---

## 💼 BUSINESS FLOW

### Onboarding Flow

```
Admin creates business
        ↓
Admin creates login credentials
        ↓
Admin shares credentials with business
        ↓
Business logs in
        ↓
Business sees dashboard (empty)
        ↓
Admin assigns cards to business
        ↓
Business sees cards in dashboard
        ↓
Business sets destination URLs
        ↓
Cards are ready to use
```

### Daily Operations

```
Business logs in
        ↓
Views dashboard (scans, cards)
        ↓
Changes destination URL if needed
        ↓
Views analytics
        ↓
Logs out
```

---

## 🗄️ DATABASE

### Core Models (Phase 1)

#### 1. User
```javascript
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  fullName: String,
  role: 'admin' | 'business',
  businessId: ObjectId | null,
  isActive: Boolean,
  lastLoginAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### 2. Business
```javascript
{
  _id: ObjectId,
  name: String,
  slug: String (unique, auto-generated),
  category: String,
  description: String,
  ownerId: ObjectId (→ User),
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  phone: String,
  website: String,
  logo: String (URL),
  cardCount: Number,
  cardLimit: Number,
  totalScans: Number,
  status: 'active' | 'suspended',
  plan: 'free' | 'starter' | 'professional' | 'enterprise',
  createdAt: Date,
  updatedAt: Date
}
```

#### 3. NfcCard
```javascript
{
  _id: ObjectId,
  publicCardId: String (unique, e.g., "JOCK-A7F92K"),
  label: String,
  businessId: ObjectId | null (→ Business),
  destinationUrl: String | null,
  status: 'unassigned' | 'active' | 'suspended' | 'retired',
  type: 'nfc' | 'qr' | 'both',
  physicalCard: {
    serialNumber: String,
    manufacturingDate: Date
  },
  totalScans: Number,
  todayScans: Number,
  weekScans: Number,
  monthScans: Number,
  lastScannedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### 4. ScanEvent (Phase 3)
```javascript
{
  _id: ObjectId,
  cardId: ObjectId (→ NfcCard),
  businessId: ObjectId (→ Business),
  timestamp: Date,
  device: 'mobile' | 'tablet' | 'desktop',
  os: String,
  browser: String,
  visitorHash: String (privacy-safe ID),
  isUniqueVisitor: Boolean,
  source: 'nfc' | 'qr' | 'direct',
  location: {
    country: String,
    city: String
  },
  createdAt: Date
}
```

#### 5. AuditLog
```javascript
{
  _id: ObjectId,
  action: String,
  userId: ObjectId (→ User),
  targetType: 'business' | 'card' | 'user',
  targetId: ObjectId,
  details: Object,
  previousValues: Object,
  newValues: Object,
  ipAddress: String,
  userAgent: String,
  success: Boolean,
  timestamp: Date
}
```

---

## 🔐 AUTH

### Visitor
- **No authentication**
- Public access to `/s/:publicCardId`

### Business
- **Authentication required**
- Login with username + password
- JWT token (7 day expiry)
- HttpOnly cookie
- Can ONLY access own data

### Admin
- **Authentication + Admin role required**
- Login with username + password
- JWT token (7 day expiry)
- HttpOnly cookie
- Can access ALL data

---

## 🔒 OWNERSHIP

### Business → Cards
```
Business can ONLY:
✓ View own cards
✓ Update own cards
✓ Change own card destinations
✓ View own analytics

Business CANNOT:
✗ View other business cards
✗ Update other business cards
✗ Change card ownership
✗ Delete cards
✗ Access admin routes
```

### Admin → Everything
```
Admin can:
✓ Create businesses
✓ Create cards
✓ Assign cards to businesses
✓ Suspend businesses
✓ Suspend cards
✓ View all data
✓ Reset passwords
```

---

## 🗺️ API MAP

### Public Endpoints

| Page | Method | Endpoint | Auth | Data |
|------|--------|----------|------|------|
| NFC Tap | GET | `/s/:publicCardId` | No | Redirect to destination |

### Business Endpoints

| Page | Method | Endpoint | Auth | Data |
|------|--------|----------|------|------|
| Login | POST | `/api/auth/login` | No | Token |
| Logout | POST | `/api/auth/logout` | Yes | - |
| Dashboard | GET | `/api/business/profile` | Yes | Business data |
| My Cards | GET | `/api/business/cards` | Yes | Cards array |
| Card Detail | GET | `/api/business/cards/:id` | Yes | Card data |
| Update Card | PATCH | `/api/business/cards/:id` | Yes | Updated card |
| Analytics | GET | `/api/business/analytics/overview` | Yes | Stats |

### Admin Endpoints

| Page | Method | Endpoint | Auth | Data |
|------|--------|----------|------|------|
| Login | POST | `/api/auth/login` | No | Token |
| List Businesses | GET | `/api/admin/businesses` | Admin | Businesses array |
| Create Business | POST | `/api/admin/businesses` | Admin | New business |
| Update Business | PUT | `/api/admin/businesses/:id` | Admin | Updated business |
| Suspend Business | PATCH | `/api/admin/businesses/:id/suspend` | Admin | Status |
| List Cards | GET | `/api/admin/cards` | Admin | Cards array |
| Create Card | POST | `/api/admin/cards` | Admin | New card |
| Assign Card | POST | `/api/admin/cards/:id/assign` | Admin | Assigned card |
| Unassign Card | POST | `/api/admin/cards/:id/unassign` | Admin | Unassigned card |
| Update Card Status | PATCH | `/api/admin/cards/:id/status` | Admin | Status |

---

## 🎴 CARD LIFECYCLE

```
┌─────────────┐
│ UNASSIGNED  │ ← Admin creates card
└──────┬──────┘
       │
       │ Admin assigns to business
       │
       ▼
┌─────────────┐
│   ACTIVE    │ ← Card is in use
└──────┬──────┘
       │
       ├──────────────────┐
       │                  │
       │ Admin suspends   │ Admin retires
       │                  │
       ▼                  ▼
┌─────────────┐    ┌─────────────┐
│  SUSPENDED  │    │   RETIRED   │
└──────┬──────┘    └─────────────┘
       │
       │ Admin reactivates
       │
       ▼
┌─────────────┐
│   ACTIVE    │
└─────────────┘
```

**Status Transitions:**
- `unassigned` → `active` (assign)
- `active` → `suspended` (suspend)
- `active` → `retired` (retire)
- `active` → `unassigned` (unassign)
- `suspended` → `active` (activate)
- `suspended` → `retired` (retire)

**Cannot:**
- `retired` → any (permanent)
- `unassigned` → `suspended` (must be assigned first)

---

## 📦 ORDER LIFECYCLE (Phase 4)

```
┌─────────┐
│ PENDING │ ← Customer places order
└────┬────┘
     │
     │ Payment confirmed
     │
     ▼
┌───────────┐
│ CONFIRMED │ ← Payment received
└────┬──────┘
     │
     │ Cards prepared
     │
     ▼
┌────────────┐
│ PROCESSING │ ← Preparing shipment
└────┬───────┘
     │
     │ Shipped
     │
     ▼
┌──────────┐
│ SHIPPED  │ ← In transit
└────┬─────┘
     │
     │ Delivered
     │
     ▼
┌───────────┐
│ DELIVERED │ ← Customer received
└───────────┘
```

**Special States:**
- `CANCELLED` - Order cancelled
- `REFUNDED` - Payment refunded

---

## 🔮 FUTURE (Not in Phase 1)

### Phase 2 - Business Operations
- Email notifications
- Support ticket system
- Password reset flow
- Bulk card operations
- Card labels/locations

### Phase 3 - Analytics
- ScanEvent tracking
- Dashboard charts
- Device breakdown
- Geographic data
- Peak hours analysis

### Phase 4 - Orders/Payments
- Product catalog
- Shopping cart
- Payment gateway (SSLCommerz/Stripe)
- Order management
- Shipping tracking

### Phase 5 - Scale
- Redis caching
- Background jobs (BullMQ)
- Read replicas
- CDN optimization
- API rate limiting tiers

### Phase 6 - Advanced
- White-label options
- Multi-language support
- Advanced analytics
- Custom integrations
- Mobile app

---

## 📝 IMPORTANT NOTES

### Security Rules

1. **Backend owns business logic**
   - Frontend NEVER makes authorization decisions
   - All validation happens on backend

2. **Ownership verification**
   - Business can ONLY access own cards
   - Check `card.businessId === business._id`
   - Check `business.ownerId === user._id`

3. **Never expose internal IDs**
   - Use `publicCardId` for NFC/QR
   - Don't leak MongoDB `_id` in URLs

4. **Validate everything**
   - URLs must be HTTP/HTTPS only
   - No javascript:, data:, file: protocols
   - Sanitize all inputs

### Performance Rules

1. **NFC redirect must be fast**
   - Target: <100ms
   - Use indexes
   - Cache if needed (Phase 5)
   - Don't block on analytics

2. **Database queries**
   - Use indexes
   - Select only needed fields
   - Use lean() for read-only
   - Paginate large lists

3. **Frontend**
   - Lazy load images
   - Code splitting
   - Cache API responses
   - Optimize bundle size

### Code Organization

```
backend/
├── src/
│   ├── config/          # Database, env, logger
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth, validation, error
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API endpoints
│   ├── services/        # Business logic
│   ├── validators/      # Joi schemas
│   └── utils/           # Helpers
├── tests/               # Test files
└── docs/                # Documentation

frontend/
├── src/
│   ├── components/      # Reusable UI
│   ├── pages/           # Route pages
│   ├── services/        # API calls
│   ├── hooks/           # Custom hooks
│   ├── utils/           # Helpers
│   └── styles/          # CSS
└── public/              # Static assets
```

---

## ✅ PHASE 1 CHECKLIST

### Database
- [ ] User model with authentication
- [ ] Business model with owner reference
- [ ] NfcCard model with status enum
- [ ] AuditLog model
- [ ] Proper indexes
- [ ] Connection pooling

### Authentication
- [ ] Login endpoint
- [ ] Logout endpoint
- [ ] JWT token generation
- [ ] HttpOnly cookies
- [ ] Password hashing (bcrypt)
- [ ] Account lockout

### Admin Features
- [ ] Create business
- [ ] List businesses
- [ ] Update business
- [ ] Suspend business
- [ ] Create card
- [ ] List cards
- [ ] Assign card to business
- [ ] Unassign card
- [ ] Update card status
- [ ] Reset business password

### Business Features
- [ ] Login
- [ ] View profile
- [ ] Update profile
- [ ] List own cards
- [ ] View card detail
- [ ] Update card destination
- [ ] View basic analytics

### Public Features
- [ ] NFC redirect endpoint
- [ ] QR redirect endpoint
- [ ] Card lookup
- [ ] Status validation
- [ ] Fast redirect (<100ms)

### Security
- [ ] Ownership verification
- [ ] Role-based access control
- [ ] Input validation
- [ ] URL validation
- [ ] Rate limiting
- [ ] CORS configuration
- [ ] Helmet headers
- [ ] Audit logging

### Frontend
- [ ] Login page
- [ ] Admin dashboard
- [ ] Business dashboard
- [ ] Card management UI
- [ ] API integration
- [ ] Error handling

### Testing
- [ ] Admin login test
- [ ] Business login test
- [ ] Card assignment test
- [ ] Ownership verification test
- [ ] NFC redirect test
- [ ] Suspended card test

### Documentation
- [ ] API contract
- [ ] Architecture doc
- [ ] Database schema
- [ ] Deployment guide
- [ ] User guide

---

## 🚀 DEPLOYMENT CHECKLIST

### Pre-Deployment
- [ ] All tests passing
- [ ] Environment variables set
- [ ] Database backups configured
- [ ] SSL certificates ready
- [ ] Domain DNS configured

### Deployment
- [ ] Backend deployed
- [ ] Frontend deployed
- [ ] Database migrated
- [ ] Environment variables configured
- [ ] SSL enabled
- [ ] Monitoring enabled

### Post-Deployment
- [ ] Smoke tests passing
- [ ] NFC redirect working
- [ ] Login working
- [ ] Admin can create business
- [ ] Business can login
- [ ] Business can update card
- [ ] Monitoring alerts configured

---

## 📞 QUICK REFERENCE

### Common Commands

```bash
# Backend
cd backend
npm install          # Install dependencies
npm run dev          # Start dev server
npm start            # Start production
npm test             # Run tests

# Frontend
cd frontend
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Start production

# Database
mongosh              # Connect to MongoDB
npm run seed         # Seed database
```

### Common URLs

```
Backend API:     http://localhost:5000/api
Frontend:        http://localhost:3000
MongoDB Atlas:   https://cloud.mongodb.com/
```

### Common Issues

**Problem:** Can't connect to database
**Solution:** Check MONGODB_URI in .env, verify IP whitelist

**Problem:** Login fails
**Solution:** Check username/password, verify user is active

**Problem:** Card redirect fails
**Solution:** Check card status, business status, destinationUrl

**Problem:** Business can't access card
**Solution:** Verify card.businessId === business._id

---

## 📚 LEARNING RESOURCES

### MongoDB
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB University](https://university.mongodb.com/)

### Express.js
- [Express Guide](https://expressjs.com/en/guide/routing.html)
- [Express Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)

### JWT Authentication
- [JWT.io](https://jwt.io/)
- [Passport.js](http://www.passportjs.org/)

### Security
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Helmet.js](https://helmetjs.github.io/)

### Performance
- [Node.js Performance Tips](https://nodejs.org/en/docs/guides/dont-block-the-event-loop/)
- [MongoDB Performance](https://www.mongodb.com/docs/manual/administration/analyzing-mongodb-performance/)

---

**Remember:**
- Start simple
- Build incrementally
- Test everything
- Document as you go
- Security first
- Performance matters

**Good luck! 🚀**
