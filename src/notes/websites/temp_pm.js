const axios = require("axios").default;
const chalk = require("chalk");
const fs = require("fs");

function getData(msg, writeNotes, temp_pm, send_webhook_notes, user_tag) {
  console.log(temp_pm);
  let requestCode = temp_pm.substring(0, temp_pm.length - 2);
  console.log(requestCode);

  return axios({
    url: `https://temp.pm?${requestCode}`,
    method: "GET",
  }).then((res) => {
    const result = res.data
      .match(/(?<=<div class="panel-body panel-message2">).*?(?=<\/div>)/gs)[0]
      .replace("<br />", "");
    if (!result || result.length === 0)
      return console.log(
        chalk`{magenta [Nitro Sniper]} {rgb(28,232,41) [+]} {rgb(137,96,142) Sniped temp.pm [${requestCode}] - Non-existant/Already destroyed - ${
          msg.guild ? msg.guild.name : "DM"
        } from ${msg.author.tag}.}`
      );
    send_webhook_notes.send_webhook_notes(
      "temp.pm",
      msg.guild ? msg.guild.name : "DMs",
      msg.author.tag,
      user_tag,
      result,
      msg.url
    );

    if (writeNotes === "true") {
      requestCode = requestCode.replace(/[^/\w\s]/gi, ""); // Make id filename-safe
      fs.writeFile(
        `./notes/temp_pm-${requestCode.substring(0, 10)}.txt`,
        result,
        (err) => {
          if (err)
            console.log(
              chalk`{magenta [Nitro Sniper]} {rgb(28,232,41) [+]} {rgb(137,96,142) Sniped temp.pm [${requestCode}] - Couldn't save it to file because of err: ${
                err.message
              } - ${msg.guild ? msg.guild.name : "DM"} from ${msg.author.tag}.}`
            );
          else
            console.log(
              chalk`{magenta [Nitro Sniper]} {rgb(28,232,41) [+]} {rgb(137,96,142) Sniped temp.pm [${requestCode}] - Saved to file ./notes/temp_pm-${requestCode.substring(
                0,
                10
              )}.txt - ${msg.guild ? msg.guild.name : "DM"} from ${
                msg.author.tag
              }.}`
            );
        }
      );
    } else
      console.log(
        chalk`{magenta [Nitro Sniper]} {rgb(28,232,41) [+]} {rgb(137,96,142) Sniped privnote [${requestCode}] - ${
          msg.guild ? msg.guild.name : "DM"
        } from ${msg.author.tag}.}`
      );
    return result.match(global.regex) || [];
  });
}

module.exports = { getData };
