# Environment Variables for Render Deployment

## Complete List of Environment Variables to Add in Render

When deploying to Render, add these environment variables in your Web Service settings:

### 1. GOOGLE_API_KEY (REQUIRED)
**Value:** `AIzaSyAvMclZ2csSLWC0pjmzy4VBkVPEatYKgJE`

**Description:** Google Gemini API key for AI-powered features (product search, recommendations, virtual try-on)

**Alternative name:** Can also be set as `GEMINI_API_KEY` (the code checks both)

---

### 2. MONGODB_URI (REQUIRED for database features)
**Value:** `mongodb+srv://piyushaga2005:Piyush%402005@cluster0.wvhet4s.mongodb.net/`

**Description:** MongoDB connection string for database features (authentication, cart persistence, order history)

**Note:** If not provided, the backend will work in memory-only mode (no persistent data)

---

### 3. MONGODB_DB_NAME (OPTIONAL)
**Value:** `shopsage`

**Description:** MongoDB database name

**Default:** `shopsage` (if not specified)

---

### 4. JWT_SECRET_KEY (REQUIRED if using MongoDB)
**Value:** `piyush2005`

**Description:** Secret key for JWT token generation and validation (used for user authentication)

**Security Note:** For production, generate a strong random key:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

**Recommended production value:** Generate a new secure key like `xK9mP2vL8nQ4wR7tY6uI3oP5aS1dF0gH2jK4lM9nB8vC3xZ`

---

### 5. FAL_KEY (OPTIONAL)
**Value:** `917e0e50-8ea9-4436-9ae4-0a7b03ea3c58:f1b4d888fd0daa33562a65244189e1de`

**Description:** FAL.ai API key (if using FAL.ai services for image generation)

**Note:** Only needed if you're using FAL.ai features

---

### 6. PYTHON_VERSION (OPTIONAL)
**Value:** `3.11.0`

**Description:** Python version to use

**Default:** Render will use latest Python 3 if not specified

---

## Quick Copy-Paste Format for Render

Add these in Render Dashboard → Your Service → Environment → Add Environment Variable:

```
Key: GOOGLE_API_KEY
Value: AIzaSyAvMclZ2csSLWC0pjmzy4VBkVPEatYKgJE

Key: MONGODB_URI
Value: mongodb+srv://piyushaga2005:Piyush%402005@cluster0.wvhet4s.mongodb.net/

Key: MONGODB_DB_NAME
Value: shopsage

Key: JWT_SECRET_KEY
Value: piyush2005

Key: FAL_KEY
Value: 917e0e50-8ea9-4436-9ae4-0a7b03ea3c58:f1b4d888fd0daa33562a65244189e1de

Key: PYTHON_VERSION
Value: 3.11.0
```

---

## Priority Levels

### ⚠️ CRITICAL (Must have for basic functionality)
- `GOOGLE_API_KEY` - Without this, AI features won't work

### 🔒 IMPORTANT (Required for full features)
- `MONGODB_URI` - Required for authentication, persistent cart, and order history
- `JWT_SECRET_KEY` - Required if using MongoDB authentication

### ✅ OPTIONAL (Nice to have)
- `MONGODB_DB_NAME` - Has a default value
- `FAL_KEY` - Only if using FAL.ai services
- `PYTHON_VERSION` - Render will use a default

---

## CORS Configuration

**Note:** CORS is configured to allow all origins (`allow_origins=["*"]`) for hackathon/demo purposes. This means your frontend can be hosted anywhere and will work without CORS issues. No need to configure FRONTEND_URL!

## MongoDB Atlas Setup (If Using Database Features)

If you're using MongoDB, make sure to:

1. **Whitelist Render IPs:**
   - Go to MongoDB Atlas → Network Access
   - Add IP Address: `0.0.0.0/0` (allows all IPs)
   - Or add specific Render IP ranges

2. **Verify Connection String:**
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/`
   - Make sure password is URL-encoded (spaces = %20, @ = %40, etc.)

3. **Test Connection:**
   - After deployment, check Render logs for MongoDB connection status
   - Look for: "✅ MongoDB enabled - authentication and database features active"

---

## Security Recommendations for Production

### 1. Generate New JWT Secret
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```
Replace `piyush2005` with the generated value.

### 2. Rotate API Keys
Consider rotating your Google API key periodically for security.

### 3. Use MongoDB Atlas IP Whitelist
Instead of `0.0.0.0/0`, add specific Render IP ranges if possible.

### 4. Enable MongoDB Authentication
Ensure your MongoDB user has appropriate permissions (readWrite on your database).

---

## Verification After Deployment

After adding all environment variables and deploying:

### 1. Check Health Endpoint
```bash
curl https://your-backend-url.onrender.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "components": 15
}
```

### 2. Check MongoDB Status
```bash
curl https://your-backend-url.onrender.com/
```

Look for `"mongodb_enabled": true` in the response.

### 3. Test Chat Endpoint
```bash
curl -X POST https://your-backend-url.onrender.com/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "show me sunglasses", "session_id": "test"}'
```

---

## Troubleshooting

### MongoDB Connection Fails
- Check if `MONGODB_URI` is correct
- Verify IP whitelist includes `0.0.0.0/0`
- Check MongoDB Atlas user permissions
- Look for connection errors in Render logs

### CORS Errors
- **FIXED:** CORS is now configured to allow all origins for hackathon/demo
- No CORS configuration needed - it will work from any frontend URL

### Gemini API Errors
- Verify `GOOGLE_API_KEY` is correct
- Check API quota in Google AI Studio
- Look for API errors in Render logs

---

## Need Help?

Check Render logs for detailed error messages:
1. Go to Render Dashboard
2. Click on your service
3. Navigate to "Logs" tab
4. Look for error messages in red

Common log messages:
- ✅ "MongoDB enabled" - Database connected successfully
- ⚠️ "MongoDB disabled" - Running in memory-only mode
- ❌ "Gemini API key not configured" - Missing or invalid API key
