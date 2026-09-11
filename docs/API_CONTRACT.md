# API Contract - Phase 1 (Sellable MVP)

**Version:** 1.0  
**Status:** PROPOSED - Awaiting Approval  
**Base URL:** `https://api.tapreview.com/api/v1`  
**Last Updated:** 2024

---

## Table of Contents

1. [Authentication](#1-authentication)
2. [Admin - Businesses](#2-admin---businesses)
3. [Admin - Cards](#3-admin---cards)
4. [Admin - Analytics](#4-admin---analytics)
5. [Business - Profile](#5-business---profile)
6. [Business - Cards](#6-business---cards)
7. [Business - Analytics](#7-business---analytics)
8. [Public - Redirect](#8-public---redirect)
9. [Error Handling](#9-error-handling)
10. [Rate Limiting](#10-rate-limiting)

---

## Response Format

All API responses follow this structure:

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req_abc123"
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {} // Optional additional details
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req_abc123"
  }
}
```

### Pagination
```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

---

## 1. Authentication

### 1.1 Login

**Endpoint:** `POST /auth/login`  
**Auth Required:** No  
**Rate Limit:** 5 requests per 15 minutes

**Request Body:**
```json
{
  "username": "joesrestaurant",
  "password": "securePassword123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_abc123",
      "username": "joesrestaurant",
      "email": "joe@example.com",
      "fullName": "Joe Smith",
      "role": "business",
      "businessId": "biz_xyz789",
      "isActive": true,
      "lastLoginAt": "2024-01-15T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- `400` - `VALIDATION_ERROR` - Missing or invalid fields
- `401` - `INVALID_CREDENTIALS` - Wrong username or password
- `403` - `ACCOUNT_INACTIVE` - Account is suspended
- `429` - `RATE_LIMIT_EXCEEDED` - Too many login attempts

**Security Notes:**
- Password is never returned
- Token is also set as HttpOnly cookie
- Failed attempts are logged
- Account locks after 5 failed attempts (15 min lockout)

---

### 1.2 Logout

**Endpoint:** `POST /auth/logout`  
**Auth Required:** Yes

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

**Notes:**
- Clears HttpOnly cookie
- Token is invalidated server-side (if session management implemented)

---

### 1.3 Get Current User

**Endpoint:** `GET /auth/me`  
**Auth Required:** Yes

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_abc123",
      "username": "joesrestaurant",
      "email": "joe@example.com",
      "fullName": "Joe Smith",
      "role": "business",
      "businessId": "biz_xyz789",
      "isActive": true,
      "lastLoginAt": "2024-01-15T10:30:00Z",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

**Error Responses:**
- `401` - `UNAUTHORIZED` - Invalid or expired token

---

### 1.4 Change Password

**Endpoint:** `PUT /auth/change-password`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newSecurePassword456"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Password changed successfully"
  }
}
```

**Error Responses:**
- `400` - `VALIDATION_ERROR` - Invalid password format
- `400` - `INCORRECT_PASSWORD` - Current password is wrong
- `401` - `UNAUTHORIZED` - Not authenticated

**Validation Rules:**
- New password must be at least 8 characters
- New password must contain at least one number
- New password must not match current password

---

## 2. Admin - Businesses

### 2.1 List Businesses

**Endpoint:** `GET /admin/businesses`  
**Auth Required:** Yes (Admin)  
**Rate Limit:** 100 requests per 15 minutes

**Query Parameters:**
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 20, max: 100) - Items per page
- `search` (optional) - Search by name or email
- `status` (optional) - Filter by status: `active`, `suspended`
- `sortBy` (optional, default: `createdAt`) - Sort field
- `sortOrder` (optional, default: `desc`) - Sort order: `asc`, `desc`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "businesses": [
      {
        "id": "biz_xyz789",
        "name": "Joe's Restaurant",
        "slug": "joes-restaurant",
        "category": "restaurant",
        "owner": {
          "id": "usr_abc123",
          "username": "joesrestaurant",
          "email": "joe@example.com",
          "fullName": "Joe Smith"
        },
        "cardCount": 3,
        "totalScans": 1247,
        "status": "active",
        "plan": "professional",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    ]
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "pages": 3
  }
}
```

**Error Responses:**
- `401` - `UNAUTHORIZED` - Not authenticated
- `403` - `FORBIDDEN` - Not admin

---

### 2.2 Get Business

**Endpoint:** `GET /admin/businesses/:id`  
**Auth Required:** Yes (Admin)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "business": {
      "id": "biz_xyz789",
      "name": "Joe's Restaurant",
      "slug": "joes-restaurant",
      "category": "restaurant",
      "description": "Authentic Italian cuisine",
      "owner": {
        "id": "usr_abc123",
        "username": "joesrestaurant",
        "email": "joe@example.com",
        "fullName": "Joe Smith",
        "lastLoginAt": "2024-01-15T10:30:00Z"
      },
      "address": {
        "street": "123 Main St",
        "city": "New York",
        "state": "NY",
        "zipCode": "10001",
        "country": "US"
      },
      "phone": "+1-555-0123",
      "website": "https://joesrestaurant.com",
      "logo": "https://cdn.tapreview.com/logos/biz_xyz789.png",
      "cardCount": 3,
      "totalScans": 1247,
      "status": "active",
      "plan": "professional",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

**Error Responses:**
- `404` - `BUSINESS_NOT_FOUND` - Business doesn't exist

---

### 2.3 Create Business

**Endpoint:** `POST /admin/businesses`  
**Auth Required:** Yes (Admin)

**Request Body:**
```json
{
  "name": "Joe's Restaurant",
  "category": "restaurant",
  "ownerName": "Joe Smith",
  "ownerEmail": "joe@example.com",
  "ownerUsername": "joesrestaurant",
  "temporaryPassword": "TempPass123!",
  "phone": "+1-555-0123",
  "website": "https://joesrestaurant.com",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "US"
  }
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "business": {
      "id": "biz_xyz789",
      "name": "Joe's Restaurant",
      "slug": "joes-restaurant",
      "category": "restaurant",
      "owner": {
        "id": "usr_abc123",
        "username": "joesrestaurant",
        "email": "joe@example.com"
      },
      "status": "active",
      "createdAt": "2024-01-15T10:30:00Z"
    },
    "credentials": {
      "username": "joesrestaurant",
      "temporaryPassword": "TempPass123!",
      "loginUrl": "https://tapreview.com/login"
    }
  }
}
```

**Error Responses:**
- `400` - `VALIDATION_ERROR` - Invalid data
- `409` - `DUPLICATE_EMAIL` - Email already exists
- `409` - `DUPLICATE_USERNAME` - Username already exists

**Validation Rules:**
- `name` - Required, 2-100 characters
- `category` - Required, must be valid enum
- `ownerName` - Required, 2-100 characters
- `ownerEmail` - Required, valid email
- `ownerUsername` - Required, 3-50 characters, alphanumeric + dash
- `temporaryPassword` - Required, min 8 characters
- `slug` - Auto-generated from name (lowercase, dashes)

**Notes:**
- Slug is auto-generated from business name
- If slug exists, append number (e.g., `joes-restaurant-2`)
- Credentials are returned ONLY in this response
- Admin should share credentials securely with business owner

---

### 2.4 Update Business

**Endpoint:** `PUT /admin/businesses/:id`  
**Auth Required:** Yes (Admin)

**Request Body:**
```json
{
  "name": "Joe's Italian Restaurant",
  "category": "restaurant",
  "phone": "+1-555-0124",
  "website": "https://joesitalian.com",
  "address": {
    "street": "456 Oak Ave",
    "city": "Brooklyn",
    "state": "NY",
    "zipCode": "11201",
    "country": "US"
  }
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "business": {
      "id": "biz_xyz789",
      "name": "Joe's Italian Restaurant",
      "slug": "joes-restaurant",
      "updatedAt": "2024-01-15T11:00:00Z"
    }
  }
}
```

**Error Responses:**
- `400` - `VALIDATION_ERROR` - Invalid data
- `404` - `BUSINESS_NOT_FOUND` - Business doesn't exist

**Notes:**
- Slug cannot be changed after creation
- Owner cannot be changed via this endpoint

---

### 2.5 Suspend Business

**Endpoint:** `PATCH /admin/businesses/:id/suspend`  
**Auth Required:** Yes (Admin)

**Request Body:**
```json
{
  "reason": "Violation of terms of service"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "business": {
      "id": "biz_xyz789",
      "status": "suspended",
      "suspendedReason": "Violation of terms of service",
      "suspendedAt": "2024-01-15T11:00:00Z"
    }
  }
}
```

**Error Responses:**
- `404` - `BUSINESS_NOT_FOUND` - Business doesn't exist

**Notes:**
- Suspended business cannot log in
- All cards for suspended business stop redirecting
- Business owner receives email notification (Phase 2)

---

### 2.6 Activate Business

**Endpoint:** `PATCH /admin/businesses/:id/activate`  
**Auth Required:** Yes (Admin)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "business": {
      "id": "biz_xyz789",
      "status": "active",
      "activatedAt": "2024-01-15T11:00:00Z"
    }
  }
}
```

**Error Responses:**
- `404` - `BUSINESS_NOT_FOUND` - Business doesn't exist

---

### 2.7 Reset Business Password

**Endpoint:** `POST /admin/businesses/:id/reset-password`  
**Auth Required:** Yes (Admin)

**Request Body:**
```json
{
  "newPassword": "NewTempPass456!"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Password reset successfully",
    "credentials": {
      "username": "joesrestaurant",
      "newPassword": "NewTempPass456!",
      "loginUrl": "https://tapreview.com/login"
    }
  }
}
```

**Error Responses:**
- `400` - `VALIDATION_ERROR` - Invalid password
- `404` - `BUSINESS_NOT_FOUND` - Business doesn't exist

**Notes:**
- Credentials returned ONLY in this response
- Admin should share new password securely

---

## 3. Admin - Cards

### 3.1 List All Cards

**Endpoint:** `GET /admin/cards`  
**Auth Required:** Yes (Admin)

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 20, max: 100)
- `status` (optional) - `unassigned`, `active`, `suspended`, `retired`
- `businessId` (optional) - Filter by business
- `search` (optional) - Search by publicCardId or label

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "cards": [
      {
        "id": "card_abc123",
        "publicCardId": "JOCK-A7F92K",
        "label": "Main Counter",
        "status": "active",
        "business": {
          "id": "biz_xyz789",
          "name": "Joe's Restaurant"
        },
        "destinationUrl": "https://g.page/r/joes-restaurant",
        "totalScans": 523,
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ]
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

---

### 3.2 Get Card

**Endpoint:** `GET /admin/cards/:id`  
**Auth Required:** Yes (Admin)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "card": {
      "id": "card_abc123",
      "publicCardId": "JOCK-A7F92K",
      "label": "Main Counter",
      "status": "active",
      "business": {
        "id": "biz_xyz789",
        "name": "Joe's Restaurant",
        "slug": "joes-restaurant"
      },
      "destinationUrl": "https://g.page/r/joes-restaurant",
      "type": "both",
      "physicalCard": {
        "serialNumber": "SN-2024-001234",
        "manufacturingDate": "2024-01-01T00:00:00Z"
      },
      "totalScans": 523,
      "todayScans": 12,
      "weekScans": 87,
      "monthScans": 342,
      "lastScannedAt": "2024-01-15T10:30:00Z",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

**Error Responses:**
- `404` - `CARD_NOT_FOUND` - Card doesn't exist

---

### 3.3 Create Card (Register Physical Card)

**Endpoint:** `POST /admin/cards`  
**Auth Required:** Yes (Admin)

**Request Body:**
```json
{
  "label": "Table 1",
  "serialNumber": "SN-2024-001235",
  "type": "both"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "card": {
      "id": "card_def456",
      "publicCardId": "JOCK-B8G03L",
      "label": "Table 1",
      "status": "unassigned",
      "business": null,
      "destinationUrl": null,
      "type": "both",
      "physicalCard": {
        "serialNumber": "SN-2024-001235"
      },
      "createdAt": "2024-01-15T11:00:00Z"
    }
  }
}
```

**Notes:**
- `publicCardId` is auto-generated (format: `JOCK-XXXXXX`)
- Card starts as `unassigned`
- No `destinationUrl` until assigned to business
- Admin can create cards in bulk (Phase 2)

---

### 3.4 Assign Card to Business

**Endpoint:** `POST /admin/cards/:id/assign`  
**Auth Required:** Yes (Admin)

**Request Body:**
```json
{
  "businessId": "biz_xyz789",
  "destinationUrl": "https://g.page/r/joes-restaurant",
  "label": "Main Counter"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "card": {
      "id": "card_def456",
      "publicCardId": "JOCK-B8G03L",
      "label": "Main Counter",
      "status": "active",
      "business": {
        "id": "biz_xyz789",
        "name": "Joe's Restaurant"
      },
      "destinationUrl": "https://g.page/r/joes-restaurant",
      "assignedAt": "2024-01-15T11:00:00Z"
    }
  }
}
```

**Error Responses:**
- `400` - `VALIDATION_ERROR` - Invalid data
- `400` - `CARD_ALREADY_ASSIGNED` - Card is already assigned
- `400` - `BUSINESS_CARD_LIMIT_EXCEEDED` - Business has reached card limit
- `404` - `CARD_NOT_FOUND` - Card doesn't exist
- `404` - `BUSINESS_NOT_FOUND` - Business doesn't exist
- `409` - `CONFLICT` - Race condition, retry

**Validation Rules:**
- Card must be `unassigned`
- Business must be `active`
- Business must not exceed card limit for their plan
- `destinationUrl` must be valid HTTP/HTTPS URL

**Notes:**
- Card status changes from `unassigned` to `active`
- Audit log entry created
- Business owner notified (Phase 2)

---

### 3.5 Reassign Card

**Endpoint:** `POST /admin/cards/:id/reassign`  
**Auth Required:** Yes (Admin)

**Request Body:**
```json
{
  "newBusinessId": "biz_abc999",
  "destinationUrl": "https://g.page/r/new-restaurant",
  "reason": "Card transferred to new business"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "card": {
      "id": "card_def456",
      "publicCardId": "JOCK-B8G03L",
      "status": "active",
      "business": {
        "id": "biz_abc999",
        "name": "New Restaurant"
      },
      "destinationUrl": "https://g.page/r/new-restaurant",
      "reassignedAt": "2024-01-15T11:00:00Z"
    }
  }
}
```

**Error Responses:**
- `400` - `CARD_NOT_ASSIGNED` - Card is not assigned
- `400` - `BUSINESS_CARD_LIMIT_EXCEEDED` - New business limit exceeded
- `404` - `CARD_NOT_FOUND` - Card doesn't exist
- `404` - `BUSINESS_NOT_FOUND` - New business doesn't exist

**Notes:**
- Old business is notified (Phase 2)
- Scan history remains with card
- Audit log entry created

---

### 3.6 Unassign Card

**Endpoint:** `POST /admin/cards/:id/unassign`  
**Auth Required:** Yes (Admin)

**Request Body:**
```json
{
  "reason": "Card returned by business"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "card": {
      "id": "card_def456",
      "publicCardId": "JOCK-B8G03L",
      "status": "unassigned",
      "business": null,
      "destinationUrl": null,
      "unassignedAt": "2024-01-15T11:00:00Z"
    }
  }
}
```

**Error Responses:**
- `400` - `CARD_NOT_ASSIGNED` - Card is not assigned
- `404` - `CARD_NOT_FOUND` - Card doesn't exist

**Notes:**
- Card status changes to `unassigned`
- `destinationUrl` is cleared
- Scan history is preserved
- Audit log entry created

---

### 3.7 Update Card Status

**Endpoint:** `PATCH /admin/cards/:id/status`  
**Auth Required:** Yes (Admin)

**Request Body:**
```json
{
  "status": "suspended",
  "reason": "Suspected fraud"
}
```

**Valid Status Transitions:**
- `unassigned` → `active` (via assign)
- `active` → `suspended`
- `active` → `retired`
- `active` → `unassigned` (via unassign)
- `suspended` → `active`
- `suspended` → `retired`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "card": {
      "id": "card_def456",
      "publicCardId": "JOCK-B8G03L",
      "status": "suspended",
      "suspendedReason": "Suspected fraud",
      "statusChangedAt": "2024-01-15T11:00:00Z"
    }
  }
}
```

**Error Responses:**
- `400` - `INVALID_STATUS_TRANSITION` - Cannot transition from current status
- `404` - `CARD_NOT_FOUND` - Card doesn't exist

---

### 3.8 Get Unassigned Cards (Inventory)

**Endpoint:** `GET /admin/cards/inventory`  
**Auth Required:** Yes (Admin)

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 20, max: 100)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "cards": [
      {
        "id": "card_def456",
        "publicCardId": "JOCK-B8G03L",
        "label": "Table 1",
        "status": "unassigned",
        "serialNumber": "SN-2024-001235",
        "createdAt": "2024-01-15T11:00:00Z"
      }
    ]
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "pages": 3
  }
}
```

**Notes:**
- Returns only cards with status `unassigned`
- Useful for inventory management
- Shows available cards for assignment

---

## 4. Admin - Analytics

### 4.1 Get Platform Stats

**Endpoint:** `GET /admin/analytics/stats`  
**Auth Required:** Yes (Admin)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "totalBusinesses": 45,
    "activeBusinesses": 42,
    "suspendedBusinesses": 3,
    "totalCards": 150,
    "activeCards": 120,
    "unassignedCards": 25,
    "suspendedCards": 5,
    "totalScans": 124789,
    "todayScans": 1247,
    "weekScans": 8742,
    "monthScans": 34521
  }
}
```

---

## 5. Business - Profile

### 5.1 Get My Profile

**Endpoint:** `GET /business/profile`  
**Auth Required:** Yes (Business)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "business": {
      "id": "biz_xyz789",
      "name": "Joe's Restaurant",
      "slug": "joes-restaurant",
      "category": "restaurant",
      "description": "Authentic Italian cuisine",
      "address": {
        "street": "123 Main St",
        "city": "New York",
        "state": "NY",
        "zipCode": "10001",
        "country": "US"
      },
      "phone": "+1-555-0123",
      "website": "https://joesrestaurant.com",
      "logo": "https://cdn.tapreview.com/logos/biz_xyz789.png",
      "cardCount": 3,
      "cardLimit": 10,
      "totalScans": 1247,
      "status": "active",
      "plan": "professional",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

---

### 5.2 Update My Profile

**Endpoint:** `PUT /business/profile`  
**Auth Required:** Yes (Business)

**Request Body:**
```json
{
  "name": "Joe's Italian Restaurant",
  "description": "Authentic Italian cuisine since 1990",
  "phone": "+1-555-0124",
  "website": "https://joesitalian.com",
  "address": {
    "street": "456 Oak Ave",
    "city": "Brooklyn",
    "state": "NY",
    "zipCode": "11201"
  }
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "business": {
      "id": "biz_xyz789",
      "name": "Joe's Italian Restaurant",
      "updatedAt": "2024-01-15T11:00:00Z"
    }
  }
}
```

**Notes:**
- Cannot change `slug`, `category`, `status`, `plan`
- Cannot change `owner` or `cardCount`
- Only whitelisted fields can be updated

---

## 6. Business - Cards

### 6.1 Get My Cards

**Endpoint:** `GET /business/cards`  
**Auth Required:** Yes (Business)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "cards": [
      {
        "id": "card_abc123",
        "publicCardId": "JOCK-A7F92K",
        "label": "Main Counter",
        "status": "active",
        "destinationUrl": "https://g.page/r/joes-restaurant",
        "nfcUrl": "https://tapreview.com/s/JOCK-A7F92K",
        "qrUrl": "https://tapreview.com/s/JOCK-A7F92K",
        "totalScans": 523,
        "todayScans": 12,
        "weekScans": 87,
        "monthScans": 342,
        "lastScannedAt": "2024-01-15T10:30:00Z",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

**Notes:**
- Returns ONLY cards owned by this business
- Includes NFC/QR URLs for sharing
- Ownership verified server-side

---

### 6.2 Get My Card

**Endpoint:** `GET /business/cards/:id`  
**Auth Required:** Yes (Business)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "card": {
      "id": "card_abc123",
      "publicCardId": "JOCK-A7F92K",
      "label": "Main Counter",
      "status": "active",
      "destinationUrl": "https://g.page/r/joes-restaurant",
      "nfcUrl": "https://tapreview.com/s/JOCK-A7F92K",
      "qrUrl": "https://tapreview.com/s/JOCK-A7F92K",
      "totalScans": 523,
      "todayScans": 12,
      "weekScans": 87,
      "monthScans": 342,
      "lastScannedAt": "2024-01-15T10:30:00Z",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

**Error Responses:**
- `403` - `FORBIDDEN` - Card does not belong to this business
- `404` - `CARD_NOT_FOUND` - Card doesn't exist

**Security Notes:**
- Ownership verification is CRITICAL
- Business can ONLY access their own cards
- Attempting to access another business's card returns 403

---

### 6.3 Update Card Destination

**Endpoint:** `PATCH /business/cards/:id`  
**Auth Required:** Yes (Business)  
**Rate Limit:** 10 requests per 15 minutes

**Request Body:**
```json
{
  "destinationUrl": "https://g.page/r/joes-restaurant-new",
  "label": "Main Entrance"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "card": {
      "id": "card_abc123",
      "publicCardId": "JOCK-A7F92K",
      "destinationUrl": "https://g.page/r/joes-restaurant-new",
      "label": "Main Entrance",
      "updatedAt": "2024-01-15T11:00:00Z"
    }
  }
}
```

**Error Responses:**
- `400` - `VALIDATION_ERROR` - Invalid URL or label
- `400` - `INVALID_URL_PROTOCOL` - Only HTTP/HTTPS allowed
- `403` - `FORBIDDEN` - Card does not belong to this business
- `404` - `CARD_NOT_FOUND` - Card doesn't exist
- `429` - `RATE_LIMIT_EXCEEDED` - Too many updates

**Validation Rules:**
- `destinationUrl` - Must be valid HTTP/HTTPS URL
- `destinationUrl` - Cannot be IP address
- `destinationUrl` - Cannot be localhost (in production)
- `label` - Optional, max 50 characters

**Security Notes:**
- Ownership verification is CRITICAL
- Business can ONLY update their own cards
- URL validation prevents malicious redirects
- Rate limiting prevents abuse

---

## 7. Business - Analytics

### 7.1 Get My Analytics Overview

**Endpoint:** `GET /business/analytics/overview`  
**Auth Required:** Yes (Business)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "totalScans": 1247,
    "todayScans": 47,
    "weekScans": 312,
    "monthScans": 1247,
    "uniqueVisitors": 892,
    "cardCount": 3
  }
}
```

