/*
Nitro Sniper enhanced ed.
Modified work Copyright (C) 2020-2021 Nitro-sniper-enhanced contributors
Original work Copyright (C) 2020 slow | Sublicensed according to the MIT license available at <https://opensource.org/licenses/MIT> or in the LICENSE.md file in the root folder.

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>. */

global.regex = new RegExp(
  /(discord\.gift\/|discord\.com\/gifts\/|discordapp\.com\/gifts\/)[^\s]+/gim
);
const privnote = new RegExp(/(?<=privnote.com\/)[^\s]+/);
const temp_pm = new RegExp(/(?<=temp.pm\/\?)[^\s]+/);

require("dotenv").config();
const axios = require("axios").default;
const rateLimit = require("axios-rate-limit");

const http = rateLimit(axios.create(), {
  maxRequests: 10,
  perMilliseconds: 60000,
});

const syncrq = require("sync-request");
const fs = require("fs");

const { Client } = require("discord.js-light");
const notes = require("./notes/all");
const { Webhook } = require("./webhooks");
const { version } = require("../package.json");
const logging = require("./logging/logging");

const tokens = process.env.guildTokens?.split(",").filter((item) => item);

let { permanentCache } = process.env;

const {
  useMain,
  mainToken,
  nitro_webhookUrl,
  notes_webhookUrl,
  legitimacyCheck,
  obfuscationCheck,
  notesCheck,
  writeNotes,
  webhookping_userid,
  replit,
  tokenStatus,
  mainStatus,
} = process.env;

let usedTokens = [];

if (useMain === "true" && mainToken != null) tokens.unshift(mainToken);
logging.splash();

logging.info("{blueBright Welcome!}");
logging.info(
  `{blueBright Running version} {blueBright.bold ${version}}{blueBright .}`
);
logging.info(
  "{redBright This program is licensed under GPL-3.0-or-later and provided free of charge at https://github.com/GiorgioBrux/nitro-sniper-enhanced.}"
);

global.userAgent = (() =>
  axios({
    url: "https://www.whatismybrowser.com/guides/the-latest-user-agent/chrome",
    method: "GET",
  })
    .then((res) => {
      const r = res.data
        .match(/Mozilla\/5\.0 \(Windows NT 10\.0; Win64; x64\)[^<]*/g)
        .toString();
      logging.info(`{blueBright Setting latest chrome user agent: ${r}}`);
      return r;
    })
    .catch((err) => {
      logging.error(
        `{red There was an error fetching the latest chrome user agent: ${err
          .toString()
          .substring(7, err.length)}. Using default...}`
      );
      return "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";
    }))();

if (
  !webhookping_userid ||
  webhookping_userid.length === 0 ||
  webhookping_userid === ""
) {
  logging.warning(
    "{rgb(255,245,107) webhookping_userid is not set correctly or is undefined. Defaulting to none.}"
  );
} else {
  logging.info(
    `{blueBright The userid [${webhookping_userid}] will be pinged in the nitro_webhook.}`
  );
}
const nitro_webhookclient = new Webhook(nitro_webhookUrl, "nitro");
const notes_webhookclient = new Webhook(notes_webhookUrl, "notes");

if (!tokens || tokens.length === 0) {
  logging.fatal(
    "{red There is no token to login to, please check your configuration.}"
  );
  logging.fatal("{red Quitting...}");
  process.exit();
}
if (useMain !== "true" && useMain !== "false") {
  logging.warning(
    "{rgb(255,245,107) useMain is not set correctly or is undefined. Defaulting to false.}"
  );
}
if (legitimacyCheck !== "true" && legitimacyCheck !== "false") {
  logging.warning(
    "{rgb(255,245,107) legitimacyCheck is not set correctly or is undefined. Defaulting to false.}"
  );
}
if (obfuscationCheck !== "true" && obfuscationCheck !== "false") {
  logging.warning(
    "{rgb(255,245,107) obfuscationCheck is not set correctly or is undefined. Defaulting to false.}"
  );
}
if (notesCheck !== "true" && notesCheck !== "false") {
  logging.warning(
    "{rgb(255,245,107) notesCheck is not set correctly or is undefined. Defaulting to false.}"
  );
}
if (permanentCache !== "true" && permanentCache !== "false") {
  logging.warning(
    "{rgb(255,245,107) permanentCache is not set correctly or is undefined. Defaulting to false.}"
  );
} else if (permanentCache === "true") {
  if (!fs.existsSync("./usedTokens.json")) {
    logging.info("{blueBright There is no usedTokens cache to load.}");
  } else {
    const file = fs.readFileSync("./usedTokens.json");

    if (file.length !== 0)
      try {
        usedTokens = JSON.parse(file);
      } catch (e) {
        logging.info(
          `{red Couldn't load usedTokens cache because of error: ${e}.}`
        );
        permanentCache = "false";
      }
    logging.info(
      `{blueBright Successfully read ${usedTokens.length} tokens from the usedTokens cache.}`
    );
  }
}

