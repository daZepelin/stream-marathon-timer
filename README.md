# subaton-timer-bot
## What is this?
Subaton / Euroton timer for your stream! This will generate a timer web page wich will use StreamLabs or StreamElements API socket to add time from every donation or even SuperChat donations on Youtube or stars on Facebook
## Features
- Support for stream labs and stream elements donation platforms;
- Creates html file wich you can add as browser source on your OBS;
- Adds time for Youtube superchat and Facebook stars;
- Stores remaining time in file;
- Control panel ui for all parameters:
![Controller!](https://i.imgur.com/4gRQztP.png "Controller")
## Requires
1. Stream Labs or Stream Elements as donation service;
2. Good stream content to generate enough donations. 😋
## Setting up:
1. Download an executable from latest release [Release](https://github.com/daZepelin/subaton-timer-bot/releases);
2. Launch your executable file;
3. Now by going to http://localhost:3000/controller you will find full control panel of your timer and http://localhost:3000/ will display only the timer which you can add as obs web source. 
[Guide on adding browser source to OBS](https://www.blog.pulsoid.net/post/how-to-add-browser-source-in-obs-streamlabs-obs-twitch-studio-xsplit)
1. Last thing left to do is authentificating with your donation platform API token.
    - For StreamLabs go to https://streamlabs.com/dashboard#/settings/api-settings and from *API Settings* copy the *Your Socket API Token*.
    - For StreamElements go to https://streamelements.com/dashboard/account/channels click on *Show secrets* and copy the *JWT Token*.
2. Paste the auth code in the control panel *API Settings* and check your platform then click on *Submit*.
## Starting
Just launch the `*.exe` file the api key and the rest of the settings should be saved.
