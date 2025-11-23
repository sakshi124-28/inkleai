# Fix: JSON Syntax Error

## ❌ Error
```
SyntaxError: Expected ',' or '}' after property value in JSON at position 91
```

This means your JSON has a **syntax error** - likely a missing comma, extra comma, or formatting issue.

---

## ✅ Common JSON Syntax Errors

### Error 1: Missing Comma

**❌ Wrong:**
```json
{
  "email": "test@gmail.com"
  "password": "pass123"
}
```

**✅ Correct:**
```json
{
  "email": "test@gmail.com",
  "password": "pass123"
}
```

### Error 2: Trailing Comma

**❌ Wrong:**
```json
{
  "email": "test@gmail.com",
  "password": "pass123",
}
```

**✅ Correct:**
```json
{
  "email": "test@gmail.com",
  "password": "pass123"
}
```

### Error 3: Single Quotes Instead of Double Quotes

**❌ Wrong:**
```json
{
  'email': 'test@gmail.com',
  'password': 'pass123'
}
```

**✅ Correct:**
```json
{
  "email": "test@gmail.com",
  "password": "pass123"
}
```

### Error 4: Unclosed Quotes

**❌ Wrong:**
```json
{
  "email": "test@gmail.com,
  "password": "pass123"
}
```

**✅ Correct:**
```json
{
  "email": "test@gmail.com",
  "password": "pass123"
}
```

### Error 5: Missing Closing Brace

**❌ Wrong:**
```json
{
  "email": "test@gmail.com",
  "password": "pass123"
```

**✅ Correct:**
```json
{
  "email": "test@gmail.com",
  "password": "pass123"
}
```

---

## ✅ Correct JSON Format for Signup

**Copy this EXACT format:**

```json
{
  "email": "testuser@gmail.com",
  "password": "password123",
  "username": "testuser"
}
```

**With optional fields:**

```json
{
  "email": "testuser@gmail.com",
  "password": "password123",
  "username": "testuser",
  "display_name": "Test User",
  "bio": "This is a test bio"
}
```

---

## 🔍 How to Find the Error

The error message says "at position 91" - this tells you where the error is:

1. **Count characters** from the start of your JSON
2. **Position 91** is where the error occurs
3. **Check around that position** for:
   - Missing comma
   - Extra comma
   - Unclosed quote
   - Wrong quote type

---

## ✅ Step-by-Step Fix

### Step 1: Copy This Template

```json
{
  "email": "",
  "password": "",
  "username": ""
}
```

### Step 2: Fill in Your Values

```json
{
  "email": "testuser@gmail.com",
  "password": "password123",
  "username": "testuser"
}
```

### Step 3: Verify Format

- [ ] All quotes are **double quotes** `"`
- [ ] **Comma** after each property (except last)
- [ ] **No comma** after last property
- [ ] All quotes are **closed**
- [ ] Opening `{` and closing `}`

### Step 4: Validate JSON

Use an online JSON validator:
- https://jsonlint.com/
- https://jsonformatter.org/

Paste your JSON and it will show errors.

---

## 🧪 Test Your JSON

Before sending to the API, validate it:

1. **Copy your JSON**
2. **Go to:** https://jsonlint.com/
3. **Paste and validate**
4. **Fix any errors**
5. **Then use in Postman**

---

## 📋 Complete Working Example

**Method:** `POST`  
**URL:** `http://localhost:3000/api/v1/auth/signup`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "email": "newuser@gmail.com",
  "password": "password123",
  "username": "newuser123"
}
```

---

## ❌ Common Mistakes Checklist

- [ ] Using single quotes `'` instead of double quotes `"`
- [ ] Missing comma between properties
- [ ] Trailing comma after last property
- [ ] Unclosed quotes in string values
- [ ] Missing closing brace `}`
- [ ] Extra opening brace `{`
- [ ] Spaces in property names (should be in quotes)

---

## 💡 Pro Tip: Use Postman's JSON Formatter

1. **Paste your JSON** in Postman body
2. **Right-click** in the body area
3. **Select "Format Document"** or press `Ctrl+Shift+I` (Windows) / `Cmd+Shift+I` (Mac)
4. Postman will **auto-format** and show syntax errors

---

## 🆘 Still Getting Errors?

1. **Use the template above** - copy it exactly
2. **Only change the values** - don't change the structure
3. **Validate online** at jsonlint.com
4. **Check backend console** - it now shows better error messages

---

**Copy the correct JSON format above and replace only the values!** 🚀