if (writeNotes !== "true" && writeNotes !== "false") {
  logging.warning(
    "{rgb(255,245,107) writeNotes is not set correctly or is undefined. Defaulting to false.}"
  );
} else if (writeNotes === "true") {
  if (!fs.existsSync("./notes")) fs.mkdirSync("./notes"); // Create notes folder if it doesn't exist
}

if (replit !== "true" && replit !== "false") {
  logging.warning(
    "{rgb(255,245,107) replit is not set correctly or is undefined. Defaulting to false.}"
  );
} else if (replit === "true") {
  logging.info("{blueBright Running in replit mode.}");
  // eslint-disable-next-line global-require
  const replit_http = require("http");

  replit_http
    .createServer((req, res) => {
      res.write("I'm alive!");
      res.end();
    })
    .listen(8080);
}
const paymentsourceid = (() => {
  const ressyncq = syncrq(
    "GET",
    "https://discord.com/api/v6/users/@me/billing/payment-sources",
    {
      headers: {
        authorization: mainToken,
        "user-agent": global.userAgent,
      },
    }
  );

  const ps = JSON.parse(ressyncq.body.toString());

  if (ps.message === "401: Unauthorized") {
    logging.fatal(`{red Main token not valid: ${ps.message}.}`);
    logging.fatal("{red Quitting...}");
    process.exit();
  } else if (ps.length === 0) {
    logging.warning(
      "{rgb(255,245,107) Main token does not have a billing source, some codes will not be sniped.}"
    );
    return "null";
  } else if (ps[0]) {
    logging.info("{blueBright Successfully got the payment method!.}");
    return ps[0].id;
  } else {
    logging.fatal(`{red Unable to get billing source: ${JSON.stringify(ps)}.}`);
    logging.fatal("{red Quitting...}");
    process.exit();
  }
})();

