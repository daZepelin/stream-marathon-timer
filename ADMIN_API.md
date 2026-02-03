# Admin API Documentation

This document describes the admin API endpoints for the Stream Marathon Timer application.

## Authentication

All admin endpoints require authentication via the `X-Admin-Secret` header.

**Header:**
```
X-Admin-Secret: stream-marathon-admin-secret-key-2024
```

**Note:** In production, the admin secret should be set via the `ADMIN_SECRET` environment variable.

## Endpoints

### 1. Get All Accounts

List all registered accounts with their time left.

**Request:**
```
GET /admin/accounts
Headers:
  X-Admin-Secret: <admin-secret>
```

**Response:**
```json
{
  "success": true,
  "accounts": [
    {
      "id": 1,
      "name": "StreamLabsAccount",
      "platform": "streamlabs",
      "auth_key": "your-auth-key",
      "time_left": 3600
    }
  ]
}
```

### 2. Create Account

Create a new account.

**Request:**
```
POST /admin/accounts
Headers:
  X-Admin-Secret: <admin-secret>
  Content-Type: application/json
Body:
{
  "name": "StreamLabsAccount",
  "platform": "streamlabs",
  "auth_key": "your-auth-key",
  "time_left": 3600
}
```

**Response:**
```json
{
  "success": true,
  "id": 1,
  "message": "Account created successfully"
}
```

### 3. Update Account

Update an existing account.

**Request:**
```
PUT /admin/accounts/:id
Headers:
  X-Admin-Secret: <admin-secret>
  Content-Type: application/json
Body:
{
  "name": "UpdatedAccountName",
  "platform": "streamlabs",
  "auth_key": "updated-auth-key",
  "time_left": 7200
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account updated successfully"
}
```

### 4. Get Global Settings

Retrieve all global service settings.

**Request:**
```
GET /admin/settings
Headers:
  X-Admin-Secret: <admin-secret>
```

**Response:**
```json
{
  "success": true,
  "settings": [
    {
      "id": 1,
      "key": "dashboard_header_text",
      "value": "Stream Marathon Timer Admin Dashboard"
    },
    {
      "id": 2,
      "key": "welcome_message",
      "value": "Welcome to the admin panel"
    }
  ]
}
```

### 5. Update Setting

Update or create a global setting.

**Request:**
```
PUT /admin/settings
Headers:
  X-Admin-Secret: <admin-secret>
  Content-Type: application/json
Body:
{
  "key": "dashboard_header_text",
  "value": "My Custom Dashboard Header"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Setting updated successfully"
}
```

## Default Settings

The following settings are created by default:

- `dashboard_header_text`: "Stream Marathon Timer Admin Dashboard"
- `welcome_message`: "Welcome to the admin panel"

## Error Responses

### Missing Authentication
```json
{
  "success": false,
  "message": "Missing admin authentication header"
}
```

### Invalid Authentication
```json
{
  "success": false,
  "message": "Invalid admin secret"
}
```

### Not Found
```json
{
  "success": false,
  "message": "Account not found"
}
```

### Validation Error
```json
{
  "success": false,
  "message": "Missing required fields: name, platform, auth_key, time_left"
}
```

## Database

The admin API uses SQLite for data persistence. The database file is stored at `server/data/app.db`.

### Tables

**accounts:**
- id (INTEGER PRIMARY KEY)
- name (TEXT)
- platform (TEXT)
- auth_key (TEXT)
- time_left (INTEGER)

**global_settings:**
- id (INTEGER PRIMARY KEY)
- key (TEXT UNIQUE)
- value (TEXT)

## Usage Example with curl

```bash
# Get all accounts
curl -X GET http://localhost:3000/admin/accounts \
  -H "X-Admin-Secret: stream-marathon-admin-secret-key-2024"

# Create an account
curl -X POST http://localhost:3000/admin/accounts \
  -H "X-Admin-Secret: stream-marathon-admin-secret-key-2024" \
  -H "Content-Type: application/json" \
  -d '{"name":"StreamLabsAccount","platform":"streamlabs","auth_key":"test-key","time_left":3600}'

# Update an account
curl -X PUT http://localhost:3000/admin/accounts/1 \
  -H "X-Admin-Secret: stream-marathon-admin-secret-key-2024" \
  -H "Content-Type: application/json" \
  -d '{"name":"UpdatedAccount","platform":"streamlabs","auth_key":"new-key","time_left":7200}'

# Get all settings
curl -X GET http://localhost:3000/admin/settings \
  -H "X-Admin-Secret: stream-marathon-admin-secret-key-2024"

# Update a setting
curl -X PUT http://localhost:3000/admin/settings \
  -H "X-Admin-Secret: stream-marathon-admin-secret-key-2024" \
  -H "Content-Type: application/json" \
  -d '{"key":"dashboard_header_text","value":"My Custom Header"}'
```

## Security Considerations

1. **Admin Secret:** The admin secret should be kept confidential and only shared with the admin dashboard application.
2. **HTTPS:** In production, use HTTPS to protect the admin secret in transit.
3. **Environment Variable:** Set the `ADMIN_SECRET` environment variable to override the default secret.
4. **Database Access:** The database file should be protected with appropriate file system permissions.
