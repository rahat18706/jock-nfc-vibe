# System Architecture - Phase 1

**Version:** 1.0  
**Status:** PROPOSED  
**Last Updated:** 2024

---

## Table of Contents

1. [Overview](#overview)
2. [System Architecture Diagram](#system-architecture-diagram)
3. [Technology Stack](#technology-stack)
4. [Database Architecture](#database-architecture)
5. [Application Layers](#application-layers)
6. [Security Architecture](#security-architecture)
7. [Performance Considerations](#performance-considerations)
8. [Scalability Strategy](#scalability-strategy)

---

## Overview

TapReview is a B2B SaaS platform that provides NFC and QR code cards to businesses for collecting Google reviews. The system consists of:

- **Backend API** - Node.js/Express.js REST API
- **Database** - MongoDB Atlas (cloud-hosted)
- **Frontend** - React/Next.js web application
- **Public Redirect Service** - Fast NFC/QR redirect endpoint

### Key Principles

1. **Backend owns business logic** - Frontend never makes authorization decisions
2. **API-first design** - Frontend consumes backend APIs
3. **Security by default** - Authentication, authorization, validation at every layer
4. **Performance-critical redirect** - NFC redirect must be <100ms
5. **Audit everything** - All admin actions logged

---

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTS                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ Admin Panel  │  │ Business     │  │ Public Visitors      │  │
│  │ (React/Next) │  │ Dashboard    │  │ (NFC/QR Scanners)    │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘  │
│         │                 │                      │               │
└─────────┼─────────────────┼──────────────────────┼───────────────┘
          │                 │                      │
          │ HTTPS           │ HTTPS                │ HTTPS
          │                 │                      │
┌─────────┼─────────────────┼──────────────────────┼───────────────┐
│         ▼                 ▼                      ▼               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              API GATEWAY / LOAD BALANCER                │   │
│  │              (Cloudflare / Nginx / AWS ALB)             │   │
│  └────────────────────────┬────────────────────────────────┘   │
│                           │                                     │
│  ┌────────────────────────▼────────────────────────────────┐   │
│  │                  BACKEND API SERVER                     │   │
│  │                  (Node.js + Express.js)                 │   │
│  │                                                          │   │
│  │  ┌──────────────────────────────────────────────────┐  │   │
│  │  │              MIDDLEWARE LAYER                     │  │   │
│  │  │  • CORS           • Rate Limiting                 │  │   │
│  │  │  • Helmet         • Request Logging              │  │   │
│  │  │  • Auth (JWT)     • Error Handling               │  │   │
│  │  │  • Validation     • Ownership Verification       │  │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  │                                                          │   │
│  │  ┌──────────────────────────────────────────────────┐  │   │
│  │  │              CONTROLLER LAYER                     │  │   │
│  │  │  • Auth Controller                                │  │   │
│  │  │  • Admin Business Controller                      │  │   │
│  │  │  • Admin Card Controller                          │  │   │
│  │  │  • Business Controller                            │  │   │
│  │  │  • Business Card Controller                       │  │   │
│  │  │  • Redirect Controller                            │  │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  │                                                          │   │
│  │  ┌──────────────────────────────────────────────────┐  │   │
│  │  │               SERVICE LAYER                       │  │   │
│  │  │  • Auth Service                                   │  │   │
│  │  │  • Business Service                               │  │   │
│  │  │  • Card Service                                   │  │   │
│  │  │  • Redirect Service                               │  │   │
│  │  │  • Analytics Service                              │  │   │
│  │  │  • Audit Service                                  │  │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  │                                                          │   │
│  │  ┌──────────────────────────────────────────────────┐  │   │
│  │  │                MODEL LAYER                        │  │   │
│  │  │  • User Model                                     │  │   │
│  │  │  • Business Model                                 │  │   │
│  │  │  • NfcCard Model                                  │  │   │
│  │  │  • ScanEvent Model                                │  │   │
│  │  │  • AuditLog Model                                 │  │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  └────────────────────────┬────────────────────────────────┘   │
│                           │                                     │
│                           │ Mongoose ODM                        │
│                           │                                     │
│  ┌────────────────────────▼────────────────────────────────┐   │
│  │              DATABASE LAYER (MongoDB Atlas)             │   │
│  │                                                          │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────────┐   │   │
│  │  │   Users    │  │ Businesses │  │   NfcCards     │   │   │
│  │  │ Collection │  │ Collection │  │  Collection    │   │   │
│  │  └────────────┘  └────────────┘  └────────────────┘   │   │
│  │                                                          │   │
│  │  ┌────────────────┐  ┌────────────────────────────┐   │   │
│  │  │  ScanEvents    │  │      AuditLogs             │   │   │
│  │  │  Collection    │  │      Collection            │   │   │
│  │  └────────────────┘  └────────────────────────────┘   │   │
│  │                                                          │   │
│  │  • Automatic backups (PITR)                             │   │
│  │  • Read replicas (Phase 5)                              │   │
│  │  • Sharding (Phase 5+)                                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│                    BACKEND SERVER CLUSTER                        │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                      EXTERNAL SERVICES                           │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ Email        │  │ Payment      │  │ CDN / Static         │  │
│  │ Service      │  │ Gateway      │  │ Assets               │  │
│  │ (Phase 2)    │  │ (Phase 4)    │  │ (Cloudflare/S3)      │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Backend

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Runtime | Node.js | 18+ | JavaScript runtime |
| Framework | Express.js | 4.18+ | HTTP server & routing |
| Database | MongoDB Atlas | 7.0+ | NoSQL database |
| ODM | Mongoose | 8.0+ | MongoDB object modeling |
| Auth | JWT + bcryptjs | - | Authentication & password hashing |
| Validation | Joi | 17+ | Request validation |
| Security | Helmet | 7+ | HTTP security headers |
| Rate Limiting | express-rate-limit | 7+ | API rate limiting |
| Logging | Winston | 3+ | Structured logging |
| Sanitization | express-mongo-sanitize | 2+ | NoSQL injection prevention |

### Frontend (Phase 1)

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Framework | React | 18+ | UI library |
| Build Tool | Vite | 5+ | Fast build tool |
| Styling | Tailwind CSS | 3+ | Utility-first CSS |
| Routing | React Router | 6+ | Client-side routing |
| HTTP Client | Axios or Fetch | - | API calls |
| State | React Context + Hooks | - | State management |
| Animations | Framer Motion | 10+ | UI animations |
| Icons | Lucide React | 0.294+ | Icon library |

### Infrastructure

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Hosting | Vercel / Railway / AWS | Application hosting |
| Database | MongoDB Atlas | Managed MongoDB |
| CDN | Cloudflare | Static assets & DDoS protection |
| DNS | Cloudflare / Route53 | Domain management |
| SSL/TLS | Let's Encrypt / Cloudflare | HTTPS encryption |
| Monitoring | Sentry / DataDog | Error tracking & APM |
| Logging | Winston + CloudWatch | Centralized logging |

---

## Database Architecture

### Entity Relationship Diagram

```
┌─────────────────┐
│     Users       │
├─────────────────┤
│ _id (PK)        │
│ username        │◄───────┐
│ email           │        │
│ password (hash) │        │
│ fullName        │        │
│ role            │        │
│ isActive        │        │
│ businessId      │────────┼──────┐
│ createdBy       │        │      │
│ lastLoginAt     │        │      │
│ createdAt       │        │      │
│ updatedAt       │        │      │
└─────────────────┘        │      │
                           │      │
                           │      │
┌─────────────────┐        │      │
│   Businesses    │        │      │
├─────────────────┤        │      │
│ _id (PK)        │◄───────┼──────┘
│ name            │        │
│ slug            │        │
│ category        │        │
│ description     │        │
│ ownerId (FK)    │────────┘
│ address         │
│ phone           │
│ website         │
│ logo            │
│ cardCount       │
│ cardLimit       │
│ totalScans      │
│ status          │
│ plan            │
│ createdAt       │
│ updatedAt       │
└─────────────────┘
         │
         │
         │ 1:N
         │
┌─────────────────┐
│    NfcCards     │
├─────────────────┤
│ _id (PK)        │
│ publicCardId    │◄──── Public NFC/QR identifier
│ label           │
│ businessId (FK) │────────┘
│ destinationUrl  │
│ status          │
│ type            │
│ physicalCard    │
│ totalScans      │
│ todayScans      │
│ weekScans       │
│ monthScans      │
│ lastScannedAt   │
│ createdAt       │
│ updatedAt       │
└─────────────────┘
         │
         │
         │ 1:N
         │
┌─────────────────┐
│   ScanEvents    │
├─────────────────┤
│ _id (PK)        │
│ cardId (FK)     │────────┘
│ businessId (FK) │
│ timestamp       │
│ device          │
│ os              │
│ browser         │
│ visitorHash     │
│ isUniqueVisitor │
│ source          │
│ location        │
│ createdAt       │
└─────────────────┘

┌─────────────────┐
│   AuditLogs     │
├─────────────────┤
│ _id (PK)        │
│ action          │
│ userId (FK)     │
│ targetType      │
│ targetId        │
│ details         │
│ previousValues  │
│ newValues       │
│ ipAddress       │
│ userAgent       │
│ success         │
│ timestamp       │
└─────────────────┘
```

### Relationships

1. **User → Business** (1:1 or 1:0)
   - A user can own 0 or 1 business
   - `User.businessId` references `Business._id`
   - Admin users have `businessId = null`

2. **Business → NfcCard** (1:N)
   - A business can have 0 to N cards
   - `NfcCard.businessId` references `Business._id`
   - Cards can be unassigned (`businessId = null`)

3. **NfcCard → ScanEvent** (1:N)
   - A card can have 0 to N scan events
   - `ScanEvent.cardId` references `NfcCard._id`
   - Scan events are immutable (append-only)

4. **Business → ScanEvent** (1:N)
   - Denormalized for query performance
   - `ScanEvent.businessId` references `Business._id`

5. **User → AuditLog** (1:N)
   - A user can have 0 to N audit log entries
   - `AuditLog.userId` references `User._id`

### Indexes

#### Users Collection
```javascript
{ username: 1 }              // Unique, login lookup
{ email: 1 }                 // Unique, login lookup
{ businessId: 1 }            // Find user by business
{ role: 1, isActive: 1 }     // Admin queries
```

#### Businesses Collection
```javascript
{ slug: 1 }                  // Unique, public URL lookup
{ ownerId: 1 }               // Find business by owner
{ status: 1 }                // Filter by status
{ plan: 1 }                  // Filter by plan
{ createdAt: -1 }            // Sort by creation date
```

#### NfcCards Collection
```javascript
{ publicCardId: 1 }          // Unique, NFC redirect lookup (CRITICAL)
{ businessId: 1, status: 1 } // Find cards by business
{ status: 1 }                // Filter by status
{ createdAt: -1 }            // Sort by creation date
```

#### ScanEvents Collection
```javascript
{ cardId: 1, timestamp: -1 }         // Card analytics
{ businessId: 1, timestamp: -1 }     // Business analytics
{ timestamp: -1 }                    // Time-based queries
{ visitorHash: 1, cardId: 1 }        // Unique visitor detection
{ timestamp: 1 } (TTL: 90 days)      // Auto-delete old events
```

#### AuditLogs Collection
```javascript
{ userId: 1, timestamp: -1 }         // User activity
{ action: 1, timestamp: -1 }         // Action filtering
{ targetType: 1, targetId: 1 }       // Target lookups
{ timestamp: -1 }                    // Time-based queries
{ timestamp: 1 } (TTL: 365 days)     // Auto-delete (GDPR)
```

---

## Application Layers

### 1. Middleware Layer

Handles cross-cutting concerns before requests reach controllers.

**Responsibilities:**
- CORS configuration
- Rate limiting
- Authentication (JWT verification)
- Authorization (role checking)
- Request validation
- Request logging
- Error handling
- Security headers

**Key Middleware:**

```javascript
// Authentication
authMiddleware → Verifies JWT token, attaches user to request

// Authorization
roleMiddleware('admin') → Checks if user has admin role
ownershipMiddleware → Verifies resource ownership

// Validation
validate(schema) → Validates request body against Joi schema

// Rate Limiting
rateLimit({ window: 15min, max: 100 }) → Limits requests per IP

// Logging
requestLogger → Logs all incoming requests
errorLogger → Logs all errors
```

### 2. Controller Layer

Handles HTTP request/response logic.

**Responsibilities:**
- Parse request parameters
- Call service layer
- Format response
- Handle HTTP-specific errors
- Set appropriate status codes

**Example:**

```javascript
// controllers/businessCard.controller.js
exports.updateCardDestination = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const { destinationUrl } = req.body;
    const userId = req.user.id;

    // Call service
    const card = await cardService.updateDestination(
      cardId, 
      destinationUrl, 
      userId
    );

    // Log audit
    await auditService.log({
      action: 'destination_changed',
      userId,
      targetType: 'card',
      targetId: cardId,
      newValues: { destinationUrl }
    });

    // Return response
    res.json({
      success: true,
      data: { card }
    });
  } catch (error) {
    next(error);
  }
};
```

### 3. Service Layer

Contains business logic and orchestration.

**Responsibilities:**
- Implement business rules
- Coordinate multiple models
- Handle transactions
- Enforce ownership
- Return domain objects

**Example:**

```javascript
// services/card.service.js
exports.updateDestination = async (cardId, destinationUrl, userId) => {
  // 1. Find card
  const card = await NfcCard.findById(cardId);
  if (!card) {
    throw new AppError('Card not found', 404, 'CARD_NOT_FOUND');
  }

  // 2. Verify ownership
  const business = await Business.findById(card.businessId);
  if (!business || business.ownerId.toString() !== userId) {
    throw new AppError('Forbidden', 403, 'FORBIDDEN');
  }

  // 3. Validate URL
  if (!isValidDestinationUrl(destinationUrl)) {
    throw new AppError('Invalid URL', 400, 'INVALID_URL');
  }

  // 4. Update card
  card.destinationUrl = destinationUrl;
  await card.save();

  // 5. Invalidate cache (if using Redis)
  await cardCache.invalidate(card.publicCardId);

  return card;
};
```

### 4. Model Layer

Defines data structure and database interactions.

**Responsibilities:**
- Define schema
- Add validation
- Add indexes
- Define instance methods
- Define static methods
- Add virtual fields

**Example:**

```javascript
// models/NfcCard.js
const nfcCardSchema = new mongoose.Schema({
  publicCardId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    default: null
  },
  destinationUrl: {
    type: String,
    validate: {
      validator: isValidUrl,
      message: 'Invalid destination URL'
    }
  },
  status: {
    type: String,
    enum: ['unassigned', 'active', 'suspended', 'retired'],
    default: 'unassigned'
  }
}, {
  timestamps: true
});

// Indexes
nfcCardSchema.index({ publicCardId: 1 });
nfcCardSchema.index({ businessId: 1, status: 1 });

// Instance methods
nfcCardSchema.methods.isActive = function() {
  return this.status === 'active';
};

// Static methods
nfcCardSchema.statics.findByPublicId = function(publicCardId) {
  return this.findOne({ publicCardId, status: 'active' });
};
```

---

## Security Architecture

### Authentication Flow

```
┌─────────┐
│ Client  │
└────┬────┘
     │
     │ 1. POST /auth/login
     │    { username, password }
     │
     ▼
┌─────────────────┐
│ Auth Controller │
└────┬────────────┘
     │
     │ 2. Validate credentials
     │
     ▼
┌─────────────┐
│ User Model  │
└────┬────────┘
     │
     │ 3. Compare password hash
     │
     ▼
┌─────────────────┐
│ Generate JWT    │
│ { userId, role }│
└────┬────────────┘
     │
     │ 4. Return token
     │
     ▼
┌─────────┐
│ Client  │
└────┬────┘
     │
     │ 5. Store token
     │    (localStorage + cookie)
     │
     │ 6. Subsequent requests
     │    Authorization: Bearer <token>
     │
     ▼
┌──────────────────┐
│ Auth Middleware  │
└────┬─────────────┘
     │
     │ 7. Verify JWT
     │
     ▼
┌──────────────────┐
│ Attach user to   │
│ req.user         │
└──────────────────┘
```

### Authorization Flow

```
┌─────────┐
│ Request │
│ GET     │
│ /business/cards/:id
└────┬────┘
     │
     │ 1. Auth middleware
     │    Verify JWT
     │    Attach req.user
     │
     ▼
┌──────────────────┐
│ Role Middleware  │
│ businessOnly()   │
└────┬─────────────┘
     │
     │ 2. Check role === 'business'
     │
     ▼
┌──────────────────────┐
│ Ownership Middleware │
└────┬─────────────────┘
     │
     │ 3. Find card by ID
     │ 4. Find business by card.businessId
     │ 5. Check business.ownerId === req.user.id
     │
     ▼
┌──────────────┐
│ Controller   │
└────┬─────────┘
     │
     │ 6. Process request
     │
     ▼
┌──────────┐
│ Response │
└──────────┘
```

### Security Layers

1. **Transport Security**
   - HTTPS only (TLS 1.3)
   - HSTS headers
   - Secure cookies

2. **Application Security**
   - Helmet headers
   - CORS configuration
   - Rate limiting
   - Input validation
   - SQL/NoSQL injection prevention

3. **Authentication Security**
   - bcrypt password hashing (12 rounds)
   - JWT with short expiry (7 days)
   - HttpOnly cookies
   - Account lockout (5 failed attempts)

4. **Authorization Security**
   - Role-based access control
   - Ownership verification
   - Principle of least privilege

5. **Data Security**
   - Sensitive data encryption
   - Audit logging
   - Data retention policies
   - GDPR compliance

---

## Performance Considerations

### NFC Redirect Performance

**Target:** <100ms response time

**Optimization Strategy:**

1. **Database Indexes**
   - `publicCardId` index for fast lookup
   - Compound index on `publicCardId + status`

2. **Caching (Phase 5)**
   - Redis cache for card data
   - TTL: 5 minutes
   - Invalidate on destination change

3. **Query Optimization**
   - Select only needed fields
   - Populate only required references
   - Use lean queries

4. **Async Processing**
   - Record scan event asynchronously
   - Don't block redirect on analytics

**Expected Performance:**
- p50: 45ms
- p95: 85ms
- p99: 150ms

### Database Performance

**Optimization Strategy:**

1. **Indexes**
   - Add indexes for all query patterns
   - Use compound indexes for multi-field queries
   - Avoid over-indexing

2. **Connection Pooling**
   - Mongoose connection pool (default: 100)
   - Reuse connections

3. **Query Optimization**
   - Use `.lean()` for read-only queries
   - Use `.select()` to limit fields
   - Use `.populate()` sparingly

4. **Aggregation Pipeline**
   - Use aggregation for complex analytics
   - Add `$match` early in pipeline
   - Use indexes in `$match` stage

### API Performance

**Optimization Strategy:**

1. **Response Compression**
   - Gzip compression
   - Minimize response size

2. **Pagination**
   - Limit default page size (20)
   - Max page size (100)
   - Cursor-based pagination for large datasets

3. **Caching**
   - HTTP caching headers
   - ETags for conditional requests
   - Redis cache for frequent queries

---

## Scalability Strategy

### Phase 1 (Current)

**Architecture:** Single server, single database

**Capacity:**
- 1,000 businesses
- 10,000 cards
- 1M scans/month

**Components:**
- 1 Node.js server
- 1 MongoDB Atlas cluster (M10)
- Cloudflare CDN

### Phase 2 (6-12 months)

**Architecture:** Horizontal scaling

**Capacity:**
- 10,000 businesses
- 100,000 cards
- 10M scans/month

**Components:**
- 2-3 Node.js servers (load balanced)
- MongoDB Atlas (M30)
- Redis cache
- Cloudflare CDN

### Phase 3 (12-24 months)

**Architecture:** Microservices

**Capacity:**
- 100,000 businesses
- 1M cards
- 100M scans/month

**Components:**
- Separate services (auth, cards, analytics, redirect)
- MongoDB Atlas (M50+)
- Redis cluster
- Message queue (RabbitMQ/Kafka)
- Kubernetes orchestration

### Phase 4 (24+ months)

**Architecture:** Global distribution

**Capacity:**
- 1M+ businesses
- 10M+ cards
- 1B+ scans/month

**Components:**
- Multi-region deployment
- Database sharding
- Read replicas
- Edge computing
- Advanced caching layers

---

## Deployment Architecture

### Development

```
┌──────────────┐
│   Frontend   │
│  localhost   │
│   :3000      │
└──────┬───────┘
       │
       │ API calls
       │
       ▼
┌──────────────┐
│   Backend    │
│  localhost   │
│   :5000      │
└──────┬───────┘
       │
       │ Mongoose
       │
       ▼
┌──────────────┐
│  MongoDB     │
│   Atlas      │
│  (Cloud)     │
└──────────────┘
```

### Production

```
┌──────────────────────────────────────┐
│         Cloudflare CDN               │
│    • DDoS Protection                 │
│    • SSL/TLS                         │
│    • Static Asset Caching            │
└──────────────┬───────────────────────┘
               │
               │ HTTPS
               │
       ┌───────┴────────┐
       │                │
       ▼                ▼
┌──────────────┐  ┌──────────────┐
│  Frontend    │  │   Backend    │
│  (Vercel)    │  │  (Railway/   │
│              │  │   AWS ECS)   │
│  React SPA   │  │              │
│  Static      │  │  Node.js     │
│  Assets      │  │  Express     │
└──────────────┘  └──────┬───────┘
                         │
                         │ HTTPS
                         │
                         ▼
                  ┌──────────────┐
                  │  MongoDB     │
                  │   Atlas      │
                  │  (M10-M30)   │
                  │              │
                  │  • Backups   │
                  │  • Monitoring│
                  │  • Scaling   │
                  └──────────────┘
```

---

## Monitoring & Observability

### Metrics to Track

1. **Application Metrics**
   - Request rate
   - Error rate
   - Response time (p50, p95, p99)
   - CPU/Memory usage

2. **Business Metrics**
   - Active businesses
   - Active cards
   - Daily scans
   - Conversion rate

3. **Infrastructure Metrics**
   - Database connections
   - Cache hit rate
   - Queue length
   - Disk usage

### Tools

- **APM:** Sentry / DataDog / New Relic
- **Logging:** Winston + CloudWatch / Papertrail
- **Monitoring:** MongoDB Atlas Monitoring
- **Alerting:** PagerDuty / Slack

---

## Disaster Recovery

### Backup Strategy

1. **MongoDB Atlas**
   - Continuous backups (PITR)
   - Daily snapshots
   - 7-day retention

2. **Application Code**
   - Git repository
   - Automated deployments
   - Rollback capability

3. **Environment Variables**
   - Encrypted storage
   - Version controlled (without secrets)
   - Documented

### Recovery Procedures

1. **Database Corruption**
   - Restore from PITR backup
   - Estimated RTO: 1 hour
   - Estimated RPO: 0 (continuous backups)

2. **Application Failure**
   - Restart service
   - Rollback deployment
   - Estimated RTO: 5 minutes

3. **Complete Outage**
   - Restore from backups
   - Redeploy application
   - Estimated RTO: 2 hours

---

## Next Steps

1. ✅ Review architecture document
2. ✅ Approve technology stack
3. ⏳ Set up development environment
4. ⏳ Create database schemas
5. ⏳ Implement authentication
6. ⏳ Build admin endpoints
7. ⏳ Build business endpoints
8. ⏳ Implement NFC redirect
9. ⏳ Create frontend pages
10. ⏳ Integration testing
11. ⏳ Deploy to staging
12. ⏳ User acceptance testing
13. ⏳ Deploy to production

---

**Document Status:** PROPOSED  
**Awaiting Approval:** Yes  
**Implementation Status:** NOT STARTED
