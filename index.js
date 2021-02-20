/*
Nitro Sniper enhanced ed.
Modified work Copyright (C) 2020-2021 Nitro-sniper-enhanced contributors
Original work Copyright (C) 2020 slow | Sublicensed according to the MIT license available at <https://opensource.org/licenses/MIT> or in the LICENSE.md file in the root folder.

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>. */

const {version} = require('./package.json');
const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36";
const regex = new RegExp(/(discord\.gift\/|discord\.com\/gifts\/|discordapp\.com\/gifts\/)[^\s]+/gmi);
const privnote = new RegExp(/(?<=privnote.com\/)[^\s]+/);
const privid = new RegExp(/[^#]*/);
const privpass = new RegExp(/[^#]*$/);

const dotenv = require('dotenv').config({path: 'dotenv'});
const axios = require('axios').default;
const rateLimit = require('axios-rate-limit');
const http = rateLimit(axios.create(), {maxRequests: 10, perMilliseconds: 60000})

const chalk = require('chalk');
const CryptoJS = require("crypto-js");
const syncrq = require('sync-request');
fs = require('fs');

const {Client, WebhookClient, MessageEmbed} = require('discord.js-light');

const useMain = process.env.useMain;
const tokens = process.env.guildTokens.split(',').filter(item => item);
const mainToken = process.env.mainToken;

let nitro_webhookUrl = process.env.nitro_webhookUrl;
let notes_webhookUrl = process.env.notes_webhookUrl;

let legitimacyCheck = process.env.legitimacyCheck;
let obfuscationCheck = process.env.obfuscationCheck;
let notesCheck = process.env.notesCheck;
let writeNotes = process.env.writeNotes;
let permanentCache = process.env.permanentCache;
let webhookping_userid = process.env.webhookping_userid;
let usedTokens = [];

let tokenStatus = process.env.tokenStatus;

if (useMain === 'true' && mainToken != null) tokens.unshift(mainToken);
console.log(`%c    _   ___ __                _____       _                   
   / | / (_) /__________     / ___/____  (_)___  ___  _____   
  /  |/ / / __/ ___/ __ \\    \\__ \\/ __ \\/ / __ \\/ _ \\/ ___/   
 / /|  / / /_/ /  / /_/ /   ___/ / / / / / /_/ /  __/ /       
/_/ |_/_/\\__/_/_  \\____/   /____/_/ /_/_/ .___/\\___/_/      __
  ___  ____  / /_  ____ _____  ________/_/___/ /  ___  ____/ /
 / _ \\/ __ \\/ __ \\/ __ \`/ __ \\/ ___/ _ \\/ __  /  / _ \\/ __  / 
/  __/ / / / / / / /_/ / / / / /__/  __/ /_/ /  /  __/ /_/ /  
\\___/_/ /_/_/ /_/\\__,_/_/ /_/\\___/\\___/\\__,_/   \\___/\\__,_/ `, "font-family:monospace");

console.log(chalk`{magenta [Nitro Sniper]} {cyan (INFO)} {blueBright Welcome!}`);
console.log(chalk`{magenta [Nitro Sniper]} {cyan (INFO)} {blueBright Running version} {blueBright.bold ${version}}{blueBright .}`);
console.log(chalk`{magenta [Nitro Sniper]} {cyan (INFO)} {redBright This program is licensed under GPL-3.0-or-later and provided free of charge at https://github.com/GiorgioBrux/nitro-sniper-enhanced.}`);

function check_webhook(webhookUrl, type) {
    if (webhookUrl === '') {
        console.log(chalk`{magenta [Nitro Sniper]} {cyan (INFO)} {blueBright The ${type} webhook is empty, skipping...}`);
        return null;
    }


    const webhooktoken = /[^/]*$/.exec(webhookUrl)[0];
    const webhookid = webhookUrl.replace(/^.*\/(?=[^\/]*\/[^\/]*$)|\/[^\/]*$/g, '');
    if (webhooktoken == null || webhookid == null || webhooktoken.length < webhookid.length || !/https:\/\/(ptb\.|canary\.|)(discordapp|discord)\.com\/api\/webhooks\/[0-9]+\/.+/g.test(webhookUrl)) {
        console.log(chalk`{magenta [Nitro Sniper]} {rgb(242,46,46) (ERROR)} {red The ${type} webhook url is not valid. Skipping...}`);
        return null;
    }
    console.log(chalk`{magenta [Nitro Sniper]} {cyan (INFO)} {blueBright Using ${type} webhook with id: [${webhookid}] and token: [${webhooktoken}].}`);
    if (!webhookping_userid || webhookping_userid.length === 0 || webhookping_userid === "") {
        console.log(chalk`{magenta [Nitro Sniper]} {yellowBright (WARNING)} {rgb(255,245,107) webhookping_userid is not set correctly or is undefined. Defaulting to none.}`);
    } else {
        console.log(chalk`{magenta [Nitro Sniper]} {cyan (INFO)} {blueBright The userid [${webhookping_userid}] will be pinged in the nitro_webhook.}`);
    }
    return new WebhookClient(webhookid, webhooktoken);
}

nitro_webhookclient = check_webhook(nitro_webhookUrl, 'nitro');
notes_webhookclient = check_webhook(notes_webhookUrl, 'notes');


function send_webhook_nitro(res_type, guild, giver, tokenname, timetaken, code, msgurl) {
    if (!nitro_webhookclient) return;
    const embed = new MessageEmbed()
        .setTitle(`Sniped gift successfully!`)
        .setColor('#1ce829')
        .addField('Where', `${guild}`, true)
        .addField('Account used', `${tokenname}`, true)
        .addField('Giver', `${giver}`, true)
        .addField('Time taken', `${timetaken}`, true)
        .addField('Type of sub', `${res_type}`, true)
        .addField('Giftcode', `${code}`, true)
        .addField('​', `[Click here for the message.](${msgurl})`, false);
    nitro_webhookclient.send('', {
        username: 'Nitro Sniper',
        avatarURL: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcS0JCyNz1WwaTkXB3jcr0MlMLIwXAsHjhoIRw&usqp=CAU',
        embeds: [embed]
    }).catch(err => {
        console.log(chalk`{magenta [Nitro Sniper]} {rgb(242,46,46) (ERROR)} {red Tried to send nitro webhook embed but got error: ${err}.}`);
    });
}

function send_webhook_notes(noteweb, guild, giver, tokenname, content, msgurl) {
    if (!notes_webhookUrl) return;
    const embed = new MessageEmbed()
        .setTitle(`Sniped note successfully!`)
        .setColor('#1ce5e8')
        .addField('Where', `${guild}`, true)
        .addField('Account used', `${tokenname}`, true)
        .addField('​', '​', true) //Dummy field
        .addField('Sender', `${giver}`, true)
        .addField('Type', `${noteweb}`, true)
        .addField('Content', `${content}`, false)
        .addField('​', `[Click here for the message.](${msgurl})`, false);
    notes_webhookclient.send(`${webhookping_userid ? ` <@${webhookping_userid}>` : ""}`, {
        username: 'Nitro Sniper',
        avatarURL: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcS0JCyNz1WwaTkXB3jcr0MlMLIwXAsHjhoIRw&usqp=CAU',
        embeds: [embed]
    }).catch(err => {
        console.log(chalk`{magenta [Nitro Sniper]} {rgb(242,46,46) (ERROR)} {red Tried to send notes webhook embed but got error: ${err}.}`);
    });
}

if (!tokens || tokens.length === 0) {
    console.log(chalk`{magenta [Nitro Sniper]} {rgb(242,46,46) (FATAL ERROR)} {red There is no token to login to, please check your configuration.}`);
    console.log(chalk`{magenta [Nitro Sniper]} {rgb(242,46,46) (FATAL ERROR)} {red Quitting...}`);
    process.exit();
}
if (useMain !== 'true' && useMain !== 'false')
    console.log(chalk`{magenta [Nitro Sniper]} {yellowBright (WARNING)} {rgb(255,245,107) useMain is not set correctly or is undefined. Defaulting to false.}`);
if (legitimacyCheck !== 'true' && legitimacyCheck !== 'false')
    console.log(chalk`{magenta [Nitro Sniper]} {yellowBright (WARNING)} {rgb(255,245,107) legitimacyCheck is not set correctly or is undefined. Defaulting to false.}`);
if (obfuscationCheck !== 'true' && obfuscationCheck !== 'false')
    console.log(chalk`{magenta [Nitro Sniper]} {yellowBright (WARNING)} {rgb(255,245,107) obfuscationCheck is not set correctly or is undefined. Defaulting to false.}`);
if (notesCheck !== 'true' && notesCheck !== 'false')
    console.log(chalk`{magenta [Nitro Sniper]} {yellowBright (WARNING)} {rgb(255,245,107) notesCheck is not set correctly or is undefined. Defaulting to false.}`);
if (permanentCache !== 'true' && permanentCache !== 'false')
    console.log(chalk`{magenta [Nitro Sniper]} {yellowBright (WARNING)} {rgb(255,245,107) permanentCache is not set correctly or is undefined. Defaulting to false.}`);
else if (permanentCache === 'true')
    if (!fs.existsSync("./usedTokens.json"))
        console.log(chalk`{magenta [Nitro Sniper]} {cyan (INFO)} {blueBright There is no usedTokens cache to load.}`);
    else {
        let file = fs.readFileSync("./usedTokens.json")

        if (file.length !== 0)
            try {
                usedTokens = JSON.parse(file);
            } catch (e) {
                console.log(chalk`{magenta [Nitro Sniper]} {rgb(242,46,46) (ERROR)} {red Couldn't load usedTokens cache because of error: ${e}.}`);
                permanentCache = 'false';
            }
        console.log(chalk`{magenta [Nitro Sniper]} {cyan (INFO)} {blueBright Successfully read ${usedTokens.length} tokens from the usedTokens cache.}`);
    }

if (writeNotes !== 'true' && writeNotes !== 'false')
    console.log(chalk`{magenta [Nitro Sniper]} {yellowBright (WARNING)} {rgb(255,245,107) writeNotes is not set correctly or is undefined. Defaulting to false.}`);
else if (writeNotes === 'true')
    if (!fs.existsSync("./notes"))
        fs.mkdirSync("./notes") //Create notes folder if it doesn't exist

const ressyncq = syncrq('GET', 'https://discord.com/api/v6/users/@me/billing/payment-sources', {
    headers: {
        'authorization': mainToken,
        'user-agent': userAgent,
    }
});

var ps = JSON.parse(ressyncq.body.toString());

if (ps['message'] === '401: Unauthorized') {
    console.log(chalk`{magenta [Nitro Sniper]} {rgb(242,46,46) (FATAL ERROR)} {red Main token not valid: ${ps['message']}.}`)
    console.log(chalk`{magenta [Nitro Sniper]} {rgb(242,46,46) (FATAL ERROR)} {red Quitting...}`)
    process.exit();
} else if (ps.length === 0) {
    console.log(chalk`{magenta [Nitro Sniper]} {yellowBright (WARNING)} {rgb(255,245,107) Main token does not have a billing source, some codes will not be sniped.}`);
    var paymentsourceid = 'null';
} else if (ps[0]) {
    var paymentsourceid = ps[0].id
} else {
    console.log(chalk`{magenta [Nitro Sniper]} {rgb(242,46,46) (FATAL ERROR)} {red Unable to get billing source: ${JSON.stringify(ps)}.}`)
    process.exit();
}


for (const token of tokens) {
    const client = new Client({ //https://discord.js.org/#/docs/main/v11/typedef/ClientOptions
        cacheGuilds: true,
        cacheChannels: false,
        cacheOverwrites: false,
        cacheRoles: false,
        cacheEmojis: false,
        cachePresences: false,
        messageCacheLifetime: 1,
        messageCacheMaxSize: 2,
        messageSweepInterval: 5,
        disabledEvents: [
            "GUILD_UPDATE",
            "GUILD_MEMBER_ADD",
            "GUILD_MEMBER_REMOVE",
            "GUILD_MEMBER_UPDATE",
            "GUILD_MEMBERS_CHUNK",
            "GUILD_ROLE_CREATE",
            "GUILD_ROLE_DELETE",
            "GUILD_ROLE_UPDATE",
            "GUILD_BAN_ADD",
            "GUILD_BAN_REMOVE",
            "CHANNEL_UPDATE",
            "CHANNEL_PINS_UPDATE",
            "MESSAGE_DELETE",
            "MESSAGE_UPDATE",
            "MESSAGE_DELETE_BULK",
            "MESSAGE_REACTION_ADD",
            "MESSAGE_REACTION_REMOVE",
            "MESSAGE_REACTION_REMOVE_ALL",
            "USER_UPDATE",
            "USER_NOTE_UPDATE",
            "USER_SETTINGS_UPDATE",
            "PRESENCE_UPDATE",
            "VOICE_STATE_UPDATE",
            "TYPING_START",
            "VOICE_SERVER_UPDATE",
            "RELATIONSHIP_ADD",
            "RELATIONSHIP_REMOVE",
        ]
    });

    client.on('message', async msg => {
        if (msg.author.id === client.user.id) return; //We don't want to snipe our own messages
        var codes = msg.content.match(regex);
        if (!codes || codes.length === 0) {
            var codes = [];
        }
        if (msg.embeds.length > 0) {
            msg.embeds.forEach((embed) => {
                if (embed.fields) {
                    for (let field of embed.fields) {
                        codes.push(String(field.name).match(regex));
                        codes.push(String(field.value).replace(/[\]\)]$/gm, '').match(regex));
                    }
                }
                if (embed.author) {
                    if (embed.author.name) {
                        codes.push(String(embed.author.name).match(regex));
                    }
                }
                if (embed.description) {
                    codes.push(String(embed.description).match(regex));
                }
                if (embed.footer) {
                    if (embed.footer.text) {
                        codes.push(String(embed.footer.text).match(regex));
                    }
                }
                if (embed.title) {
                    codes.push(String(embed.title).match(regex));
                }
            })
            var codes = codes.filter(e => e !== 'null').filter(Boolean).flat();
        }
        if (!codes || codes.length === 0) {
            if (notesCheck === 'false') return;
            else {
                let priv = msg.content.match(privnote);
                if (!priv || priv.length === 0) return;
                priv = priv.splice(0, 1).toString(); //Why is the splice necessary? No idea
                let id = priv.match(privid).splice(0, 1).toString();
                let pass = priv.match(privpass).splice(0, 1).toString();
                if (!id || !pass || id === pass) return console.log(chalk`{magenta [Nitro Sniper]} {rgb(28,232,41) [+]} {rgb(137,96,142) Sniped privnote ]${id}#${pass}] - Invalid URL - ${msg.guild ? msg.guild.name : "DM"} from ${msg.author.tag}.}`);
                else {
                    axios({
                        url: `https://privnote.com/${id}`,
                        method: 'DELETE',
                        parse: 'json',
                        headers: {
                            'Content-type': 'application/x-www-form-urlencoded',
                            'Content-Length': '0',
                            'DNT': '1',
                            'X-Requested-With': 'XMLHttpRequest',
                            'Origin': 'https:\/\/privnote.com',
                            'Referer': 'https:\/\/privnote.com\/hidden',
                            'Sec-Fetch-Dest': 'empty',
                            'Sec-Fetch-Mode': 'cors',
                            'Sec-Fetch-Site': 'same-origin',
                            'User-Agent': userAgent
                        }
                    })
                        .then((res) => {
                            if (!res.data.hasOwnProperty('data'))
                                return console.log(chalk`{magenta [Nitro Sniper]} {rgb(28,232,41) [+]} {rgb(137,96,142) Sniped privnote [${id}#${pass}] - Non-existant/Already destroyed - ${msg.guild ? msg.guild.name : "DM"} from ${msg.author.tag}.}`);
                            else { //Decrypt gibberish-aes
                                let data = CryptoJS.AES.decrypt(res.data.data, pass);
                                data = data.toString(CryptoJS.enc.Utf8)
                                if (!data || data.length === 0)
                                    return console.log(chalk`{magenta [Nitro Sniper]} {rgb(28,232,41) [+]} {rgb(137,96,142) Sniped privnote [${id}#${pass}] - Non-existant/Already destroyed - ${msg.guild ? msg.guild.name : "DM"} from ${msg.author.tag}.}`);
                                codes = data.match(regex);
                                send_webhook_notes('privnote.com', (msg.guild ? msg.guild.name : "DMs"), msg.author.tag, client.user.tag, data, msg.url);
                                if (writeNotes === 'true') {

                                    id = id.replace(/[^/\w\s]/gi, ''); //Make id filename-safe
                                    fs.writeFile(`./notes/privnote-${id}.txt`, data, function (err) {
                                        if (err)
                                            console.log(chalk`{magenta [Nitro Sniper]} {rgb(28,232,41) [+]} {rgb(137,96,142) Sniped privnote [${id}#${pass}] - Couldn't save it to file because of err: ${err.message} - ${msg.guild ? msg.guild.name : "DM"} from ${msg.author.tag}.}`);
                                        else
                                            console.log(chalk`{magenta [Nitro Sniper]} {rgb(28,232,41) [+]} {rgb(137,96,142) Sniped privnote [${id}#${pass}] - Saved to file ./notes/privnote-${id}.txt - ${msg.guild ? msg.guild.name : "DM"} from ${msg.author.tag}.}`);
                                    });
                                } else console.log(chalk`{magenta [Nitro Sniper]} {rgb(28,232,41) [+]} {rgb(137,96,142) Sniped privnote [${id}#${pass}] - ${msg.guild ? msg.guild.name : "DM"} from ${msg.author.tag}.}`);

                            }
                        })
                        .catch((err) => {
                            return console.log(chalk`{magenta [Nitro Sniper]} {rgb(28,232,41) [+]} {rgb(137,96,142) Sniped privnote [${id}#${pass}] - Error: ${err} - ${msg.guild ? msg.guild.name : "DM"} from ${msg.author.tag}.}`);
                        })
                    if (!codes || codes.length === 0) return;
                }
            }
        }
        for (let code of codes) {
            let start = new Date();

            code = code.replace(/(discord\.gift\/|discord\.com\/gifts\/|discordapp\.com\/gifts\/)/gmi, '');
            if (obfuscationCheck === 'true') {
                let code_no_symbols = code.replace(/\W/g, '');
                let code_no_obfuscation = code.replace(/\W.*/g, '');
                if (code_no_symbols !== code_no_obfuscation) {
                    if (code_no_symbols.length > 26 && code_no_symbols.length < 16) code = code_no_symbols;
                    else if (code_no_obfuscation.length > 26 && code_no_obfuscation < 16) code = code_no_obfuscation;
                } else if (code_no_symbols !== code) code = code_no_symbols;
            }
            if (legitimacyCheck === 'true') {
                const numeric = code.replace(/[^0-9]/g, "").length;
                const lowercase = code.replace(/[^a-z]+/g, "").length;
                const uppercase = code.replace(/[^A-Z]+/g, "").length;

                if (code.length > 26 || code.length < 16 || lowercase === 0 || uppercase === 0 || (lowercase < 4 && uppercase < 4)) { //Very basic but no false positives. Will try to improve it in the future
                    console.log(chalk`{magenta [Nitro Sniper]} {rgb(28,232,41) [+]} {rgb(137,96,142) Sniped [${code}] - Fake Code - ${msg.guild ? msg.guild.name : "DM"} from ${msg.author.tag}.}`);
                    continue;
                }
            }

            if (usedTokens.includes(code)) {
                console.log(chalk`{magenta [Nitro Sniper]} {rgb(28,232,41) [+]} {rgb(255,228,138) Sniped [${code}] - Already checked - Seen in ${msg.guild ? msg.guild.name : "DM"} from ${msg.author.tag}.}`);
                continue;
            }
            http({
                url: `https://discord.com/api/v8/entitlements/gift-codes/${code}/redeem`,
                method: 'POST',
                parse: 'json',
                headers: {
                    "Authorization": mainToken,
                    "User-Agent": userAgent,
                    "Content-Type": "application/json",
                },
                data: {
                    "channel_id": msg.channel.id,
                    "payment_source_id": paymentsourceid
                }
            })
                .then((res) => {
                    let end = `${new Date() - start}ms`;
                    if ('subscription_plan' in res.data) {
                        console.log(chalk`{magenta [Nitro Sniper]} {rgb(28,232,41) [+]} {rgb(28,232,41) Sniped [${code}] - Success! - ${res.data.subscription_plan.name} - ${msg.guild ? msg.guild.name : "DM"} from ${msg.author.tag} - ${end}.}`);
                        send_webhook_nitro(res.data.subscription_plan.name, (msg.guild ? msg.guild.name : "DMs"), msg.author.tag, client.user.tag, end, code, msg.url);
                    } else {
                        console.log(chalk`{magenta [Nitro Sniper]} {rgb(242,46,46) (ERROR)} {red Tried to redeem code [${code}] but got error: ${res.data.message}.}`);
                    }
                })
                .catch((err) =>  {
                    if (err.response) {
                        if(err.response.status === 401){
                            console.log(chalk`{magenta [Nitro Sniper]} {rgb(242,46,46) (ERROR)} {red Tried to redeem code [${code}] but the main token is not valid.}`);
                        }
                        else if (err.response.data.message === "This gift has been redeemed already." || err.response.data.message === "Missing Access") {
                            console.log(chalk`{magenta [Nitro Sniper]} {rgb(28,232,41) [+]} {rgb(255,228,138) Sniped [${code}] - Already redeemed - ${msg.guild ? msg.guild.name : "DM"} from ${msg.author.tag} - ${end}.}`);
                        }
                        else if (err.response.data.message === "You need to verify your e-mail in order to perform this action.") {
                            console.log(chalk`{magenta [Nitro Sniper]} {rgb(242,46,46) (ERROR)} {red Tried to redeem code [${code}] but the main token doesn't have a verified e-mail.}`);
                        }
                        else if (err.response.data.message === "Unknown Gift Code") {
                            console.log(chalk`{magenta [Nitro Sniper]} {rgb(28,232,41) [+]} {redBright Sniped [${code}] - Invalid - ${msg.guild ? msg.guild.name : "DM"} from ${msg.author.tag} - ${end}.}`);
                        } else if (err.response.data.message === "New subscription required to redeem gift." || err.response.data.message === "Already purchased") {
                            console.log(chalk`{magenta [Nitro Sniper]} {rgb(242,46,46) (ERROR)} {red Tried to redeem code [${code}] but the gift type cannot be used with an existing Nitro.}`);
                        } else if (err.response.data.message === "Payment source required to redeem gift.") {
                            console.log(chalk`{magenta [Nitro Sniper]} {rgb(28,232,41) [+]} {rgb(28,232,41) Sniped [${code}] - You don't have a valid payment method.}`);
                        }
                    }
                    else
                    console.log(chalk`{magenta [Nitro Sniper]} {rgb(242,46,46) (ERROR)} {red Tried to redeem code [${code}] but got connection error: ${err}}`);
                })
            usedTokens.push(code);
            if (permanentCache === 'true')
                fs.writeFileSync("./usedTokens.json", JSON.stringify(usedTokens));
        }
    })


    client.on('ready', () => {
        if (token === mainToken) console.log(chalk`{magenta [Nitro Sniper]} {cyan (INFO)} {blue Main token valid: ${client.user.tag} - Sniping in ${client.guilds.cache.size} servers.}`);
        else console.log(chalk`{magenta [Nitro Sniper]} {cyan (INFO)} {cyan Slave logged in as ${client.user.tag} - Sniping in ${client.guilds.cache.size} servers.}`);
        if (token !== mainToken) client.user.setStatus(tokenStatus)
    })

    client.on('shardError', error => {
        console.log(chalk`{magenta [Nitro Sniper]} {rgb(242,46,46) (ERROR)} {red Token [${token.substring(0, 10)}...] encountered a connection error: ${error}.}`);
    })
    client.on('shardReconnecting', () => {
        console.log(chalk`{magenta [Nitro Sniper]} {cyan (INFO)} {rgb(255,245,107) Attempting to reconnect token [${token.substring(0, 10)}...]}.`);
    })
    client.on('shardResume', () => {
        console.log(chalk`{magenta [Nitro Sniper]} {cyan (INFO)} {blueBright Token [${token.substring(0, 10)}...] reconnected successfully!}`);
    })

    setTimeout(() => {
        client.login(token)
            .catch(function (err) {
                if (token === mainToken) {
                    console.log(chalk`{magenta [Nitro Sniper]} {rgb(242,46,46) (FATAL ERROR)} {red Main token not valid: ${err}.}`)
                    console.log(chalk`{magenta [Nitro Sniper]} {rgb(242,46,46) (FATAL ERROR)} {red Quitting...}`)
                    process.exit();
                } else {
                    console.log(chalk`{magenta [Nitro Sniper]} {rgb(242,46,46) (ERROR)} {red Skipping slave token "${token.substring(0, 10)}...": ${err}.}`)
                    clearTimeout();
                }
            })
    }, Math.floor(Math.random() * ((1100 * tokens.length) - 500 + 1)) + 500)
}
