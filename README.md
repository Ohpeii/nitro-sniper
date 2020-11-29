# Nitro Sniper Enhanced [![CodeFactor](https://www.codefactor.io/repository/github/giorgiobrux/nitro-sniper-enhanced/badge)](https://www.codefactor.io/repository/github/giorgiobrux/nitro-sniper-enhanced) ![GitHub issues](https://img.shields.io/github/issues/giorgiobrux/nitro-sniper-enhanced) [![GPLv3 license](https://img.shields.io/badge/License-GPLv3-blue.svg)](http://perso.crans.org/besson/LICENSE.html)
<img alt="img" align="right" src="https://user-images.githubusercontent.com/18328525/92536909-19ea5000-f23b-11ea-8fb7-524b4ba22f26.png">
Snipes nitro gift codes; with alt-support.<br>
A fork of the (previously-MIT licensed) sniper by hellbound1337.
  
# Features
<img alt="img" align="right" src="https://user-images.githubusercontent.com/18328525/93030855-88a61f80-f626-11ea-882f-3136ca00d26e.png">

- Beautiful colors to see quickly what you need to see.
- Multi-token support with all codes redeemed on your main.
- Notifications from the mobile discord app work if you don't use your main account for sniping too.
- Removes non-alphanumeric chars automatically from codes and tries to redeem.
- Supports `code&,junk` -> `code` obfuscation.
- Auto-detects fake codes by length or probability check.
- It remembers all codes it tries and won't check them again. (clears on restart).
- Optional webhook support; Avatar and username set by default.
# Disclaimer
The use of selfbots is against the [discord TOS](https://discord.com/terms) and [guidelines](https://discord.com/guidelines).  
Before proceeding, make sure you understand the implications and can accept the consequences.

# Installation methods
#### Heroku (recommended)
Click on the image below and login to continue the setup.<br>
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/giorgiobrux/nitro-sniper/tree/master)  
Make sure you go to your app -> Configure dynos/Resources and turn off `web` and start `worker`.<br>
You can then see logs by clicking on `More` (top right) and then `View logs`.<br>
To update see [here](https://github.com/GiorgioBrux/nitro-sniper-enhanced/issues/7#issuecomment-692116471).
#### Local
- Make sure [Node](https://nodejs.org/en/) is installed on your system and open a command prompt/terminal.
- Run `git clone https://github.com/giorgiobrux/nitro-sniper-enhanced nitro-sniper`
- Run `cd nitro-sniper`
- Run `npm install`
- Edit the dotenv file. <br>
    - To insert multiple tokens in the guildTokens variable, use `,` as a separator. <br> 
    - The useMain can be either true or false. If it's false the mainToken won't be checked to avoid destroying it.
    - If you want to use a webhook, put the url in the webhookUrl field.
- Run `node .`
#### Docker
[Available on DockerHub](https://hub.docker.com/r/giorgiobrux/nitro-sniper)

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
Modified work Copyright (C) 2020 GiorgioBrux  
Original work Copyright (C) 2020 hellrising1337 | Sublicensed according to the MIT license available [here](https://opensource.org/licenses/MIT) or in the [LICENSE.md](https://github.com/GiorgioBrux/nitro-sniper-enhanced/blob/master/LICENSE.md) file.

