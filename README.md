# TapReview — NFC Review Card SaaS Platform

A production-ready SaaS platform for NFC-powered Google review collection. Businesses receive physical NFC cards that redirect customers to their Google review page with a single tap. The destination URL can be changed anytime without replacing the card.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js 14 (App Router)                   │
│  Landing Page │ Login │ Dashboard │ Admin │ /s/[cardId]      │
└──────────────────────────┬──────────────────────────────────┘
                           │ REST API (proxied)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  Express.js Backend API                      │
│  Auth │ Business │ Cards │ Redirect │ Admin │ Analytics      │
└──────────────────────────┬──────────────────────────────────┘
                           │ Mongoose ODM
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   MongoDB Atlas (Cloud)                      │
│  Users │ Businesses │ NfcCards │ ScanEvents │ Orders         │
└─────────────────────────────────────────────────────────────┘
```

## Project Structure

```
project-root/
├── nextjs-app/          # Next.js 14 Frontend (App Router)
│   ├── app/
│   │   ├── layout.js    # Root layout
│   │   ├── page.js      # Landing page
│   │   ├── login/       # Business login
│   │   ├── dashboard/   # Business dashboard (change NFC URLs)
│   │   ├── admin/       # Admin panel (create accounts)
│   │   └── s/[cardId]/  # NFC redirect handler
│   ├── next.config.js
│   ├── package.json
│   └── .env.example
│
├── backend/             # Express.js API Server
│   ├── server.js        # Main server
│   ├── config/
│   │   └── db.js        # MongoDB Atlas connection
│   ├── models/
│   │   ├── User.js      # Admin-set credentials
│   │   ├── Business.js  # Business/store data
│   │   ├── NfcCard.js   # NFC card + destination URL
│   │   ├── ScanEvent.js # Analytics events
│   │   └── Order.js     # Orders + Products
│   ├── routes/
│   │   ├── auth.js      # Login/register (admin creates accounts)
│   │   ├── business.js  # Business management + URL changes
│   │   ├── cards.js     # NFC card management
│   │   ├── redirect.js  # ★ Core NFC redirect (optimized)
│   │   ├── admin.js     # Admin operations
│   │   ├── orders.js    # Order management
│   │   └── analytics.js # Analytics queries
│   ├── middleware/
│   │   └── auth.js      # JWT authentication
│   ├── package.json
│   └── .env.example
│
├── src/                 # Vite Preview (live demo)
│   ├── App.tsx
│   ├── pages/
│   │   ├── LandingPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── AdminPage.tsx
│   │   ├── OrderPage.tsx
│   │   └── RedirectPage.tsx
│   └── data/
│       └── mockData.ts
│
└── README.md
```

## Key Features

### 🔑 Admin-Set Credentials
- Admin creates business accounts with username/password
- Business owners cannot self-register (security)
- Admin can reset passwords, suspend/activate accounts
- JWT-based authentication with HttpOnly cookies

### ⚡ NFC Redirect System (Core Feature)
- NFC card encoded with: `tapreview.com/s/{cardId}`
- Business owner changes destination URL from dashboard
- Physical card never needs replacement
- In-memory cache for sub-100ms redirects
- Rate limiting, bot detection, URL validation
- Privacy-aware analytics (hashed visitor IDs)

### 📊 Analytics Dashboard
- Total scans, unique visitors, peak hours
- Device/OS/browser breakdown
- Per-card performance tracking
- Timeline charts
- Geographic data (approximate)

### 🛒 E-Commerce
- Product catalog (card packs)
- Order management with status tracking
- Shipping address collection
- Payment abstraction (Stripe-ready)

## Setup Instructions

### 1. Backend (Express.js)

```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your MongoDB Atlas URI and JWT secret
```

**MongoDB Atlas Setup:**
1. Go to https://cloud.mongodb.com/
2. Create a cluster (free tier works)
3. Create a database user
4. Get your connection string
5. Add to `.env`:
```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/tapreview
JWT_SECRET=your-random-secret-string-min-32-chars
```

```bash
# Start development server
npm run dev

# Production
npm start
```

### 2. Frontend (Next.js)

```bash
cd nextjs-app
npm install

