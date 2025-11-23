# Quick Fix: Empty Body in Postman

## 🎯 The Problem

Body is empty `{}` even though you set Content-Type. This is a **Postman configuration issue**.

---

## ✅ 5-Step Fix (Do This Now!)

### 1. Method = POST ✅
```
[POST ▼]  ← Must be POST, not GET
```

### 2. Headers Tab ✅
```
Key: Content-Type
Value: application/json
Checkbox: ✓ (checked)
```

### 3. Body Tab - Select "raw" ✅
```
Click "Body" tab
Select ● raw (not form-data, not x-www-form-urlencoded)
```

### 4. Body Tab - Select "JSON" ✅
```
Look for dropdown on right side
Change from "Text" to "JSON"  ← THIS IS CRITICAL!
```

### 5. Paste JSON ✅
```json
{
  "email": "testuser@gmail.com",
  "password": "password123",
  "username": "testuser"
}
```

---

## 🖼️ Visual Guide

```
┌─────────────────────────────────────────────┐
│ [POST ▼] http://localhost:3000/api/v1/auth/ │
│          signup                              │
├─────────────────────────────────────────────┤
│ [Params] [Authorization] [Headers] [Body]   │
│                                              │
│ Headers Tab:                                 │
│ ┌─────────────┬──────────────────────┬─────┐ │
│ │ Content-Type│ application/json     │ ✓   │ │
│ └─────────────┴──────────────────────┴─────┘ │
│                                              │
│ Body Tab:                                    │
│ ○ none                                       │
│ ○ form-data                                  │
│ ○ x-www-form-urlencoded                      │
│ ● raw                    [JSON ▼]  ← HERE! │
│                                              │
│ ┌──────────────────────────────────────────┐ │
│ │ {                                       │ │
│ │   "email": "testuser@gmail.com",       │ │
│ │   "password": "password123",           │ │
│ │   "username": "testuser"               │ │
│ │ }                                       │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│                    [Send]                    │
└─────────────────────────────────────────────┘
```

---

## ⚠️ Most Common Issue

**The dropdown next to "raw" is set to "Text" instead of "JSON"!**

Fix:
1. Click the dropdown (says "Text" or "JSON")
2. Select **"JSON"**
3. Now paste your JSON

---

## 🧪 Test First

Before signup, test body parsing:

**Request:**
```
POST http://localhost:3000/api/v1/test-body
Headers: Content-Type: application/json
Body (raw JSON): { "test": "value" }
```

**If you see:**
```json
{
  "success": true,
  "received": {
    "body": { "test": "value" }
  }
}
```

**Then body parsing works!** Try signup again.

---

## ✅ Checklist

- [ ] Method = POST
- [ ] Headers: Content-Type = application/json
- [ ] Body tab = raw
- [ ] Dropdown = JSON (not Text!)
- [ ] JSON pasted in body
- [ ] Click Send

---

**The dropdown must say "JSON" not "Text"!** 🚀

