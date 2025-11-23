# Fix: "Cannot GET /api/v1/auth/signup"

## ❌ Error
```
Cannot GET /api/v1/auth/signup
```

## 🔍 Problem

You're using the **GET** method, but signup requires **POST** method.

---

## ✅ Solution

### In Postman:

1. **Change Method to POST:**
   - Look at the top left of Postman
   - There's a dropdown that says "GET"
   - Click it and select **"POST"**

2. **Set URL:**
   - `http://localhost:3000/api/v1/auth/signup`

3. **Set Headers:**
   - Key: `Content-Type`
   - Value: `application/json`

4. **Set Body:**
   - Click **Body** tab
   - Select **raw**
   - Select **JSON** from dropdown
   - Add your JSON:
   ```json
   {
     "email": "testuser@gmail.com",
     "password": "password123",
     "username": "testuser"
   }
   ```

5. **Click Send**

---

## 📋 Complete Request Setup

### Visual Guide:

```
┌─────────────────────────────────────────┐
│ [POST ▼] http://localhost:3000/api/v1/ │  ← Method must be POST!
│          auth/signup                    │
├─────────────────────────────────────────┤
│ Headers                                 │
│ ┌─────────────┬──────────────────────┐  │
│ │ Content-Type│ application/json     │  │
│ └─────────────┴──────────────────────┘  │
├─────────────────────────────────────────┤
│ Body (raw JSON)                         │
│ {                                       │
│   "email": "testuser@gmail.com",       │
│   "password": "password123",           │
│   "username": "testuser"               │
│ }                                       │
└─────────────────────────────────────────┘
```

---

## ❌ Common Mistakes

### Mistake 1: Using GET Instead of POST
```
❌ GET /api/v1/auth/signup
✅ POST /api/v1/auth/signup
```

### Mistake 2: No Body with POST
```
❌ POST request without body
✅ POST request with JSON body
```

### Mistake 3: Wrong Content-Type
```
❌ No Content-Type header
✅ Content-Type: application/json
```

---

## 📝 All HTTP Methods for Auth Routes

| Endpoint | Method | Requires Body? |
|----------|--------|----------------|
| `/api/v1/auth/signup` | **POST** | ✅ Yes (JSON) |
| `/api/v1/auth/login` | **POST** | ✅ Yes (JSON) |

**Both signup and login use POST, not GET!**

---

## 🧪 Quick Test

1. **Method:** `POST` (not GET!)
2. **URL:** `http://localhost:3000/api/v1/auth/signup`
3. **Headers:** `Content-Type: application/json`
4. **Body (raw JSON):**
   ```json
   {
     "email": "testuser@gmail.com",
     "password": "password123",
     "username": "testuser"
   }
   ```

---

## 💡 Why POST?

- **GET** = Retrieve data (no body, no side effects)
- **POST** = Create/submit data (requires body, creates resources)

Signup **creates** a new user, so it must be **POST**.

---

**Change the method from GET to POST and it will work!** 🚀

