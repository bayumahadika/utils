const functs = require("./index");

console.log(
  functs.isValidURL(
    "https://www.freecodecamp.org/news/module-exports-how-to-export-in-node-js-and-javascript/"
  )
);
console.log(functs.isValidTikTokURL("https://vt.tiktok.com/ZSMmC551U/"));
console.log(functs.isValidYouTubeURL("https://youtu.be/mhLmbYWf008"));
console.log(functs.generateRandomString(7));
console.log(functs.formatCurrency(70000));
console.log(functs.formatTime(new Date()));
console.log(functs.formatDate(new Date()));
console.log(functs.formatDateTime(new Date()));
console.log(functs.toCapitalize("hello world"));
