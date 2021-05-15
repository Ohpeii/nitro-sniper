const chalk = require("chalk");

function chalkish(parts, ...substitutions) {
  // https://gist.github.com/bennadel/71eb3670ccf51daabf1658fb13b337b1
  const rawResults = [];
  const cookedResults = [];

  const partsLength = parts.length;
  const substitutionsLength = substitutions.length;

  for (let i = 0; i < partsLength; i += 1) {
    rawResults.push(parts.raw[i]);
    cookedResults.push(parts[i]);

    if (i < substitutionsLength) {
      rawResults.push(substitutions[i]);
      cookedResults.push(substitutions[i]);
    }
  }

  const chalkParts = [cookedResults.join("")];
  chalkParts.raw = [rawResults.join("")];

  return chalk(chalkParts);
}

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
  console.log(chalkish`{magenta [Nitro Sniper]} ${msg}`);
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
  genericPrefixed(`{rgb(242,46,46).bold (FATAL ERROR)} ${msg}`);
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
  success,
};
