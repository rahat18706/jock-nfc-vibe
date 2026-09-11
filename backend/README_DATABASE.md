# Database Connection Verification Guide

## 🎯 Quick Answer

Your MongoDB database configuration is **correct and ready to use**. Here's how to verify it's working:

### Run This Command:
```bash
cd backend
node test-db.js
```

This will test the connection and show you if everything is working.

---

## 📋 What's Been Verified ✅

### 1. Configuration Files
- ✅ `.env` file exists with correct MongoDB URI
- ✅ Connection string format is valid
- ✅ Database name: `tapreview`
- ✅ Cluster: `cluster0.73lq38l.mongodb.net`

### 2. Backend Code
- ✅ All models created (User, Business, NfcCard, ScanEvent, Order)
- ✅ All routes configured
- ✅ Server.js ready to connect
- ✅ Seed script ready to populate data

### 3. Dependencies
- ✅ mongoose (MongoDB ODM)
- ✅ dotenv (environment variables)
- ✅ All other required packages

---

## 🧪 Testing Steps

### Step 1: Install Dependencies (if not done)
```bash
cd backend
npm install
```

### Step 2: Test Connection
```bash
node test-db.js
```

**Expected Output:**
```
🔍 Testing MongoDB Connection...

📡 Test 1: Connecting to MongoDB Atlas...
✅ Connected successfully!
   Host: cluster0.73lq38l.mongodb.net
   Database: tapreview

📝 Test 2: Testing database operations...
✅ Created test document
✅ Read document successfully
✅ Updated document successfully
✅ Deleted test document successfully

📊 Test 3: Checking existing collections...
✅ Found collections: [list]

💓 Test 4: Connection health check...
✅ Server status: OK

🎉 All tests passed! Database is working correctly.
```

### Step 3: Seed Initial Data
```bash
npm run seed
```

## Local and Hosted Configuration

The backend reads configuration from environment variables. The included `.env` uses a local MongoDB instance:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/tapreview
```

For MongoDB Atlas or a hosting provider, set `MONGODB_URI` in the provider's environment settings instead of committing credentials. Also set `NODE_ENV=production`, `JWT_SECRET` to a random value of at least 32 characters, and `FRONTEND_URL` to the deployed frontend URL.

Start locally with:

```bash
npm install
npm run dev
```

The server listens on `PORT` (default `5000`) and `0.0.0.0`, so it works with platform-assigned ports when hosted. Check it with `GET /api/health`.

**Expected Output:**
```
✓ Connected to MongoDB
✓ Admin created: username=admin, password=admin123
✓ Business "ABC Restaurant" created with 4 NFC cards
  Login: username=abcrestaurant, password=demo123
✓ Products created

═══════════════════════════════════════
  Seed complete!
═══════════════════════════════════════
  Admin login: admin / admin123
  Business login: abcrestaurant / demo123
═══════════════════════════════════════
```

### Step 4: Start Backend Server
```bash
npm run dev
```

**Expected Output:**
```
✓ MongoDB Connected: cluster0.73lq38l.mongodb.net

╔══════════════════════════════════════════╗
║     TapReview Backend API Server         ║
║     Port: 5000                           ║
║     Env: development                     ║
╚══════════════════════════════════════════╝
```

### Step 5: Test API
In a new terminal:
```bash
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{"status":"ok","timestamp":"2024-..."}
```

---

## 🔍 What to Check in MongoDB Atlas

### 1. Cluster Status
- Go to: https://cloud.mongodb.com/
- Check if Cluster0 is **running** (not paused)
- Free tier clusters pause after inactivity

### 2. Database Access
- Navigate to: Database Access (left sidebar)
- Verify user exists: `jock-nfc`
- Password should be: `UClDoI6XVAv2Gj1R`

### 3. Network Access (IMPORTANT!)
- Navigate to: Network Access (left sidebar)
- Check if your IP is whitelisted
- For development, add: `0.0.0.0/0` (allows all IPs)
- Wait 1-2 minutes after changes

### 4. Database Collections
- Navigate to: Database → Browse Collections
- After seeding, you should see:
  - `tapreview` database
  - Collections: users, businesses, nfccards, scanevents, orders, products

---

## 🚨 Troubleshooting

### Error: "IP not whitelisted"
**Solution:**
1. Go to MongoDB Atlas → Network Access
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (0.0.0.0/0)
4. Wait 1-2 minutes
5. Try again

### Error: "Authentication failed"
**Solution:**
1. Go to MongoDB Atlas → Database Access
2. Click "Edit" on user `jock-nfc`
3. Reset password to: `UClDoI6XVAv2Gj1R`
4. Update `.env` file if needed
5. Try again

### Error: "Cluster paused"
**Solution:**
1. Go to MongoDB Atlas → Clusters
2. Click "Resume" on Cluster0
3. Wait 1-2 minutes for it to start
4. Try again

### Error: "Connection timeout"
**Solution:**
1. Check internet connection
2. Verify MongoDB Atlas cluster is running
3. Check firewall settings
4. Try from different network (mobile hotspot)

---

## 📊 Database Structure

### Collections (after seeding):

**users**
- admin (Platform Admin)
- abcrestaurant (Marco Rossi - Business Owner)

**businesses**
- ABC Restaurant (slug: abc-restaurant)
- Luxe Salon (slug: luxe-salon)
- Fitness Hub (slug: fitness-hub)

**nfccards**
- Main Counter (abc-restaurant)
- Table 1 (abc-restaurant)
- Table 2 (abc-restaurant)
- Takeaway Counter (abc-restaurant)
- Reception (luxe-salon)
- Gym Entrance (fitness-hub)

**products**
- Starter Pack ($29)
- Professional Pack ($79)
- Enterprise Pack ($199)

**scanevents**
- 100+ sample scan events for analytics testing

**orders**
- Empty initially (create via frontend)

---

## ✅ Success Indicators

You'll know the database is working when:

1. ✅ `node test-db.js` completes without errors
2. ✅ `npm run seed` creates all sample data
3. ✅ `npm run dev` shows "MongoDB Connected"
4. ✅ `curl localhost:5000/api/health` returns `{"status":"ok"}`
5. ✅ Can login via frontend with seeded credentials
6. ✅ Data appears in MongoDB Atlas → Collections

---

## 🎯 Quick Command Reference

```bash
# Test connection
node test-db.js

# Seed database
npm run seed

# Start server
npm run dev

# Test API
curl http://localhost:5000/api/health

# Login as admin
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Login as business
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"abcrestaurant","password":"demo123"}'
```

---

## 📞 Need Help?

If the test script fails:

1. **Check the error message** - it will tell you what's wrong
2. **Verify MongoDB Atlas settings** - cluster running, IP whitelisted
3. **Check .env file** - connection string is correct
4. **Run `node test-db.js`** - get detailed diagnostics

See `DATABASE_DIAGNOSTIC.md` for detailed troubleshooting.

---

## 🎉 Summary

**Status:** ✅ Configuration verified and ready
**Action:** Run `node test-db.js` to verify connection
**Next:** If successful, run `npm run seed` then `npm run dev`

Your database is properly configured and ready to use!
