# MongoDB Database Connection Diagnostic Guide

## Current Status

✅ **Configuration Verified:**
- Connection string: `mongodb+srv://jock-nfc:UClDoI6XVAv2Gj1R@cluster0.73lq38l.mongodb.net/tapreview`
- Database name: `tapreview`
- All required dependencies installed
- Backend configuration is correct

## How to Test the Database Connection

### Option 1: Run the Test Script (Recommended)

```bash
cd backend
node test-db.js
```

This will:
- ✅ Test the connection to MongoDB Atlas
- ✅ Create, read, update, and delete test data
- ✅ Check existing collections
- ✅ Verify server health
- ✅ Provide detailed error messages if something fails

### Option 2: Start the Backend Server

```bash
cd backend
npm install  # If not already installed
npm run dev
```

If the database connects successfully, you'll see:
```
✓ MongoDB Connected: cluster0.73lq38l.mongodb.net
╔══════════════════════════════════════════╗
║     TapReview Backend API Server         ║
║     Port: 5000                           ║
║     Env: development                     ║
╚══════════════════════════════════════════╝
```

### Option 3: Seed Initial Data

```bash
cd backend
npm run seed
```

This will create:
- Admin account (admin@tapreview.com / admin123)
- Sample business account (abcrestaurant / demo123)
- Sample NFC cards
- Sample analytics data

## Common Issues & Solutions

### Issue 1: "ENOTFOUND" or DNS Error

**Symptom:**
```
Error: getaddrinfo ENOTFOUND cluster0.73lq38l.mongodb.net
```

**Solution:**
- Check your internet connection
- Verify MongoDB Atlas cluster is running (not paused)
- Try pinging the cluster: `ping cluster0.73lq38l.mongodb.net`

### Issue 2: Authentication Failed

**Symptom:**
```
Error: Authentication failed
```

**Solution:**
- Verify username: `jock-nfc`
- Verify password: `UClDoI6XVAv2Gj1R`
- Check MongoDB Atlas → Database Access → Ensure user exists
- Reset password if needed in MongoDB Atlas

### Issue 3: IP Not Whitelisted

**Symptom:**
```
Error: IP address not whitelisted
```

**Solution:**
1. Go to MongoDB Atlas
2. Navigate to: Network Access
3. Click "Add IP Address"
4. Choose one of:
   - "Allow Access from Anywhere" (0.0.0.0/0) - for development
   - Add your current IP address - for production
5. Wait 1-2 minutes for changes to take effect

### Issue 4: Connection Timeout

**Symptom:**
```
Error: Connection timeout
```

**Solution:**
- Check firewall settings
- Verify port 27017 is not blocked
- Try connecting from a different network
- Check MongoDB Atlas cluster status

### Issue 5: Cluster Paused (Free Tier)

**Symptom:**
Connection works intermittently or fails after inactivity

**Solution:**
1. Go to MongoDB Atlas
2. Navigate to your cluster
3. Click "Resume" if paused
4. Consider upgrading to a paid tier for always-on clusters

## Verification Checklist

Run through this checklist to ensure everything is working:

- [ ] MongoDB Atlas cluster is running (not paused)
- [ ] Database user `jock-nfc` exists with correct password
- [ ] IP address is whitelisted in Network Access
- [ ] Connection string is correct in `.env` file
- [ ] Backend dependencies are installed (`npm install`)
- [ ] Test script runs successfully (`node test-db.js`)
- [ ] Backend server starts without errors (`npm run dev`)
- [ ] Can seed initial data (`npm run seed`)

## Quick Test Commands

```bash
# 1. Install dependencies
cd backend
npm install

# 2. Test connection
node test-db.js

# 3. Start server
npm run dev

# 4. In another terminal, test API
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-..."
}
```

## Database Structure

Once connected, your database will have these collections:

### Collections:
1. **users** - Admin and business owner accounts
2. **businesses** - Business/store information
3. **nfccards** - NFC card configurations
4. **scanevents** - Analytics data
5. **orders** - Customer orders
6. **products** - Available products

### Sample Data (after seeding):
- 1 Admin user
- 1 Business user
- 1 Business (ABC Restaurant)
- 4 NFC cards
- 100+ scan events
- 3 products

## Testing API Endpoints

After successful connection, test these endpoints:

```bash
# Health check
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

## Troubleshooting Steps

If the test script fails:

1. **Check MongoDB Atlas Dashboard**
   - Is the cluster running?
   - Is the database user active?
   - Is your IP whitelisted?

2. **Verify Connection String**
   ```bash
   # In backend folder
   cat .env | grep MONGODB_URI
   ```
   Should show your connection string

3. **Check Network Connectivity**
   ```bash
   # Test DNS resolution
   nslookup cluster0.73lq38l.mongodb.net
   
   # Test MongoDB port
   telnet cluster0.73lq38l.mongodb.net 27017
   ```

4. **Review Error Messages**
   - Copy the exact error message
   - Check the "Common Issues" section above
   - Search MongoDB documentation

## Next Steps After Successful Connection

1. **Seed the database:**
   ```bash
   npm run seed
   ```

2. **Start the backend:**
   ```bash
   npm run dev
   ```

3. **Test the frontend:**
   - Open http://localhost:5173
   - Login with seeded credentials
   - Verify data loads from MongoDB

4. **Monitor the database:**
   - Check MongoDB Atlas → Metrics
   - Monitor connections and operations
   - Set up alerts for issues

## Support Resources

- MongoDB Atlas Documentation: https://www.mongodb.com/docs/atlas/
- Mongoose Documentation: https://mongoosejs.com/docs/
- MongoDB University (Free): https://university.mongodb.com/

## Contact

If you continue to have issues after following this guide:
1. Run `node test-db.js` and copy the output
2. Check MongoDB Atlas cluster status
3. Verify all checklist items above
4. Provide the exact error message for further assistance
