# Test Credentials for Postman

## ✅ Valid Test Data

Use these credentials when testing the API in Postman:

### Signup Request

```json
{
  "email": "testuser@gmail.com",
  "password": "password123",
  "username": "testuser",
  "display_name": "Test User",
  "bio": "This is a test account"
}
```

### Alternative Test Emails

If `testuser@gmail.com` is already taken, try:

```json
{
  "email": "testuser1@gmail.com",
  "password": "password123",
  "username": "testuser1"
}
```

Or use any of these formats:
- `yourname@gmail.com`
- `test123@yahoo.com`
- `demo@outlook.com`
- `sample@hotmail.com`

---

## ❌ Invalid Test Data (Will Fail)

### Don't Use These:

```json
// ❌ Invalid - example.com is often rejected
{
  "email": "test@example.com"
}

// ❌ Invalid - missing @ symbol
{
  "email": "testexample.com"
}

// ❌ Invalid - no domain
{
  "email": "test@"
}

// ❌ Invalid - password too short
{
  "password": "123"
}

// ❌ Invalid - username too short
{
  "username": "ab"
}

// ❌ Invalid - username with special characters
{
  "username": "test-user!"
}
```

---

## 📋 Complete Valid Request Example

### Headers:
```
Content-Type: application/json
```

### Body (raw JSON):
```json
{
  "email": "testuser@gmail.com",
  "password": "password123",
  "username": "testuser",
  "display_name": "Test User",
  "bio": "Testing the API"
}
```

---

## 🔍 Validation Rules

### Email:
- ✅ Must contain `@` symbol
- ✅ Must have domain (e.g., `gmail.com`)
- ✅ Must have top-level domain (e.g., `.com`)
- ❌ `example.com` domain may be rejected by Supabase
- ❌ Use real email domains for testing

### Password:
- ✅ Minimum 6 characters
- ✅ Can contain letters, numbers, symbols

### Username:
- ✅ 3-20 characters
- ✅ Letters, numbers, and underscores only
- ✅ No spaces or special characters

---

## 🧪 Quick Test Sequence

1. **Signup:**
   ```json
   POST /api/v1/auth/signup
   {
     "email": "testuser@gmail.com",
     "password": "password123",
     "username": "testuser"
   }
   ```

2. **Login:**
   ```json
   POST /api/v1/auth/login
   {
     "email": "testuser@gmail.com",
     "password": "password123"
   }
   ```

3. **Get Profile:**
   ```
   GET /api/v1/profiles/me
   Authorization: Bearer YOUR_TOKEN_HERE
   ```

---

## 💡 Tips

1. **Use unique emails** - If you get "already registered" error, use a different email
2. **Use unique usernames** - If you get "username taken" error, add numbers
3. **Use real email domains** - Gmail, Yahoo, Outlook work best
4. **Save tokens** - Copy the token from login/signup response for authenticated requests

---

**Use `testuser@gmail.com` or similar real email domains for testing!** 🚀

