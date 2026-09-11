# TapReview Backend Rebuild Guide

**Complete guide to understanding and rebuilding the TapReview backend from scratch**

---

## Table of Contents

1. [Introduction](#introduction)
2. [Architecture Overview](#architecture-overview)
3. [Build Order](#build-order)
4. [File-by-File Rebuild](#file-by-file-rebuild)
5. [Request Lifecycle](#request-lifecycle)
6. [Database Deep Dive](#database-deep-dive)
7. [Authentication & Authorization](#authentication--authorization)
8. [Validation & Error Handling](#validation--error-handling)
9. [Security Analysis](#security-analysis)
10. [Environment Variables](#environment-variables)
11. [API Documentation](#api-documentation)
12. [Frontend-Backend Integration](#frontend-backend-integration)
13. [Production Deployment](#production-deployment)
14. [Testing Guide](#testing-guide)
15. [Debugging Guide](#debugging-guide)
16. [Knowledge Checkpoints](#knowledge-checkpoints)
17. [Rebuild Exercise](#rebuild-exercise)
18. [Backend Engineer Mindset](#backend-engineer-mindset)
19. [Learning Checklist](#learning-checklist)

---

## Introduction

### What You're Building

TapReview is an NFC/QR review card SaaS platform. Businesses purchase physical NFC cards that customers tap to leave Google reviews. The backend manages:

- **Business accounts** (created by admin)
- **NFC cards** (assigned to businesses)
- **Dynamic redirects** (change destination URLs without replacing cards)
- **Analytics** (track scans, visitors, devices)
- **Authentication** (JWT + HttpOnly cookies)
- **Authorization** (role-based: admin vs business)

### Your Current Backend

**Tech Stack:**
- Node.js + Express.js (JavaScript, ES modules)
- MongoDB Atlas (cloud database)
- Mongoose (MongoDB ODM)
- JWT (authentication)
- bcryptjs (password hashing)
- Winston (logging)
- Helmet (security headers)
- express-rate-limit (rate limiting)
- Joi (validation)

**Key Features:**
✅ Admin creates businesses with credentials  
✅ Businesses log in and manage their NFC cards  
✅ Businesses change destination URLs dynamically  
✅ NFC cards redirect to destinations with analytics  
✅ Role-based access control (admin vs business)  
✅ Comprehensive error handling  
✅ Rate limiting and security measures  
✅ Structured logging  

### How to Use This Guide

This guide teaches you to **understand** the backend, not just copy it. For each section:

1. **Read the explanation** - Understand WHY before WHAT
2. **Study the code** - Look at the actual implementation
3. **Rebuild it yourself** - Write the code from memory
4. **Test it** - Verify it works
5. **Move to next section** - Build incrementally

**Important:** Don't skip sections. Each builds on the previous.

---

## Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENTS                              │
│  (Frontend: React/Next.js, Mobile Apps, NFC Card Scanners)  │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS Requests
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    EXPRESS.JS SERVER                         │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              MIDDLEWARE STACK                         │  │
│  │  Security → Logging → Rate Limit → Auth → Validation │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                  ROUTES LAYER                         │  │
│  │  /api/auth, /api/businesses, /api/admin, /s/:cardId  │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              CONTROLLERS LAYER                        │  │
│  │  Request handling, response formatting, error handling│  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                MODELS LAYER                           │  │
│  │  User, Business, NfcCard, ScanEvent, Order, AuditLog │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │ Mongoose Queries
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   MONGODB ATLAS                              │
│  Collections: users, businesses, nfccards, scanevents,      │
│               orders, audit_logs                            │
└─────────────────────────────────────────────────────────────┘
```

### Request Flow

```
1. Client sends HTTP request
   ↓
2. Express receives request
   ↓
3. Middleware stack processes request (in order):
   - Security headers (Helmet)
   - CORS configuration
   - Request logging (Winston)
   - Rate limiting
   - Body parsing (JSON, URL-encoded)
   - Cookie parsing
   - Authentication (if protected route)
   - Validation (if schema defined)
   ↓
4. Router matches route to controller
   ↓
5. Controller handles business logic:
   - Extract data from request
   - Call models/database
   - Format response
   ↓
6. Response sent back to client
   ↓
7. Error handler catches any errors
```

### Folder Structure

```
backend/
├── server.js                 # Entry point, Express setup
├── package.json              # Dependencies
├── .env                      # Environment variables (NOT committed)
├── .env.example              # Environment template
│
├── config/
│   ├── db.js                # MongoDB connection
│   ├── env.js               # Environment validation
│   └── logger.js            # Winston logger setup
│
├── models/
│   ├── User.js              # User schema (admin, business)
│   ├── Business.js          # Business schema
│   ├── NfcCard.js           # NFC card schema
│   ├── ScanEvent.js         # Analytics schema
│   ├── Order.js             # Order + Product schemas
│   └── AuditLog.js          # Audit trail schema
│
├── middleware/
│   ├── auth.js              # Authentication (JWT)
│   ├── errorHandler.js      # Global error handling
│   ├── security.js          # Rate limiting, bot detection
│   └── validate.js          # Request validation (Joi)
│
├── routes/
│   ├── auth.js              # /api/auth/* endpoints
│   ├── business.js          # /api/businesses/* endpoints
│   ├── cards.js             # /api/cards/* endpoints
│   ├── admin.js             # /api/admin/* endpoints
│   ├── redirect.js          # /s/:cardId redirect endpoint
│   ├── orders.js            # /api/orders/* endpoints
│   └── analytics.js         # /api/analytics/* endpoints
│
├── seed.js                  # Database seeder (development)
└── test-db.js               # Database connection tester
```

### File Dependencies

```
server.js
├── config/db.js
├── config/env.js
├── config/logger.js
├── middleware/errorHandler.js
├── middleware/security.js
└── routes/*.js
    ├── models/*.js
    └── middleware/auth.js
```

---

## Build Order

**Build in this exact order. Each phase depends on the previous.**

### Phase 1: Project Setup
**What:** Initialize Node.js project, install dependencies  
**Why:** Foundation for everything else  
**Files:** `package.json`  
**Time:** 10 minutes

### Phase 2: Environment Configuration
**What:** Set up environment variables, validation  
**Why:** Security, configuration management  
**Files:** `.env`, `.env.example`, `config/env.js`  
**Time:** 20 minutes

### Phase 3: Express Server
**What:** Create Express app, basic middleware  
**Why:** HTTP server foundation  
**Files:** `server.js`  
**Time:** 30 minutes

### Phase 4: Database Connection
**What:** Connect to MongoDB Atlas  
**Why:** Data persistence  
**Files:** `config/db.js`  
**Time:** 20 minutes

### Phase 5: Logging System
**What:** Set up Winston logger  
**Why:** Debugging, monitoring  
**Files:** `config/logger.js`  
**Time:** 20 minutes

### Phase 6: Data Models
**What:** Define Mongoose schemas  
**Why:** Data structure, validation  
**Files:** `models/*.js`  
**Time:** 2 hours

### Phase 7: Authentication
**What:** JWT auth, password hashing  
**Why:** Security, user identity  
**Files:** `middleware/auth.js`, `routes/auth.js`  
**Time:** 1.5 hours

### Phase 8: Error Handling
**What:** Global error handler, custom errors  
**Why:** Robust error management  
**Files:** `middleware/errorHandler.js`  
**Time:** 30 minutes

### Phase 9: Security Middleware
**What:** Rate limiting, CORS, Helmet  
**Why:** Protection against attacks  
**Files:** `middleware/security.js`  
**Time:** 45 minutes

### Phase 10: Validation
**What:** Request validation with Joi  
**Why:** Data integrity  
**Files:** `middleware/validate.js`  
**Time:** 45 minutes

### Phase 11: Business Routes
**What:** Business CRUD operations  
**Why:** Core functionality  
**Files:** `routes/business.js`  
**Time:** 1.5 hours

### Phase 12: Card Routes
**What:** NFC card management  
**Why:** Core functionality  
**Files:** `routes/cards.js`  
**Time:** 1 hour

### Phase 13: Admin Routes
**What:** Admin operations  
**Why:** Platform management  
**Files:** `routes/admin.js`  
**Time:** 2 hours

### Phase 14: Redirect Endpoint
**What:** NFC/QR redirect with analytics  
**Why:** Core product feature  
**Files:** `routes/redirect.js`  
**Time:** 1.5 hours

### Phase 15: Analytics Routes
**What:** Analytics endpoints  
**Why:** Business insights  
**Files:** `routes/analytics.js`  
**Time:** 1.5 hours

### Phase 16: Order Routes
**What:** Order management  
**Why:** E-commerce functionality  
**Files:** `routes/orders.js`  
**Time:** 1 hour

### Phase 17: Database Seeder
**What:** Seed initial data  
**Why:** Development convenience  
**Files:** `seed.js`  
**Time:** 30 minutes

### Phase 18: Testing & Debugging
**What:** Test all endpoints  
**Why:** Verify functionality  
**Files:** `test-db.js`  
**Time:** 2 hours

**Total Time:** ~15 hours

---

## File-by-File Rebuild

### [backend/package.json]

#### Purpose
Defines project metadata, dependencies, and scripts. This is the foundation of your Node.js project.

#### Dependencies Explained

**Production Dependencies:**
- `express` - Web framework for building APIs
- `mongoose` - MongoDB ODM (Object Data Modeling)
- `bcryptjs` - Password hashing (more portable than bcrypt)
- `jsonwebtoken` - JWT token generation/verification
- `dotenv` - Load environment variables from .env file
- `cors` - Cross-Origin Resource Sharing
- `helmet` - Security headers
- `express-rate-limit` - Rate limiting
- `cookie-parser` - Parse cookies from requests
- `winston` - Logging library
- `joi` - Request validation
- `validator` - String validation utilities
- `ua-parser-js` - Parse user agent strings

**Development Dependencies:**
- `nodemon` - Auto-restart server on file changes

#### Rebuild Steps

1. **Create package.json:**
```bash
cd backend
npm init -y
```

2. **Install production dependencies:**
```bash
npm install express mongoose bcryptjs jsonwebtoken dotenv cors helmet express-rate-limit cookie-parser winston joi validator ua-parser-js
```

3. **Install development dependencies:**
```bash
npm install --save-dev nodemon
```

4. **Add scripts to package.json:**
```json
{
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "seed": "node seed.js"
  }
}
```

**Why `"type": "module"`?**  
Enables ES6 import/export syntax instead of CommonJS require().

#### What Could Go Wrong
- Forgetting `"type": "module"` → Import errors
- Wrong dependency versions → Compatibility issues
- Missing dependencies → Runtime errors

---

### [backend/.env.example]

#### Purpose
Template for environment variables. Shows what variables are needed without exposing actual secrets.

#### Variables Explained

| Variable | Purpose | Example |
|----------|---------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` or `production` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | JWT signing secret | Random 64-char string |
| `JWT_EXPIRES_IN` | Token expiration | `7d` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |
| `REDIRECT_CACHE_TTL` | Redirect cache TTL | `300` (5 min) |

#### Rebuild Steps

1. **Create .env.example:**
```bash
touch .env.example
```

2. **Add template variables:**
```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

# JWT
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRES_IN=7d

# Frontend
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Cache
REDIRECT_CACHE_TTL=300
```

#### Security Note
**NEVER commit .env file to Git!** Only commit .env.example.

---

### [backend/config/env.js]

#### Purpose
Validates environment variables at startup. Ensures all required variables are present and valid.

#### What It Does
1. Loads environment variables from .env
2. Checks required variables exist
3. Validates JWT_SECRET strength
4. Validates MONGODB_URI format
5. Exits if validation fails

#### Rebuild Steps

1. **Create config directory:**
```bash
mkdir config
touch config/env.js
```

2. **Import dotenv:**
```javascript
import dotenv from 'dotenv';
dotenv.config();
```

3. **Define required variables:**
```javascript
const requiredEnvVars = {
  development: ['MONGODB_URI', 'JWT_SECRET', 'NODE_ENV'],
  production: [
    'MONGODB_URI',
    'JWT_SECRET',
    'NODE_ENV',
    'FRONTEND_URL',
    'JWT_EXPIRES_IN',
  ],
};
```

4. **Validate JWT_SECRET:**
```javascript
const validateJWTSecret = (secret) => {
  if (!secret) return false;
  if (secret.length < 32) {
    console.error('❌ JWT_SECRET must be at least 32 characters');
    return false;
  }
  
  const weakSecrets = ['secret', 'password', '123456'];
  if (weakSecrets.some(weak => secret.toLowerCase().includes(weak))) {
    console.error('❌ JWT_SECRET is too weak');
    return false;
  }
  
  return true;
};
```

5. **Validate MONGODB_URI:**
```javascript
const validateMongoURI = (uri) => {
  if (!uri) return false;
  if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    console.error('❌ MONGODB_URI must start with mongodb:// or mongodb+srv://');
    return false;
  }
  return true;
};
```

6. **Main validation function:**
```javascript
export const validateEnv = () => {
  const env = process.env.NODE_ENV || 'development';
  const required = requiredEnvVars[env];
  
  const missing = required.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error('❌ Missing environment variables:', missing);
    process.exit(1);
  }
  
  if (!validateJWTSecret(process.env.JWT_SECRET)) {
    process.exit(1);
  }
  
  if (!validateMongoURI(process.env.MONGODB_URI)) {
    process.exit(1);
  }
  
  console.log('✅ Environment validated');
};
```

7. **Export config object:**
```javascript
export const envConfig = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT) || 5000,
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
};
```

#### Why This Matters
- **Fail fast:** Catch configuration errors at startup, not runtime
- **Security:** Prevent weak secrets in production
- **Documentation:** Self-documenting required variables

---

### [backend/config/db.js]

#### Purpose
Establishes connection to MongoDB Atlas database.

#### What It Does
1. Reads MONGODB_URI from environment
2. Connects to MongoDB with optimized settings
3. Handles connection errors
4. Sets up connection event listeners
5. Handles graceful shutdown

#### Rebuild Steps

1. **Create db.js:**
```bash
touch config/db.js
```

2. **Import mongoose:**
```javascript
import mongoose from 'mongoose';
```

3. **Get connection string:**
```javascript
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not set');
  process.exit(1);
}
```

4. **Create connectDB function:**
```javascript
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 50,           // Max connections in pool
      minPoolSize: 10,           // Min connections in pool
      serverSelectionTimeoutMS: 5000,  // Timeout for server selection
      socketTimeoutMS: 45000,    // Socket timeout
      family: 4,                 // Use IPv4
      retryWrites: true,         // Retry failed writes
      retryReads: true,          // Retry failed reads
    });

    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('✗ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};
```

5. **Add connection event listeners:**
```javascript
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected');
});
```

6. **Handle graceful shutdown:**
```javascript
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});
```

#### Connection Options Explained

| Option | Value | Why |
|--------|-------|-----|
| `maxPoolSize` | 50 | Limit max connections to prevent overload |
| `minPoolSize` | 10 | Keep connections ready for quick response |
| `serverSelectionTimeoutMS` | 5000 | Fail fast if server unavailable |
| `socketTimeoutMS` | 45000 | Prevent hanging connections |
| `retryWrites` | true | Automatically retry failed writes |
| `retryReads` | true | Automatically retry failed reads |

#### What Could Go Wrong
- Wrong MONGODB_URI → Connection fails
- IP not whitelisted in MongoDB Atlas → Connection refused
- Network issues → Connection timeout
- Wrong credentials → Authentication failed

---

### [backend/config/logger.js]

#### Purpose
Sets up Winston logger for structured logging to files and console.

#### What It Does
1. Creates logger with custom levels (error, warn, info, http, debug)
2. Configures file transports (error.log, combined.log)
3. Adds console transport for development
4. Exports request logger middleware
5. Exports error logger middleware

#### Rebuild Steps

1. **Create logger.js:**
```bash
touch config/logger.js
```

2. **Import winston:**
```javascript
import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
```

3. **Define log levels:**
```javascript
const logLevels = {
  levels: {
    error: 0,    // Most important
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,    // Least important
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
  },
};

winston.addColors(logLevels.colors);
```

4. **Define log format:**
```javascript
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);
```

5. **Create logger instance:**
```javascript
const logger = winston.createLogger({
  levels: logLevels.levels,
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  transports: [
    // Error logs only
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/error.log'),
      level: 'error',
      maxsize: 5242880,  // 5MB
      maxFiles: 5,
    }),
    // All logs
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/combined.log'),
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
});
```

6. **Add console transport:**
```javascript
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({ format: 'HH:mm:ss' }),
      winston.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level}]: ${message}`;
      })
    ),
  }));
}
```

7. **Create request logger middleware:**
```javascript
export const requestLogger = (req, res, next) => {
  if (!req.path.includes('/health')) {
    logger.http(`${req.method} ${req.path}`, {
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });
  }
  next();
};
```

8. **Create error logger middleware:**
```javascript
export const errorLogger = (err, req, res, next) => {
  logger.error(`${err.message}`, {
    method: req.method,
    path: req.path,
    ip: req.ip,
    stack: err.stack,
  });
  next(err);
};
```

9. **Export logger:**
```javascript
export default logger;
```

#### Why Structured Logging?
- **Searchable:** JSON format allows log aggregation tools to search
- **Context:** Include request metadata (IP, user agent)
- **Levels:** Filter logs by severity
- **Rotation:** Prevent log files from growing indefinitely

---

### [backend/models/User.js]

#### Purpose
Defines the User schema for authentication and authorization.

#### Schema Fields

| Field | Type | Required | Unique | Purpose |
|-------|------|----------|--------|---------|
| `username` | String | ✓ | ✓ | Login username |
| `password` | String | ✓ | | Hashed password |
| `email` | String | ✓ | ✓ | User email |
| `fullName` | String | ✓ | | Display name |
| `role` | String | ✓ | | 'admin' or 'business' |
| `isActive` | Boolean | | | Account status |
| `createdBy` | ObjectId | | | Who created this user |
| `lastLoginAt` | Date | | | Last login timestamp |
| `passwordResetToken` | String | | | Password reset token |
| `passwordResetExpires` | Date | | | Token expiration |

#### Rebuild Steps

1. **Create User.js:**
```bash
touch models/User.js
```

2. **Import dependencies:**
```javascript
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
```

3. **Define schema:**
```javascript
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minlength: 3,
    maxlength: 50,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ['admin', 'business'],
    default: 'business',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  lastLoginAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
}, {
  timestamps: true,  // Adds createdAt, updatedAt
});
```

4. **Add password hashing hook:**
```javascript
userSchema.pre('save', async function(next) {
  // Only hash if password modified
  if (!this.isModified('password')) return next();
  
  // Hash password with bcrypt (12 rounds)
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
```

**Why 12 rounds?**  
Higher = more secure but slower. 12 is a good balance.

5. **Add password comparison method:**
```javascript
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
```

6. **Remove sensitive fields from JSON output:**
```javascript
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.passwordResetToken;
  delete obj.passwordResetExpires;
  return obj;
};
```

**Why?**  
Prevent accidentally sending password hashes to client.

7. **Add indexes:**
```javascript
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });
```

**Why indexes?**  
Speed up login queries (find by username/email).

8. **Create and export model:**
```javascript
const User = mongoose.model('User', userSchema);
export default User;
```

#### What Happens at Runtime

1. **User registration:**
   - Password is automatically hashed before saving
   - Username and email are lowercased and trimmed

2. **User login:**
   - Find user by username
   - Compare provided password with hashed password
   - Return user object (without password)

3. **User serialization:**
   - `toJSON()` removes sensitive fields
   - Safe to send to client

---

### [backend/models/Business.js]

#### Purpose
Defines the Business schema. Each business is owned by a User.

#### Schema Fields

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| `name` | String | ✓ | Business name |
| `slug` | String | ✓ | URL-friendly identifier |
| `category` | String | ✓ | Business category |
| `description` | String | | Business description |
| `owner` | ObjectId | ✓ | Reference to User |
| `address` | Object | | Business address |
| `phone` | String | | Contact phone |
| `website` | String | | Business website |
| `logo` | String | | Logo URL |
| `isActive` | Boolean | | Business status |
| `isSuspended` | Boolean | | Suspension status |
| `plan` | String | | Subscription plan |

#### Rebuild Steps

1. **Create Business.js:**
```bash
touch models/Business.js
```

2. **Define schema:**
```javascript
import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,  // URL-friendly format
  },
  category: {
    type: String,
    enum: ['restaurant', 'cafe', 'salon', 'hotel', 'shop', 'clinic', 'gym', 'barber', 'spa', 'other'],
    required: true,
  },
  description: {
    type: String,
    maxlength: 500,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: 'US' },
  },
  phone: { type: String, trim: true },
  website: { type: String, trim: true },
  logo: String,
  coverImage: String,
  isActive: { type: Boolean, default: true },
  isSuspended: { type: Boolean, default: false },
  suspendedReason: String,
  plan: {
    type: String,
    enum: ['free', 'starter', 'professional', 'enterprise'],
    default: 'free',
  },
  analyticsRetentionDays: { type: Number, default: 90 },
}, {
  timestamps: true,
});
```

3. **Add indexes:**
```javascript
businessSchema.index({ slug: 1 });
businessSchema.index({ owner: 1 });
businessSchema.index({ category: 1 });
businessSchema.index({ isActive: 1 });
```

4. **Export model:**
```javascript
const Business = mongoose.model('Business', businessSchema);
export default Business;
```

#### Relationships

```
User (1) ←→ (1) Business
  owner          owner reference
```

Each business has exactly one owner (User). Each user can own at most one business.

---

### [backend/models/NfcCard.js]

#### Purpose
Defines the NFC card schema. Cards belong to businesses and have destination URLs.

#### Schema Fields

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| `cardId` | String | ✓ | Unique card identifier (e.g., JOCK-A7F92K) |
| `label` | String | | Human-readable label |
| `business` | ObjectId | ✓ | Reference to Business |
| `destinationUrl` | String | ✓ | Where card redirects to |
| `type` | String | | 'nfc', 'qr', or 'both' |
| `isActive` | Boolean | | Card status |
| `stats` | Object | | Scan statistics |

#### Rebuild Steps

1. **Create NfcCard.js:**
```bash
touch models/NfcCard.js
```

2. **Define schema:**
```javascript
import mongoose from 'mongoose';

const nfcCardSchema = new mongoose.Schema({
  cardId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  label: {
    type: String,
    trim: true,
    maxlength: 50,
  },
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true,
  },
  destinationUrl: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: (value) => {
        try {
          const url = new URL(value);
          return url.protocol === 'http:' || url.protocol === 'https:';
        } catch {
          return false;
        }
      },
      message: 'Destination URL must be valid HTTP/HTTPS',
    },
  },
  type: {
    type: String,
    enum: ['nfc', 'qr', 'both'],
    default: 'both',
  },
  isActive: { type: Boolean, default: true },
  physicalCard: {
    serialNumber: String,
    manufacturingDate: Date,
    shippedDate: Date,
    deliveredDate: Date,
  },
  stats: {
    totalScans: { type: Number, default: 0 },
    todayScans: { type: Number, default: 0 },
    weekScans: { type: Number, default: 0 },
    monthScans: { type: Number, default: 0 },
    lastScannedAt: Date,
  },
  redirectPage: {
    enabled: { type: Boolean, default: false },
    title: String,
    message: String,
    backgroundColor: { type: String, default: '#ffffff' },
    showAfterSeconds: { type: Number, default: 0 },
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
  },
}, {
  timestamps: true,
});
```

3. **Add critical indexes:**
```javascript
// Fast lookup for NFC redirect
nfcCardSchema.index({ cardId: 1, isActive: 1 });
nfcCardSchema.index({ business: 1 });
```

**Why these indexes?**
- `cardId + isActive`: Fast redirect lookups
- `business`: Find all cards for a business

4. **Add URL validation method:**
```javascript
nfcCardSchema.methods.isDestinationSafe = function() {
  try {
    const url = new URL(this.destinationUrl);
    const allowedProtocols = ['http:', 'https:'];
    return allowedProtocols.includes(url.protocol);
  } catch {
    return false;
  }
};
```

5. **Export model:**
```javascript
const NfcCard = mongoose.model('NfcCard', nfcCardSchema);
export default NfcCard;
```

#### Relationships

```
Business (1) ←→ (N) NfcCard
  _id              business reference
```

Each business can have many NFC cards. Each card belongs to one business.

---

### [backend/middleware/auth.js]

#### Purpose
Authentication middleware. Verifies JWT tokens and attaches user to request.

#### What It Does
1. Extracts token from Authorization header or cookie
2. Verifies JWT token
3. Fetches user from database
4. Checks if user is active
5. Attaches user to `req.user`

#### Rebuild Steps

1. **Create auth.js:**
```bash
touch middleware/auth.js
```

2. **Import dependencies:**
```javascript
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
```

3. **Create protect middleware:**
```javascript
export const protect = async (req, res, next) => {
  try {
    let token;

    // Check Authorization header
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Check cookie
    else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ error: 'Not authorized - no token' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ error: 'User no longer exists' });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Account deactivated' });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(401).json({ error: 'Not authorized' });
  }
};
```

4. **Create role middleware:**
```javascript
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ error: 'Admin access required' });
  }
};

export const businessOnly = (req, res, next) => {
  if (req.user && req.user.role === 'business') {
    next();
  } else {
    return res.status(403).json({ error: 'Business account required' });
  }
};
```

5. **Create token generator:**
```javascript
export const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};
```

#### Authentication Flow

```
1. Client sends request with token
   ↓
2. protect middleware extracts token
   ↓
3. Verify JWT signature
   ↓
4. Decode token to get userId
   ↓
5. Fetch user from database
   ↓
6. Check if user is active
   ↓
7. Attach user to req.user
   ↓
8. Continue to route handler
```

#### Security Considerations

- **Token in header OR cookie:** Flexibility for different clients
- **Verify signature:** Prevent tampering
- **Check user exists:** Handle deleted users
- **Check isActive:** Allow admin to deactivate accounts
- **Exclude password:** Never send password hash to client

---

## Request Lifecycle

### Example: POST /api/auth/login

```
1. Client sends POST request
   {
     "username": "joesrestaurant",
     "password": "password123"
   }
   ↓
2. Express receives request
   ↓
3. Middleware stack executes:
   - securityHeaders: Add security headers
   - cors: Check origin
   - requestLogger: Log request
   - apiLimiter: Check rate limit
   - express.json(): Parse JSON body
   - cookieParser: Parse cookies
   ↓
4. Router matches POST /api/auth/login
   ↓
5. Route handler executes:
   - Extract username, password from req.body
   - Find user by username
   - Compare password with bcrypt
   - Generate JWT token
   - Set HttpOnly cookie
   - Return user data (without password)
   ↓
6. Response sent to client:
   {
     "success": true,
      {
       "user": { "id": "...", "username": "...", ... },
       "token": "eyJhbGc..."
     }
   }
   Set-Cookie: token=eyJhbGc...; HttpOnly; Secure
```

### Example: GET /api/businesses/my/cards

```
1. Client sends GET request
   Cookie: token=eyJhbGc...
   ↓
2. Middleware stack executes:
   - securityHeaders
   - cors
   - requestLogger
   - apiLimiter
   - cookieParser
   - protect: Verify JWT, attach user
   - businessOnly: Check role === 'business'
   ↓
3. Router matches GET /api/businesses/my/cards
   ↓
4. Route handler executes:
   - Get business by owner: req.user._id
   - Find all cards for business
   - Return cards array
   ↓
5. Response sent:
   {
     "success": true,
      {
       "cards": [
         { "cardId": "JOCK-A7F92K", "label": "Main Counter", ... }
       ]
     }
   }
```

### Example: GET /s/:cardId (NFC Redirect)

```
1. Customer taps NFC card
   Phone opens: https://tapreview.com/s/JOCK-A7F92K
   ↓
2. Middleware stack executes:
   - securityHeaders
   - cors
   - requestLogger
   - redirectLimiter: Check rate limit (30/min)
   - detectBot: Mark if bot
   ↓
3. Router matches GET /s/:cardId
   ↓
4. Route handler executes:
   - Check cache for card
   - If not cached, query database
   - Validate card is active
   - Validate business is active
   - Validate destination URL
   - Record scan event (async, non-blocking)
   - Return 302 redirect to destination URL
   ↓
5. Browser redirects to destination:
   HTTP 302 Found
   Location: https://g.page/r/business-review
```

---

## Database Deep Dive

### Collections

| Collection | Purpose | Key Indexes |
|------------|---------|-------------|
| `users` | User accounts | username, email |
| `businesses` | Business profiles | slug, owner |
| `nfccards` | NFC cards | cardId, business |
| `scanevents` | Analytics data | card + timestamp, business + timestamp |
| `orders` | E-commerce orders | orderNumber, customer |
| `audit_logs` | Audit trail | userId + timestamp, action + timestamp |

### Relationships

```
User (1) ←→ (1) Business
  ↓
Business (1) ←→ (N) NfcCard
  ↓
NfcCard (1) ←→ (N) ScanEvent
  ↓
User (1) ←→ (N) Order
  ↓
User (1) ←→ (N) AuditLog
```

### Common Queries

**Find user by username:**
```javascript
const user = await User.findOne({ username: 'joesrestaurant' });
```

**Find business by owner:**
```javascript
const business = await Business.findOne({ owner: userId });
```

**Find all cards for business:**
```javascript
const cards = await NfcCard.find({ business: businessId });
```

**Count scans for business:**
```javascript
const count = await ScanEvent.countDocuments({
  business: businessId,
  timestamp: { $gte: startDate }
});
```

**Aggregate scans by day:**
```javascript
const timeline = await ScanEvent.aggregate([
  { $match: { business: businessId } },
  {
    $group: {
      _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
      scans: { $sum: 1 }
    }
  },
  { $sort: { '_id': 1 } }
]);
```

---

## Authentication & Authorization

### Authentication (Who are you?)

**JWT Flow:**
```
1. User logs in with username/password
   ↓
2. Server verifies credentials
   ↓
3. Server generates JWT token:
   jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' })
   ↓
4. Token sent to client (cookie + response body)
   ↓
5. Client sends token with each request
   ↓
6. Server verifies token signature
   ↓
7. Server decodes token to get userId
   ↓
8. Server fetches user from database
   ↓
9. Server attaches user to req.user
```

**Token Structure:**
```
Header: { "alg": "HS256", "typ": "JWT" }
Payload: { "id": "userId", "iat": 1234567890, "exp": 1234567890 }
Signature: HMACSHA256(header + payload, JWT_SECRET)
```

### Authorization (What can you do?)

**Role-Based Access Control:**
```javascript
// Admin-only route
router.get('/admin/stats', protect, adminOnly, handler);

// Business-only route
router.get('/businesses/my', protect, businessOnly, handler);

// Public route
router.get('/s/:cardId', handler);
```

**Ownership Verification:**
```javascript
// Business can only access own cards
const cards = await NfcCard.find({ business: req.user.businessId });

// NOT this (security vulnerability):
const cards = await NfcCard.find({ business: req.body.businessId });
```

---

## Validation & Error Handling

### Validation with Joi

**Example: Login validation:**
```javascript
const loginSchema = Joi.object({
  username: Joi.string().min(3).max(50).required(),
  password: Joi.string().min(6).required(),
});

const { error, value } = loginSchema.validate(req.body);

if (error) {
  return res.status(400).json({
    success: false,
    message: 'Validation error',
    details: error.details
  });
}

// Use validated data
req.body = value;
```

### Error Handling

**Custom Error Class:**
```javascript
export class AppError extends Error {
  constructor(message, statusCode, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
```

**Global Error Handler:**
```javascript
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // MongoDB duplicate key error
  if (err.code === 11000) {
    statusCode = 409;
    message = `${Object.keys(err.keyValue)[0]} already exists`;
  }

  // MongoDB validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  // Log error
  logger.error(`${statusCode} - ${message}`, {
    method: req.method,
    path: req.path,
    stack: err.stack,
  });

  // Send response
  res.status(statusCode).json({
    success: false,
    message: process.env.NODE_ENV === 'production' && statusCode === 500
      ? 'Internal Server Error'
      : message,
  });
};
```

---

## Security Analysis

### Security Measures Implemented

✅ **Password Hashing:** bcrypt with 12 rounds  
✅ **JWT Authentication:** Signed tokens with expiration  
✅ **HttpOnly Cookies:** Tokens not accessible via JavaScript  
✅ **Rate Limiting:** Prevent brute force attacks  
✅ **CORS:** Restrict cross-origin requests  
✅ **Helmet:** Security headers  
✅ **Input Validation:** Joi schemas  
✅ **MongoDB Injection Protection:** express-mongo-sanitize  
✅ **URL Validation:** Only HTTP/HTTPS allowed  
✅ **Role-Based Access Control:** Admin vs Business  
✅ **Ownership Verification:** Users can only access own data  
✅ **Audit Logging:** Track all admin actions  
✅ **Environment Validation:** Check secrets at startup  

### Security Concerns

⚠️ **MEDIUM: In-Memory Cache**  
Redirect cache uses in-memory Map. In multi-server setup, cache won't be shared.  
**Fix:** Use Redis for distributed cache.

⚠️ **LOW: No CSRF Protection**  
Cookies are HttpOnly but not CSRF-protected.  
**Fix:** Add CSRF tokens for state-changing operations.

✅ **GOOD: No Sensitive Data in Logs**  
Passwords, tokens not logged.

✅ **GOOD: Error Messages Sanitized**  
Stack traces not exposed in production.

---

## Environment Variables

| Variable | Purpose | Secret? | Production Notes |
|----------|---------|---------|------------------|
| `PORT` | Server port | No | Usually set by hosting platform |
| `NODE_ENV` | Environment | No | Must be 'production' in prod |
| `MONGODB_URI` | MongoDB connection | **YES** | Use MongoDB Atlas |
| `JWT_SECRET` | JWT signing key | **YES** | Min 32 chars, random |
| `JWT_EXPIRES_IN` | Token expiration | No | '7d' recommended |
| `FRONTEND_URL` | Frontend URL | No | Must match exactly |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | No | 900000 (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests | No | 100 per window |
| `REDIRECT_CACHE_TTL` | Cache TTL | No | 300 (5 min) |

**NEVER commit .env to Git!**

---

## API Documentation

### Authentication Endpoints

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/auth/login` | Public | Login |
| POST | `/api/auth/logout` | Public | Logout |
| GET | `/api/auth/me` | Protected | Get current user |

### Business Endpoints

| Method | Endpoint | Auth | Role | Purpose |
|--------|----------|------|------|---------|
| GET | `/api/businesses/my` | ✓ | Business | Get my business |
| PUT | `/api/businesses/my` | ✓ | Business | Update business |
| GET | `/api/businesses/my/cards` | ✓ | Business | Get my cards |
| PUT | `/api/businesses/cards/:id/destination` | ✓ | Business | Update card destination |

### Admin Endpoints

| Method | Endpoint | Auth | Role | Purpose |
|--------|----------|------|------|---------|
| GET | `/api/admin/stats` | ✓ | Admin | Get platform stats |
| GET | `/api/admin/businesses` | ✓ | Admin | List businesses |
| POST | `/api/admin/businesses` | ✓ | Admin | Create business |
| GET | `/api/admin/cards` | ✓ | Admin | List all cards |
| POST | `/api/admin/cards` | ✓ | Admin | Create card |
| POST | `/api/admin/cards/:id/assign` | ✓ | Admin | Assign card |

### Public Endpoints

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/s/:cardId` | Public | NFC/QR redirect |
| GET | `/api/health` | Public | Health check |

---

## Frontend-Backend Integration

### API Client

**Frontend API calls:**
```javascript
// Login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',  // Send cookies
  body: JSON.stringify({ username, password })
});

// Protected request
const response = await fetch('/api/businesses/my/cards', {
  credentials: 'include'  // Cookie automatically sent
});
```

### Authentication State

**Frontend stores:**
- User data (from /api/auth/me)
- Authentication status (isLoggedIn)

**Backend enforces:**
- Token validation
- Role checking
- Ownership verification

**Remember:** Frontend hiding a button is NOT security. Backend must enforce all permissions.

---

## Production Deployment

### Checklist

✅ Environment variables set  
✅ NODE_ENV=production  
✅ Strong JWT_SECRET (64+ chars)  
✅ MongoDB Atlas IP whitelisted  
✅ HTTPS enabled  
✅ CORS configured for production domain  
✅ Rate limiting enabled  
✅ Logging configured  
✅ Error tracking (Sentry)  
✅ Database backups enabled  
✅ Health check endpoint working  

### Deployment Steps

1. **Set environment variables**
2. **Install dependencies:** `npm install --production`
3. **Start server:** `npm start`
4. **Verify health:** `GET /api/health`
5. **Test authentication**
6. **Test core features**

---

## Testing Guide

### Manual Testing

**Test 1: Health Check**
```bash
curl http://localhost:5000/api/health
```
Expected: `{ "status": "ok", ... }`

**Test 2: Login**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```
Expected: Token in response and cookie

**Test 3: Protected Route**
```bash
curl http://localhost:5000/api/auth/me \
  -H "Cookie: token=YOUR_TOKEN"
```
Expected: User data

**Test 4: NFC Redirect**
```bash
curl -I http://localhost:5000/s/JOCK-A7F92K
```
Expected: 302 redirect

---

## Debugging Guide

### Server Won't Start

**Check:**
1. Environment variables set?
2. MongoDB Atlas accessible?
3. Port available?
4. Dependencies installed?

### Authentication Fails

**Check:**
1. JWT_SECRET matches?
2. Token not expired?
3. User exists and active?
4. Cookie being sent?

### Database Query Returns Nothing

**Check:**
1. Correct collection name?
2. Query syntax correct?
3. Data exists in database?
4. Indexes created?

### CORS Error

**Check:**
1. FRONTEND_URL matches exactly?
2. Credentials included?
3. Origin allowed in CORS config?

---

## Knowledge Checkpoints

### Checkpoint 1: Project Setup

Before continuing, you should be able to answer:

1. What is package.json?
2. What are dependencies vs devDependencies?
3. What does "type": "module" do?
4. What is nodemon?

### Checkpoint 2: Environment Variables

1. What is an environment variable?
2. Why use .env files?
3. Why never commit .env to Git?
4. What is dotenv?

### Checkpoint 3: Express

1. What is Express?
2. What is middleware?
3. What is the request-response cycle?
4. What are routes?

### Checkpoint 4: MongoDB

1. What is MongoDB?
2. What is a collection?
3. What is a document?
4. What is Mongoose?
5. What is a schema?

### Checkpoint 5: Authentication

1. What is JWT?
2. What is bcrypt?
3. What is HttpOnly cookie?
4. What is the difference between authentication and authorization?

### Checkpoint 6: Security

1. What is rate limiting?
2. What is CORS?
3. What is Helmet?
4. What is input validation?
5. What is SQL injection? (Not applicable here, but good to know)

---

## Rebuild Exercise

### Goal
Rebuild the entire backend from memory without looking at the existing code.

### Steps

1. **Create project structure:**
   ```
   backend/
   ├── server.js
   ├── package.json
   ├── .env.example
   ├── config/
   ├── models/
   ├── middleware/
   └── routes/
   ```

2. **Initialize project:**
   ```bash
   npm init -y
   npm install express mongoose bcryptjs jsonwebtoken ...
   ```

3. **Build in order:**
   - Environment validation
   - Express server
   - Database connection
   - Logger
   - Models (User, Business, NfcCard)
   - Authentication middleware
   - Error handler
   - Security middleware
   - Validation middleware
   - Routes (auth, business, cards, admin, redirect)

4. **Test each component:**
   - Start server
   - Test health endpoint
   - Test login
   - Test protected routes
   - Test NFC redirect

5. **Compare with original:**
   - What did you miss?
   - What did you do differently?
   - What do you understand better now?

---

## Backend Engineer Mindset

### Trust Boundaries

**Never trust:**
- Client input
- Headers
- Cookies
- Query parameters
- Request body

**Always validate:**
- Data types
- Data formats
- Data ranges
- User permissions

### Untrusted Input

**Example:**
```javascript
// BAD: Trusting client input
const business = await Business.findById(req.body.businessId);

// GOOD: Using authenticated user
const business = await Business.findOne({ owner: req.user._id });
```

### Failure is Inevitable

**Always handle:**
- Database connection failures
- Network timeouts
- Invalid input
- Missing data
- Permission denied

### Security is Layered

**Defense in depth:**
1. Rate limiting (prevent brute force)
2. Input validation (prevent injection)
3. Authentication (verify identity)
4. Authorization (check permissions)
5. Ownership verification (check resource access)

### Data Integrity

**Always:**
- Validate before saving
- Use transactions for multi-step operations
- Handle duplicate keys
- Log important operations

### Observability

**Always log:**
- Errors
- Important operations
- Security events
- Performance metrics

### Performance

**Always:**
- Use indexes
- Limit query results
- Cache expensive operations
- Monitor slow queries

### Maintainability

**Always:**
- Write clear code
- Add comments for complex logic
- Use consistent naming
- Keep functions small
- Separate concerns

---

## Learning Checklist

### Project Setup
- [ ] I understand package.json
- [ ] I can initialize a Node.js project
- [ ] I understand dependencies
- [ ] I can install packages

### Environment
- [ ] I understand environment variables
- [ ] I can create .env files
- [ ] I understand why secrets must be protected
- [ ] I can validate environment variables

### Express
- [ ] I understand how Express starts
- [ ] I understand middleware
- [ ] I understand routing
- [ ] I can create an Express app

### Database
- [ ] I understand MongoDB connection
- [ ] I understand the data models
- [ ] I understand relationships
- [ ] I understand indexes

### Authentication
- [ ] I understand JWT
- [ ] I understand password hashing
- [ ] I understand HttpOnly cookies
- [ ] I can implement authentication

### Authorization
- [ ] I understand role-based access
- [ ] I understand ownership verification
- [ ] I can implement authorization

### Validation
- [ ] I understand input validation
- [ ] I can use Joi
- [ ] I understand why validation is necessary

### Error Handling
- [ ] I understand error handling
- [ ] I can create custom errors
- [ ] I understand global error handlers

### Security
- [ ] I understand rate limiting
- [ ] I understand CORS
- [ ] I understand security headers
- [ ] I understand common attacks

### API
- [ ] I understand REST APIs
- [ ] I can test APIs
- [ ] I understand request/response

### Production
- [ ] I understand deployment
- [ ] I understand environment configuration
- [ ] I understand monitoring

### Debugging
- [ ] I can debug the API
- [ ] I can read logs
- [ ] I can trace requests

### Rebuild
- [ ] I can rebuild the backend without AI
- [ ] I understand every file
- [ ] I understand every function

---

## Final Notes

### What You've Learned

✅ Backend architecture  
✅ Express.js fundamentals  
✅ MongoDB and Mongoose  
✅ Authentication and authorization  
✅ Security best practices  
✅ Error handling  
✅ API design  
✅ Request lifecycle  
✅ Database relationships  
✅ Production deployment  

### What's Next

1. **Build the frontend** to connect to this backend
2. **Add more features** (email notifications, file uploads)
3. **Deploy to production** (Railway, Render, AWS)
4. **Monitor and optimize** (performance, security)
5. **Scale** (caching, load balancing, database sharding)

### Remember

- **Understand before you copy**
- **Test everything**
- **Security is not optional**
- **Fail fast, recover gracefully**
- **Log everything important**
- **Never trust client input**

---

**Congratulations!** You now have a complete understanding of the TapReview backend. You can rebuild it, maintain it, debug it, and extend it. You're ready to become a backend engineer.

**Last Updated:** 2024-01-XX  
**Status:** ✅ COMPLETE  
**Next Step:** Rebuild the backend yourself!
