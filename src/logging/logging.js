const chalk = require("chalk");

const splash = () => {
  console.log(
    `%c    _   ___ __                _____       _                   
     / | / (_) /__________     / ___/____  (_)___  ___  _____   
    /  |/ / / __/ ___/ __ \\    \\__ \\/ __ \\/ / __ \\/ _ \\/ ___/   
   / /|  / / /_/ /  / /_/ /   ___/ / / / / / /_/ /  __/ /       
  /_/ |_/_/\\__/_/_  \\____/   /____/_/ /_/_/ .___/\\___/_/      __
    ___  ____  / /_  ____ _____  ________/_/___/ /  ___  ____/ /
   / _ \\/ __ \\/ __ \\/ __ \`/ __ \\/ ___/ _ \\/ __  /  / _ \\/ __  / 
  /  __/ / / / / / / /_/ / / / / /__/  __/ /_/ /  /  __/ /_/ /  
  \\___/_/ /_/_/ /_/\\__,_/_/ /_/\\___/\\___/\\__,_/   \\___/\\__,_/ `,
    "font-family:monospace"
  );
};

const genericPrefixed = (msg) => {
  console.log(
    chalk`{magenta [Nitro Sniper]} ${msg}`
  );
};

const info = (msg) => {
  genericPrefixed(`{cyan (INFO)} ${msg}`);
};

const error = (msg) => {
  genericPrefixed(`{rgb(242,46,46) (ERROR)} ${msg}`);
};

const warning = (msg) => {
  genericPrefixed(`{yellowBright (WARNING)} ${msg}`);
};

const fatal = (msg) => {
  genericPrefixed(`{rgb(242,46,46).bold (FATAL ERROR)}`);
};

const success = (msg) => {
  genericPrefixed(`{rgb(28,232,41) [+]} ${msg}`);
};

module.exports = {
  splash,
  info,
  error,
  warning,
  genericPrefixed,
  fatal,
  success
};