---

### 7.2 Get My Analytics Timeline

**Endpoint:** `GET /business/analytics/timeline`  
**Auth Required:** Yes (Business)

**Query Parameters:**
- `period` (optional, default: `30d`) - `7d`, `30d`, `90d`, `1y`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "timeline": [
      {
        "date": "2024-01-01",
        "scans": 42,
        "uniqueVisitors": 38
      },
      {
        "date": "2024-01-02",
        "scans": 56,
        "uniqueVisitors": 51
      }
    ]
  }
}
```

---

### 7.3 Get My Analytics by Card

**Endpoint:** `GET /business/analytics/cards`  
**Auth Required:** Yes (Business)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "cards": [
      {
        "cardId": "card_abc123",
        "publicCardId": "JOCK-A7F92K",
        "label": "Main Counter",
        "totalScans": 523,
        "todayScans": 12,
        "weekScans": 87,
        "monthScans": 342,
        "uniqueVisitors": 389,
        "lastScannedAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

**Notes:**
- Returns ONLY cards owned by this business
- Ownership verified server-side

---

## 8. Public - Redirect

### 8.1 NFC/QR Redirect

**Endpoint:** `GET /s/:publicCardId`  
**Auth Required:** No  
**Rate Limit:** 30 requests per minute per IP

**Success Response (302):**
```
HTTP/1.1 302 Found
Location: https://g.page/r/joes-restaurant
X-Response-Time: 45ms
```

**Error Responses:**
- `404` - Card not found or inactive (returns friendly error page)
- `403` - Business suspended (returns friendly error page)
- `429` - Rate limit exceeded

**Flow:**
1. Visitor taps NFC or scans QR
2. Request hits `/s/JOCK-A7F92K`
3. Backend looks up card (cache → database)
4. Backend validates card status and business status
5. Backend records scan event (async, non-blocking)
6. Backend redirects to `destinationUrl`

**Performance Targets:**
- p50: < 50ms
- p95: < 100ms
- p99: < 200ms

**Security Notes:**
- No private information exposed
- Invalid cards return generic error
- Suspended businesses return generic error
- Rate limiting prevents abuse

---

## 9. Error Handling

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `INVALID_CREDENTIALS` | 401 | Wrong username or password |
| `UNAUTHORIZED` | 401 | Not authenticated |
| `FORBIDDEN` | 403 | Not authorized for this action |
| `ACCOUNT_INACTIVE` | 403 | Account is suspended |
| `NOT_FOUND` | 404 | Resource not found |
| `BUSINESS_NOT_FOUND` | 404 | Business doesn't exist |
| `CARD_NOT_FOUND` | 404 | Card doesn't exist |
| `DUPLICATE_EMAIL` | 409 | Email already exists |
| `DUPLICATE_USERNAME` | 409 | Username already exists |
| `CARD_ALREADY_ASSIGNED` | 409 | Card is already assigned |
| `CONFLICT` | 409 | Race condition |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": {
      "email": "Invalid email format",
      "password": "Password must be at least 8 characters"
    }
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req_abc123"
  }
}
```

