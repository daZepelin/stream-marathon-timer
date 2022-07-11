# subaton-timer-bot
## What is this?
Subaton / Euroton timer for your stream! This will generate a timer web page wich will use StreamLabs or StreamElements API socket to add time from every donation or even SuperChat donations on Youtube.
## Requires:
1. [NodeJS](https://nodejs.org/en/download/current/) (18 or higher);
2. Stream Labs or Stream Elements as donation service;
3. Good stream content to generate enough donations. 😋
## Setting up:
1. Make sure you have NodeJS installed;
2. Download and unpack Latest app [Release](https://github.com/daZepelin/subaton-timer-bot/releases);
3. Open the folder and while holding down Shift right click to see *Open PowerShell window here* option and click on it;
![An old rock in the desert](https://i.imgur.com/dL5WmRM.png "IMG1")
4. In a PowerShell window enter the following:
```
npm i
```
5. After the process is done start the app by entering the following;
```
npm start
```
6. Now by going to http://localhost:3000/controller you will find full control panel of your timer and http://localhost:3000/ will display only the timer which you can add as obs web source. 
[Guide on adding browser source to OBS](https://www.blog.pulsoid.net/post/how-to-add-browser-source-in-obs-streamlabs-obs-twitch-studio-xsplit)
7. Last thing left to do is authentificating with your donation platform API token.
    - For StreamLabs go to https://streamlabs.com/dashboard#/settings/api-settings and from *API Settings* copy the *Your Socket API Token*.
    - For StreamElements go to https://streamelements.com/dashboard/account/channels click on *Show secrets* and copy the *JWT Token*.
8. Paste the auth code in the control panel *API Settings* and check your platform then click on *Submit*.
