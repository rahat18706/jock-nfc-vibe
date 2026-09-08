# Database Connection Test - Quick Start

## 🎯 TL;DR - Just Run This:

```bash
cd backend
node test-db.js
```

If you see `🎉 All tests passed!` → **Database is working!** ✅

---

## 📋 Complete Testing Guide

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Test Database Connection
```bash
node test-db.js
```

**Success Output:**
```
🔍 Testing MongoDB Connection...

📡 Test 1: Connecting to MongoDB Atlas...
✅ Connected successfully!

📝 Test 2: Testing database operations...
✅ Created test document
✅ Read document successfully
✅ Updated document successfully
✅ Deleted test document successfully

📊 Test 3: Checking existing collections...
✅ Found collections

💓 Test 4: Connection health check...
✅ Server status: OK

🎉 All tests passed! Database is working correctly.
```

### Step 3: Seed Database (Optional)
```bash
npm run seed
```

Creates:
- Admin account: `admin` / `admin123`
- Business account: `abcrestaurant` / `demo123`
- Sample businesses, NFC cards, and products

### Step 4: Start Backend
```bash
npm run dev
```

Expected output:
```
✓ MongoDB Connected: cluster0.73lq38l.mongodb.net
```

### Step 5: Test API
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{"status":"ok","timestamp":"..."}
```

---

## 🔍 What to Check in MongoDB Atlas

1. **Is cluster running?**
   - Go to: https://cloud.mongodb.com/
   - Check Cluster0 status

2. **Is IP whitelisted?**
   - Network Access → Add IP Address
   - Use `0.0.0.0/0` for development

3. **Does user exist?**
   - Database Access → Check `jock-nfc` user

---

## 🚨 Common Issues

### "IP not whitelisted"
→ Add `0.0.0.0/0` in Network Access

### "Authentication failed"
→ Verify username/password in MongoDB Atlas

### "Cluster paused"
→ Click "Resume" in MongoDB Atlas

---

## 📊 Database Info

- **Connection:** `mongodb+srv://jock-nfc:***@cluster0.73lq38l.mongodb.net/tapreview`
- **Database:** `tapreview`
- **Cluster:** `Cluster0`

---

## ✅ Success Indicators

- [ ] `node test-db.js` passes all tests
- [ ] `npm run seed` creates sample data
- [ ] `npm run dev` shows "MongoDB Connected"
- [ ] `curl localhost:5000/api/health` returns OK
- [ ] Can login via frontend

---

## 📁 Documentation Files

- `backend/test-db.js` - Connection test script
- `backend/seed.js` - Database seeder
- `backend/README_DATABASE.md` - Detailed guide
- `DATABASE_VERIFICATION.md` - Complete status report
- `DATABASE_DIAGNOSTIC.md` - Troubleshooting guide

---

## 🎉 You're Ready!

Your database configuration is **correct**. Just run:

```bash
cd backend
node test-db.js
```

If it passes → Database is working! ✅
