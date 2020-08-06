const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.91 Safari/537.36";
const regex = new RegExp(/(discord\.gift\/|discord\.com\/gifts\/|discordapp\.com\/gifts\/)[^\s]+/gmi);

const dotenv = require('dotenv').config({ path: 'dotenv' });
const phin = require('phin').unpromisified;

const { Client } = require('discord.js');

const tokens = process.env.guildTokens.split(',');
const mainToken = process.env.mainToken;

for (const token of tokens) {
   const client = new Client({
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
      let codes = msg.content.match(regex);
      if (!codes || codes === null || codes.length === 0) return;

      let start = new Date();

      for (let code of codes) {
         code = code.replace(/(discord\.gift\/|discord\.com\/gifts\/|discordapp\.com\/gifts\/)/gmi, '');

         phin({
            url: `https://discord.com/api/v6/entitlements/gift-codes/${code}/redeem`,
            method: 'POST',
            parse: 'json',
            headers: {
               "Authorization": mainToken,
               "User-Agent": userAgent
            }
         }, (err, res) => {
            if (err) {
               console.log(`[Nitro Sniper] (${code}) - Error - ${err}`);
            } else if (res.body.message === '401: Unauthorized') {
               console.log(`[Nitro Sniper] (${code}) - Error - Your main token is invalid.`)
            } else if (res.body.message == "This gift has been redeemed already.") {
               console.log(`[Nitro Sniper] (${code}) - Already redeemed - ${msg.guild ? msg.guild.name : "DMs"} - ${new Date() - start}ms `)
            } else if ('subscription_plan' in res.body) {
               console.log(`[Nitro Sniper] (${code}) - Success - ${res.body.subscription_plan.name} - ${msg.guild ? msg.guild.name : "DMs"}  - ${new Date() - start}ms`)
            } else if (res.body.message == "Unknown Gift Code") {
               console.log(`[Nitro Sniper] (${code}) - Invalid Code - ${msg.guild ? msg.guild.name : "DMs"}  - ${new Date() - start}ms`)
            }
         })
      }
   })

   client.on('ready', () => {
      console.log(`[Nitro Sniper] Logged in as ${client.user.tag}.`)
   })

   setTimeout(() => {
      client.login(token)
   }, 1000)
}