---

## 10. Rate Limiting

### Rate Limits by Endpoint

| Endpoint | Limit | Window |
|----------|-------|--------|
| `POST /auth/login` | 5 requests | 15 minutes |
| `POST /auth/register` | 3 requests | 1 hour |
| `GET /admin/*` | 100 requests | 15 minutes |
| `GET /business/*` | 100 requests | 15 minutes |
| `PATCH /business/cards/:id` | 10 requests | 15 minutes |
| `GET /s/:publicCardId` | 30 requests | 1 minute |
| All other endpoints | 100 requests | 15 minutes |

### Rate Limit Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642249200
```

---

## API Versioning

Current version: `v1`

Base URL: `https://api.tapreview.com/api/v1`

Future versions will use `/api/v2`, `/api/v3`, etc.

---

## Authentication

All protected endpoints require JWT token in one of:

1. **Authorization Header:**
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

2. **HttpOnly Cookie:**
   ```
   Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

Token expires after 7 days.

---

## Next Steps

1. Review this API contract
2. Approve or request changes
3. Implement backend according to this contract
4. Update frontend to use these endpoints
5. Test all endpoints with Postman/Insomnia
6. Write integration tests

---

**Document Status:** PROPOSED  
**Awaiting Approval:** Yes  
**Implementation Status:** NOT STARTED
