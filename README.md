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

## Admin API
The application now includes admin API endpoints for managing accounts and global settings. These endpoints are secured with an admin secret key and are intended to be accessed only by the admin dashboard application.

For detailed API documentation, see [ADMIN_API.md](./ADMIN_API.md).

**Key Features:**
- Secure admin authentication using `X-Admin-Secret` header
- Account management (list, create, update)
- Global settings management (dashboard header text, etc.)
- SQLite database for persistent storage

**Admin Endpoints:**
- `GET /admin/accounts` - List all registered accounts with time left
- `POST /admin/accounts` - Create a new account
- `PUT /admin/accounts/:id` - Update account settings
- `GET /admin/settings` - Get global service settings
- `PUT /admin/settings` - Update global service settings

## Setting up:
1. Download an executable from latest release [Release](https://github.com/daZepelin/subaton-timer-bot/releases);
2. Install the application (yes, it will throw a warning about unreliable source);
3. Open Subathon Timer application.
4. Add browser source with the url: `http://localhost:1427/subathon-timer`
[Guide on adding browser source to OBS](https://www.blog.pulsoid.net/post/how-to-add-browser-source-in-obs-streamlabs-obs-twitch-studio-xsplit)
5. Go to Authentification tab and paste your token(-s).