// eslint-disable-next-line no-restricted-syntax
for (const token of tokens) {
  const client = new Client({
    // https://discord.js.org/#/docs/main/v12/typedef/ClientOptions
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
    ],
  });

  client.on("message", async (msg) => {
    if (msg.author.id === client.user.id) return; // We don't want to snipe our own messages
    let codes = msg.content.match(global.regex);
    if (!codes || codes.length === 0) {
      codes = [];
    }
    if (msg.embeds.length > 0) {
      msg.embeds.forEach((embed) => {
        if (embed.fields) {
          // eslint-disable-next-line no-restricted-syntax
          for (const field of embed.fields) {
            codes.push(String(field.name).match(global.regex));
            codes.push(
              String(field.value)
                .replace(/[\])]$/gm, "")
                .match(global.regex)
            );
          }
        }
        if (embed.author) {
          if (embed.author.name) {
            codes.push(String(embed.author.name).match(global.regex));
          }
        }
        if (embed.description) {
          codes.push(String(embed.description).match(global.regex));
        }
        if (embed.footer) {
          if (embed.footer.text) {
            codes.push(String(embed.footer.text).match(global.regex));
          }
        }
        if (embed.title) {
          codes.push(String(embed.title).match(global.regex));
        }
      });
      codes = codes
        .filter((e) => e !== "null")
        .filter(Boolean)
        .flat();
    }
    if (!codes || codes.length === 0) {
      if (notesCheck === "false") return;
      const test = function () {
        switch (true) {
          case privnote.test(msg.content):
            return notes.privnote.getData(
              msg,
              writeNotes,
              msg.content.match(privnote).splice(0, 1).toString(),
              notes_webhookclient,
              client.user.tag
            );
          case temp_pm.test(msg.content):
            return notes.temp_pm.getData(
              msg,
              writeNotes,
              msg.content.match(temp_pm).splice(0, 1).toString(),
              notes_webhookclient,
              client.user.tag
            );
          default:
            return [];
        }
      };
      codes = codes.concat(await test()).filter((e) => e); // Concat and remove empty values
      if (!codes || codes.length === 0) return;
    }
    if (codes.length > 10) return;
    // eslint-disable-next-line no-restricted-syntax
    for (let code of codes) {
      const start = new Date();
      code = code.replace(
        /(discord\.gift\/|discord\.com\/gifts\/|discordapp\.com\/gifts\/)/gim,
        ""
      );
      if (obfuscationCheck === "true") {
        const code_no_symbols = code.replace(/\W/g, "");
        const code_no_obfuscation = code.replace(/\W.*/g, "");
        if (code_no_symbols !== code_no_obfuscation) {
          if (code_no_symbols.length > 26 && code_no_symbols.length < 16)
            code = code_no_symbols;
          else if (code_no_obfuscation.length > 26 && code_no_obfuscation < 16)
            code = code_no_obfuscation;
        } else if (code_no_symbols !== code) code = code_no_symbols;
      }
      if (legitimacyCheck === "true") {
        // const numeric = code.replace(/[^0-9]/g, "").length;
        const lowercase = code.replace(/[^a-z]+/g, "").length;
        const uppercase = code.replace(/[^A-Z]+/g, "").length;

        if (
          code.length > 26 ||
          code.length < 16 ||
          lowercase === 0 ||
          uppercase === 0 ||
          (lowercase < 4 && uppercase < 4)
        ) {
          // Very basic but no false positives. Will try to improve it in the future
          logging.success(
            `{rgb(137,96,142) Sniped [${code}] - Fake Code - ${
              msg.guild ? msg.guild.name : "DM"
            } from ${msg.author.tag}.}`
          );
          // eslint-disable-next-line no-continue
          continue;
        }
      }

      if (usedTokens.includes(code)) {
        logging.success(
          `{rgb(255,228,138) Sniped [${code}] - Already checked - Seen in ${
            msg.guild ? msg.guild.name : "DM"
          } from ${msg.author.tag}.}`
        );
        // eslint-disable-next-line no-continue
        continue;
      }
      http({
        url: `https://discord.com/api/v8/entitlements/gift-codes/${code}/redeem`,
        method: "POST",
        parse: "json",
        headers: {
          Authorization: mainToken,
          "User-Agent": global.userAgent,
          "Content-Type": "application/json",
        },
        data: {
          channel_id: msg.channel.id,
          payment_source_id: paymentsourceid,
        },
      })
        .then((res) => {
          const end = `${new Date() - start}ms`;
          if ("subscription_plan" in res.data) {
            logging.success(
              `{rgb(28,232,41) Sniped [${code}] - Success! - ${
                res.data.subscription_plan.name
              } - ${msg.guild ? msg.guild.name : "DM"} from ${
                msg.author.tag
              } - ${end}.}`
            );
            nitro_webhookclient.send_webhook_nitro(
              res.data.subscription_plan.name,
              msg.guild ? msg.guild.name : "DMs",
              msg.author.tag,
              client.user.tag,
              end,
              code,
              msg.url,
              webhookping_userid
            );
          } else {
            logging.error(
              `{red Tried to redeem code [${code}] but got error: ${res.data.message}.}`
            );
          }
        })
        .catch((err) => {
          const end = `${new Date() - start}ms`;
          if (err.response) {
            if (err.response.status === 401) {
              logging.error(
                `{red Tried to redeem code [${code}] but the main token is not valid.}`
              );
            } else if (
              err.response.data.message ===
                "This gift has been redeemed already." ||
              err.response.data.message === "Missing Access"
            ) {
              logging.success(
                `{rgb(255,228,138) Sniped [${code}] - Already redeemed - ${
                  msg.guild ? msg.guild.name : "DM"
                } from ${msg.author.tag} - ${end}.}`
              );
            } else if (
              err.response.data.message ===
              "You need to verify your e-mail in order to perform this action."
            ) {
              logging.error(
                `{red Tried to redeem code [${code}] but the main token doesn't have a verified e-mail.}`
              );
            } else if (err.response.data.message === "Unknown Gift Code") {
              logging.success(
                `{redBright Sniped [${code}] - Invalid - ${
                  msg.guild ? msg.guild.name : "DM"
                } from ${msg.author.tag} - ${end}.}`
              );
            } else if (
              err.response.data.message ===
                "New subscription required to redeem gift." ||
              err.response.data.message === "Already purchased"
            ) {
              logging.error(
                `{red Tried to redeem code [${code}] but the gift type cannot be used with an existing Nitro.}`
              );
            } else if (
              err.response.data.message ===
              "Payment source required to redeem gift."
            ) {
              logging.success(
                `{rgb(28,232,41) Sniped [${code}] - You don't have a valid payment method.}`
              );
            }
          } else {
            logging.error(
              `{red Tried to redeem code [${code}] but got connection error: ${err}}`
            );
          }
        });
      usedTokens.push(code);
      if (permanentCache === "true")
        fs.writeFileSync("./usedTokens.json", JSON.stringify(usedTokens));
    }
  });

  client.on("ready", () => {
    if (token === mainToken) {
      logging.info(
        `{cyan (INFO)} {blue Main token valid: ${client.user.tag} - Sniping in ${client.guilds.cache.size} servers.}`
      );
    } else {
      logging.info(
        `{cyan Slave logged in as ${client.user.tag} - Sniping in ${client.guilds.cache.size} servers.}`
      );
    }
    if (token !== mainToken) client.user.setStatus(tokenStatus);
    else client.user.setStatus(mainStatus);
  });

  client.on("shardError", (error) => {
    logging.error(
      `{red Token [${token.substring(
        0,
        10
      )}...] encountered a connection error: ${error}.}`
    );
    client.on("shardResume", () => {
      logging.info(
        `{blueBright Token [${token.substring(
          0,
          10
        )}...] reconnected successfully!}`
      );
    });
  });

  setTimeout(() => {
    client.login(token).catch((err) => {
      if (token === mainToken) {
        logging.fatal(`{red Main token not valid: ${err}.}`);
        logging.fatal("{red Quitting...}");
        process.exit();
      } else {
        logging.error(
          `{red Skipping slave token "${token.substring(0, 10)}...": ${err}.}`
        );
        clearTimeout();
      }
    });
  }, Math.floor(Math.random() * (1100 * tokens.length - 500 + 1)) + 500);
}
