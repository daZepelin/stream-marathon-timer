# Stream marathon timer
## What is this?
Subathon / Euroton timer for your live stream! This will generate a timer web page wich will use StreamLabs or StreamElements API socket to add time from every donation or even SuperChat donations on Youtube or stars on Facebook
## Features
- Support for Stream Labs and Stream Elements donation platforms;
- Creates browser source for OBS;
- Adds time for Youtube superchat, Facebook stars and regular donations;
- Control panel ui for all parameters:
![Controller!](https://i.imgur.com/pltNCoo.png "Controller")
- Authentification by using api keys:
![Auth!](https://i.imgur.com/ZJpHAaS.png "Auth")
- Implemented style customization:
![image](https://github.com/daZepelin/subathon-timer-bot/assets/63473480/50bd1fbd-70f8-4fcd-bb21-e12488557e08)
![image](https://github.com/daZepelin/subathon-timer-bot/assets/63473480/5e84c786-46bd-43d2-9911-0db66940826e)


## Requires
1. Stream Labs or Stream Elements as donation service;
2. Good stream content to generate enough donations. 😋
## Setting up:
1. Download an executable from latest release [Release](https://github.com/daZepelin/subaton-timer-bot/releases);
2. Install the application (yes, it will throw a warning about unreliable source);
3. Open Subathon Timer application.
4. Add browser source with the url: `http://localhost:1427/subathon-timer`
[Guide on adding browser source to OBS](https://www.blog.pulsoid.net/post/how-to-add-browser-source-in-obs-streamlabs-obs-twitch-studio-xsplit)
5. Go to Authentification tab and paste your token(-s).

## Admin System Setup

### Backend Configuration (for deployment)

The backend includes admin API endpoints for managing accounts and global settings.

#### Required Environment Variables

Create a `.env` file based on `.env.example`:

```bash
# Admin authentication token for backend API endpoints
ADMIN_TOKEN=your-secure-admin-token-here

# CORS allowed origins (comma-separated)
# For development: http://localhost:3001
# For production: https://your-admin-subdomain.example.com
CORS_ORIGINS=http://localhost:3001

# Server port (default: 3000)
PORT=3000
```

#### Admin API Endpoints

All admin endpoints require Bearer token authentication via the `Authorization` header:

```
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**Available endpoints:**
- `GET /api/admin/accounts` - List all registered accounts
- `GET /api/admin/accounts/:id` - Get specific account details
- `PATCH /api/admin/accounts/:id/settings` - Update account settings
- `GET /api/admin/settings` - Get global service settings
- `PATCH /api/admin/settings` - Update global service settings
- `GET /api/health` - Health check endpoint (no auth required)

#### Data Storage

The backend stores data in JSON files under the `data/` directory:
- `accounts.json` - List of registered accounts and their settings
- `settings.json` - Global service settings (e.g., maintenanceMode)

#### Deployment on Render

1. Set environment variables in Render dashboard:
   - `ADMIN_TOKEN` - Generate a secure random token
   - `CORS_ORIGINS` - Your admin dashboard URL
   - `PORT` - (optional, defaults to 3000)

2. The admin dashboard should be deployed separately as a subdomain (e.g., `admin.yourdomain.com`)

3. Ensure the admin dashboard's `BACKEND_API_URL` points to this backend service