# Create .env.local
cp .env.example .env.local
# Set API URL
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Start development
npm run dev
```

### 3. Create Initial Admin Account

Run this script or use MongoDB Compass to create the first admin:

```javascript
// In MongoDB shell or via API
db.users.insertOne({
  username: "admin",
  password: "$2a$12$...", // Use bcrypt to hash
  email: "admin@tapreview.com",
  fullName: "Platform Admin",
  role: "admin",
  isActive: true,
  createdAt: new Date()
})
```

Or use the admin seed script (create `backend/seed.js`):

```javascript
import User from './models/User.js';
import { connectDB } from './config/db.js';

await connectDB();
await User.create({
  username: 'admin',
  password: 'admin123secure',
  email: 'admin@tapreview.com',
  fullName: 'Platform Admin',
  role: 'admin',
});
console.log('Admin created: admin / admin123secure');
process.exit(0);
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Business login with admin-set credentials |
| POST | `/api/auth/register` | Admin creates new business account |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Current user profile |
| POST | `/api/auth/forgot-password` | Admin initiates password reset |
| POST | `/api/auth/reset-password` | Reset password with token |
| PUT | `/api/auth/change-password` | Change own password |

### Business (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/businesses/my` | Get my business |
| PUT | `/api/businesses/my` | Update business details |
| GET | `/api/businesses/my/cards` | Get my NFC cards |
| **PUT** | **`/api/businesses/cards/:cardId/destination`** | **★ Change NFC destination URL** |
| PUT | `/api/businesses/cards/:cardId` | Update card settings |

### NFC Redirect (Public - Optimized)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/s/:cardId` | **Core redirect** (cached, rate-limited) |
| GET | `/s/:cardId/info` | Card info without redirect |

### Admin (Admin Role Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Platform statistics |
| GET | `/api/admin/businesses` | List all businesses |
| POST | `/api/admin/businesses` | Create business + account |
| PUT | `/api/admin/businesses/:id` | Update/suspend business |
| DELETE | `/api/admin/businesses/:id` | Delete business |
| GET | `/api/admin/cards` | All NFC cards |
| POST | `/api/admin/cards` | Create/assign card |
| GET | `/api/admin/orders` | All orders |
| PUT | `/api/admin/orders/:id/status` | Update order status |

## Security Features

- ✅ Password hashing with bcrypt (12 rounds)
- ✅ JWT with HttpOnly cookies
- ✅ URL validation (only http/https, no javascript:)
- ✅ Rate limiting on all endpoints
- ✅ Stricter rate limiting on auth endpoints
- ✅ CORS configuration
- ✅ Helmet security headers
- ✅ Input sanitization
- ✅ MongoDB injection prevention (Mongoose)
- ✅ Visitor hash (no raw IP storage)
- ✅ Bot detection on redirect endpoint
- ✅ Cache invalidation on URL change

## Database Schema

### User
```javascript
{
  username: String,      // Admin-set, used for login
  password: String,      // bcrypt hashed
  email: String,
  fullName: String,
  role: 'admin' | 'business',
  isActive: Boolean,
  createdBy: ObjectId,   // Admin who created this account
  lastLoginAt: Date,
}
```

### Business
```javascript
{
  name: String,
  slug: String,          // URL-friendly identifier
  category: String,
  owner: ObjectId,       // Reference to User
  address: Object,
  phone: String,
  isActive: Boolean,
  isSuspended: Boolean,
  plan: String,
}
```

### NfcCard
```javascript
{
  cardId: String,        // Unique, encoded in NFC chip
  business: ObjectId,
  destinationUrl: String, // ★ What business owner changes
  label: String,         // "Main Counter", "Table 1", etc.
  isActive: Boolean,
  stats: { totalScans, todayScans, ... },
}
```

### ScanEvent
```javascript
{
  card: ObjectId,
  business: ObjectId,
  device: String,
  os: String,
  browser: String,
  visitorHash: String,   // Privacy-aware unique ID
  isUniqueVisitor: Boolean,
  timestamp: Date,
}
```

## Deployment

### Backend (Express)
- **Recommended:** Railway, Render, or DigitalOcean App Platform
- Set environment variables in platform dashboard
- MongoDB Atlas connection string in env

### Frontend (Next.js)
- **Recommended:** Vercel (native Next.js support)
- Set `NEXT_PUBLIC_API_URL` to your backend URL
- Automatic deployments from Git

### DNS
- Point `tapreview.com` to Vercel
- API routes proxied via `next.config.js` rewrites
- `/s/:cardId` redirects handled by backend

## Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret
FRONTEND_URL=https://tapreview.com
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=https://api.tapreview.com
NEXT_PUBLIC_SITE_URL=https://tapreview.com
```

## License

Proprietary — All rights reserved.
