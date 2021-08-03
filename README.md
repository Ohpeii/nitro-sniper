# Nitro Sniper Enhanced [![CodeFactor](https://www.codefactor.io/repository/github/giorgiobrux/nitro-sniper-enhanced/badge)](https://www.codefactor.io/repository/github/giorgiobrux/nitro-sniper-enhanced) ![GitHub issues](https://img.shields.io/github/issues/giorgiobrux/nitro-sniper-enhanced) [![GPLv3 license](https://img.shields.io/badge/License-GPLv3-blue.svg)](http://perso.crans.org/besson/LICENSE.html)
<img alt="img" align="right" src="https://user-images.githubusercontent.com/18328525/92536909-19ea5000-f23b-11ea-8fb7-524b4ba22f26.png">
Snipes nitro gift codes; with alt-support.<br>
A fork of the (previously-MIT licensed) sniper by slow.
  
# Features
<img alt="img" align="right" src="https://user-images.githubusercontent.com/18328525/93030855-88a61f80-f626-11ea-882f-3136ca00d26e.png">

- Beautiful colors to see quickly what you need to see.
- Multi-token support with all codes redeemed on your main.
- Notifications from the mobile discord app work if you don't use your main account for sniping too.
- Removes non-alphanumeric chars automatically from codes and tries to redeem.
- Supports `code&,junk` -> `code` obfuscation.
- Auto-detects fake codes by length or probability check.
- It remembers all codes it tries and won't check them again. (cached on disk).
- Optional webhook support; Avatar and username set by default.
- Will snipe privnotes searching for codes and saving the content to a file.
# Disclaimer
The use of selfbots is against the [discord TOS](https://discord.com/terms) and [guidelines](https://discord.com/guidelines).  
Before proceeding, make sure you understand the implications and can accept the consequences.

# Installation methods
#### Heroku (recommended)
The good guys at heroku have apparently blacklisted this repo.<br>
In order to deploy an heroku instance:
- Fork the repo.
- Go to https://dashboard.heroku.com/new?template=https://github.com/YOURUSERNAME/nitro-sniper-enhanced making sure to change `YOURUSERNAME` in the url to your actual github username.
- To update your fork, you can use the `Fetch upstream` button on github.

> ℹ️ While directly using someone else's fork is possible, it is heavily discouraged for novice users because malicious code can be added and if one becomes very popular it will also be blacklisted by heroku.

After deployment, make sure you go to your app -> Configure dynos/Resources and turn off `web` and start `worker`.<br>
You can then see logs by clicking on `More` (top right) and then `View logs`.<br>
To update see [here](https://github.com/GiorgioBrux/nitro-sniper-enhanced/issues/7#issuecomment-692116471) or just remove your app and recreate it.
#### Repl.it
Go to your dashboard, click on the plus button, import from github and type `giorgiobrux/nitro-sniper-enhanced`. <br>
Edit the .env file, making sure to set `replit` to `true`. <br>
No one else will be able to see the .env file even with public repos, so your tokens are safe. <br>
**IMPORTANT**: You need to use a service that periodically pings your repl.it app like [UptimeRobot](https://uptimerobot.com/), or else it will go in sleep mode. <br>
To update, run `git pull` from the shell.
#### Local
- Make sure [Node](https://nodejs.org/en/) 14+ is installed on your system and open a command prompt/terminal.
- Run `git clone https://github.com/giorgiobrux/nitro-sniper-enhanced nitro-sniper`
- Run `cd nitro-sniper`
- Run `npm install`
- Edit the .env file.
- Run `node .` <br>
To update, run `git pull`  
#### Docker
[Available on DockerHub](https://hub.docker.com/r/giorgiobrux/nitro-sniper) <br>
To update, use [watchtower](https://github.com/containrrr/watchtower) or similar. 

# Contributing
Pull requests are welcome.  
If you contribute, all your code will be licensed under GPL-3.0-or-later.  

# Tips
- Try to get a low latency to discord servers as there can be competition with other snipers.
- This is technically a self-bot: mentioning this in a discord chat is enough to make your account reportable to Trust & Safety.
- Running more than one instance or different snipers is an easy way to get your account deactivated.
- If you get a lot of nitro in a short amount of time, turn the sniper off for a while.
- Before using, consider the moral implications of stealing gifts from communities you have nothing to do with.

# License
[GPL-3.0-or-later](https://www.gnu.org/licenses/)  
Modified work Copyright (C) 2020-2021 All nitro-sniper-enhanced contributors  
Original work Copyright (C) 2020 slow | Sublicensed according to the MIT license available [here](https://opensource.org/licenses/MIT) or in the [LICENSE.md](https://github.com/GiorgioBrux/nitro-sniper-enhanced/blob/master/LICENSE.md) file.

